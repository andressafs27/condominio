import express from 'express';
import UnidadeController from '../controllers/unidadeController.js';
import BlocoController from '../controllers/blocoController.js';

const router = express.Router();
const ctrl = new UnidadeController();  
const bloco = new BlocoController();


router.get("/listar", (req, res) => {
    ctrl.listar(req, res); 
});

//rota para a view do cadastro com select
router.get("/cadastrar", async (req, res) => {
    try {
        const blocos = await bloco.obterTodosDireto();
        res.render("unidade/cadastrar", { blocos });
    } catch (error) {
        console.error("Erro ao carregar blocos:", error);
        res.status(500).send("Erro ao carregar blocos");
    }
});

router.post("/cadastrar", (req, res) => {
    ctrl.cadastrar(req, res);
});

// Rota para alterar uma unidade
router.get("/alterar/:id", async (req, res) => {
    try {
        const blocos = await bloco.obterTodosDireto();
        let unidade = await ctrl.buscarPorId(req);
        console.log("unidade encontrada:", unidade);

        if (!unidade) {
            return res.render("unidade/alterar", {
                msg: "Unidade não encontrada",
                unidade: null,
                blocos: [],
            });
        }

        res.render("unidade/alterar", {
            unidade,
            blocos,
        });
    } catch (error) {
        console.error("Erro ao buscar unidade:", error);
        res.render("unidade/alterar", {
            msg: "Erro interno do servidor",
            unidade: null,
            blocos: [],
        });
    }
});


router.post("/alterar", (req, res) => {
    ctrl.alterar(req, res);
});

// Rota para desabilitar uma unidade
router.get("/desabilitar/:id", async (req, res) => {
    try {
        let unidade = await ctrl.buscarPorId(req);

        if (!unidade) {
            return res.render("unidade/desabilitar", { msg: "Unidade não encontrada", unidade: null });
        }

        return res.render("unidade/desabilitar", {
            msg: "Unidade com morador vinculado",
            unidade: unidade
        });

    } catch (error) {
        console.error("Erro ao buscar unidade:", error);
        res.render("unidade/desabilitar", { msg: "Erro interno do servidor", unidade: null });
    }
});

router.post("/desabilitar", (req, res) => {
    ctrl.desabilitar(req, res);
});

router.post("/reativar", (req, res) => {
    ctrl.reativar(req, res);
});

// Rota para buscar unidade por número e bloco
router.get("/buscar/:numeroUnidade/:bloco", async (req, res) => {
    const { numeroUnidade, bloco } = req.params;
    try {
        const unidade = await ctrl.buscarPorNumeroEBloco(numeroUnidade, bloco);
        if (unidade) {
            return res.status(200).json({ ok: true, unidade });
        } else {
            return res.status(404).json({ ok: false, msg: "Unidade não encontrada" });
        }
    } catch (error) {
        console.error("Erro ao buscar unidade:", error);
        return res.status(500).json({ ok: false, msg: "Erro interno do servidor" });
    }
});


export default router;
