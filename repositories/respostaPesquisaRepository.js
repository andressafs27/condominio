import respostaPesquisaEntity from "../entities/respostaPesquisaEntity.js";
import BaseRepository from "./baseRepository.js";

export default class RespostaPesquisaRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }

    async obter(id) {
        let sql = "select * from resposta_pesquisa where id = ?";
        let valores = [id];

        let row = await this.db.ExecutaComando(sql, valores);
        return this.toMap(row[0]);
    }

    async obterPorRespostaPorPessoaId(pessoa_id) {
        const sql = "SELECT * FROM resposta_pesquisa WHERE pessoa_id = ?";
        const valores = [pessoa_id];
        
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

    async obterIdRespostaPorPesquisaId(pesquisa_id) {
        const sql = "SELECT * FROM resposta_pesquisa WHERE pesquisa_id = ?";
        const valores = [pesquisa_id];
    
        try {
            const rows = await this.db.ExecutaComando(sql, valores); 
    
            console.log("Resultado da consulta: ", rows);
    
            if (rows.length === 0) {
                return null;
            }
    
            return rows[0].id;
        } catch (error) {
            console.error("Erro ao buscar ID da Resposta por pesquisa_id:", error);
            throw error;
        }
    }
    

    //cadastra as respostas
    async cadastrar(entidade) {
        
        let sql = "insert into resposta_pesquisa(pessoa_id, pergunta_id, pesquisa_id, alternativas_id) values (?,?,?,?)";

        let valores = [entidade.pessoa_id, entidade.pergunta_id,entidade.pesquisa_id, entidade.alternativas_id];

        let result = await this.db.ExecutaComandoNonQuery(sql, valores);

        return result;
    }
 
    async buscarPorId(id) {
        let sql = "SELECT * FROM resposta_pesquisa WHERE id = ?";
        let valores = [id];
        let rows = await this.db.ExecutaComando(sql, valores);


        console.log("Resultado da consulta:", rows);

        if(rows.length === 0){
            return null;
        }
        
        return new respostaPesquisaEntity(
            rows[0].id,
            rows[0].pessoa_id,
            rows[0].pergunta_id,
            rows[0].pesquisa_id,
            rows[0].alternativas_id
        );   
    }

    
    async listarTodasRespostasPesquisa() {
        let sql = `SELECT * FROM resposta_pesquisa`;
        let lista = [];
        let rows = await this.db.ExecutaComando(sql);

        for (let i = 0; i < rows.length; i++) {
            let resposta_pesquisa = new respostaPesquisaEntity();
            resposta_pesquisa.id = rows[i].id;
            resposta_pesquisa.pessoa_id = rows[i].pessoa_id;
            resposta_pesquisa.pergunta_id = rows[i].pergunta_id;
            resposta_pesquisa.pesquisa_id = rows[i].pesquisa_id;
            resposta_pesquisa.alternativas_id = rows[i].alternativas_id;
            lista.push( resposta_pesquisa );
        }

        return lista;
    }


    async buscarPorIdPessoa(pessoa_id) {
        let sql = "SELECT * FROM resposta_pesquisa WHERE pessoa_id = ?";
        let valores = [pessoa_id];
        let rows = await this.db.ExecutaComando(sql, valores);


        console.log("Resultado da consulta:", rows);

        if(rows.length === 0){
            return null;
        }
        
        return new respostaPesquisaEntity(
            rows[0].id,
            rows[0].pessoa_id,
            rows[0].pergunta_id,
            rows[0].pesquisa_id,
            rows[0].alternativas_id
        );   
    }

async buscarPorIdPesquisa(pesquisa_id) {
        let sql = "SELECT * FROM resposta_pesquisa WHERE pesquisa_id = ?";
        let valores = [pesquisa_id];
        let rows = await this.db.ExecutaComando(sql, valores);

        console.log("Resultado da consulta:", rows);

        if(rows.length === 0){
            return null;
        }
        let lista = [];
        
        for (let i = 0; i < rows.length; i++) {
            let resposta_pesquisa = new respostaPesquisaEntity();
            resposta_pesquisa.id = rows[i].id;
            resposta_pesquisa.pessoa_id = rows[i].pessoa_id;
            resposta_pesquisa.pergunta_id = rows[i].pergunta_id;
            resposta_pesquisa.pesquisa_id = rows[i].pesquisa_id;
            resposta_pesquisa.alternativas_id = rows[i].alternativas_id;
            lista.push( resposta_pesquisa );
        }
    
        return lista;
    }


    async jaRespondeuPergunta(pessoa_id, pergunta_id) {
        let sql = "SELECT * FROM resposta_pesquisa WHERE pessoa_id = ? and pergunta_id = ? limit 1";
        let valores = [pessoa_id, pergunta_id];
        let rows = await this.db.ExecutaComando(sql, valores);

        if(rows.length === 0){
            return null;
        }
        
        return new respostaPesquisaEntity(
            rows[0].id,
            rows[0].pessoa_id,
            rows[0].pergunta_id,
            rows[0].pesquisa_id,
            rows[0].alternativas_id
        );   
    }

    async buscarPerguntasRespondidas(pessoa_id, pergunta_id) {
        try{
           let sql =  `
            SELECT pergunta_id FROM resposta_pesquisa 
            WHERE pessoa_id = ? AND pesquisa_id = ?
        `;
        let valores = [pessoa_id, pergunta_id];
        let rows = await this.db.ExecutaComando(sql, valores);


         return rows || [];  
        }
        catch(error){
            console.error("Erro no repository:", error);
            return [];
        }
       
    }

    toMap(row) {
        if (!row) return null;
    
        const resposta_pesquisa = new respostaPesquisaEntity();
        resposta_pesquisa.id = row["id"];
        resposta_pesquisa.pessoa_id = row["pessoa_id"];
        resposta_pesquisa.pergunta_id = row["pergunta_id"];
        resposta_pesquisa.pesquisa_id = row["pesquisa_id"];
        resposta_pesquisa.alternativas_id = row["alternativas_id"];

        console.log("resposta_pesquisa mapeada:", resposta_pesquisa); 
    
        return resposta_pesquisa;
    }
    
}