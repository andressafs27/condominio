import VotacaoRepository from "../repositories/votacaoRepository.js";
import VotacaoEntity from "../entities/votacaoEntity.js";
import PessoaRepository from "../repositories/pessoaRepository.js";
import PautaRepository from "../repositories/pautasRepository.js";

export default class VotacaoController {

    //cadastra o voto da pessoa na pauta
    async cadastrar(req, res) {

        try {
            const { voto, pessoa_id, pauta_id } = req.body; 
            if (!voto || !pessoa_id || !pauta_id ) {
                return res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
            }

            const repoPessoa = new PessoaRepository();
            const pessoaExistente = await repoPessoa.buscarPorId(pessoa_id);
            if (!pessoaExistente) {
                return res.status(400).json({ msg: "Pessoa não encontrada!" });
            }

            if (!pessoaExistente.ativo) {   
                return res.status(400).json({ msg: "Pessoa não está ativa!" });
            }

            const repoPauta = new PautaRepository();
            const pautaExistente = await repoPauta.buscarPorId(pauta_id);
            if (!pautaExistente) {
                return res.status(400).json({ msg: "Pauta não encontrada!" });
            }
            
            const repoVotacao = new VotacaoRepository();
            const votoJaExiste = await repoVotacao.buscarPorPessoaEPauta(pessoa_id, pauta_id);
            if (votoJaExiste) {
                console.log("Voto já existe:", votoJaExiste);
                return res.status(400).json({ msg: "Pessoa já votou na pauta!" });
            }

            const entidade = new VotacaoEntity(0, voto, pessoa_id, pauta_id);
            const result = await repoVotacao.cadastrar(entidade);
    
            if (result) {
                // return res.status(201).json({  ok: true,msg: "Voto realizado com sucesso!" });
                return res.status(201).json({  
                    ok: true,
                    msg: "Voto realizado com sucesso!",
                    pessoa: pessoaExistente.nome,
                    pauta: pautaExistente.descricao
                });
                
                
            } else {
                throw new Error("Erro ao cadastrar voto no banco de dados");
            }
        } catch (ex) {
            console.error("Erro no cadastro:", ex); 
            return res.status(500).json({  ok: false,msg: ex.message || "Erro interno do servidor" });
        }
    }

    //lista todas as votações ativas
    async listar(req, res) {
        try{
            let votacao = new VotacaoRepository();
            let lista = await votacao.listar();
            res.render("votacao/listar", { lista: lista });
            
        }
        catch(ex) {
            console.error("Erro ao listar votacao:", ex);
            res.status(500).json({msg: ex.message});
        }
    }

    //lista todas as votações (ativas e inativas)
    async listarTodasVotacoes(req, res) {

        try{
            let votacao = new VotacaoRepository();
            let lista = await votacao.listarTodasVotacoes();

            res.render("votacao/listar", { lista: lista });
            
        }
        catch(ex) {
            console.error("Erro ao listar votacao:", ex);
            res.status(500).json({msg: ex.message});
        }
    }

    async listarTodasVotacoesPorMorador(req, res) {

        try{
            let pautasRepository = new PautaRepository();

            const pessoaLogado = req.cookies.pessoaLogado ? JSON.parse(req.cookies.pessoaLogado) : null;

            let pautas = await pautasRepository.listarPautasPorPessoa(pessoaLogado.id)

            res.render("votacao/listarMorador", { 
                pautas,
                pessoaLogado: pessoaLogado,
                layout: "layoutMorador"
            });
            
        }
        catch(ex) {
            console.error("Erro ao listar votacao:", ex);
            res.status(500).json({msg: ex.message});
        }
    }

    //busca uma votação pelo id
    async buscarPorId(req) {
        try {
            const { id } = req.params;
            console.log('id', id);

            const repo = new VotacaoRepository();
            const votacao = await repo.buscarPorId(id);

            console.log('votacao', votacao);
    
            if (!votacao) {
                return res.status(404).json({ msg: "votacao não encontrada" });
            }
    
            return (votacao);
        } catch (error) {
            console.error("Erro ao buscar votacao por ID:", error);
            return null;
        }
    }

    //busca uma votação pelo id
    async obterVotacaoPorId(req) {
        try {
            const { id } = req.params;
            console.log('id', id);

            const repo = new VotacaoRepository();
            const votacao = await repo.buscarPorId(id);

            console.log('votacao', votacao);
    
            if (!votacao) {
                return res.status(404).json({ msg: "votacao não encontrada" });
            }
    
            return (votacao);
        } catch (error) {
            console.error("Erro ao buscar votacao por ID:", error);
            return null;
        }
    }

    //busca os votos de uma votação pelo id da pauta
    async obterVotosPorId(req, res) {
        try {
            const repoVotos = new VotacaoRepository();
            const votos = await repoVotos.obterPorPautaId(req.params.id); 

            if (!votos || votos.length === 0) {
                return res.status(404).render("votacao/erro", {
                    mensagem: "Nenhum voto encontrado para esta pauta."
                });
            }

            // Contagem de votos
            const votosSim = votos.filter(v => v.voto.toLowerCase() === 'sim').length;
            const votosNao = votos.filter(v => v.voto.toLowerCase() === 'nao' || v.voto.toLowerCase() === 'não').length;

            const percentualSim = ((votosSim / votos.length) * 100).toFixed(1);
            const percentualNao = ((votosNao / votos.length) * 100).toFixed(1);

            res.render("votacao/resultado", {
                votos: votos,
                percentualSim: percentualSim,
                percentualNao: percentualNao
            });

        } catch (error) {
            console.error("Erro ao obter votos:", error);
            return res.status(500).render("votacao/erro", {
                mensagem: "Erro ao obter votos. Por favor, tente novamente mais tarde."
            });
        }
    }

