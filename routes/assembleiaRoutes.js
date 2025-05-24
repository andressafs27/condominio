import express from 'express';
import AssembleiaController from '../controllers/assembleiaController.js';
import PautasController from '../controllers/pautasController.js';

const router = express.Router();
const ctrl = new AssembleiaController();    
const ctrlPautas = new PautasController();

router.get("/cadastrar", (req, res) => {
    res.render("assembleia/cadastrar");  
});

router.post("/cadastrar", (req, res) => {
    ctrl.cadastrar(req,res);
});

router.get("/listar", (req, res) => {
    ctrl.listar(req, res); 
});

router.get("/alterar/:id", async (req, res) => {
    console.log("Route- assembleia");
    try {
        let assembleia = await ctrl.buscarPorId(req);

        console.log("Route- assembleia encontrada:", assembleia);

        if (!assembleia) {
            return res.render("assembleia/alterar", { msg: "assembleia não encontrada", assembleia: null });
        }

        const pautas = await ctrlPautas.obterTodasAsPautas();
        
        res.render("assembleia/alterar", { 
            assembleia: assembleia, 
            pautas: pautas,
            msg: null
        });

    } catch (error) {
        console.error("Erro ao buscar assembleia:", error);
        res.render("assembleia/alterar", { msg: "Erro interno do servidor", assembleia: null });
    }
});

router.post("/alterar", (req, res) => {
    try {
        ctrl.alterar(req, res);
    } catch (error) {
        console.error("Erro ao tentar alterar assembleia:", error);
        res.render("assembleia/alterar", { 
            msg: "Erro ao tentar alterar a assembleia. Por favor, tente novamente.", 
            assembleia: req.body 
        });
    }
});


router.get("/excluir/:id", async (req, res) => {
    try {
        let assembleia = await ctrl.buscarPorIdComId(req.params.id);

        if (!assembleia) {
            return res.render("assembleia/excluir", { 
                msg: "Assembleia não encontrada", 
                assembleia: null,
                pautas: []
            });
        }

        const pautas = await ctrlPautas.obterTodasAsPautas();

        res.render("assembleia/excluir", { 
            assembleia: assembleia, 
            pautas: pautas 
        });

    } catch (error) {
        console.error("Erro ao carregar assembleia:", error);
        res.status(500).send("Erro ao carregar assembleia");
    }
});

router.delete("/excluir", (req, res) => {
  ctrl.excluir(req,res);
});

export default router;
