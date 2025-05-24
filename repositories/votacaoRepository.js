import votacaoEntity from "../entities/votacaoEntity.js";
import BaseRepository from "./baseRepository.js";

export default class VotacaoRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }

    async obter(id) {
        let sql = "select * from votacao where id = ?";
        let valores = [id];

        let row = await this.db.ExecutaComando(sql, valores);
        return this.toMap(row[0]);
    }

    async obterPorPautaId(pauta_id) {
        const sql = "SELECT * FROM votacao WHERE pauta_id = ?";
        const valores = [pauta_id];
        
        try {
            const rows = await this.db.ExecutaComando(sql, valores); 

            if (rows.length === 0) {
                return null; 
            }

            return this.toMap(rows[0]);

        } catch (error) {
            console.error("Erro ao executar a query:", error);
            throw error;
        }
    }

    async obterIdVotacaoPorPautaId(pauta_id) {
        const sql = "SELECT id FROM votacao WHERE pauta_id = ?";
        const valores = [pauta_id];
    
        try {
            const rows = await this.db.ExecutaComando(sql, valores); 
    
            console.log("Resultado da consulta: ", rows);
    
            if (rows.length === 0) {
                return null;
            }
    
            return rows[0].id;
        } catch (error) {
            console.error("Erro ao buscar ID da votação por pauta_id:", error);
            throw error;
        }
    }
    

    //cadastra os votos
    async cadastrar(entidade) {
        
        let sql = "insert into votacao (voto, pessoa_id, pauta_id) values (?,?,?)";

        let valores = [entidade.voto, entidade.pessoa_id, entidade.pauta_id];

        let result = await this.db.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    //cria a votação
    async criar(entidade) {
        let sql = "INSERT INTO votacao (pauta_id, pessoa_id, voto) VALUES (?, ?, ?)";
        let valores = [entidade.pauta_id, entidade.pessoa_id, entidade.voto];
    
        let result = await this.db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    //alterar votação
    async alterar(entidade) {
        try{
            await this.db.AbreTransacao();
            let sql = "update votacao set pauta_id = ?, data_inicio = ?, data_fim = ?, status = ? where id = ?";
            let valores = [entidade.pauta_id, entidade.data_inicio, entidade.data_fim, entidade.status, entidade.id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            await this.db.Commit();
            return result;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao alterar votação:", error.message);
            throw error;
        }
    }

    
    
    async buscarPorId(id) {
        let sql = "SELECT * FROM votacao WHERE id = ?";
        let valores = [id];
        let rows = await this.db.ExecutaComando(sql, valores);


        console.log("Resultado da consulta:", rows);

        if(rows.length === 0){
            return null;
        }
        
        return new votacaoEntity(
            rows[0].id,
            rows[0].voto,
            rows[0].pessoa_id,
            rows[0].pauta_id,
            rows[0].pauta_descricao,
            rows[0].data_inicio,
            rows[0].data_fim,
            rows[0].status
        );

            
    }


    async listar() {
        let sql = `
            SELECT 
                v.id,
                v.voto,
                v.pessoa_id,
                v.pauta_id,
                pa.descricao AS pauta_descricao
            FROM votacao v
            JOIN pautas pa ON v.pauta_id = pa.id
        `;

    
        let rows = await this.db.ExecutaComando(sql);
        let lista = [];
    
        for (let row of rows) {
            let votacao = new votacaoEntity();
            votacao.id = row.id;
            votacao.voto = row.voto;
            votacao.pessoa_id = row.pessoa_id;
            votacao.pauta_id = row.pauta_id;
    
            lista.push(votacao);
        }
    
        return lista;
    }



    async listarTodasVotacoes() {
        let sql = `
                SELECT 
                    v.pauta_id,
                    pa.descricao AS pauta_descricao,
                    SUM(CASE WHEN v.voto = '1' THEN 1 ELSE 0 END) AS total_votos_sim,
                    SUM(CASE WHEN v.voto = '0' THEN 1 ELSE 0 END) AS total_votos_nao,
                    SUM(CASE WHEN v.voto IN ('1', '0') THEN 1 ELSE 0 END) AS total_votos,
                    v.status
                FROM votacao v
                JOIN pautas pa ON pa.id = v.pauta_id
                GROUP BY v.pauta_id, pa.descricao, v.status; 
        `;

        let rows = await this.db.ExecutaComando(sql);
        let lista = [];
    
        for (let row of rows) {
            let votacao = new votacaoEntity();
            votacao.id = row.id;
            votacao.voto = row.voto;
            votacao.pessoa_id = row.pessoa_id;
            votacao.pauta_id = row.pauta_id;

            votacao.pauta_descricao = row.pauta_descricao;
            votacao.total_votos_sim = row.total_votos_sim;
            votacao.total_votos_nao = row.total_votos_nao;
            votacao.total_votos = row.total_votos;
            votacao.status = row.status;

            lista.push(votacao);
        }
        
    
        return lista;
    }
    

    async buscarPorPessoaEPauta(pessoa_id, pauta_id) {
        let sql = "SELECT * FROM votacao WHERE pessoa_id = ? AND pauta_id = ?";
        let valores = [pessoa_id, pauta_id];
        let rows = await this.db.ExecutaComando(sql, valores);

        if (rows.length === 0) {
            return null; 
        }

        return this.toMap(rows[0]);
    }

    async contarVotosPorPauta(pauta_id) {
        let sql = `
            SELECT voto, COUNT(*) as total
            FROM votacao
            WHERE pauta_id = ?
            GROUP BY voto
        `;
        let valores = [pauta_id];
    
        try {
            let rows = await this.db.ExecutaComando(sql, valores);
    
            let contagem = {};
            for (let row of rows) {
                contagem[row.voto] = row.total;
            }
    
            return contagem;
    
        } catch (error) {
            console.error("Erro ao contar votos:", error);
            throw error;
        }
    }

    toMap(row) {
        if (!row) return null;
    
        const votacao = new votacaoEntity();
        votacao.id = row["id"];
        votacao.voto = row["voto"];
        votacao.pessoa_id = row["pessoa_id"];
        votacao.pauta_id = row["pauta_id"];
        votacao.pauta_descricao = row["pauta_descricao"];
        votacao.data_inicio = row["data_inicio"];
        votacao.data_fim = row["data_fim"];
        votacao.status = row["status"];

        console.log("Votação mapeada:", votacao); 
    
        return votacao;
    }
    
}