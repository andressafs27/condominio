import categoriaReclamacaoRepository from "../repositories/categoriaReclamacaoRepository.js";
import categoriaReclamacaoEntity from "../entities/categoriaReclamacaoEntity.js";

export default class CategoriaReclamacaoController {

    async cadastrar(req, res) {

        try {
            const { nome, penalidade, multa } = req.body; 
            if (!nome || !penalidade || !multa ) {
                return res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
            }
            const repo = new categoriaReclamacaoRepository();

            let categoriaExistente = await repo.obterPorNome(nome);

            // if(categoriaExistente) {
            //     return res.status(400).json({ msg: "Categoria já cadastrada!" });
            // }

            if (categoriaExistente) {
                if (!categoriaExistente.ativo) {
                    return res.status(200).json({ jaExisteDesativado: true, id: categoriaExistente.id, msg: "Esta categoria de reclamação já existe, mas está desativada. Deseja reativá-la?" });
                }
                return res.status(400).json({ msg: "Categoria de Reclamação já cadastrada!" });
            }
            

            const entidade = new categoriaReclamacaoEntity(0, nome, penalidade, multa, true);
            
            const result = await repo.cadastrar(entidade);
    
            if (result) {
                return res.status(201).json({  ok: true,msg: "Cadastro realizado com sucesso!" });
                
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
            let categoria = new categoriaReclamacaoRepository();
            let lista = await categoria.listar();
            // res.status(200).json(lista);
            res.render("categoria/listar", { lista: lista });
            
        }
        catch(ex) {
            console.error("Erro ao listar categorias:", ex);
            res.status(500).json({msg: ex.message});
        }
    }

    async alterar(req, res) {
        try {
            console.log("Dados recebidos:", req.body); 
            
            const { id, nome, penalidade, multa } = req.body;
            if (!id || !nome || !penalidade || !multa) {
                return res.status(400).json({ ok: false, msg: "Parâmetros não informados corretamente!" });
            }
    
            const repo = new categoriaReclamacaoRepository();
            let categoriaExistente = await repo.obterPorNome(nome);
    
            console.log("categoriaExistente (JSON):", JSON.stringify(categoriaExistente));
    
            // Se o nome foi alterado e já existe outra categoria com o mesmo nome, retorna erro
            if (categoriaExistente && categoriaExistente.id !== Number(id)) {
                return res.status(400).json({ ok: false, msg: "Já existe uma categoria com este nome!" });
            }

            // if (categoriaExistente) {
            //     if (!categoriaExistente.ativo) {
            //         return res.status(200).json({ jaExisteDesativado: true, id: categoriaExistente.id, msg: "Esta categoria de reclamação já existe, mas está desativada. Deseja reativá-la?" });
            //     }
            //     return res.status(400).json({ msg: "Categoria de Reclamação já cadastrada!" });
            // }
            
    
            const entidade = new categoriaReclamacaoEntity(Number(id), nome, penalidade, multa, true);
            const result = await repo.alterar(entidade);
    
            if (result) {
                return res.status(200).json({ ok: true, msg: "Cadastro atualizado com sucesso!" });

            } else {
                return res.status(400).json({ ok: false, msg: "Cadastro não encontrado ou não atualizado" });
            }
    
        } catch (ex) {
            console.error("Erro na atualização:", ex);
            return res.render("categoria/alterar", { ok: false, msg: "Erro interno do servidor", categoria: req.body });
        }
    }
    
    
    async buscarPorCategoriaId(categoria_id) {
        try {

            const repo = new categoriaReclamacaoRepository();
            return await repo.buscarPorId(categoria_id);
        } catch (error) {
            console.error("Erro ao buscar categoria por ID:", error);
            return null;
        }
    }


    async buscarPorId(req) {
        try {
            const { id } = req.params;

            const repo = new categoriaReclamacaoRepository();
            const categoria = await repo.buscarPorId(id);

            console.log('categoria', categoria);
    
            if (!categoria) {
                return res.status(404).json({ msg: "Categoria não encontrada" });
            }
    
            return (categoria);
        } catch (error) {
            console.error("Erro ao buscar categoria por ID:", error);
            return null;
        }
    }

    async desabilitar(req, res) {
        try {
            const { id } = req.body;

            if (!id) {
                return res.status(400).json({ msg: "Parâmetro ID não informado corretamente!" });
            }

            const repo = new categoriaReclamacaoRepository();
            let categoriaExistente = await repo.buscarPorId(id);

            if (!categoriaExistente) {
                return res.status(404).json({ msg: "Categoria não encontrada!" });
            }

            categoriaExistente.ativo = false;
            const result = await repo.desabilitar(categoriaExistente);

            if (result) {
                return res.status(200).json({ ok: true, msg: "Categoria desabilitada com sucesso!" });
            } else {
                return res.status(400).json({ msg: "Falha ao desabilitar categoria!" });
            }
        } catch (ex) {
            console.error("Erro ao desabilitar categoria:", ex);
            return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    }

    async verificarNome(req, res) {
        try {
            const { nome } = req.body;
            const repo = new categoriaReclamacaoRepository();
            const categoria = await repo.obterPorNome(nome);
    
            if (categoria) {
                return res.status(200).json({ ok: true});
            } else {
                return res.status(200).json({ ok: !!categoria });
            }
        } catch (ex) {
            console.error("Erro ao verificar nome:", ex);
            return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    }

    async reativar(req, res) {
            try {
                const { id } = req.body;
        
                if (!id) {
                    return res.status(400).json({ msg: "Parâmetro ID não informado corretamente!" });
                }
        
                const repo = new categoriaReclamacaoRepository();
                const result = await repo.reativar({id});
        
                if (result) {
                    return res.status(200).json({ ok: true, msg: "Categoria de Reclamação reativada com sucesso!" });
                } else {
                    return res.status(400).json({ msg: "Falha ao reativar Categoria de Reclamação !" });
                }
            } catch (ex) {
                console.error("Erro ao reativar Categoria de Reclamação :", ex);
                return res.status(500).json({ msg: "Erro interno do servidor" });
            }
        }

        async obterTodasCategorias() {
                try {
                    const repo = new categoriaReclamacaoRepository();
                    const categoria = await repo.listar();
                    return categoria;
                } catch (error) {
                    console.error("Erro ao obter categorias diretamente:", error);
                    throw error;
                }
            }
    
    
    
}