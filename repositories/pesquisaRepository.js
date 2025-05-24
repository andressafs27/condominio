import PesquisaEntity from "../entities/pesquisaEntity.js";
import BaseRepository from "./baseRepository.js";

export default class PesquisaRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }

    async obter(id) {
        try{
            await this.db.AbreTransacao();
            let sql = "select * from pesquisa where id = ?";
            let valores = [id];
            let rows = await this.db.ExecutaComando(sql, valores);
            if (rows.length === 0) return null;
            await this.db.Commit();
            return this.toMap(rows[0]);
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao obter pesquisa por id:", error.message);
            throw error;
        } 
    }

    async cadastrar(entidade) {
        try{
            await this.db.AbreTransacao();
            let sql = `
                INSERT INTO pesquisa (titulo, data, status, data_fim) 
                VALUES (?, ?, ?, ?)
            `;
            let valores = [entidade.titulo, entidade.data,entidade.status, entidade.data_fim];
            let result = await this.db.ExecutaComandoLastInserted(sql, valores);
            await this.db.Commit();
            return result;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao cadastrar pesquisa :", error.message);
            throw error;
        }
    }
    
    async alterar(entidade) {
        try{
            await this.db.AbreTransacao();
            let sql = "update pesquisa set titulo = ?, data = ?, status = ?, data_fim = ? where id = ?";
            let valores = [entidade.titulo, entidade.data, entidade.status, entidade.data_fim, entidade.id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            await this.db.Commit();
            return result;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao alterar pesquisa:", error.message);
            throw error;
        }
    }
    
    async listar() {
        try{
            await this.db.AbreTransacao();
            let sql = `SELECT * FROM pesquisa`;
            let lista = [];
            let rows = await this.db.ExecutaComando(sql);

            await this.db.Commit();
            for (let i = 0; i < rows.length; i++) {
                let pesquisa = new PesquisaEntity();
                pesquisa.id = rows[i].id;
                pesquisa.titulo = rows[i].titulo;
                pesquisa.data = rows[i].data;
                pesquisa.data_fim = rows[i].data_fim;
                pesquisa.status = rows[i].status;
                lista.push(pesquisa);
            }
            return lista;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao listar pesquisas: ", error.message);
            throw error;
        }
    }


    async buscarPorId(id) {

        const sql = "select * from pesquisa where id = ?";
    
        const valores = [id];

        try {
            const rows = await this.db.ExecutaComando(sql, valores);

            if (rows.length === 0) return null;
    
            const pesquisa = new PesquisaEntity(
                rows[0].id,
                rows[0].titulo,
                rows[0].data,
                rows[0].status,
                rows[0].data_fim
            );

            return pesquisa;
        } catch (error) {
            console.error("Erro ao buscar por id da pesquisa:", error.message);
            throw error;
        }
    }
    
    async buscarPesquisaTitulo(titulo){
        try{
            await this.db.AbreTransacao();
            let sql = "select * from pesquisa where titulo = ?";
            let valores = [titulo];
            let rows = await this.db.ExecutaComando(sql, valores);
            await this.db.Commit();
            if (rows.length === 0) {
            return null;
            }

            let pesquisa = new PesquisaEntity(
                rows[0].id,
                rows[0].titulo,
                rows[0].data,
                rows[0].status,
                rows[0].data_fim,
            );

            return pesquisa;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao buscar por titulo da pesquisa:", error.message);
            throw error;
        }
        
    }

    async buscarPesquisaTituloAtivo(titulo) {
        try {
            const sql = "SELECT * FROM pesquisa WHERE titulo = ? AND status = 'ativa'";
            const valores = [titulo];
            const rows = await this.db.ExecutaComando(sql, valores);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error("Erro ao buscar pesquisa com titulo ativo:", error.message);
            throw error;
        }
    }

    // 
    async listarPorPessoa(id){
        try{
            await this.db.AbreTransacao();
            let sql = `SELECT 
                p.*,
                (SELECT COUNT(*) 
                FROM resposta_pesquisa rp 
                WHERE rp.pesquisa_id = p.id AND rp.pessoa_id = ?) AS perguntas_respondidas,
                (SELECT COUNT(*) 
                FROM perguntas_has_pesquisa pp 
                WHERE pp.pesquisa_id = p.id) AS qtde_perguntas
            FROM pesquisa p
            WHERE p.status = '1'
            and p.data <= CURDATE()
            and p.data_fim >= CURDATE();`;
            let valores = [id];
            let lista = [];
            let rows = await this.db.ExecutaComando(sql, valores);

            await this.db.Commit();
            for (let i = 0; i < rows.length; i++) {
                let pesquisa = new PesquisaEntity();
                pesquisa.id = rows[i].id;
                pesquisa.titulo = rows[i].titulo;
                pesquisa.data = rows[i].data;
                pesquisa.data_fim = rows[i].data_fim;
                pesquisa.status = rows[i].status;

                pesquisa.perguntas_respondidas = rows[i].perguntas_respondidas;
                pesquisa.qtde_perguntas = rows[i].qtde_perguntas;

                lista.push(pesquisa);
            }
            return lista;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao listar pesquisas: ", error.message);
            throw error;
        }
    }
 
    toMap(row) {
        if (!row) return null;
    
        const pesquisa = new PesquisaEntity();
        pesquisa.id = row["id"];
        pesquisa.titulo = row["titulo"];
        pesquisa.data = row["data"];
        pesquisa.data_fim = row["data_fim"];
        pesquisa.status = row["status"];
    
        return pesquisa;
    }
}