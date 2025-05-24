import sugestaoRepository from "../repositories/sugestaoRepository.js";
import sugestaoEntity from "../entities/sugestaoEntity.js";
import pessoaRepository from "../repositories/pessoaRepository.js";
import SugestaoRepository from "../repositories/sugestaoRepository.js";

export default class SugestaoController {

  async cadastrar(req, res) {
    try {
      let { descricao } = req.body;
    
      const pessoaCookie = req.cookies.pessoaLogado ? JSON.parse(req.cookies.pessoaLogado) : null;
      const pessoa_id = pessoaCookie?.id;      

      if (!descricao || !pessoa_id) {
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
      const sugestaoRepo = new sugestaoRepository();
      const dataAtual = new Date();
      const entidade = new sugestaoEntity(0, descricao, dataAtual, pessoaExistente.id);
      const result = await sugestaoRepo.cadastrar(entidade);

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

  async listar(req, res) {
    try {
      let sugestao = new sugestaoRepository();
      let lista = await sugestao.listar();
      res.render("sugestao/listar", { lista: lista });

    } catch (ex) {
      console.error("Erro ao listar sugestões:", ex);
      res.status(500).json({ msg: ex.message });
    }
  }

  async buscarPorId(req) {
    try {

        const { id } = req.params;
        const repo = new sugestaoRepository();
        const sugestao = await repo.buscarPorId(id);

        console.log("sugestão encontrado:", sugestao);
    
        if (!sugestao) return null;

        return (sugestao);
  
    } catch (error) {
      console.error("Erro ao buscar sugestão por ID:", error);
      throw error;
    }
  }

  async listarPorPessoa(req, res) {
      const pessoaLogado = req.cookies.pessoaLogado ? JSON.parse(req.cookies.pessoaLogado) : null;

      try{
          let sugestao = new SugestaoRepository();
          let lista = await sugestao.listarPorPessoa(pessoaLogado.id);
          res.render("sugestao/listagem-morador", { lista: lista ,pessoaLogado: pessoaLogado, layout:"layoutMorador"});  
      }
      catch(ex) {
          console.error("Erro ao listar sugestões:", ex);
          res.status(500).json({msg: ex.message});
      }
  }

  // Relatório
async filtrar(req, res, json = false) {
        let termo = req.params.termo;
        let filtro = req.params.filtro;
        let startDate = req.query.startDate;
        let endDate = req.query.endDate;


        let repo = new sugestaoRepository();
        var lista = await repo.listarParaRelatorio(termo, filtro, startDate, endDate);
        if(!json)
        {
        res.render("sugestao/relatorio", 
          { 
            sugestoes: lista
          });

        }
        else{
          res.json(lista);
        }
    }

}