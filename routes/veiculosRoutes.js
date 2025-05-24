// routes/veiculoRoute.js
import express from 'express';
import veiculoController from '../controllers/veiculoController.js';

const router = express.Router();
const ctrl = new veiculoController();    

// Rota para exibir o formulário de cadastro de veículo
router.get("/cadastrar", (req, res) => {
  res.render("veiculo/cadastrar");
});

// Rota para processar o cadastro do veículo
router.post("/cadastrar", (req, res) => {
  ctrl.cadastrar(req, res);
});

// Rota para listar os veículos
router.get("/listar", (req, res) => {
  ctrl.listar(req, res);
});

// Rota para exibir formulário de alteração de veículo
router.get("/alterar/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const veiculo = await ctrl.buscarPorId(id);
    console.log("Veículo encontrado:", veiculo);

    if (!veiculo) {
      return res.render("veiculo/alterar", {
        ok: false,
        msg: "Veículo não encontrado!",
        veiculo: null,
        pessoa: null
      });
    }

    res.render("veiculo/alterar", {
      ok: true,
      msg: null,
      veiculo: veiculo,
      pessoa: veiculo.pessoa
    });
  } catch (error) {
    console.error("Erro ao buscar veículo:", error);
    res.render("veiculo/alterar", {
      ok: false,
      msg: "Erro interno do servidor",
      veiculo: null,
      pessoa: null
    });
  }
});

// Rota para processar a alteração do veículo
router.post("/alterar", (req, res) => {
  ctrl.alterar(req, res);
});

// Rota para exibir confirmação de desabilitação do veículo
router.get("/desabilitar/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const veiculo = await ctrl.buscarPorId(id);
    console.log("Veículo encontrado:", veiculo);

    if (!veiculo) {
      return res.render("veiculo/desabilitar", {
        ok: false,
        msg: "Veículo não encontrado!",
        veiculo: null,
        pessoa: null
      });
    }

    res.render("veiculo/desabilitar", {
      ok: true,
      msg: null,
      veiculo: veiculo,
      pessoa: veiculo.pessoa
    });
  } catch (error) {
    console.error("Erro ao buscar veículo:", error);
    res.render("veiculo/desabilitar", {
      ok: false,
      msg: "Erro interno do servidor",
      veiculo: null,
      pessoa: null
    });
  }
});

// Rota para processar a desabilitação
router.post("/desabilitar", (req, res) => {
  ctrl.desabilitar(req, res);
});

router.post("/reativar", (req, res) => {
  ctrl.reativar(req, res);
});

export default router;
