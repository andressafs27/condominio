import express from 'express';
import PessoaController from '../controllers/pessoaController.js';
import BlocoController from '../controllers/blocoController.js';
import UnidadeController from '../controllers/unidadeController.js';

const router = express.Router();

const ctrl = new PessoaController();    
const bloco = new BlocoController();
const unidade = new UnidadeController();

router.get("/cadastrar", async (req, res) => {
    try {
        const blocos = await bloco.obterTodosDireto();
        const unidades = await unidade.obterTodasUnidades();

        res.render("pessoa/cadastrar", { blocos, unidades });

    } catch (error) {
        console.error("Erro ao carregar blocos:", error);
        res.status(500).send("Erro ao carregar blocos");
    }
});

router.post("/cadastrar", (req, res) => {
    ctrl.cadastrar(req,res);
});

router.get("/listar", (req, res) => {
    ctrl.listar(req, res); 
});

router.get("/alterar/:id", async (req, res) => {
    try {
        let pessoa = await ctrl.buscarPorId(req.params.id);

        if (!pessoa) {
            return res.render("pessoa/alterar", { 
                msg: "Pessoa não encontrada", 
                pessoa: null,
                blocos: [], 
                unidades: []
            });
        }

        const blocos = await bloco.obterTodosDireto();
        const unidades = await unidade.obterTodasUnidades();

        res.render("pessoa/alterar", { 
            pessoa: pessoa, 
            blocos: blocos, 
            unidades: unidades 
        });
    } catch (error) {
        console.error("Erro ao carregar blocos:", error);
        res.status(500).send("Erro ao carregar blocos");
    }
});

router.post("/alterar", (req, res) => {
    ctrl.alterar(req,res);
});

router.get("/buscarPorCpf/:cpf", (req, res) => ctrl.buscarPorCpf(req, res));

router.get("/desabilitar/:id", async (req, res) => {
    try {
        let pessoa = await ctrl.buscarPorId(req.params.id);

        if (!pessoa) {
            return res.render("pessoa/desabilitar", { 
                msg: "Pessoa não encontrada", 
                pessoa: null,
                blocos: [], 
                unidades: []
            });
        }

        const blocos = await bloco.obterTodosDireto();
        const unidades = await unidade.obterTodasUnidades();

        res.render("pessoa/desabilitar", { 
            pessoa: pessoa, 
            blocos: blocos, 
            unidades: unidades 
        });

    } catch (error) {
        console.error("Erro ao carregar blocos:", error);
        res.status(500).send("Erro ao carregar blocos");
    }
});

router.post("/desabilitar", (req, res) => {
  ctrl.desabilitar(req,res);
});

router.get('/relatorio', async (req, res) => {
 try {
  ctrl.filtrar(req, res, false);
  } catch (error) {
      console.error("Erro ao buscar relatorio:", error);
      res.render("pessoa/listar", {
          msg: "Erro interno do servidor",
      });
  }
});


router.get("/filtrar/:termo/:filtro", async (req, res) => {
  ctrl.filtrar(req, res, true);
});

export default router;
