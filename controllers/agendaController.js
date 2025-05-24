import AgendaEntity from "../entities/agendaEntity.js";
import agendaRepository from "../repositories/agendaRepository.js";

export default class AgendaController {
    
async cadastrar(req, res) {
        try {
            const { data, data_final, descricao, bloco_id, servico_id } = req.body;
    


            if (!data || !data_final || !descricao || !bloco_id || !servico_id) {
                return res.status(400).json({ ok: false, msg: "Parâmetros não informados corretamente!" });
            }
    
            const repoAgenda = new agendaRepository();
    
            const novaAgenda = new AgendaEntity(0, data, data_final, descricao, bloco_id, servico_id);
            await repoAgenda.cadastrar(novaAgenda);
    
            return res.status(201).json({ ok: true, msg: "Agenda cadastradas com sucesso!" });
    
        } catch (ex) {
            console.error("Erro no cadastro:", ex);
            return res.status(500).json({ ok: false, msg: ex.message || "Erro interno do servidor" });
        }
    }

    async obter(id) {
        try {
            const repo = new agendaRepository();
            const agenda = await repo.obter(id);

            if (!agenda) {
                return null; 
            }

            return (agenda);

        } catch (error) {
            console.error("Erro ao obter agenda diretamente:", error);
            throw error;
        }
    }

    async buscarPorId(req) {
        try {
            const { id } = req.params;

            console.log('id', id);

            const repo = new agendaRepository();
            const agenda = await repo.buscarPorId(id);

            if (!agenda) {
                return null; 
            }
    
            return agenda;
        } catch (error) {
            console.error("Erro ao buscar agenda por ID:", error);
            return null;
        }
    }


       async listar(req, res) {
           try{
               let agenda = new agendaRepository();
               let lista = await agenda.listar();
               res.render("agenda/listar", { lista: lista });  
           }
           catch(ex) {
               console.error("Erro ao listar agendas:", ex);
               res.status(500).json({msg: ex.message});
           }
       }

       async alterar(req, res) {
               try {
                   const { id, data, data_final, descricao, bloco_id, servico_id } = req.body;
                   if (!id || !data || !data_final || !descricao || !bloco_id || !servico_id) {
                       return res.status(400).json({ ok: false, msg: "Parâmetros não informados corretamente!" });
                   }
       
                   const repo = new agendaRepository();
                   const entidade = new AgendaEntity(id, data, data_final, descricao, bloco_id, servico_id);
                   const result = await repo.alterar(entidade);
       
                   if (result) {
                       return res.status(200).json({ ok: true, msg: "Cadastro atualizado com sucesso!" });
                   } else {
                       return res.status(400).json({ ok: false, msg: "Cadastro não encontrado ou não atualizado" });
                   }
               } catch (ex) {
                   console.error("Erro na atualização:", ex);
                   return res.render("agenda/alterar", { ok: false, msg: "Erro interno do servidor", unidade: req.body });
               }
           }
       
           async excluir(req, res) {
                   try {
                     const { id } = req.body;
               
                     if (!id) {
                       return res.status(400).json({ msg: "Parâmetro ID não informado corretamente!" });
                     }
               
                     const repo = new agendaRepository();
                     const agendaExistente = await repo.buscarPorId(id);
               
                     if (!agendaExistente) {
                       return res.status(404).json({ msg: "agendaExistente não encontrada!" });
                     }
           
                     const result = await repo.excluir(agendaExistente);
                     console.log("agendaExistente excluida:", result);
               
                     if (result) {
                       return res.status(200).json({ ok: true, msg: "agendaExistente excluida com sucesso!" });
                     } else {
                       return res.status(400).json({ok:false, msg: "Falha ao excluir agendaExistente!" });
                     }
                   } catch (ex) {
                     console.error("Erro ao cancelar agendaExistente:", ex);
                     return res.status(500).json({ msg: "Erro interno do servidor" });
                   }
               }
   
    
}