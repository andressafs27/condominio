import express from 'express';
import PerguntasController from '../controllers/perguntasController.js';
import AlternativasController from '../controllers/alternativasController.js';

const router = express.Router();
const ctrl = new PerguntasController();    
const ctrlAlternativas = new AlternativasController();

router.get("/cadastrar", (req, res) => {
    res.render("perguntas/cadastrar");  
});

router.post("/cadastrar", (req, res) => {
    ctrl.cadastrar(req,res);
});

router.get("/listar", (req, res) => {
    ctrl.listar(req, res); 
});

router.get("/alterar/:id", async (req, res) => {
    try {
        let perguntas = await ctrl.buscarPorId(req.params.id);

        if (!perguntas) {
            return res.render("perguntas/alterar", { msg: "perguntas não encontrada", perguntas: null });
        }

        const alternativas = await ctrlAlternativas.obterTodasAlternativasId(perguntas.id) || [];
     
        res.render("perguntas/alterar", { 
            perguntas: perguntas, 
            alternativas: alternativas,
            msg: null
        });

    } catch (error) {
        console.error("Erro ao buscar perguntas:", error);
        res.render("perguntas/alterar", { msg: "Erro interno do servidor", perguntas: null });
    }
});

router.post("/alterar", (req, res) => {
    try {
        ctrl.alterar(req, res);
    } catch (error) {
        console.error("Erro ao tentar alterar perguntas:", error);
        res.render("perguntas/alterar", { 
            msg: "Erro ao tentar alterar a perguntas. Por favor, tente novamente.", 
            perguntas: req.body 
        });
    }
});


router.get("/desativar/:id", async (req, res) => {
    try {
        let perguntas = await ctrl.buscarPorId(req);

        if (!perguntas) {
            return res.render("perguntas/desativar", { 
                msg: "perguntas não encontrada", 
                perguntas: null,
                alternativas: []
            });
        }

        const alternativas = await ctrlAlternativas.obterTodasAlternativasId();

        res.render("perguntas/desativar", { 
            perguntas: perguntas, 
            alternativas: alternativas 
        });

    } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
        res.status(500).send("Erro ao carregar perguntas");
    }
});

router.post("/desativar", (req, res) => {
  ctrl.desativar(req,res);
});

router.get("/ativar/:id", async (req, res) => {
    try {
        let perguntas = await ctrl.buscarPorId(req);

        if (!perguntas) {
            return res.render("perguntas/ativar", { 
                msg: "perguntas não encontrada", 
                perguntas: null,
            });
        }

        res.render("perguntas/ativar", { 
            perguntas: perguntas, 
        });

    } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
        res.status(500).send("Erro ao carregar perguntas");
    }
});

router.post("/ativar", (req, res) => {
  ctrl.ativar(req,res);
});

export default router;
