import pautasRepository from "../repositories/pautasRepository.js";

export default class PautasController {
    
    async obterTodasAsPautas() {
        try {
            console.log("Entrou na função obterTodasAsPautas");

            const repo = new pautasRepository();
            const pautas = await repo.listar();

            console.log("Pautas obtidas:", pautas);
            
            return pautas;
        } catch (error) {
            console.error("Erro ao obter pautas diretamente:", error);
            throw error;
        }
    }
    
    async obterPautasSemVotacao() {
        try {
            console.log("Entrou na função obterPautasSemVotacao");

            const repo = new pautasRepository();
            const pautasSemVotacao = await repo.listarPautasSemVotacao();

            console.log("Pautas sem votação obtidas:", pautasSemVotacao);
            
            return pautasSemVotacao;
        } catch (error) {
            console.error("Erro ao obter pautas com votação:", error);
            throw error;
        }
    }

    async obterPautaId(id){
        try {

            const repo = new pautasRepository();
            const pauta = await repo.buscarPorId(id);
            
            return pauta;
        } catch (error) {
            console.error("Erro ao obter pauta por ID:", error);
            throw error;
        }
    }

    
}
