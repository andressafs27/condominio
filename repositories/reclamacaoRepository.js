import ReclamacaoEntity from "../entities/reclamacaoEntity.js";
import BaseRepository from "./baseRepository.js";

export default class ReclamacaoRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }

    async obter(id) {
        let sql = "select * from reclamacao where id = ?";
        let valores = [id];

        let row = await this.db.ExecutaComando(sql, valores);
        return this.toMap(row[0]);
    }

    async cadastrar(entidade) {
        
        let sql = "insert into reclamacao (descricao, data, status,pessoa_id, categoria_id) values (?,?,?,?,?)";

        let valores = [entidade.descricao, entidade.data, entidade.status, entidade.pessoa_id, entidade.categoria_id];

        let result = await this.db.ExecutaComandoNonQuery(sql, valores);

        return result;
    }
    
    async buscarPorId(id) {
        let sql = "SELECT * FROM reclamacao WHERE id = ?";
        let valores = [id];
        let rows = await this.db.ExecutaComando(sql, valores);

        if(rows.length === 0){
            return null;
        }
        
        return new ReclamacaoEntity(
            rows[0].id,
            rows[0].descricao,
            rows[0].data,
            rows[0].status,
            rows[0].pessoa_id,
            rows[0].categoria_id
        ); 
    }
    
    async listar() {
        let sql = `    
                SELECT 
                r.id,
                r.descricao,
                r.data,
                r.status,
                r.pessoa_id,
                r.categoria_id,
                p.nome AS pessoa_nome,
                cr.nome AS categoria_nome
                FROM reclamacao r
                LEFT JOIN pessoa p ON r.pessoa_id = p.id
                LEFT JOIN categoria_reclamacao cr ON r.categoria_id = cr.id;
            `;

        let lista = [];
        let rows = await this.db.ExecutaComando(sql);

        for (let i = 0; i < rows.length; i++) {
            let reclamacao = new ReclamacaoEntity();
            reclamacao.id = rows[i].id;
            reclamacao.descricao = rows[i].descricao;
            reclamacao.data = rows[i].data;
            reclamacao.status = rows[i].status;
            reclamacao.pessoa_id = rows[i].pessoa_id;
            reclamacao.categoria_id = rows[i].categoria_id;

            reclamacao.pessoa_nome = rows[i].pessoa_nome;
            reclamacao.categoria_nome = rows[i].categoria_nome;

            lista.push(reclamacao);
        }

        return lista;
    }

    async listarPorPessoa(id){
        try{
            await this.db.AbreTransacao();

            let sql = "select * from reclamacao where pessoa_id = ?";
            let valores = [id];
            let lista = [];
            let rows = await this.db.ExecutaComando(sql, valores);

            await this.db.Commit();
            for (let i = 0; i < rows.length; i++) {
                let reclamacao = new ReclamacaoEntity();
                reclamacao.id = rows[i].id;
                reclamacao.descricao = rows[i].descricao;
                reclamacao.data = rows[i].data;
                reclamacao.status = rows[i].status;
                reclamacao.pessoa_id = rows[i].pessoa_id;
                reclamacao.categoria_id = rows[i].categoria_id;

                lista.push(reclamacao);
            }
            return lista;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao listar reclamações: ", error.message);
            throw error;
        }
    }

    async alterarStatus(id, novoStatus) {
        const sql = `UPDATE reclamacao SET status = ? WHERE id = ?`;
        const valores = [novoStatus, id];
        const resultado = await this.db.ExecutaComandoNonQuery(sql,valores);
        
        return resultado > 0; 
    }
    
    async listarParaRelatorio(termo, filtro, startDate, endDate) 
    {
        let sqlFiltro = "";
        let valores = [];

        if (filtro == "1") {
            if (termo != "") {
                sqlFiltro = ` WHERE r.id = ?`;
                valores.push(termo);
            }
        } else if (filtro == "2") {
            sqlFiltro = ` WHERE r.status = '0'`;
        } else if (filtro == "3") {
            sqlFiltro = ` WHERE r.status = '1'`;
        } else if (filtro == "4") {
            sqlFiltro = ` WHERE r.status = '2'`;
        } else if (filtro == "5") {
            sqlFiltro = ` WHERE r.categoria_id = ?`;
            valores.push(termo);
        } else if (filtro == "6") {
            sqlFiltro = "";
        } else if (filtro == "7") {
            if (startDate && endDate) {
                sqlFiltro = ` WHERE r.data BETWEEN ? AND ?`;
                valores.push(startDate, endDate);
            }
        } 

        let sql = `select r.*, cr.nome as categoria_nome from reclamacao r join categoria_reclamacao cr on cr.id = r.categoria_id ${sqlFiltro}`;
        let rows = await this.db.ExecutaComando(sql, valores);
        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            let reclamacao = new ReclamacaoEntity();
            reclamacao.id = rows[i].id;
            reclamacao.descricao = rows[i].descricao;
            reclamacao.data = rows[i].data;
            reclamacao.status = rows[i].status;
            reclamacao.categoria_id = rows[i].categoria_id;

            reclamacao.categoria_nome = rows[i].categoria_nome;

            lista.push(reclamacao);
        }

        return lista;
    }

    toMap(row) {
        if (!row) return null;
    
        const reclamacao = new ReclamacaoEntity();
        reclamacao.id = row["id"];
        reclamacao.descricao = row["descricao"];
        reclamacao.data = row["data"];
        reclamacao.status = row["status"];
        reclamacao.pessoa_id = row["pessoa_id"];
        reclamacao.categoria_id = row["categoria_id"];

        console.log("Categoria mapeada:", reclamacao); 
    
        return reclamacao;
    }
    
}