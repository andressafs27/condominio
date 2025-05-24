import reclamacaoRepository from "../repositories/reclamacaoRepository.js";
import reclamacaoEntity from "../entities/reclamacaoEntity.js";
import pessoaRepository from "../repositories/pessoaRepository.js";
import categoriaReclamacaoRepository from "../repositories/categoriaReclamacaoRepository.js";

export default class reclamacaoController {

  async cadastrar(req, res) {
    try {
      let { descricao, categoria_id } = req.body;

      console.log("req.body da controller : ", req.body);
    
      const pessoaCookie = req.cookies.pessoaLogado ? JSON.parse(req.cookies.pessoaLogado) : null;
      const pessoa_id = pessoaCookie?.id;      

      if (!descricao || !categoria_id || !pessoa_id) {
        return res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
      }

      const pessoaRepo = new pessoaRepository();
      const pessoaExistente = await pessoaRepo.obter(pessoa_id);

      console.log("pessoaExistente: ", pessoaExistente);

      if (!pessoaExistente) {
        return res.status(400).json({ ok: false, msg: "Pessoa não encontrada!" });
      }

      if (!pessoaExistente.ativo) {
        return res.status(400).json({ ok: false,msg: "Pessoa não está ativa!" });
      }

      const reclamacaoRepo = new reclamacaoRepository();
      const dataAtual = new Date();
      const status = '0';
      const entidade = new reclamacaoEntity(0, descricao, dataAtual, status, pessoaExistente.id, categoria_id);
      const result = await reclamacaoRepo.cadastrar(entidade);

      if (result) {
        return { ok: true, msg: "Sugestão cadastrada com sucesso!" };
      } else {
        return { ok: false, msg: "Erro ao cadastrar no banco de dados." };
        // throw new Error("Erro ao cadastrar no banco de dados");
      }
    } catch (ex) {
      console.error("Erro no cadastro:", ex);
      // return res.status(500).json({ ok: false, msg: ex.message || "Erro interno do servidor" });
      return { ok: false, msg: error.message };
    }
  }

 async alterar(req, res) {
    try {
      let { id, status } = req.body;

      const reclamacaoRepo = new reclamacaoRepository();
      const result = await reclamacaoRepo.alterarStatus(id, status);

      if (result) {
        return res.status(200).json({ ok: true, msg: "Reclamação alterada com sucesso!" });
      } else {
        return res.status(400).json({ ok: false, msg: "Erro ao alterar reclamação no banco de dados." });
      }
    } catch (ex) {
      console.error("Erro na alteração:", ex);
      return { ok: false, msg: error.message };
    }
  }

  async listar(req, res) {
    try {
      let reclamacao = new reclamacaoRepository();
      let lista = await reclamacao.listar();
      res.render("reclamacao/listar", { lista: lista });

    } catch (ex) {
      console.error("Erro ao listar sugestões:", ex);
      res.status(500).json({ msg: ex.message });
    }
  }

// Relatório
async filtrar(req, res, json = false) {
        let termo = req.params.termo;
        let filtro = req.params.filtro;
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;


        let cateogiraRepo = new categoriaReclamacaoRepository();
        let listaCategorias = await cateogiraRepo.listar();

        let reclamacaoRepo = new reclamacaoRepository();
        var lista = await reclamacaoRepo.listarParaRelatorio(termo, filtro, startDate, endDate);
        if(!json)
        {
        res.render("reclamacao/relatorio", 
          { 
            reclamacoes: lista,
            categorias: listaCategorias
          });

        }
        else{
          res.json(lista);
        }
    }
  
  async buscarPorId(req) {
    try {

        const { id } = req.params;
        const repo = new reclamacaoRepository();
        const reclamacao = await repo.buscarPorId(id);

        console.log("sugestão encontrado:", reclamacao);
    
        if (!reclamacao) return null;

        return (reclamacao);
  
    } catch (error) {
      console.error("Erro ao buscar reclamaçõa por ID:", error);
      throw error;
    }
  }

  async listarPorPessoa(req, res) {
      const pessoaLogado = req.cookies.pessoaLogado ? JSON.parse(req.cookies.pessoaLogado) : null;

      try{
          let reclamacao = new reclamacaoRepository();
          let lista = await reclamacao.listarPorPessoa(pessoaLogado.id);
          res.render("reclamacao/listagem-morador", { lista: lista , pessoaLogado: pessoaLogado, layout:"layoutMorador"});  
      }
      catch(ex) {
          console.error("Erro ao listar reclamações:", ex);
          res.status(500).json({msg: ex.message});
      }
  }

  async alterarStatus(req, res) {
      try {
          const { id, status } = req.body;

          if (!id || status === undefined) {
              return res.status(400).json({ ok: false, msg: "ID e status são obrigatórios." });
          }

          const reclamacaoRepo = new reclamacaoRepository();
          const sucesso = await reclamacaoRepo.alterarStatus(id, status);

          if (sucesso) {
              return res.json({ ok: true, msg: "Status atualizado com sucesso." });
          } else {
              return res.status(404).json({ ok: false, msg: "Reclamação não encontrada." });
          }
      } catch (erro) {
          console.error("Erro ao alterar status:", erro);
          return res.status(500).json({ ok: false, msg: "Erro interno ao alterar o status." });
      }
  }


}