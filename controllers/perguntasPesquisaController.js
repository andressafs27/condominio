import perguntasPesquisaRepository from "../repositories/perguntasPesquisaRepository.js";
import PerguntasPesquisaEntity from "../entities/perguntasPesquisaEntity.js";

export default class PerguntasPesquisaController {

    async obterPerguntasDaPesquisa(pesquisa_id) {
        try {

            const repo = new perguntasPesquisaRepository();
            const rows = await repo.buscarPorPesquisaId(pesquisa_id);


            if (!rows || rows.length === 0) {
                return []; // Retorna um array vazio se não houver perguntas
            }

            return rows.map(row => ({
                id: row.id,
                enunciado: row.enunciado,
            }));
            

          
        } catch (error) {
            console.error("Erro ao buscar perguntas da pesquisa:", error);
            throw new Error("Erro ao buscar perguntas da pesquisa");
        }
    }

    async buscarPorPesquisaParaResponder(pesquisa_id, pessoa_id) {
        try {

            const repo = new perguntasPesquisaRepository();
            const rows = await repo.buscarPorPesquisaParaResponder(pesquisa_id, pessoa_id);


            if (!rows || rows.length === 0) {
                return []; // Retorna um array vazio se não houver perguntas
            }

            return rows;            

          
        } catch (error) {
            console.error("Erro ao buscar perguntas da pesquisa:", error);
            throw new Error("Erro ao buscar perguntas da pesquisa");
        }
    }

    async removerAssociacoesPorPesquisaId(pesquisa_id) {
        try {
            const repo = new perguntasPesquisaRepository();

            return await repo.removerPorPesquisaId(pesquisa_id);
        } catch (error) {
            console.error("Erro ao remover associações da pesquisa:", error);
            throw new Error("Erro ao remover associações da pesquisa");
        }
    }

    async removerAssociacao(pergunta_id, pesquisa_id) {
        try {
            const repo = new perguntasPesquisaRepository();

            return await repo.removerAssociacao(pergunta_id, pesquisa_id);
        } catch (error) {
            console.error("Erro ao remover associação específica:", error);
            throw new Error("Erro ao remover associação entre pergunta e pesquisa");
        }
    }

    async adicionarAssociacao(pergunta_id, pesquisa_id) {
        try {
            const repo = new perguntasPesquisaRepository();

            return await repo.adicionarAssociacao(pergunta_id, pesquisa_id);
        } catch (error) {
            console.error("Erro ao criar associação:", error);
            throw new Error("Erro ao criar associação entre pergunta e pesquisa");
        }
    }

    // perguntaPesquisaCtrl.js

    async adicionarPerguntaNaPesquisa(pesquisaId, perguntaId) {
        try {
            // Verifique se a associação já existe
            const existeAssociacao = await db('pergunta_pesquisa')
                .where({ pesquisa_id: pesquisaId, pergunta_id: perguntaId })
                .first();

            if (existeAssociacao) {
                throw new Error('Pergunta já adicionada a essa pesquisa.');
            }

            // Adicionar a nova associação
            await db('pergunta_pesquisa').insert({
                pesquisa_id: pesquisaId,
                pergunta_id: perguntaId
            });

            return { success: true };
        } catch (error) {
            console.error("Erro ao adicionar pergunta à pesquisa:", error);
            throw error; // Repassa o erro para o controlador
        }
    }

    // perguntaPesquisaCtrl.js

    async  removerPerguntaDaPesquisa(pesquisaId, perguntaId) {
        try {
            // Remover a associação entre a pesquisa e a pergunta
            await db('pergunta_pesquisa')
                .where({ pesquisa_id: pesquisaId, pergunta_id: perguntaId })
                .del();

            return { success: true };
        } catch (error) {
            console.error("Erro ao remover pergunta da pesquisa:", error);
            throw error; // Repassa o erro para o controlador
        }
    }

    async buscarPrimeiraPergunta(pesquisa_id) {
        try {
            console.log("Controller -> buscarPrimeiraPergunta");

            const repo = new perguntasPesquisaRepository();
            const pergunta = await repo.buscarPrimeiraPergunta(pesquisa_id);

            console.log("controller buscarprimeirapergunta: ", pergunta);


            if (!pergunta) {
                return null; 
            }

            return new PerguntasPesquisaEntity(
                pergunta.pergunta_id,
                pergunta.pesquisa_id,
            );
        } catch (error) {
            console.error("Erro ao buscar a primeira pergunta da pesquisa:", error);
            throw new Error("Erro ao buscar a primeira pergunta da pesquisa.");
        }
    }
}
