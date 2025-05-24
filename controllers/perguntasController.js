import perguntasRepository from "../repositories/perguntasRepository.js";
import perguntasEntity from "../entities/perguntasEntity.js";
import AlternativasRepository from "../repositories/alternativasRepository.js";

export default class PerguntasController {

    async cadastrar(req, res) {
        try {
            const { enunciado, status, alternativas = [] } = req.body;
    
            // Validação básica
            if (!enunciado || !status || alternativas.length === 0) {
                return res.status(400).json({ ok: false, msg: "Parâmetros não informados corretamente!" });
            }
    
            // Validação das alternativas (ANTES de salvar qualquer coisa)
            const enunciados = [];
            for (const alternativa of alternativas) {
                const altEnunciado = alternativa.enunciado?.trim();
    
                if (!altEnunciado) {
                    return res.status(400).json({ ok: false, msg: "Enunciado da alternativa não informado corretamente!" });
                }
    
                if (enunciados.includes(altEnunciado)) {
                    return res.status(400).json({ ok: false, msg: "As alternativas não podem ter enunciados repetidos!" });
                }
    
                enunciados.push(altEnunciado);
            }
    
            // Agora verifica se a pergunta já existe
            const repoperguntas = new perguntasRepository();
            const perguntasExistente = await repoperguntas.buscarPerguntaEnunciado(enunciado);
    
            if (perguntasExistente) {
                return res.status(400).json({ ok: false, msg: "Pergunta já cadastrada com este enunciado!" });
            }
    
            // Cadastra a pergunta
            const novaperguntas = new perguntasEntity(0, enunciado, status);
            const idperguntas = await repoperguntas.cadastrar(novaperguntas);
    
            if (!idperguntas) {
                throw new Error("Erro ao cadastrar a pergunta no banco de dados");
            }
    
            // Cadastra as alternativas
            const repoAlternativas = new AlternativasRepository();
            for (const alternativa of alternativas) {
                await repoAlternativas.cadastrar({
                    enunciado: alternativa.enunciado.trim(),
                    perguntas_id: idperguntas
                });
            }
    
            return res.status(201).json({ ok: true, msg: "Pergunta e alternativas cadastradas com sucesso!" });
    
        } catch (ex) {
            console.error("Erro no cadastro:", ex);
            return res.status(500).json({ ok: false, msg: ex.message || "Erro interno do servidor" });
        }
    }
    
    

    async listar(req, res) {
        try{
            let perguntas = new perguntasRepository();
            let lista = await perguntas.listar();
            res.render("perguntas/listar", { lista: lista });  
        }
        catch(ex) {
            console.error("Erro ao listar perguntass:", ex);
            res.status(500).json({msg: ex.message});
        }
    }

    async alterar(req, res) {
        try {
            const { id, enunciado, status, alternativas = [] } = req.body;
    
            if (!id || !enunciado || !status || alternativas.length === 0) {
                return res.status(400).json({ ok: false, msg: "Parâmetros não informados corretamente!" });
            }
    
            // Validação de alternativas duplicadas
            const enunciados = [];
            for (const alternativa of alternativas) {
                const altEnunciado = alternativa.enunciado?.trim();
    
                if (!altEnunciado) {
                    return res.status(400).json({ ok: false, msg: "Enunciado da alternativa não informado corretamente!" });
                }
    
                if (enunciados.includes(altEnunciado)) {
                    return res.status(400).json({ ok: false, msg: "As alternativas não podem ter enunciados repetidos!" });
                }
    
                enunciados.push(altEnunciado);
            }
    
            const repoperguntas = new perguntasRepository();
            const repoAlternativas = new AlternativasRepository();
    
            const perguntasExistente = await repoperguntas.buscarPorId(id);
            if (!perguntasExistente) {
                return res.status(404).json({ ok: false, msg: "Pergunta não encontrada!" });
            }
    
            let perguntaEnunciadoExistente = null;
            if (enunciado !== perguntasExistente.enunciado) {
                perguntaEnunciadoExistente = await repoperguntas.buscarPerguntaEnunciado(enunciado);
            }
    
            if (perguntaEnunciadoExistente && perguntaEnunciadoExistente.id !== id) {
                return res.status(400).json({ ok: false, msg: "Já existe outra pergunta com este enunciado!" });
            }
    
            if (status === 'ativo' && perguntasExistente.status !== 'ativo') {
                const perguntaAtiva = await repoperguntas.buscarPerguntaEnunciadoAtivo(enunciado);
                if (perguntaAtiva) {
                    return res.status(400).json({ ok: false, msg: "Já existe uma pergunta com este enunciado ativa!" });
                }
            }
    
            // Agora que tudo está validado, pode atualizar no banco
            await repoAlternativas.removerAlternativasPergunta(id);
    
            for (const alternativa of alternativas) {
                await repoAlternativas.cadastrar({
                    enunciado: alternativa.enunciado.trim(),
                    perguntas_id: id
                });
            }
    
            const entidadeAtualizada = new perguntasEntity(id, enunciado, status);
            const alterado = await repoperguntas.alterar(entidadeAtualizada);
    
            if (!alterado) {
                return res.status(400).json({ ok: false, msg: "Erro ao atualizar pergunta!" });
            }
    
            return res.status(200).json({ ok: true, msg: "Pergunta atualizada com sucesso!" });
    
        } catch (ex) {
            console.error("Erro ao alterar pergunta:", ex);
            return res.status(500).json({ ok: false, msg: ex.message || "Erro interno do servidor" });
        }
    }
    
    
    
