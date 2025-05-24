import AlternativasEntity from "../entities/alternativasEntity.js";
import BaseRepository from "./baseRepository.js";

export default class AlternativasRepository extends BaseRepository {

    
    constructor(db) {
        super(db);
    }

    async obter(id) {
        try{
            await this.db.AbreTransacao();
            let sql = "select * from alternativas where pergunta_id = ?";
            let valores = [id];
            let rows = await this.db.ExecutaComando(sql, valores);
            if (rows.length === 0) return null;
            await this.db.Commit();
            return this.toMap(rows[0]);
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao obter alternativas por id:", error.message);
            throw error;
        } 
    }
    
    async cadastrar(alternativas) {

        const sql = "INSERT INTO alternativas (enunciado, pergunta_id) VALUES (?,?)";
        const valores = [alternativas.enunciado, alternativas.perguntas_id];
        let result = await this.db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async listar() {
        let sql = "SELECT * from alternativas";

        let lista = [];
        let rows = await this.db.ExecutaComando(sql);

        for (let i = 0; i < rows.length; i++) {
            let alternativas = new AlternativasEntity();
            alternativas.id = rows[i].id;
            alternativas.enunciado = rows[i].enunciado;
            alternativas.pergunta_id = rows[i].pergunta_id;
            lista.push(alternativas);
        }

        return lista;
    }

    async alterar(alternativas) {
        const sql = "UPDATE alternativas SET enunciado = ?, pergunta_id = ? WHERE id = ?";
        const valores = [alternativas.enunciado, alternativas.pergunta_id, alternativas.id];
        let result = await this.db.ExecutaComandoNonQuery(sql, valores);
        return result;
        
    }

    async removerAlternativasPergunta(pergunta_id) {
        try {
            const sql ="DELETE FROM alternativas WHERE pergunta_id = ?";
            const valores = [pergunta_id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            console.log(`alternativas da pergunta ${pergunta_id} removidas com sucesso`);
            return result;
        } catch (ex) {
            console.error("Erro ao remover alternativas:", ex);
            throw new Error("Erro ao remover as alternativas da assembleia");
        }
    }

    async excluir(alternativas) {
        try {
            let sql = 'delete from alternativas where id = ?';
            let valores = [alternativas.id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            return result;
            
        } catch (error) {
            console.error("Erro ao excluir alternativas:", error);
            throw error; 
        }
    }

    async buscarPorId(id) {

        const sql = "select * from alternativas where id = ?";
    
        const valores = [id];

        try {

            const rows = await this.db.ExecutaComando(sql, valores);

            if (rows.length === 0) return null;
    
            const alternativas = new AlternativasEntity(
                rows[0].id,
                rows[0].pergunta_id,
                rows[0].enunciado,
            );

            return alternativas;
        } catch (error) {
            console.error("Erro ao buscar por id da alternativa:", error.message);
            throw error;
        }
    }

    async buscarPorIdPergunta(id) {

        const sql = "select * from alternativas where pergunta_id = ?";
    
        const valores = [id];

        try {
            const rows = await this.db.ExecutaComando(sql, valores);

            if (rows.length === 0) return null;
    
            // const alternativas = new AlternativasEntity(
            //     rows[0].id,
            //     rows[0].pergunta_id,
            //     rows[0].enunciado,
            // );

            const alternativas = rows.map(row => new AlternativasEntity(
                row.id,
                row.enunciado,
                row.pergunta_id
            ));

            return alternativas;
        } catch (error) {
            console.error("Erro ao buscar por id da pergunta as suas alternativa:", error.message);
            throw error;
        }
    }
        

    toMap(row) {
        if (!row) return null;
    
        const alternativas = new AlternativasEntity();
        alternativas.id = row["id"];
        alternativas.enunciado = row["enunciado"];
        alternativas.pergunta_id = row["pergunta_id"];

        console.log("alternativas mapeado tomap:", alternativas); 
    
        return alternativas;
    }
}
