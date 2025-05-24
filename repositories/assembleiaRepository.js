import AssembleiaEntity from "../entities/assembleiaEntity.js";
import BaseRepository from "./baseRepository.js";

export default class AssembleiaRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }

    async obter(id) {
        try{
            await this.db.AbreTransacao();
            let sql = "select * from Assembleia where id = ?";
            let valores = [id];
            let rows = await this.db.ExecutaComando(sql, valores);
            if (rows.length === 0) return null;
            await this.db.Commit();
            return this.toMap(rows[0]);
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao obter assembleia por id:", error.message);
            throw error;
        } 
    }

    async cadastrar(entidade) {
        try{
            await this.db.AbreTransacao();
            let sql = `
                INSERT INTO Assembleia (data, horario) 
                VALUES (?, ?)
            `;
            let valores = [entidade.data, entidade.horario];
            let result = await this.db.ExecutaComandoLastInserted(sql, valores);
            await this.db.Commit();
            return result;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao cadastrar assembleia :", error.message);
            throw error;
        }
    }
    
    async alterar(entidade) {
        try{
            await this.db.AbreTransacao();
            let sql = "update Assembleia set data = ?, horario = ? where id = ?";
            let valores = [entidade.data, entidade.horario, entidade.id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            await this.db.Commit();
            return result;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao alterar assembleia:", error.message);
            throw error;
        }
    }
    
    async listar() {
        try{
            await this.db.AbreTransacao();
            let sql = `SELECT * FROM Assembleia`;
            let lista = [];
            let rows = await this.db.ExecutaComando(sql);

            await this.db.Commit();
            for (let i = 0; i < rows.length; i++) {
                let assembleia = new AssembleiaEntity();
                assembleia.id = rows[i].id;
                assembleia.data = rows[i].data;
                assembleia.horario = rows[i].horario;
                lista.push(assembleia);
            }
            return lista;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao listar assembleias: ", error.message);
            throw error;
        }
    }
    
    async excluir(entidade) {
        try {
            if (!entidade.id) {
                throw new Error("ID da assembleia não encontrada!");
            }

            const assembleiaExistente = await this.obter(entidade.id);
            if (!assembleiaExistente) {
                throw new Error(`Assembleia com ID ${entidade.id} não existe no banco.`);
            }

            await this.db.AbreTransacao();

            const sqlPautas = 'delete from pautas WHERE assembleia_id = ?';
            const valoresPautas = [entidade.id];
            await this.db.ExecutaComandoNonQuery(sqlPautas, valoresPautas);

            const sqlAssembleia = 'delete from Assembleia WHERE id = ?';
            const valoresAssembleia = [entidade.id];
            await this.db.ExecutaComandoNonQuery(sqlAssembleia, valoresAssembleia);

            await this.db.Commit();
            console.log("Assembleia excluida com sucesso.");

            return true;
    
        } catch (error) {
            await this.db.Rollback();
            console.error("Erro ao excluir assembleia:", error.message);
            throw error;
        }
    }

    async obterPorDataHorario(data, horario) {
        try {
            await this.db.AbreTransacao();
            let sql  = `
                SELECT * FROM Assembleia WHERE data = ? AND horario = ?
            `;
            let valores = [data, horario];
            let row = await this.db.ExecutaComando(sql, valores);
            await this.db.Commit();
            if (row.length > 0) {
                return new AssembleiaEntity(row[0]["id"], row[0]["data"],row[0]["horario"]);
            }
            return null;
        } catch (error) {
            await this.db.Rollback();
            console.error("Erro ao buscar assembleia por data e horario:", error.message);
            throw error;
        }
    }

    async buscarPorId(id) {
        try{
            await this.db.AbreTransacao();
            let sql = `select a.*, p.id as pauta_id, p.descricao as pauta_descricao from pautas p
                    left join assembleia a on a.id = p.assembleia_id
                    where p.assembleia_id = ?`;
            let valores = [id];
            let rows = await this.db.ExecutaComando(sql, valores);
            await this.db.Commit();
            if (rows.length === 0) {
            return null;
            }

            let assembleia = new AssembleiaEntity(
                rows[0].id,
                rows[0].data,
                rows[0].horario,
            );

            let pautas = [];
            for(let i = 0; i < rows.length; i++){
            pautas.push({ 
                id : rows[i].pauta_id,
                descricao: rows[i].pauta_descricao,
            });
            }
            assembleia.pautas = pautas;
            return assembleia;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao buscar por id da assembleia:", error.message);
            throw error;
        }
    }
        
    toMap(row) {
        if (!row) return null;
    
        const assembleia = new AssembleiaEntity();
        assembleia.id = row["id"];
        assembleia.data = row["data"];
        assembleia.horario = row["horario"];
    
        return assembleia;
    }
}