import unidadeRepository from "../repositories/unidadeRepository.js";
import unidadeEntity from "../entities/unidadeEntity.js";
import pessoaUnidadeRepository from "../repositories/pessoaUnidadeRepository.js";

export default class UnidadeController {
    
    async cadastrar(req, res) {

        console.log("UnidadeController cadastrar (req.body):", req.body); 

        try {
            const { numero, bloco_id } = req.body;
            
            if (!numero || !bloco_id) {
                return res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
            }

            const repo = new unidadeRepository();
            
            let unidadeExistente = await repo.obterPorNumeroEBlocoId(numero, bloco_id);
        
            if(unidadeExistente){
                if(!unidadeExistente.ativo){
                    return res.status(200).json({ jaExisteDesativado: true, id: bloco_id, msg: "Esta unidade já existe, mas está desativada. Deseja reativá-la?" });
                }
                return res.status(400).json({ msg: "Unidade já cadastrada!" });
            }
            
            const entidade = new unidadeEntity(0, numero, bloco_id, true);
            const result = await repo.cadastrar(entidade);

            if (result) {
                return res.status(201).json({ ok: true, msg: "Cadastro realizado com sucesso!" });
            } else {
                throw new Error("Erro ao cadastrar no banco de dados");
            }
        } catch (ex) {
            console.error("Erro no cadastro:", ex);
            return res.status(500).json({ ok: false, msg: ex.message || "Erro interno do servidor" });
        }
    }

      

    async listar(req, res) {
        try{
            let unidade = new unidadeRepository();
            let lista = await unidade.listar();
            res.render("unidade/listar", { lista: lista });
            
        }
        catch(ex) {
            console.error("Erro ao listar unidades:", ex);
            res.status(500).json({msg: ex.message});
        }
    }

    async alterar(req, res) {
        try {
            const { id, numero, bloco_id } = req.body;
            if (!id || !numero || !bloco_id) {
                return res.status(400).json({ ok: false, msg: "Parâmetros não informados corretamente!" });
            }

            //verificacao se tem morador naquela unidade e impede a alteração
            // const pessoaUnidadeRepo = new pessoaUnidadeRepository();  
            // const pessoaMoradorExistente = await pessoaUnidadeRepo.obterUnidadesPorPessoa(pessoa_id);

            // if (!pessoaMoradorExistente) {
            //     return res.status(400).json({ msg: "Unidade com Morador vinculado!" });
            // }
            
            const repo = new unidadeRepository();

            const unidadeExistente = await repo.obterPorNumeroEBlocoId(numero, bloco_id);

            if (unidadeExistente && unidadeExistente.id != id) {
                if (!unidadeExistente.ativo) {
                    return res.status(200).json({ jaExisteDesativado: true, id: bloco_id, msg: "Esta unidade já existe, mas está desativada. Deseja reativá-la?" });
                }
                return res.status(400).json({ msg: "Já existe outra unidade com este número neste bloco!" });
            }

            const entidade = new unidadeEntity(id, numero, bloco_id, true);

            const result = await repo.alterar(entidade);

            if (result) {
                return res.status(200).json({ ok: true, msg: "Cadastro atualizado com sucesso!" });
            } else {
                return res.status(400).json({ ok: false, msg: "Cadastro não encontrado ou não atualizado" });
            }
        } catch (ex) {
            console.error("Erro na atualização:", ex);
            return res.render("unidade/alterar", { ok: false, msg: "Erro interno do servidor", unidade: req.body });
        }
    }

    async buscarPorId(req) {
            try {
                const { id } = req.params;

                console.log('UnidadeController buscarPorId (req): ', id);
    
                const repo = new unidadeRepository();
                const unidade = await repo.buscarPorId(id);
    
                console.log('UnidadeController buscarPorId (id): ', id);
        
                if (!unidade) {
                    console.log("unidade não encontrada.");
                    return null; 
                }
        
                return (unidade);
            } catch (error) {
                console.error("Erro ao buscar unidade por ID:", error);
                return null;
            }
        }

    async desabilitar(req, res) {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({ msg: "Parâmetro ID não informado corretamente!" });
            }

            const repo = new unidadeRepository();
            let unidadeExistente = await repo.buscarPorId(id);

            if (!unidadeExistente) {
                return res.status(404).json({ msg: "Unidade não encontrada!" });
            }

            const pessoaUnidadeRepo = new pessoaUnidadeRepository();
            const vinculoUnidade = await pessoaUnidadeRepo.obterUnidadesDaPessoaPorId(id);

            if (vinculoUnidade != null) {
                return res.status(400).json({ msg: "Morador(es) Vinculado(s) a unidade!" });
            }

            unidadeExistente.ativo = false;
            const result = await repo.desabilitar(unidadeExistente);

            if (result) {
                return res.status(200).json({ ok: true, msg: "Unidade desabilitada com sucesso!" });
            } else {
                return res.status(400).json({ msg: "Falha ao desabilitar unidade!" });
            }
        } catch (ex) {
            console.error("Erro ao desabilitar unidade:", ex);
            return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    }

   async reativar(req, res) {
           try {
               const { id } = req.body;
       
               if (!id) {
                   return res.status(400).json({ msg: "Parâmetro ID não informado corretamente!" });
               }
       
               const repo = new unidadeRepository();
               const result = await repo.reativar({id});
       
               if (result) {
                   return res.status(200).json({ ok: true, msg: "Unidade reativada com sucesso!" });
               } else {
                   return res.status(400).json({ msg: "Falha ao reativar unidade!" });
               }
           } catch (ex) {
               console.error("Erro ao reativar unidade:", ex);
               return res.status(500).json({ msg: "Erro interno do servidor" });
           }
       }

        async obterTodasUnidades() {
            try {
                const repo = new unidadeRepository();
                const unidades = await repo.listar();
                return unidades;
            } catch (error) {
                console.error("Erro ao obter unidades diretamente:", error);
                throw error;
            }
        }

        async buscarPorNumeroEBloco(numeroUnidade, bloco) {
            try {
                // Chama o método do repositório para buscar a unidade
                const repo = new unidadeRepository();
                const unidade = await repo.buscarPorNumeroEBloco(numeroUnidade, bloco);
                return unidade;
            } catch (error) {
                console.error("Erro ao buscar unidade por número e bloco:", error);
                throw error;
            }
        }
}
