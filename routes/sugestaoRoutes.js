import express from 'express';
import sugestaoController from '../controllers/sugestaoController.js';

const router = express.Router();
const ctrl = new sugestaoController();    

router.get("/cadastrar", (req, res) => {
  res.render("sugestao/cadastrar");
});

router.post("/sugestao", (req, res) => {
  ctrl.cadastrar(req, res);
});

router.get("/listar", (req, res) => {
  ctrl.listar(req, res);
});

router.get("/visualizar/:id", async (req, res) => {
  try {
      let sugestao = await ctrl.buscarPorId(req);
      console.log("sugestao encontrada:", sugestao);

      if (!sugestao) {
          return res.render("sugestao/visualizar", {
              msg: "Sugestão não encontrada",
              sugestao: null,
          });
      }

      res.render("sugestao/visualizar", {
          sugestao,
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
      res.render("sugestao/listar", {
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
        console.error("Erro ao listar sugestões:", error);
        res.status(500).send("Erro ao listar sugestões.");
    }
  });

  router.get('/registrar', async (req, res) => {
    try {

        const pessoaCookie = req.cookies.pessoaLogado;
        if (!pessoaCookie) {
            return res.status(400).send("Você precisa estar logado para registrar sua sugestão.");
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

        res.render('sugestao/registrar', {
            pessoa,
            msg: null, 
            layout: "layoutMorador"
        });


    } catch (error) {
        console.error("Erro ao tentar fazer sugestão:", error);
        res.status(500).send("Erro ao tentar fazer sugestão.");
    }
  });

  router.post("/registrar", async (req, res) => {
    try {

        const { descricao } = req.body;

         if ( !descricao ) {
            return res.status(400).send("Dados incompletos.");
        }
        console.log("descricao: ", descricao);

        const sugestaoRegistrada = await ctrl.cadastrar(req, res);

        if (sugestaoRegistrada.ok) {
            return res.render("sugestao/final-alert", { layout: "layoutMorador" });
          } else {
            return res.status(400).send(resultado.msg);
          }

    } catch (error) {
        console.error("Erro ao registrar sugestao:", error);
        res.status(500).send("Erro ao registrar sugestão.");
    }
});

export default router;
