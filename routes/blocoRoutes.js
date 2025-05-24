import express from 'express';
import BlocoController from '../controllers/blocoController.js';

const router = express.Router();
const ctrl = new BlocoController();    

router.get("/cadastrar", (req, res) => {
    res.render("bloco/cadastrar");  
});

router.post("/cadastrar", (req, res) => {
    ctrl.cadastrar(req,res);
});

router.get("/listar", (req, res) => {
    ctrl.listar(req, res); 
});

//para a view do select 
// Rota que retorna os blocos em formato JSON
router.get("/obterTodos", (req, res) => {
    ctrl.obterTodos(req, res);
});



router.get("/alterar/:id", async (req, res) => {
    try {
        let bloco = await ctrl.buscarPorId(req);
        console.log("bloco encontrado:", bloco);

        if (!bloco) {
            return res.render("bloco/alterar", { msg: "bloco não encontrado", bloco: null });
        }
        
        res.render("bloco/alterar", { bloco: bloco });
    } catch (error) {
        console.error("Erro ao buscar bloco:", error);
        res.render("bloco/alterar", { msg: "Erro interno do servidor", bloco: null });
    }
});

router.post("/alterar", (req, res) => {
    ctrl.alterar(req,res);
});



//desabilitar
router.get("/desabilitar/:id", async (req, res) => {
    try {
        let bloco = await ctrl.buscarPorId(req);
        console.log("bloco encontrado:", bloco);

        if (!bloco) {
            return res.render("bloco/desabilitar", { msg: "bloco não encontrado", bloco: null });
        }
        res.render("bloco/desabilitar", { bloco: bloco });
    } catch (error) {
        console.error("Erro ao buscar bloco:", error);
        res.render("bloco/desabilitar", { msg: "Erro interno do servidor", bloco: null });
    }
});

router.post("/desabilitar", (req, res) => {
    ctrl.desabilitar(req,res);
});

// reativar
router.get("/reativar/:id", async (req, res) => {
    try {
        let bloco = await ctrl.buscarPorId(req);
        console.log("bloco encontrado:", bloco);

        if (!bloco) {
            return res.render("bloco/reativar", { msg: "bloco não encontrado", bloco: null });
        }
        res.render("bloco/reativar", { bloco: bloco });
    } catch (error) {
        console.error("Erro ao buscar bloco:", error);
        res.render("bloco/reativar", { msg: "Erro interno do servidor", bloco: null });
    }
});

router.post("/reativar", (req, res) => {
    ctrl.reativar(req, res);
});





export default router;
