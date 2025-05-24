import express from 'express';
import PesquisaController from '../controllers/pesquisaController.js';
import PerguntasController from '../controllers/perguntasController.js';
import PerguntasPesquisaController from '../controllers/perguntasPesquisaController.js';
import AlternativasController from '../controllers/alternativasController.js';
import RespostaPesquisaController from '../controllers/respostaPesquisaController.js';

const router = express.Router();
const ctrl = new PesquisaController();
const perguntaCtrl = new PerguntasController();
const perguntaPesquisaCtrl = new PerguntasPesquisaController();
const alternativasCtrl = new AlternativasController();
const respostaPesquisaCtrl = new RespostaPesquisaController();

// Rota para cadastrar uma nova pesquisa
router.get("/cadastrar", async (req, res) => {
    try {
        const perguntas = await perguntaCtrl.obterPerguntasAtivas();
        res.render("pesquisa/cadastrar", { perguntas });
    } catch (error) {
        console.error("Erro ao carregar perguntas:", error);
        res.status(500).send("Erro ao carregar perguntas");
    }
});

// Rota para salvar uma nova pesquisa
router.post("/cadastrar", (req, res) => {
    try {
        ctrl.cadastrar(req, res);
    } catch (error) {
        console.error("Erro ao cadastrar pesquisa:", error);
        res.status(500).send("Erro ao cadastrar pesquisa.");
    }
});

// Rota para listar as pesquisas
router.get("/listar", (req, res) => {
    try {
        ctrl.listar(req, res);
    } catch (error) {
        console.error("Erro ao listar pesquisas:", error);
        res.status(500).send("Erro ao listar pesquisas.");
    }
});

// Rota para alterar a pesquisa (com perguntas vinculadas e disponíveis)
router.get("/alterar/:id", async (req, res) => {
    try {
        let pesquisa = await ctrl.buscarPorId(req.params.id);
        if (!pesquisa) {
            return res.render("pesquisa/alterar", { msg: "Pesquisa não encontrada", pesquisa: null });
        }

        // Obtém as perguntas já vinculadas à pesquisa
        const perguntas = await perguntaCtrl.obterPerguntasParaPequisa(pesquisa.id);

        // Renderiza a página de alteração com as perguntas vinculadas e disponíveis
        return res.render("pesquisa/alterar", {
            pesquisa,
            perguntas,
            msg: null
        });

    } catch (error) {
        console.error("Erro ao buscar pesquisa para alteração:", error);
        res.render("pesquisa/alterar", { msg: "Erro interno do servidor", pesquisa: null });
    }
});


// Rota para atualizar os dados de uma pesquisa
router.post("/alterar", async (req, res) => {
    try {
        // Validação: Pelo menos uma pergunta deve ser vinculada à pesquisa
        if (!req.body.perguntas || req.body.perguntas.length === 0) {
            return res.render("pesquisa/alterar", {
                msg: "É necessário selecionar pelo menos uma pergunta para a pesquisa.",
                pesquisa: req.body
            });
        }

        await ctrl.alterar(req, res);
        
    } catch (error) {
        console.error("Erro ao tentar alterar pesquisa:", error);
        res.render("pesquisa/alterar", {
            msg: "Erro ao tentar alterar a pesquisa. Por favor, tente novamente.",
            pesquisa: req.body
        });
    }
});

// Rota para remover uma pergunta da pesquisa
router.post("/remover", async (req, res) => {
    const { perguntaId, pesquisa_id } = req.body;
    try {
        await perguntaPesquisaCtrl.removerPerguntaDaPesquisa(pesquisa_id, perguntaId);
        res.json({ success: true });
    } catch (e) {
        console.error("Erro ao remover pergunta:", e);
        res.status(500).json({ success: false, error: e.message });
    }
});

