import AssembleiaRepository from "../repositories/assembleiaRepository.js";
import AssembleiaEntity from "../entities/assembleiaEntity.js";
import PautasRepository from "../repositories/pautasRepository.js";

export default class AssembleiaController {

    async cadastrar(req, res) {
        try {
            const { data, horario, pautas = [] } = req.body;
    
            if (!data || !horario || pautas.length === 0) {
                return res.status(400).json({ ok: false, msg: "Parâmetros não informados corretamente!" });
            }
    
            const repoAssembleia = new AssembleiaRepository();
            const assembleiaExistente = await repoAssembleia.obterPorDataHorario(data, horario);
    
            if (assembleiaExistente) {
                return res.status(400).json({ ok: false, msg: "Esta data e horário já estão cadastrados!" });
            }
    
            const novaAssembleia = new AssembleiaEntity(0, data, horario);
            const idAssembleia = await repoAssembleia.cadastrar(novaAssembleia);
    
            if (!idAssembleia) {
                throw new Error("Erro ao cadastrar a assembleia no banco de dados");
            }
    
            const repoPautas = new PautasRepository();
    
            for (const pauta of pautas) {
                const { descricao } = pauta;
    
                if (!descricao || descricao.trim() === "") {
                    return res.status(400).json({ ok: false, msg: "Descrição da pauta não informada corretamente!" });
                }
    
                await repoPautas.cadastrar({
                    descricao,
                    assembleia_id: idAssembleia
                });
            }
    
            return res.status(201).json({ ok: true, msg: "Assembleia e pautas cadastradas com sucesso!" });
    
        } catch (ex) {
            console.error("Erro no cadastro:", ex);
            return res.status(500).json({ ok: false, msg: ex.message || "Erro interno do servidor" });
        }
    }
    

    async listar(req, res) {
        try{
            let assembleia = new AssembleiaRepository();
            let lista = await assembleia.listar();
            res.render("assembleia/listar", { lista: lista });  
        }
        catch(ex) {
            console.error("Erro ao listar assembleias:", ex);
            res.status(500).json({msg: ex.message});
        }
    }

    async alterar(req, res) {
        try {
            const { id, data, horario, pautas = [] } = req.body;
    
            if (!id || !data || !horario || pautas.length === 0) {
                return res.status(400).json({ ok: false, msg: "Parâmetros não informados corretamente!" });
            }
    
            const repoAssembleia = new AssembleiaRepository();
            const repoPautas = new PautasRepository();
    
            const assembleiaExistente = await repoAssembleia.buscarPorId(id);
            if (!assembleiaExistente) {
                return res.status(404).json({ ok: false, msg: "Assembleia não encontrada!" });
            }

            await repoPautas.removerPorAssembleia(id);
    
            for (const pauta of pautas) {
                const { descricao } = pauta;
    
                if (!descricao || descricao.trim() === "") {
                    return res.status(400).json({ ok: false, msg: "Descrição da pauta não informada corretamente!" });
                }
    
                await repoPautas.cadastrar({
                    descricao,
                    assembleia_id: id
                });
            }
            
            const entidadeAtualizada = new AssembleiaEntity(id, data, horario);
            const alterado = await repoAssembleia.alterar(entidadeAtualizada);
    
            if (!alterado) {
                return res.status(400).json({ ok: false, msg: "Erro ao atualizar assembleia!" });
            }
    
            return res.status(200).json({ ok: true, msg: "Assembleia atualizada com sucesso!" });
    
        } catch (ex) {
            console.error("Erro ao alterar assembleia:", ex);
            return res.status(500).json({ ok: false, msg: ex.message || "Erro interno do servidor" });
        }
    }
    

        async buscarPorIdComId(id) {
        try {
            console.log('id', id);

            const repo = new AssembleiaRepository();
            const assembleia = await repo.buscarPorId(id);

            console.log('assembleia', assembleia);
    
            if (!assembleia) {
                console.log("Assembleia não encontrada.");
                return null; 
            }
    
            return(assembleia);
        } catch (error) {
            console.error("Erro ao buscar assembleia por ID:", error);
            return null;
        }
    }

    
    async buscarPorId(req) {
        try {
            const { id } = req.params;

            console.log('id', id);

            const repo = new AssembleiaRepository();
            const assembleia = await repo.buscarPorId(id);

            console.log('assembleia', assembleia);
    
            if (!assembleia) {
                console.log("Assembleia não encontrada.");
                return null; 
            }
    
            return(assembleia);
        } catch (error) {
            console.error("Erro ao buscar assembleia por ID:", error);
            return null;
        }
    }

    async excluir(req, res) {
        try {
          const { id } = req.body;
    
          if (!id) {
            return res.status(400).json({ msg: "Parâmetro ID não informado corretamente!" });
          }
    
          const repo = new AssembleiaRepository();
          const assembleiaExistente = await repo.buscarPorId(id);
    
          if (!assembleiaExistente) {
            return res.status(404).json({ msg: "Assembleia não encontrada!" });
          }

          const result = await repo.excluir(assembleiaExistente);
          console.log("Assembleia excluida:", result);
    
          if (result) {
            return res.status(200).json({ ok: true, msg: "Assembleia excluida com sucesso!" });
          } else {
            return res.status(400).json({ok:false, msg: "Falha ao excluir assembleia!" });
          }
        } catch (ex) {
          console.error("Erro ao cancelar assembleia:", ex);
          return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    }
}