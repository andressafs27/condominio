import AgendaEntity from "../entities/agendaEntity.js";
import BaseRepository from "./baseRepository.js";

export default class AgendaRepository extends BaseRepository {

    
    constructor(db) {
        super(db);
    }

    async cadastrar(agenda) {
        const sql = "INSERT INTO agenda (data, descricao, bloco_id, servico_id, data_final) VALUES (?, ?, ?, ?, ?)";
        const valores = [agenda.data, agenda.descricao, agenda.bloco_id, agenda.servico_id, agenda.data_final];
        let result = await this.db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async listar() {
        let sql = `select 
                    a.*,
                    b.numero as bloco_numero,
                    s.descricao as servico_descricao
                from agenda a
                join bloco b on b.Id = a.bloco_id
                join servico s on s.Id = a.servico_id`;

        let lista = [];
        let rows = await this.db.ExecutaComando(sql);

        for (let i = 0; i < rows.length; i++) {
            let agenda = new AgendaEntity(rows[i].id, rows[i].data, rows[i].data_final, rows[i].descricao, rows[i].bloco_id, rows[i].servico_id);
            agenda.bloco_numero = rows[i].bloco_numero;
            agenda.servico_descricao = rows[i].servico_descricao;
            lista.push(agenda);
        }

        return lista;
    }

    async alterar(agenda) {
        const sql = "UPDATE agenda SET data = ?, descricao = ?, bloco_id = ?, servico_id = ?, data_final = ? WHERE id = ?";
        const valores = [agenda.data, agenda.descricao, agenda.bloco_id, agenda.servico_id, agenda.data_final, agenda.id];
        let result = await this.db.ExecutaComandoNonQuery(sql, valores);
        return result;
        
    }

 

    async excluir(agenda) {
        try {
            let sql = 'delete from agenda where id = ?';
            let valores = [agenda.id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            return result;
            
        } catch (error) {
            console.error("Erro ao excluir agenda:", error);
            throw error; 
        }
    }

    async buscarPorServicoId(servicoId) {
        const sql = `select *
                    from agenda
                    where servico_id = ?`;
    
        const valores = [servicoId];

        try {

            const rows = await this.db.ExecutaComando(sql, valores);

            if (rows.length === 0) return null;
    
            let agenda = new AgendaEntity(rows[0].id, rows[0].data, rows[0].data_final, rows[0].descricao, rows[0].bloco_id, rows[0].servico_id);
            return agenda;
        } catch (error) {
            console.error("Erro ao buscar agenda por id do serviço:", error.message);
            throw error;
        }
    }

    async buscarPorId(id) {

        const sql = `select *
                    from agenda
                    where id = ?`;
    
        const valores = [id];

        try {

            const rows = await this.db.ExecutaComando(sql, valores);

            if (rows.length === 0) return null;
    
            let agenda = new AgendaEntity(rows[0].id, rows[0].data, rows[0].data_final, rows[0].descricao, rows[0].bloco_id, rows[0].servico_id);
            return agenda;
        } catch (error) {
            console.error("Erro ao buscar por id da agenda:", error.message);
            throw error;
        }
    }

    

    toMap(row) {
        if (!row) return null;
    
        let agenda = new AgendaEntity(row.id, row.data, row.data_final, row.descricao, row.bloco_id, row.servico_id);
        console.log("agenda mapeado tomap:", agenda); 
    
        return agenda;
    }
}
