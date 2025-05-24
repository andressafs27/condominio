import express from 'express';
import categoriaReclamacaoController from '../controllers/categoriaReclamacaoController.js';

const router = express.Router();
const ctrl = new categoriaReclamacaoController();    

router.get("/cadastrar", (req, res) => {
    res.render("categoria/cadastrar");  
});

router.post("/cadastrar", (req, res) => {
    ctrl.cadastrar(req,res);
});

router.get("/listar", (req, res) => {
    ctrl.listar(req, res); 
});

router.get("/alterar/:id", async (req, res) => {
    try {
        let categoria = await ctrl.buscarPorId(req);
        console.log("categoria encontrada:", categoria);

        if (!categoria) {
            return res.render("categoria/alterar", { msg: "categoria não encontrada", categoria: null });
        }
        res.render("categoria/alterar", {  categoria: categoria });
    } catch (error) {
        console.error("Erro ao buscar categoria:", error);
        res.render("categoria/alterar", {  msg: "Erro interno do servidor", categoria: null });
    }
});

router.post("/alterar", (req, res) => {
    ctrl.alterar(req,res);
});

//desabilitar
router.get("/desabilitar/:id", async (req, res) => {
    try {
        let categoria = await ctrl.buscarPorId(req);
        console.log("categoria encontrada:", categoria);

        if (!categoria) {
            return res.render("categoria/desabilitar", { msg: "categoria não encontrada", categoria: null });
        }
        res.render("categoria/desabilitar", { categoria: categoria });
    } catch (error) {
        console.error("Erro ao buscar categoria:", error);
        res.render("categoria/desabilitar", { msg: "Erro interno do servidor", categoria: null });
    }
});

router.post("/desabilitar", (req, res) => {
    ctrl.desabilitar(req,res);
});

router.post("/verificar-nome", (req, res) => {
    ctrl.verificarNome(req,res);
});

router.post("/reativar", (req, res) => {
    ctrl.reativar(req, res);
});



export default router;
