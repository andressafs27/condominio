import BlocoEntity from "../entities/blocoEntity.js";
import BaseRepository from "./baseRepository.js";

export default class BlocoRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }

    async obter(id) {
        let sql = "select * from bloco where id = ?";
        let valores = [id];

        let row = await this.db.ExecutaComando(sql, valores);
        return this.toMap(row[0]);
    }

    async obterPorNumero(numero) {
        let sql = "select * from bloco where numero = ?";
        let valores = [numero];

        let row = await this.db.ExecutaComando(sql, valores);
        return this.toMap(row[0]);
    }

    
    
    
    async cadastrar(entidade) {
        
        let sql = "insert into bloco (numero, ativo) values (?,?)";

        let valores = [entidade.numero, entidade.ativo];

        let result = await this.db.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async alterar(entidade) {
        
        let sql = "update bloco set numero = ?, ativo =?  where id = ?";

        let valores = [entidade.numero, entidade.ativo,entidade.id];

        let result = await this.db.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async desabilitar(entidade) {
        try {
            let sql = 'update bloco set ativo = ? where id = ?';
            let valores = [false,entidade.id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            return result;
            
        } catch (error) {
            console.error("Erro ao desabilitar bloco:", error);
            throw error; 
        }
    }

    async reativar(entidade) {
        try {
            let sql = 'update bloco set ativo = ? where id = ?';
            let valores = [true,entidade.id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            return result;
            
        } catch (error) {
            console.error("Erro ao desabilitar bloco:", error);
            throw error; 
        }
        
    }

    async buscarPorId(id) {
        let sql = "SELECT * FROM bloco WHERE id = ?";
        let valores = [id];
        let rows = await this.db.ExecutaComando(sql, valores);

        console.log("BlocoRepository buscarPorId (rows):", rows);

        if(rows.length === 0){
            return null;
        }
        
        return new BlocoEntity(
            rows[0].id,
            rows[0].numero,
            rows[0].ativo
        );
    
    }

    async buscarPorNumero(bloco) {
        let sql = "SELECT * FROM bloco WHERE numero = ? AND ativo = 1";
        let valores = [bloco];
        let rows = await this.db.ExecutaComando(sql, valores);

        console.log("Resultado da consulta buscarBloco:", rows);

        if(rows.length === 0){
            return null;
        }
        
        return new BlocoEntity(
            rows[0].id,
            rows[0].numero,
            rows[0].ativo
        );
    
    }

    async listar() {
        let sql = `SELECT * FROM bloco WHERE ativo = 1 ORDER BY numero ASC`;
        let lista = [];
        let rows = await this.db.ExecutaComando(sql);
    
        for (let i = 0; i < rows.length; i++) {
            let bloco = new BlocoEntity();
            bloco.id = rows[i].id;
            bloco.numero = rows[i].numero;
            bloco.ativo = rows[i].ativo;
            lista.push(bloco);
        }


    
        return lista;
    }

   

      
    

    toMap(row) {
        if (!row) return null;
    
        const bloco = new BlocoEntity();
        bloco.id = row["id"];
        bloco.numero = row["numero"];
        bloco.ativo = row["ativo"];

        console.log("bloco mapeado tomap:", bloco); 
    
        return bloco;
    }
    
}