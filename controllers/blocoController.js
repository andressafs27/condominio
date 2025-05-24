import BlocoRepository from "../repositories/blocoRepository.js";
import BlocoEntity from "../entities/blocoEntity.js";
import UnidadeRepository from "../repositories/unidadeRepository.js";


export default class BlocoController {

    async cadastrar(req, res) {

        try {
            const { numero } = req.body; 
            if (!numero ) {
                return res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
            }
    
            const repo = new BlocoRepository();

            let blocoExistente = await repo.obterPorNumero(numero);

            if (blocoExistente) {
                if (!blocoExistente.ativo) {
                    return res.status(200).json({ jaExisteDesativado: true, id: blocoExistente.id, msg: "Este bloco já existe, mas está desativado. Deseja reativá-lo?" });
                }
                return res.status(400).json({ msg: "Bloco já cadastrado!" });
            }
            
           
            const entidade = new BlocoEntity(0, numero, true);
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
    

    // async listar(req, res) {
    //     try{
    //         let bloco = new BlocoRepository();
    //         let lista = await bloco.listar();
    //         res.render("bloco/listar", { lista });
            
    //     }
    //     catch(ex) {
    //         console.error("Erro ao listar blocos:", ex);
    //         res.status(500).json({msg: ex.message});
    //     }
    // }

    // método usado na rota /listar para exibir na tela
async listar(req, res) {
    try {
        const repo = new BlocoRepository();
        const blocos = await repo.listar();
        res.render("bloco/listar", { blocos });  // aqui espera uma view
    } catch (error) {
        console.error("Erro ao listar blocos:", error);
        res.render("bloco/listar", { msg: "Erro ao carregar blocos", blocos: [] });
    }
}

    // método usado na rota /obterTodos para retornar JSON
    async obterTodosDireto() {
        try {
            const repo = new BlocoRepository();
            const blocos = await repo.listar();
            return blocos;
        } catch (error) {
            console.error("Erro ao obter blocos diretamente:", error);
            throw error;
        }
    }

    async alterar(req, res) {
        try {
            // const {id} = req.params;
            const { id, numero } = req.body;
                if (!id || !numero) {
                return res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
            }
            const entidade = new BlocoEntity(id, numero, true);
            const repo = new BlocoRepository();

            let blocoExistente = await repo.obterPorNumero(numero);

            if (blocoExistente) {

                const unidadeRepo = new UnidadeRepository();
                const vinculoUnidadeBloco = await unidadeRepo.buscarPorId(id);

                if (vinculoUnidadeBloco != null) {
                    return res.status(400).json({ msg: "Bloco Vinculado a unidades!" });
                }

                if (!blocoExistente.ativo) {
                    return res.status(200).json({ jaExisteDesativado: true, id: blocoExistente.id, msg: "Este bloco já existe, mas está desativado. Deseja reativá-lo?" });
                }
                return res.status(400).json({ msg: "Bloco já cadastrado!" });
            }
            
            const result = await repo.alterar(entidade);

            if (result) {
                return res.status(200).json({ ok: true, msg: "Cadastro atualizado com sucesso!" });
            } else {
                // return res.render("bloco/alterar", {  ok: false,msg: "Cadastro não encontrado ou não atualizado", bloco: req.body });
                // throw new Error("Erro ao atualizar no banco de dados");
                return res.status(400).json({ ok: false, msg: "Cadastro não encontrado ou não atualizado" });

            }
    
        } catch (ex) {
            console.error("Erro na atualização:", ex);
            return res.render("bloco/alterar", { msg: "Erro interno do servidor", bloco: req.body });
            // return res.status(500).json({ msg: ex.message || "Erro interno do servidor" });
        }
    }

    async buscarPorId(req) {
        try {
            const { id } = req.params;

            console.log('BlocoController buscarPorId (id): ', id);

            const repo = new BlocoRepository();
            const bloco = await repo.buscarPorId(id);

              console.log('BlocoController buscarPorId (bloco): ', bloco);
    
            if (!bloco) {
                console.log("Bloco não encontrado.");
                return null; 
            }
    
            return (bloco);
        } catch (error) {
            console.error("Erro ao buscar bloco por ID:", error);
            return null;
        }
    }

    async desabilitar(req, res) {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({ msg: "Parâmetro ID não informado corretamente!" });
            }

            const repo = new BlocoRepository();
            let blocoExistente = await repo.buscarPorId(id);

            if (!blocoExistente) {
                return res.status(404).json({ msg: "Bloco não encontrado!" });
            }

            const unidadeRepo = new UnidadeRepository();
            const vinculoUnidadeBloco = await unidadeRepo.buscarPorBloco(blocoExistente.id);

            if (vinculoUnidadeBloco != null) {
                return res.status(400).json({ msg: "Bloco Vinculado a unidade!" });
            }

            blocoExistente.ativo = false;
            const result = await repo.desabilitar(blocoExistente);

            if (result) {
                return res.status(200).json({ ok: true, msg: "Bloco desabilitado com sucesso!" });
            } else {
                return res.status(400).json({ msg: "Falha ao desabilitar bloco!" });
            }
        } catch (ex) {
            console.error("Erro ao desabilitar bloco:", ex);
            return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    }

    async reativar(req, res) {
        try {
            const { id } = req.body;
    
            if (!id) {
                return res.status(400).json({ msg: "Parâmetro ID não informado corretamente!" });
            }
    
            const repo = new BlocoRepository();
            const result = await repo.reativar({id});
    
            if (result) {
                return res.status(200).json({ ok: true, msg: "Bloco reativado com sucesso!" });
            } else {
                return res.status(400).json({ msg: "Falha ao reativar bloco!" });
            }
        } catch (ex) {
            console.error("Erro ao reativar bloco:", ex);
            return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    }

   
    

    
    
}