import ServicoRepository from "../repositories/servicoRepository.js";
import AgendaRepository from "../repositories/agendaRepository.js";
import ServicoEntity from "../entities/servicoEntity.js";

export default class ServicoController {

    async cadastrar(req, res) {

        try {
            const { descricao } = req.body; 

            if (!descricao ) {
                return res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
            }

            const repo = new ServicoRepository();

            let servicoExistente = await repo.obterPorNome(descricao);

            // if(servicoExistente) {
            //     return res.status(400).json({ msg: "Serviço já cadastrado!" });
            // }

            if (servicoExistente) {
                if (!servicoExistente.ativo) {
                    return res.status(200).json({ jaExisteDesativado: true, id: servicoExistente.id, msg: "Este serviço já existe, mas está desativado. Deseja reativá-lo?" });
                }
                return res.status(400).json({ msg: "servico já cadastrado!" });
            }

            const entidade = new ServicoEntity(0, descricao, true);
            
            const result = await repo.cadastrar(entidade);
    
            if (result) {
                return res.status(201).json({  ok: true,msg: "Cadastrado realizado com sucesso!" });
            } else {
                throw new Error("Erro ao cadastrar no banco de dados");
            }
        } catch (ex) {
            console.error("Erro no cadastro:", ex); 
            return res.status(500).json({  ok: false,msg: ex.message || "Erro interno do servidor" });
        }
    }

    async listar(req, res) {
        try{
            let servico = new ServicoRepository();
            let lista = await servico.listar();
            res.render("servico/listar", { lista: lista });
            
        }
        catch(ex) {
            console.error("Erro ao listar servicos:", ex);
            res.status(500).json({msg: ex.message});
        }
    }

    async listarParaMorador(req, res) {
        try{
            const pessoaLogado = req.cookies.pessoaLogado ? JSON.parse(req.cookies.pessoaLogado) : null;
            let servico = new ServicoRepository();
            let lista = await servico.listarParaMorador(pessoaLogado.id);
            res.render("servico/listarMorador", 
            { 
                lista: lista,
                pessoaLogado: pessoaLogado,
                layout: "layoutMorador",
            });
            
        }
        catch(ex) {
            console.error("Erro ao listar servicos:", ex);
            res.status(500).json({msg: ex.message});
        }
    }

    async alterar(req, res) {
        try {
            // const {id} = req.params;
            const { id, descricao } = req.body;
                if (!id || !descricao) {
                return res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
            }
            // const entidade = new ServicoEntity(id, descricao, true);
            const repo = new ServicoRepository();

            let servicoExistente = await repo.obterPorNome(descricao);

            // if(servicoExistente) {
            //     return res.status(400).json({ msg: "Serviço já cadastrado!" });
            // }

            // if (servicoExistente) {
            //     if (!servicoExistente.ativo) {
            //         return res.status(200).json({ jaExisteDesativado: true, id: servicoExistente.id, msg: "Este serviço já existe, mas está desativado. Deseja reativá-lo?" });
            //     }
            //     return res.status(400).json({ msg: "servico já cadastrado!" });
            // }

            // Se o nome foi alterado e já existe outra servico com o mesmo nome, retorna erro
            if (servicoExistente && servicoExistente.id !== Number(id)) {
                return res.status(400).json({ ok: false, msg: "Já existe uma serviço com esta descrição!" });
            }
    
            const entidade = new ServicoEntity(id, descricao, true);
            const result = await repo.alterar(entidade);
    
            if (result) {
                return res.status(200).json({ ok: true, msg: "Cadastro atualizado com sucesso!" });
            } else {
                return res.status(400).json({ ok: false, msg: "Cadastro não encontrado ou não atualizado" });

            }
    
        } catch (ex) {
            console.error("Erro na atualização:", ex);
            return res.render("servico/alterar", { msg: "Erro interno do servidor", servico: req.body });
            // return res.status(500).json({ msg: ex.message || "Erro interno do servidor" });
        }
    }

    async buscarPorId(req) {
        try {
            const { id } = req.params;
            console.log('id', id);

            const repo = new ServicoRepository();
            const servico = await repo.buscarPorId(id);

            console.log('servico', servico);
    
            if (!servico) {
                console.log("Serviço não encontrado.");
                return null; 
            }
    
            return (servico);
        } catch (error) {
            console.error("Erro ao buscar serviço por ID:", error);
            return null;
        }
    }


    async desabilitar(req, res) {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({ msg: "Parâmetro ID não informado corretamente!" });
            }

            const repoAgenda = new AgendaRepository();
            const agendaExistente = await repoAgenda.buscarPorServicoId(id);
            if(agendaExistente){
                return res.status(404).json({ msg: "Serviço vinculado a um agendamento!" });
            }

            const repo = new ServicoRepository();
            let servicoExistente = await repo.buscarPorId(id);

            if (!servicoExistente) {
                return res.status(404).json({ msg: "Serviço não encontrado!" });
            }

            servicoExistente.ativo = false;
            const result = await repo.desabilitar(servicoExistente);

            if (result) {
                return res.status(200).json({ ok: true, msg: "Serviço desabilitado com sucesso!" });
            } else {
                return res.status(400).json({ msg: "Falha ao desabilitar serviço!" });
            }
        } catch (ex) {
            console.error("Erro ao desabilitar serviço:", ex);
            return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    }

    async reativar(req, res) {
            try {
                const { id } = req.body;
        
                if (!id) {
                    return res.status(400).json({ msg: "Parâmetro ID não informado corretamente!" });
                }
        
                const repo = new ServicoRepository();
                const result = await repo.reativar({id});
        
                if (result) {
                    return res.status(200).json({ ok: true, msg: "Serviço reativada com sucesso!" });
                } else {
                    return res.status(400).json({ msg: "Falha ao reativar serviço!" });
                }
            } catch (ex) {
                console.error("Erro ao reativar serviço:", ex);
                return res.status(500).json({ msg: "Erro interno do servidor" });
            }
        }


}