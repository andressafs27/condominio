import PesquisaRepository from "../repositories/pesquisaRepository.js";
import PesquisaEntity from "../entities/pesquisaEntity.js";
import PerguntasRepository from "../repositories/perguntasRepository.js";
import PerguntasPesquisaRepository from "../repositories/perguntasPesquisaRepository.js";
import RespostaPesquisaRepository from "../repositories/respostaPesquisaRepository.js";

export default class PesquisaController {

    async cadastrar(req, res) {
        try {
            const { titulo, data, status, data_fim, perguntas = [] } = req.body;
    
            if (!titulo || !data || !data_fim || !status || perguntas.length === 0) {
                return res.status(400).json({ ok: false, msg: "Parâmetros não informados corretamente!" });
            }
    
            const repoPesquisa = new PesquisaRepository();
            const pesquisaExistente = await repoPesquisa.buscarPesquisaTitulo(titulo);
    
            if (pesquisaExistente) {
                return res.status(400).json({ ok: false, msg: "Pesquisa já cadastrada com este título!" });
            }
    
            const repoPerguntas = new PerguntasRepository();

            console.log("Perguntas recebidas:", perguntas);

    
            for (const pergunta of perguntas) {
                const id = typeof pergunta === 'object' ? pergunta.id : pergunta;
                console.log("Perguntas recebidas:", perguntas);

                
                console.log("Perguntas recebidas:", perguntas);

                if (!id) {
                    return res.status(400).json({ ok: false, msg: "Pergunta não informada corretamente!" });
                }

            }
    
            const novapesquisa = new PesquisaEntity(0, titulo, data, status, data_fim);
            const idpesquisa = await repoPesquisa.cadastrar(novapesquisa);
    
            if (!idpesquisa) {
                throw new Error("Erro ao cadastrar a pesquisa no banco de dados");
            }
    
            for (const pergunta of perguntas) {
                const id = typeof pergunta === 'object' ? pergunta.id : pergunta;
                const repoPesquisaPergunta = new PerguntasPesquisaRepository();
                await repoPesquisaPergunta.associarPerguntaPesquisa({
                    pergunta_id: id,
                    pesquisa_id: idpesquisa
                });            }
    
            return res.status(201).json({ ok: true, msg: "Pesquisa cadastrada com sucesso!" });
    
        } catch (ex) {
            console.error("Erro no cadastro:", ex);
            return res.status(500).json({ ok: false, msg: ex.message || "Erro interno do servidor" });
        }
    }
    
    async listar(req, res) {
        try{
            let pesquisa = new PesquisaRepository();
            let lista = await pesquisa.listar();
            res.render("pesquisa/listar", { lista: lista });  
        }
        catch(ex) {
            console.error("Erro ao listar pesquisas:", ex);
            res.status(500).json({msg: ex.message});
        }
    }

    async alterar(req, res) {
        try {
            const { id, titulo, data, data_fim, status, perguntas = [] } = req.body;
    
            if (!id || !titulo || !data || !data_fim || !status || perguntas.length === 0) {
                return res.status(400).json({ ok: false, msg: "Parâmetros não informados corretamente!" });
            }
    
            const repoPesquisa = new PesquisaRepository();
            const pesquisaExistente = await repoPesquisa.buscarPorId(id);
    
            if (!pesquisaExistente) {
                return res.status(404).json({ ok: false, msg: "Pesquisa não encontrada!" });
            }
    
            let pesquisatituloExistente = null;
            if (titulo !== pesquisaExistente.titulo) {
                pesquisatituloExistente = await repoPesquisa.buscarPesquisaTitulo(titulo);
            }
    
            if (pesquisatituloExistente && pesquisatituloExistente.id !== id) {
                return res.status(400).json({ ok: false, msg: "Já existe outra pesquisa com este título!" });
            }
    
            if (status === 'ativo' && pesquisaExistente.status !== 'ativo') {
                const pesquisaAtiva = await repoPesquisa.buscarPesquisaTituloAtivo(titulo);
                if (pesquisaAtiva) {
                    return res.status(400).json({ ok: false, msg: "Já existe uma pesquisa com este título ativa!" });
                }
            }

            /*Validar se q pesquisa possui perguntas respondidas*/
            const respostaPesquisaRepository = new RespostaPesquisaRepository();
            let respostasDaPesquisa = await respostaPesquisaRepository.buscarPorIdPesquisa(pesquisaExistente.id);
            if(respostasDaPesquisa && respostasDaPesquisa.length > 0)
            {
                return res.status(400).json({ ok: false, msg: "Essa pesquisa já possui respostas! Não é possível alterar." });
            }

            const entidadeAtualizada = new PesquisaEntity(id, titulo, data, status, data_fim);
            const alterado = await repoPesquisa.alterar(entidadeAtualizada);
    
            if (!alterado) {
                return res.status(400).json({ ok: false, msg: "Erro ao atualizar pesquisa!" });
            }
    
            const repoPesquisaPergunta = new PerguntasPesquisaRepository();
            await repoPesquisaPergunta.removerPorPesquisaId(id);
    
            for (const pergunta of perguntas) {
                const pergunta_id = typeof pergunta === 'object' ? pergunta.id : pergunta;
                if (!pergunta_id) {
                    return res.status(400).json({ ok: false, msg: "Pergunta não informada corretamente!" });
                }
    
                await repoPesquisaPergunta.associarPerguntaPesquisa({
                    pergunta_id,
                    pesquisa_id: id
                });
            }
    
            return res.status(200).json({ ok: true, msg: "Pesquisa atualizada com sucesso!" });
    
        } catch (ex) {
            console.error("Erro ao alterar pesquisa:", ex);
            return res.status(500).json({ ok: false, msg: ex.message || "Erro interno do servidor" });
        }
    }
    
    
    async buscarPorId(id) {
        try {

            const repo = new PesquisaRepository();
            const pesquisa = await repo.buscarPorId(id);


            if (!pesquisa) {
                console.log("pesquisa não encontrada.");
                return null; 
            }
    
            return(pesquisa);
        } catch (error) {
            console.error("Erro ao buscar pesquisa por ID:", error);
            return null;
        }
    }

    // 

    async listarPorPessoa(req, res) {
        const pessoaLogado = req.cookies.pessoaLogado ? JSON.parse(req.cookies.pessoaLogado) : null;

        try{
            let pesquisa = new PesquisaRepository();
            let lista = await pesquisa.listarPorPessoa(pessoaLogado.id);
            res.render("pesquisa/listagem-morador", { lista: lista ,pessoaLogado: pessoaLogado, layout:"layoutMorador"});  
        }
        catch(ex) {
            console.error("Erro ao listar pesquisas:", ex);
            res.status(500).json({msg: ex.message});
        }
    }
}