import express from 'express';
import AgendaController from '../controllers/agendaController.js';
import ServicoRepository from '../repositories/servicoRepository.js';
import BlocoRepository from '../repositories/blocoRepository.js';


const router = express.Router();
const ctrl = new AgendaController();    
const blocoRepository = new BlocoRepository();
const servicoRepository = new ServicoRepository();

router.get("/cadastrar", async (req, res) => {
    const blocos = await blocoRepository.listar();
    const servicos = await servicoRepository.listar();
    res.render("agenda/cadastrar", {
        blocos,
        servicos
    });  
});

router.post("/cadastrar", (req, res) => {
    ctrl.cadastrar(req,res);
});

router.get("/listar", (req, res) => {
    ctrl.listar(req, res); 
});

router.get("/alterar/:id", async (req, res) => {
    try {
        let Agenda = await ctrl.buscarPorId(req);

        if (!Agenda) {
            return res.render("agenda/alterar", { msg: "Agenda não encontrada", Agenda: null });
        }

        const blocos = await blocoRepository.listar();
        const servicos = await servicoRepository.listar();
        res.render("agenda/alterar", { 
            agenda: Agenda,
            blocos,
            servicos
        });

    } catch (error) {
        console.error("Erro ao buscar Agenda:", error);
        res.render("agenda/alterar", { msg: "Erro interno do servidor", Agenda: null });
    }
});

router.post("/alterar", (req, res) => {
    try {
        ctrl.alterar(req, res);
    } catch (error) {
        res.render("agenda/alterar", { 
            msg: "Erro ao tentar alterar a Agenda. Por favor, tente novamente.", 
            Agenda: req.body 
        });
    }
});


router.get("/excluir/:id", async (req, res) => {
    try {
        let Agenda = await ctrl.buscarPorId(req);
        if (!Agenda) {
            return res.render("agenda/excluir", { 
                msg: "Agenda não encontrada", 
                Agenda: null
            });
        }
        
        const blocos = await blocoRepository.listar();
        const servicos = await servicoRepository.listar();

        res.render("Agenda/excluir", { 
            agenda: Agenda,
            blocos,
            servicos
        });

    } catch (error) {
        console.error("Erro ao carregar Agenda:", error);
        res.status(500).send("Erro ao carregar Agenda");
    }
});

router.delete("/excluir", (req, res) => {
  ctrl.excluir(req,res);
});

export default router;
