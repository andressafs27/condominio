import pessoaUnidadeRepository from "../repositories/pessoaUnidadeRepository.js";

export default class PessoaUnidadeController {
    
    async pessoaVinculadaUnidade(req) {
        
        try {
            const { id } = req.params;

            console.log('controler pessoa-has id da unidade', id);

            const repo = new pessoaUnidadeRepository();
            const unidade = await repo.obterUnidadesDaPessoaPorId(id);
 
            console.log('controler pessoa-has-unidade', unidade);
    
            if (unidade == null) {
                console.log("pessoa não tem unidade vinculada.");
                return (null); 
            }
            else{
               return (unidade); 
            }
    
            
        } catch (error) {
            console.error("Erro ao buscar unidade da pessoa por ID:", error);
            return null;
        }
    }
}