// Rota para adicionar uma pergunta à pesquisa
router.post("/adicionar", async (req, res) => {
    const { perguntaId, pesquisa_id } = req.body;
    try {
        // Validação: Verificar se a pergunta já não foi adicionada
        const perguntaExistente = await perguntaPesquisaCtrl.verificarPerguntaAdicionada(pesquisa_id, perguntaId);
        if (perguntaExistente) {
            return res.status(400).json({ success: false, error: "Pergunta já associada a esta pesquisa." });
        }

        await perguntaPesquisaCtrl.adicionarPerguntaNaPesquisa(pesquisa_id, perguntaId);
        res.json({ success: true });
    } catch (e) {
        console.error("Erro ao adicionar pergunta:", e);
        res.status(500).json({ success: false, error: e.message });
    }
});

// **************************Morador******************************

router.get("/morador/listagem", (req, res) => {
    try {
        ctrl.listarPorPessoa(req, res);
    } catch (error) {
        console.error("Erro ao listar pesquisas:", error);
        res.status(500).send("Erro ao listar pesquisas.");
    }
});

router.get('/morador/:id/responder', async (req, res) => {
    try {

        const pesquisa_id = req.params.id;

        const pessoaCookie = req.cookies.pessoaLogado;
        if (!pessoaCookie) {
            return res.status(400).send("Você precisa estar logado para responder a pesquisa.");
        }
        let pessoa;
        try {
            pessoa = JSON.parse(pessoaCookie);
        } catch (e) {
            return res.status(400).send("Cookie inválido.");
        }

        const pessoa_id = pessoa?.id;

        if (!pessoa_id) {
            return res.status(400).send("Identificador de pessoa não encontrado.");
        }

        const pesquisa = await ctrl.buscarPorId(pesquisa_id);
        const todasPerguntas = await perguntaPesquisaCtrl.buscarPorPesquisaParaResponder(pesquisa_id, pessoa_id);
        console.log(todasPerguntas);

        res.render('pesquisa/responder', {
            pesquisa,
            todasPerguntas: todasPerguntas,
            pessoa,
            msg: null, 
            layout: "layoutMorador"
        });

    } catch (error) {
        console.error("Erro ao acessar pesquisa para responder:", error);
        res.status(500).send("Erro ao acessar pesquisa.");
    }
});

router.get('/morador/:pesquisa_id/responder/:pergunta_id', async (req, res) => {
    try {

        const pesquisa_id = req.params.pesquisa_id;
        const pergunta_id = req.params.pergunta_id;

        const pessoaCookie = req.cookies.pessoaLogado;
        if (!pessoaCookie) {
            return res.status(400).send("Você precisa estar logado para responder a pesquisa.");
        }
        let pessoa;
        try {
            pessoa = JSON.parse(pessoaCookie);
        } catch (e) {
            return res.status(400).send("Cookie inválido.");
        }

        const pessoa_id = pessoa?.id;

        if (!pessoa_id) {
            return res.status(400).send("Identificador de pessoa não encontrado.");
        }
        const pergunta = await perguntaCtrl.buscarPorId(pergunta_id);
        const alternativas = await alternativasCtrl.buscarPorIdPergunta(pergunta_id);

        res.render('pesquisa/responder-pergunta', {
            alternativas,
            pessoa,
            pesquisa_id,
            pergunta,
            msg: null, 
            layout: "layoutMorador"
        });

    } catch (error) {
        console.error("Erro ao acessar pesquisa para responder:", error);
        res.status(500).send("Erro ao acessar pesquisa.");
    }
});


router.post("/morador/responder", async (req, res) => {
    try {

        const { pesquisa_id, pergunta_id, alternativa_id } = req.body;

         // Verifica se todos os dados necessários foram enviados
         if (!pesquisa_id || !pergunta_id || !alternativa_id) {
            return res.status(400).send("Dados incompletos.");
        }

        await respostaPesquisaCtrl.cadastrar(req, res);

    } catch (error) {
        console.error("Erro ao escolher alternativa:", error);
        res.status(500).send("Erro ao escolher alternativa.");
    }
});

export default router;
