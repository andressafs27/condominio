import SugestãoEntity from "../entities/sugestaoEntity.js";
import sugestaoEntity from "../entities/sugestaoEntity.js";
import BaseRepository from "./baseRepository.js";

export default class SugestaoRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }
    
    async cadastrar(sugestao) {
        const sql = "INSERT INTO sugestao (descricao, data, pessoa_id) VALUES (?, ?, ?)";
        const valores = [sugestao.descricao, sugestao.data, sugestao.pessoa_id];        
        let result = await this.db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async listar() {
        let sql = "select * from sugestao";

        let lista = [];
        let rows = await this.db.ExecutaComando(sql);

        for (let i = 0; i < rows.length; i++) {
            let sugestao = new sugestaoEntity(
                rows[i].id,
                rows[i].descricao,
                rows[i].data,
                rows[i].pessoa_id
            );
            
            lista.push(sugestao);
        }

        return lista;
    }


    async buscarPorId(id) {
            let sql = "select * from sugestao where id = ?";
            let valores = [id];
            let rows = await this.db.ExecutaComando(sql, valores);
    
            console.log("Resultado da consulta buscarPorId:", rows);
    
            if(rows.length === 0){
                return null;
            }
            
            let sugestao = new sugestaoEntity(
                rows[0].id,
                rows[0].descricao,
                rows[0].data,
                rows[0].pessoa_id
            );
            
            return sugestao;
        }

     async listarPorPessoa(id){
        try{
            await this.db.AbreTransacao();

            let sql = "select * from sugestao where pessoa_id = ?";
            let valores = [id];
            let lista = [];
            let rows = await this.db.ExecutaComando(sql, valores);

            await this.db.Commit();
            for (let i = 0; i < rows.length; i++) {
                let sugestao = new sugestaoEntity();
                sugestao.id = rows[i].id;
                sugestao.descricao = rows[i].descricao;
                sugestao.data = rows[i].data;
                sugestao.pessoa_id = rows[i].pessoa_id;

                lista.push(sugestao);
            }
            return lista;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao listar sugestões: ", error.message);
            throw error;
        }
    }

    async listarParaRelatorio(termo, filtro, startDate, endDate) 
    {
        let sqlFiltro = "";
        let valores = [];

        if (filtro == "1") {
            if (termo != "") {
                sqlFiltro = ` WHERE id = ?`;
                valores.push(termo);
            }
        } else if (filtro == "7") {
            if (startDate && endDate) {
                sqlFiltro = ` WHERE data BETWEEN ? AND ?`;
                valores.push(startDate, endDate);
            }
        } 

        let sql = `select * from sugestao ${sqlFiltro}`;
        let rows = await this.db.ExecutaComando(sql, valores);
        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            let sugestao = new SugestãoEntity();
            sugestao.id = rows[i].id;
            sugestao.descricao = rows[i].descricao;
            sugestao.data = rows[i].data;
            sugestao.pessoa_id = rows[i].pessoa_id;

            lista.push(sugestao);
        }

        return lista;
    }

    toMap(row) {
        if (!row) return null;
    
        const sugestao = new sugestaoEntity();
        sugestao.id = row["id"];
        sugestao.descricao = row["descricao"];
        sugestao.data = row["data"];
        sugestao.pessoa_id = row["pessoa_id"];

        console.log("sugestao mapeado tomap:", sugestao); 
    
        return sugestao;
    }
}
