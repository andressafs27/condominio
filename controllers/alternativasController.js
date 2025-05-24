import AlternativasRepository from "../repositories/alternativasRepository.js";

export default class AlternativasController {
    
    async obterTodasAlternativasId(id) {
        try {
            const repo = new AlternativasRepository();
            const alternativas = await repo.obter(id);

            console.log("Controler Alternativa obterTodasAlternativas (alternativas) obtidas:", alternativas);

            if (!alternativas) {
                console.log("Alternativas não encontradas.");
                return null; 
            }

            return (alternativas);

        } catch (error) {
            console.error("Erro ao obter alternativas diretamente:", error);
            throw error;
        }
    }

    async obter(id) {
        try {
            const repo = new AlternativasRepository();
            const alternativas = await repo.obter(id);

            console.log("Controler Alternativa obterTodasAlternativas (alternativas) obtidas:", alternativas);

            if (!alternativas) {
                console.log("Alternativas não encontradas.");
                return null; 
            }

            return (alternativas);

        } catch (error) {
            console.error("Erro ao obter alternativas diretamente:", error);
            throw error;
        }
    }

    async buscarPorIdPergunta(idPergunta) {
        try {
            // const { idPergunta } = req.params;

            const repo = new AlternativasRepository();
            const alternativas = await repo.buscarPorIdPergunta(idPergunta);

            console.log("controller alternativas buscarporidaPergunta: ", alternativas);

    
            if (!alternativas || alternativas.length === 0) {
                console.log("alternativas não encontrada.");
                return []; 
            }
    
            return alternativas;

        } catch (error) {
            console.error("Erro ao buscar alternativas da pergunta por ID:", error);
            return null;
        }
    }
}