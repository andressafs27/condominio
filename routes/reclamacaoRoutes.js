import express from 'express';
import reclamacaoController from '../controllers/reclamacaoController.js';
import categoriaReclamacaoController from '../controllers/categoriaReclamacaoController.js';
import pessoaController from '../controllers/pessoaController.js';
import categoriaController from '../controllers/categoriaReclamacaoController.js';

const router = express.Router();
const ctrl = new reclamacaoController();   
const categoriaReclamacaoCtrl = new categoriaReclamacaoController();
const pessoaCtrl = new pessoaController();
const categoriaCtrl = new categoriaController();

router.get("/cadastrar", (req, res) => {
  res.render("reclamacao/cadastrar");
});

router.post("/alterar", (req, res) => {
  ctrl.alterar(req, res);
});


router.post("/reclamacao", (req, res) => {
  ctrl.cadastrar(req, res);
});

router.get("/listar", (req, res) => {
  ctrl.listar(req, res);
});


router.get("/visualizar/:id", async (req, res) => {
  try {
      let reclamacao = await ctrl.buscarPorId(req);
      console.log("reclamacao encontrada:", reclamacao);

      if (!reclamacao) {
          return res.render("reclamacao/visualizar", {
              msg: "Sugestão não encontrada",
              reclamacao: null,
          });
      }
    let pessoa = await pessoaCtrl.buscarPorId(reclamacao.pessoa_id);
    let categoria = await categoriaCtrl.buscarPorCategoriaId(reclamacao.categoria_id);


      res.render("reclamacao/visualizar", {
          reclamacao,
          pessoa,
          categoria
      });

  } catch (error) {
      console.error("Erro ao buscar sugestão:", error);
      res.render("sugestão/visualizar", {
          msg: "Erro interno do servidor",
      });
  }
});

router.get('/relatorio', async (req, res) => {
 try {
  ctrl.filtrar(req, res, false);
  } catch (error) {
      console.error("Erro ao buscar relatorio:", error);
      res.render("reclamacao/listar", {
          msg: "Erro interno do servidor",
      });
  }
});


router.get("/filtrar/:termo/:filtro", async (req, res) => {
  ctrl.filtrar(req, res, true);
});

  // **************************Morador******************************

  router.get("/morador/listagem", (req, res) => {
    try {
        ctrl.listarPorPessoa(req, res);
    } catch (error) {
        console.error("Erro ao listar reclamações:", error);
        res.status(500).send("Erro ao listar reclamações.");
    }
  });

  router.get('/registrar', async (req, res) => {
    try {

        const pessoaCookie = req.cookies.pessoaLogado;
        if (!pessoaCookie) {
            return res.status(400).send("Você precisa estar logado para registrar sua reclamação.");
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

        const categoria = await categoriaReclamacaoCtrl.obterTodasCategorias();

        console.log("obtertodascategorias: ", categoria);

        res.render('reclamacao/registrar', {
            pessoa: pessoa,
            categoria,
            msg: null, 
            layout: "layoutMorador"
        });


    } catch (error) {
        console.error("Erro ao tentar fazer reclamação:", error);
        res.status(500).send("Erro ao tentar fazer reclamação.");
    }
  });

  router.post("/registrar", async (req, res) => {
    try {

        const { descricao , categoria_id} = req.body;

        console.log("req.body: ", req.body);

        console.log("descricao: ", descricao);
        console.log("categoria_id: ", categoria_id);

        if ( !descricao || !categoria_id) {
            return res.status(400).send("Dados incompletos.");
        }

        console.log("descricao: ", descricao);
        console.log("categoria_id: ", categoria_id);

        const reclamacaoRegistrada = await ctrl.cadastrar(req, res);

        if (reclamacaoRegistrada.ok) {
            return res.render("reclamacao/final-alert",{ layout: "layoutMorador" });
          } else {
            return res.status(400).send(resultado.msg);
          }

    } catch (error) {
        console.error("Erro ao registrar reclamacao:", error);
        res.status(500).send("Erro ao registrar reclamação.");
    }
});

export default router;
