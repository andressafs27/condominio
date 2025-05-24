import RespostaPesquisaRepository from "../repositories/respostaPesquisaRepository.js";
import RespostaPesquisaEntity from "../entities/respostaPesquisaEntity.js";

export default class RespostaPesquisaController {

    //cadastra a resposta da pessoa na pesquisa
    async cadastrar(req, res) {
        try {

            console.log("req.body: ", req.body);

            if (!req.body) {
                return res.status(400).json({ msg: "Dados não recebidos." });
            }

            const { pesquisa_id, pergunta_id, alternativa_id } = req.body;
            const pessoaLogado = JSON.parse(req.cookies.pessoaLogado || "{}");
            const pessoa_id = pessoaLogado.id;

            if (!pessoa_id || !pergunta_id || !pesquisa_id || !alternativa_id) {
                return res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
            }

            const repoRespostaPesquisa = new RespostaPesquisaRepository();
            const entidade = new RespostaPesquisaEntity(0, pessoa_id, pergunta_id, pesquisa_id, alternativa_id);
            const result = await repoRespostaPesquisa.cadastrar(entidade);
    
            if (result) {
                return res.status(201).json({
                    ok: true,
                    msg: "Alternativa registrada com sucesso!"
                });
            } else {
                throw new Error("Erro ao salvar resposta");
            }
    
        } catch (ex) {
            console.error("Erro no cadastro:", ex);
            return res.status(500).json({ ok: false, msg: ex.message || "Erro interno do servidor" });
        }
    }
    

    async listarTodasRespostasObtidasPesquisas(req, res) {
        try{
            let resposta_pesquisa = new RespostaPesquisaRepository();
            let lista = await resposta_pesquisa.listarTodasRespostasPesquisa();
            res.render("resposta-pesquisa/listar", { lista: lista });
            
        }
        catch(ex) {
            console.error("Erro ao listar todas as respostas obtidas das pesquisas:", ex);
            res.status(500).json({msg: ex.message});
        }
    }

    async buscarPorId(req) {
        try {
            const { id } = req.params;
            console.log('id', id);

            const repo = new RespostaPesquisaRepository();
            const resposta_pesquisa = await repo.buscarPorId(id);

            console.log('resposta_pesquisa', resposta_pesquisa);
    
            if (!resposta_pesquisa) {
                return res.status(404).json({ msg: "resposta da pesquisa não encontrada" });
            }
    
            return (resposta_pesquisa);
        } catch (error) {
            console.error("Erro ao buscar resposta da pesquisa por ID:", error);
            return null;
        }
    }

    async obterIdDaRespostaPorPesquisaId(req) {
        try {
            const { id } = req.params;
            console.log('id', id);

            const repo = new RespostaPesquisaRepository();
            const resposta_pesquisa = await repo.obterIdRespostaPorPesquisaId(id);

            console.log('resposta_pesquisa', resposta_pesquisa);
    
            if (!resposta_pesquisa) {
                return res.status(404).json({ msg: "resposta da pesquisa não encontrada" });
            }
    
            return (resposta_pesquisa);
        } catch (error) {
            console.error("Erro ao buscar resposta da pesquisa pelo ID da pesquisa:", error);
            return null;
        }
    }

    async listagem(req, res) {
        try{
            let resposta_pesquisa = new RespostaPesquisaRepository();
            let lista = await resposta_pesquisa.listagem();
            res.render("pesquisa/listagem", { lista: lista });  
        }
        catch(ex) {
            console.error("Erro ao listar pesquisas:", ex);
            res.status(500).json({msg: ex.message});
        }
    }

    // async buscarPerguntasRespondidas(pessoa_id, pesquisa_id) {
    //     try {
    //         // const pessoa = req.cookies.pessoaLogado;
    //         // const pessoa_id = typeof pessoa === 'string' ? JSON.parse(pessoa).id : pessoa.id;

    //         // const { pesquisa_id } = req.params;
    
    //         if (!pessoa_id || !pesquisa_id) {
    //             return res.status(400).json({ msg: "Parâmetros ausentes!" });
    //         }
    
    //         const repo = new RespostaPesquisaRepository();
    //         const perguntasRespondidas = await repo.buscarPerguntasRespondidas(pessoa_id, pesquisa_id);
    
    //         // return res.status(200).json({
    //         //     ok: true,
    //         //     perguntasRespondidas
    //         // });
    //         return perguntasRespondidas || [];
    
    //     } catch (ex) {
    //         console.error("Erro ao buscar perguntas respondidas:", ex);
    //         // return res.status(500).json({ ok: false, msg: ex.message || "Erro interno do servidor" });
    //         return [];
    //     }
    // }

    async buscarPerguntasRespondidas(pessoa_id, pesquisa_id) {
        try {
            if (!pessoa_id || !pesquisa_id) {
                console.warn("Parâmetros ausentes ao buscar perguntas respondidas");
                return [];
            }
    
            const repo = new RespostaPesquisaRepository();
            const perguntasRespondidas = await repo.buscarPerguntasRespondidas(pessoa_id, pesquisa_id);
    
            return perguntasRespondidas || [];
    
        } catch (ex) {
            console.error("Erro ao buscar perguntas respondidas:", ex);
            return [];
        }
    }
    

    async buscarPerguntasRespondidasPorPessoa(pessoa_id, pesquisa_id) {
        try {
            const repo = new RespostaPesquisaRepository();
            const perguntasRespondidas = await repo.buscarPerguntasRespondidas(pessoa_id, pesquisa_id);
            return perguntasRespondidas || [];
        } catch (ex) {
            console.error("Erro ao buscar perguntas respondidas:", ex);
            throw ex;
        }
    }
    
    

    
    
}