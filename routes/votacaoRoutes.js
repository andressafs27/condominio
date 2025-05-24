import express from "express";
import VotacaoController from "../controllers/votacaoController.js";
import PessoaController from "../controllers/pessoaController.js";
import PautaController from "../controllers/pautasController.js";

const router = express.Router();
const ctrlVotacao = new VotacaoController();
const ctrlPessoa = new PessoaController();
const ctrlPauta = new PautaController();

//listagem de pautas em votacao
router.get("/listar", (req, res) => {
    ctrlVotacao.listarTodasVotacoes(req, res);
  });

//cadastrar voto
router.get("/cadastrar", async (req, res) => {
    try {
        const pessoa = await ctrlPessoa.listar();
        const pauta = await ctrlPauta.obterTodasAsPautas();

        res.render("votacao/cadastrar", {
            pessoa,
            pauta,
            msg: null
        });

    } catch (error) {
        console.error("Erro ao carregar dados para cadastro:", error);
        res.status(500).send("Erro ao carregar página de cadastro.");
    }
});

router.post("/cadastrar", (req, res) => {
    ctrlVotacao.cadastrar(req, res);
});

//listagem de votos após votacao
router.get("/votacao/:id/resultado", async (req, res) => {
    try {
        console.log("Entrou na rota de votos");
        const id = req.params.id;

        const votos = await ctrlVotacao.obterVotosPorId(id);

        console.log("Votos carregados:", votos);
        
        if (!votos || votos.length === 0) {
            console.log("Nenhum voto encontrado para esta votação.");
            return res.status(404).send("Nenhum voto encontrado para esta votação.");
        }

        let totalVotos = votos.length;
        let votosSim = votos.filter(v => v.voto.toLowerCase() === 'sim').length;
        let votosNao = votos.filter(v => v.voto.toLowerCase() === 'nao' || v.voto.toLowerCase() === 'não').length;

        let percentualSim = ((votosSim / totalVotos) * 100).toFixed(1);
        let percentualNao = ((votosNao / totalVotos) * 100).toFixed(1);

        console.log("Votos Sim:", votosSim, "Votos Não:", votosNao);
        console.log("Percentual Sim:", percentualSim, "Percentual Não:", percentualNao);

        console.log("Renderizando a página de resultados");

        res.render("votacao/resultado", {
            votos: votos,
            percentualSim: percentualSim,
            percentualNao: percentualNao
        });

        // res.render("votacao/resultado", { votos: votos });
    } catch (error) {
        console.error("Erro ao exibir votos:", error);
        res.status(500).send("Erro ao exibir votos.");
    }
});


//cria votacao
router.get("/criar", async (req, res) => {
    try {
        console.log("Entrou na rota de criar votação");
        const pautasSemVotacao = await ctrlPauta.obterPautasSemVotacao();

        console.log("Pautas disponíveis para votação:", pautasSemVotacao);

        const status = [
            { id: 1, descricao: 'Aberta' },
            { id: 0, descricao: 'Fechada' },
        ];

        const votacao = {
            status: 1,  
        };


        console.log("Pautas Sem Votacao:", pautasSemVotacao);
        console.log("Status carregados:", status);

        res.render("votacao/criar", {
            pauta: pautasSemVotacao, 
            status,
            votacao,
            msg: null  
        });

    } catch (error) {
        console.error("Erro ao carregar dados para criar votacao:", error);
        res.status(500).send("Erro ao carregar página de criação de votação.");
    }
});

router.post("/criar", (req, res) => {
    ctrlVotacao.criar(req, res);
});


router.get("/pauta/:pauta_id/alterar", async (req, res) => {

    try {
        const pautaId = req.params.pauta_id;

        const pauta = await ctrlPauta.obterPautaId(pautaId); 

        const votacao = await ctrlVotacao.obterVotacaoPorPautaId(pautaId);  

        const status = [
            { id: 1, descricao: 'Aberta' },
            { id: 0, descricao: 'Fechada' },
        ];

        if (!pauta || !votacao) {
            return res.render("votacao/alterar", {
                msg: "Pauta/Votação não encontrados",
                votacao: null,
                pauta: null,
                status
            });
        }

        res.render("votacao/alterar", { 
            pauta: pauta, 
            votacao: votacao,
            status,
            msg: null
        });

    } catch (error) {
        console.error("Erro ao carregar dados para alteração da votação:", error);
        res.status(500).send("Erro interno ao carregar os dados.");
    }
});


router.post("/pauta/:id/alterar", (req, res) => {
    const { id } = req.params;
    ctrlVotacao.alterar(req, res, id);  
});

/* MORADOR */
//listagem de pautas em votacao
router.get("/morador/listar", (req, res) => {
    ctrlVotacao.listarTodasVotacoesPorMorador(req, res);
  });

  router.post("/morador", (req, res) => {
  ctrlVotacao.votar(req, res);  
});


export default router;