    async votar(req, res) {

        try {
            const { pauta_id, voto } = req.body; 
            const pessoaLogado = req.cookies.pessoaLogado ? JSON.parse(req.cookies.pessoaLogado) : null;

            if (!pauta_id) {
                return res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
            }

            const repoVotacao = new VotacaoRepository();
            const entidade = new VotacaoEntity(0,voto, pessoaLogado.id, pauta_id, null, null, null);
            const result = await repoVotacao.criar(entidade);
    
            if (result) {
                return res.status(201).json({  
                    ok: true,
                    msg: "Votocao criada com sucesso!"
                });
                
                
            } else {
                throw new Error("Erro ao criar votacao no banco de dados");
            }
        } catch (ex) {
            console.error("Erro no cadastro:", ex); 
            return res.status(500).json({  ok: false,msg: ex.message || "Erro interno do servidor" });
        }
    }

    //cria uma nova votação
    async criar(req, res) {

        try {
            console.log("Entrou na rota de criar votação");
            console.log("req.body ", req.body);

            const { pauta_id, data_inicio, data_fim, status } = req.body; 

            if (!pauta_id || !data_inicio || !data_fim || !status) {
                return res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
            }

            const repoPauta = new PautaRepository();
            const pautaExistente = await repoPauta.buscarPorId(pauta_id);

            console.log("pautaExistente", pautaExistente);

            if (!pautaExistente) {
                return res.status(400).json({ msg: "Pauta não encontrada!" });
            }
            
            if (result) {
                return res.status(201).json({  
                    ok: true,
                    msg: "Pauta criada com sucesso!",
                    pauta: pautaExistente.descricao
                });
                
                
            } else {
                throw new Error("Erro ao criar Pauta no banco de dados");
            }
        } catch (ex) {
            console.error("Erro no cadastro:", ex); 
            return res.status(500).json({  ok: false,msg: ex.message || "Erro interno do servidor" });
        }
    }

    async alterar(req, res, id) {
        try {
            const { pauta_id, data_inicio, data_fim, status } = req.body;
    
            if (!pauta_id || !data_inicio || !data_fim || !status) {
                console.log("Parâmetros obrigatórios não informados!");
                return res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
            }
    
            const repoPauta = new PautaRepository();
            const pautaExistente = await repoPauta.buscarPorId(pauta_id);
    
            if (!pautaExistente) {
                return res.status(400).json({ msg: "Pauta não encontrada!" });
            }
    
            const repoVotacao = new VotacaoRepository();
            const votocaoJaExiste = await repoVotacao.obterPorPautaId(pauta_id);

            if (!votocaoJaExiste) {
                console.log("Votocao não existe:", votocaoJaExiste);
                return res.status(400).json({ msg: "Votacao não encontrada para esta pauta!" });
            }

            const votacaoId = await repoVotacao.obterIdVotacaoPorPautaId(pauta_id);

    
            const entidade = new VotacaoEntity(votacaoId, null, null, pauta_id, data_inicio, data_fim, status);

            
            const result = await repoVotacao.alterar(entidade);

            if (result) {
                return res.status(201).json({  
                    ok: true,
                    msg: "Votacão alterada com sucesso!",
                    pauta: pautaExistente.descricao
                });
            } else {
                throw new Error("Erro ao alterar votacao no banco de dados");
            }
        } catch (ex) {
            console.error("Erro na atualização:", ex);
            return res.status(500).json({ ok: false, msg: ex.message || "Erro interno do servidor" });
        }
    }
    

    // Retorna os dados da votação para uma pauta específica
    async obterVotacaoPorPautaId(pautaId) {
        try {
       
            if (!pautaId) {
                return res.status(400).json({ msg: "Parâmetro pauta_id não informado!" });
            }

            const repoVotacao = new VotacaoRepository();
            const votacao = await repoVotacao.obterPorPautaId(pautaId);

            return votacao;
        } catch (error) {
            console.error("Erro ao obter votação por pauta_id:", error);
            return null;
        }
    }

    
   
    
    
   
   

    
    
    
    
    

 
    


    // async desabilitar(req, res) {
    //     try {
    //         const { id } = req.body;

    //         if (!id) {
    //             return res.status(400).json({ msg: "Parâmetro ID não informado corretamente!" });
    //         }

    //         const repo = new VotacaoRepository();
    //         let votacaoExistente = await repo.buscarPorId(id);

    //         if (!votacaoExistente) {
    //             return res.status(404).json({ msg: "votacao não encontrada!" });
    //         }

    //         // votacaoExistente.ativo = false;
    //         const result = await repo.desabilitar(votacaoExistente);

    //         if (result) {
    //             return res.status(200).json({ ok: true, msg: "votacao desabilitada com sucesso!" });
    //         } else {
    //             return res.status(400).json({ msg: "Falha ao desabilitar votacao!" });
    //         }
    //     } catch (ex) {
    //         console.error("Erro ao desabilitar votacao:", ex);
    //         return res.status(500).json({ msg: "Erro interno do servidor" });
    //     }
    // }


    // async reativar(req, res) {
    //     try {
    //         const { id } = req.body;
    
    //         if (!id) {
    //             return res.status(400).json({ msg: "Parâmetro ID não informado corretamente!" });
    //         }
    
    //         const repo = new VotacaoRepository();
    //         const result = await repo.reativar({id});
    
    //         if (result) {
    //             return res.status(200).json({ ok: true, msg: "votacao reativada com sucesso!" });
    //         } else {
    //             return res.status(400).json({ msg: "Falha ao reativar votacao !" });
    //         }
    //     } catch (ex) {
    //         console.error("Erro ao reativar votacao:", ex);
    //         return res.status(500).json({ msg: "Erro interno do servidor" });
    //     }
    // }
}