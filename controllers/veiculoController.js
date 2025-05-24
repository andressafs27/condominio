import veiculoRepository from "../repositories/veiculoRepository.js";
import veiculoEntity from "../entities/veiculoEntity.js";
import pessoaRepository from "../repositories/pessoaRepository.js";

export default class VeiculoController {

  async cadastrar(req, res) {
    try {
      let { placa, modelo, cor, marca, pessoa_id } = req.body;

    
      if (!placa || !modelo || !cor || !marca || !pessoa_id) {
        return res.status(400).json({ msg: "Parâmetros não informados corretamente!" });
      }

      placa = placa.trim().toUpperCase(); 
      const pessoaRepo = new pessoaRepository();
      const pessoaExistente = await pessoaRepo.buscarPorId(pessoa_id);

      console.log("pessoa: ", pessoaExistente.ativo);

      if (!pessoaExistente) {
        return res.status(400).json({ ok: false, msg: "Pessoa não encontrada!" });
      }

      if (pessoaExistente.ativo === 0) {
        return res.status(400).json({ ok: false,msg: "Pessoa não está ativa!" });
      }

      const repo = new veiculoRepository();
      const veiculoExistente = await repo.buscarPorPlaca(placa);

      if (veiculoExistente) {
        if (!veiculoExistente.ativo) {
          return res.status(200).json({
            ok: false,
            reativar: true,
            msg: "Veículo com essa placa está desabilitado. Deseja reativar?"
          });
        }
        return res.status(400).json({ ok: false, msg: "Placa já cadastrada!" });
      }

      const entidade = new veiculoEntity(0, placa, modelo, cor, marca, true, pessoaExistente.id);
      const result = await repo.cadastrar(entidade);

      if (result) {
        return res.status(201).json({ ok: true, msg: "Veículo cadastrado com sucesso!" });
      } else {
        throw new Error("Erro ao cadastrar no banco de dados");
      }
    } catch (ex) {
      console.error("Erro no cadastro:", ex);
      return res.status(500).json({ ok: false, msg: ex.message || "Erro interno do servidor" });
    }
  }

  async listar(req, res) {
    try {
      const veiculo = new veiculoRepository();
      const lista = await veiculo.listar();

      //trazer o nome da pessoa e o cpf
      
      return res.render("veiculo/listar", { lista: lista });
    } catch (ex) {
      console.error("Erro ao listar veículos:", ex);
      return res.status(500).json({ msg: ex.message });
    }
  }

  async alterar(req, res) {
    try {
      let { id, placa, modelo, cor, marca, pessoa_id } = req.body;
  
      placa = placa.trim().toUpperCase();

      // Verifica se já existe outro veículo com a mesma placa
      const repo = new veiculoRepository();
      const repPessoa = new pessoaRepository();
      const veiculoExistente = await repo.buscarPorPlaca(placa);
  
      if (veiculoExistente && veiculoExistente.id != id) {
        // return res.status(200).json( {ok: false,msg: "Já existe um veículo com esta placa!"});
        return res.status(200).json({ jaExisteDesativado: true, id: veiculoExistente.id, msg: "Este Veiculo já existe, mas está desativado. Deseja reativá-lo?" });

      }
  
      const veiculo = new veiculoEntity(id, placa, modelo, cor, marca, true, pessoa_id);
  
      const sucesso = await repo.alterar(veiculo);
  
      if (sucesso) {
        // return res.redirect("/veiculo/listar");
        return res.status(200).json({ ok: true, msg: "Cadastro atualizado com sucesso!" });

      } else {
        // return res.render("veiculo/alterar", {
        //   ok: false,
        //   msg: "Não foi possível alterar o veículo.",
        //   veiculo: req.body,
        //   pessoa: await repPessoa.buscarPorId(pessoa_id)
        // });
        return res.status(400).json({  ok: false,msg: "Cadastro não encontrado ou não atualizado" });


      }
  
    } catch (ex) {
      console.error("Erro ao alterar:", ex);


      // Verifica se foi erro de duplicidade de chave
      if (ex.code === 'ER_DUP_ENTRY' && ex.sqlMessage.includes('placa')) {
        return res.status(400).json({
          erro: 'Placa já existente',
          campo: 'placa'
        });
      }
    
      return res.status(500).json({ erro: 'Erro ao alterar veículo. Tente novamente mais tarde.' });
    }
  }
  
  

  async buscarPorId(id) {
    try {
      const repo = new veiculoRepository();
      const veiculo = await repo.buscarPorId(id);

      console.log("Veículo encontrado:", veiculo);
  
      if (!veiculo) return null;
  
      const pessoaRepo = new pessoaRepository();
      const pessoa = await pessoaRepo.buscarPorId(veiculo.pessoa_id);
      
      console.log("Pessoa encontrada:", pessoa);
  
      
      if (pessoa.id !== veiculo.pessoa_id) {
        console.warn("Pessoa carregada não corresponde ao veículo!");
      }
  
      const { senha, ...pessoaSemSenha } = pessoa.toJSON();

      return {
        ...veiculo.toJSON(),
        pessoa: pessoaSemSenha
      };

    } catch (error) {
      console.error("Erro ao buscar veículo por ID:", error);
      throw error;
    }
  }
  

  async desabilitar(req, res) {
    try {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ msg: "Parâmetro ID não informado corretamente!" });
      }

      const repo = new veiculoRepository();
      const veiculoExistente = await repo.buscarPorId(id);

      if (!veiculoExistente) {
        return res.status(404).json({ msg: "Veículo não encontrado!" });
      }

      veiculoExistente.ativo = false;
      const result = await repo.desabilitar(veiculoExistente);

      if (result) {
        return res.status(200).json({ ok: true, msg: "Veículo desabilitado com sucesso!" });
      } else {
        return res.status(400).json({ msg: "Falha ao desabilitar veículo!" });
      }
    } catch (ex) {
      console.error("Erro ao desabilitar veículo:", ex);
      return res.status(500).json({ msg: "Erro interno do servidor" });
    }
  }

  async reativar(req, res) {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ msg: "Parâmetro ID não informado corretamente!" });
        }

        const repo = new veiculoRepository();
        const result = await repo.reativar({id});

        if (result) {
            return res.status(200).json({ ok: true, msg: "Veiculo reativado com sucesso!" });
        } else {
            return res.status(400).json({ msg: "Falha ao reativar Veiculo !" });
        }
    } catch (ex) {
        console.error("Erro ao reativar Veiculo :", ex);
        return res.status(500).json({ msg: "Erro interno do servidor" });
    }
  }

}