    async buscarPorIdAtivar(req) {
        try {
            const { id } = req.params;
            console.log('1 - controller pergunta (id) buscarPOrId (req)', id);

            const repo = new perguntasRepository();
            const perguntas = await repo.buscarIdPerguntaAtivar(id);

            console.log('2 - controller pergunta (perguntas) resultado do buscarIdPerguntaAtivar', perguntas);
    
            if (!perguntas) {
                console.log("perguntas não encontrada.");
                return null; 
            }
    
            return(perguntas);
        } catch (error) {
            console.error("Erro ao buscar perguntas por ID:", error);
            return null;
        }
    }

    async buscarPorId(id) {
        try {

            const repo = new perguntasRepository();
            const perguntas = await repo.buscarPorId(id);
    
            if (!perguntas) {
                console.log("perguntas não encontrada.");
                return null; 
            }

            if (!perguntas.enunciado) {
                console.log("Enunciado não encontrado para a pergunta com ID:", id);
                return null;
            }
    

            return(perguntas);
        } catch (error) {
            console.error("Erro ao buscar perguntas por ID:", error);
            return null;
        }
    }

    async desativar(req, res) {
        try {
          const { id } = req.body;
    
          if (!id) {
            return res.status(400).json({ msg: "Parâmetro ID não informado corretamente!" });
          }
    
          const repo = new perguntasRepository();
          const repoAlternativas = new AlternativasRepository();

          const perguntasExistente = await repo.buscarPorId(id);
    
          if (!perguntasExistente) {
            return res.status(404).json({ msg: "perguntas não encontrada!" });
          }

          await repoAlternativas.removerAlternativasPergunta(id);

          const result = await repo.desativar(perguntasExistente);
          
          console.log("perguntas desativada:", result);
    
          if (result) {
            return res.status(200).json({ ok: true, msg: "perguntas desativada com sucesso!" });
          } else {
            return res.status(400).json({ok:false, msg: "Falha ao desativar perguntas!" });
          }
        } catch (ex) {
          console.error("Erro ao desativar perguntas:", ex);
          return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    }

    async ativar(req, res) {
        try {
          const { id } = req.body;
    
          if (!id) {
            return res.status(400).json({ msg: "Parâmetro ID não informado corretamente!" });
          }
    
          const repo = new perguntasRepository();

          const perguntasExistente = await repo.buscarIdPerguntaAtivar(id);
    
          if (!perguntasExistente) {
            return res.status(404).json({ msg: "perguntas não encontrada!" });
          }

          const result = await repo.ativar(perguntasExistente);
          
          console.log("perguntas ativada:", result);
    
          if (result) {
            return res.status(200).json({ ok: true, msg: "perguntas ativada com sucesso!" });
          } else {
            return res.status(400).json({ok:false, msg: "Falha ao ativar perguntas!" });
          }
        } catch (ex) {
          console.error("Erro ao ativar perguntas:", ex);
          return res.status(500).json({ msg: "Erro interno do servidor" });
        }
    }

     async obterPerguntasAtivas() {
        try {
            const repo = new perguntasRepository();
            const perguntas = await repo.buscarPerguntaAtiva();
            return perguntas;
        } catch (error) {
            console.error("Erro ao obter perguntas diretamente:", error);
            throw error;
        }
    }

     async obterPerguntasParaPequisa(pesquisa_id) {
        try {
            const repo = new perguntasRepository();
            const perguntas = await repo.obterPerguntasParaPequisa(pesquisa_id);
            return perguntas;
        } catch (error) {
            console.error("Erro ao obter perguntas diretamente:", error);
            throw error;
        }
    }

    async buscarProxima(req) {
        try {
            const { id } = req.params;
            console.log("1 - Controller Pergunta (id) buscarProxima:", id);
    
            const repo = new perguntasRepository();
            const pergunta = await repo.buscarProxima(id);
    
            if (!pergunta) {
                return res.status(404).json({ ok: false, msg: "Não há próxima pergunta!" });
            }
    
            return res.status(200).json({ ok: true, pergunta: pergunta });
    
        } catch (ex) {
            console.error("Erro ao buscar próxima pergunta:", ex);
            return res.status(500).json({ ok: false, msg: ex.message || "Erro interno do servidor" });
        }
    }

    async buscarPrimeiraPergunta(idPesquisa) {
        try {
            if (!idPesquisa) {
                throw new Error("ID da pesquisa não informado!");
            }
    
            const repo = new perguntasRepository();
            const pergunta = await repo.buscarPrimeiraPergunta(idPesquisa);
    
            if (!pergunta) {
                throw new Error("Não há perguntas para esta pesquisa!");
            }
    
            return pergunta;
    
        } catch (ex) {
            console.error("Erro ao buscar a primeira pergunta:", ex);
            throw ex; 
        }
    }
    
    
    
}