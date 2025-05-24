import express from 'express';
import ServicoController from '../controllers/servicoController.js';

const router = express.Router();
const ctrl = new ServicoController();    

router.get("/cadastrar", (req, res) => {
    res.render("servico/cadastrar");  
});

router.post("/cadastrar", (req, res) => {
    ctrl.cadastrar(req,res);
});

router.get("/listar", (req, res) => {
    ctrl.listar(req, res); 
});

router.get("/alterar/:id", async (req, res) => {
    try {
        let servico = await ctrl.buscarPorId(req);
        console.log("servico encontrado:", servico);

        if (!servico) {
            return res.render("servico/alterar", { msg: "servico não encontrado", servico: null });
        }
        
        res.render("servico/alterar", { servico: servico });
    } catch (error) {
        console.error("Erro ao buscar servico:", error);
        res.render("servico/alterar", { msg: "Erro interno do servidor", servico: null });
    }
});

router.post("/alterar", (req, res) => {
    ctrl.alterar(req,res);
});

//desabilitar
router.get("/desabilitar/:id", async (req, res) => {
    try {
        let servico = await ctrl.buscarPorId(req);
        console.log("servico encontrada:", servico);

        if (!servico) {
            return res.render("servico/desabilitar", { msg: "servico não encontrado", servico: null });
        }
        res.render("servico/desabilitar", { servico: servico });
    } catch (error) {
        console.error("Erro ao buscar servico:", error);
        res.render("servico/desabilitar", { msg: "Erro interno do servidor", servico: null });
    }
});

router.post("/desabilitar", (req, res) => {
    ctrl.desabilitar(req,res);
});

router.post("/reativar", (req, res) => {
    ctrl.reativar(req, res);
});

/************************* MORADOR **************************/
router.get("/morador/listar", (req, res) => {
    ctrl.listarParaMorador(req, res); 
});



export default router;
