import express from "express";
import PautaController from "../controllers/pautasController.js";

const router = express.Router();
const ctrlPauta = new PautaController();

// Rota para listar todas as pautas
router.get("/listar", async (req, res) => {
    try {
        const pautas = await ctrlPauta.obterTodasAsPautas();  // Obtém todas as pautas
        res.render("pauta/listar", { pautas: pautas });  // Renderiza a view 'listar' passando as pautas
    } catch (error) {
        console.error("Erro ao carregar pautas:", error);
        res.status(500).send("Erro ao carregar a lista de pautas.");
    }
});

// Rota para exibir detalhes de uma pauta
router.get("/:id", async (req, res) => {
    try {
        const idPauta = req.params.id;
        const pauta = await ctrlPauta.obterPautaId(idPauta);  // Obtém a pauta pelo ID

        if (!pauta) {
            return res.status(404).send("Pauta não encontrada.");
        }

        res.render("pauta/detalhes", { pauta: pauta });  // Renderiza os detalhes da pauta
    } catch (error) {
        console.error("Erro ao carregar pauta:", error);
        res.status(500).send("Erro ao carregar a pauta.");
    }
});

// Rota para criar uma nova pauta
router.get("/criar", (req, res) => {
    res.render("pauta/criar", { msg: null });  // Exibe a página para criar uma nova pauta
});

router.post("/criar", async (req, res) => {
    try {
        const dadosPauta = req.body;  // Dados recebidos do formulário
        await ctrlPauta.criarPauta(dadosPauta);  // Chama o método para criar a pauta no banco
        const pautas = await ctrlPauta.obterTodasAsPautas(); // Obtem todas as pautas novamente
        res.render("pauta/listar", { pautas: pautas, msg: "Pauta criada com sucesso!" });  // Renderiza a lista de pautas com a mensagem de sucesso
    } catch (error) {
        console.error("Erro ao criar pauta:", error);
        res.status(500).send("Erro ao criar a pauta.");
    }
});

// Rota para editar uma pauta
router.get("/editar/:id", async (req, res) => {
    try {
        const idPauta = req.params.id;
        const pauta = await ctrlPauta.obterPautaId(idPauta);  // Obtém a pauta pelo ID

        if (!pauta) {
            return res.status(404).send("Pauta não encontrada.");
        }

        res.render("pauta/editar", { pauta: pauta, msg: null });  // Exibe a página de edição com os dados da pauta
    } catch (error) {
        console.error("Erro ao carregar pauta para edição:", error);
        res.status(500).send("Erro ao carregar a pauta para edição.");
    }
});

router.post("/editar/:id", async (req, res) => {
    try {
        const idPauta = req.params.id;
        const dadosPauta = req.body;  // Dados recebidos do formulário
        await ctrlPauta.atualizarPauta(idPauta, dadosPauta);  // Atualiza a pauta no banco
        const pautaAtualizada = await ctrlPauta.obterPautaId(idPauta); // Obtem a pauta atualizada
        res.render("pauta/detalhes", { pauta: pautaAtualizada, msg: "Pauta atualizada com sucesso!" });  // Renderiza os detalhes da pauta com a mensagem de sucesso
    } catch (error) {
        console.error("Erro ao editar pauta:", error);
        res.status(500).send("Erro ao editar a pauta.");
    }
});

// Rota para excluir uma pauta
router.post("/excluir/:id", async (req, res) => {
    try {
        const idPauta = req.params.id;
        await ctrlPauta.excluirPauta(idPauta);  // Exclui a pauta do banco
        const pautas = await ctrlPauta.obterTodasAsPautas(); // Obtem todas as pautas restantes
        res.render("pauta/listar", { pautas: pautas, msg: "Pauta excluída com sucesso!" });  // Renderiza a lista de pautas com a mensagem de sucesso
    } catch (error) {
        console.error("Erro ao excluir pauta:", error);
        res.status(500).send("Erro ao excluir a pauta.");
    }
});

// Rota para listar pautas que não têm votação associada
router.get("/sem-votacao", async (req, res) => {
    try {
        const pautasSemVotacao = await ctrlPauta.obterPautasSemVotacao();  // Obtém pautas sem votação
        res.render("pauta/sem-votacao", { pautas: pautasSemVotacao });  // Exibe essas pautas
    } catch (error) {
        console.error("Erro ao carregar pautas sem votação:", error);
        res.status(500).send("Erro ao carregar pautas sem votação.");
    }
});

export default router;
