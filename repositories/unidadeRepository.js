import UnidadeEntity from "../entities/unidadeEntity.js";
import BaseRepository from "./baseRepository.js";

export default class UnidadeRepository extends BaseRepository {

    
    constructor(db) {
        super(db);
    }
    
    async cadastrar(unidade) {
        const sql = "INSERT INTO unidade (numero, ativo, bloco_id) VALUES (?,?, ?)";
        const valores = [unidade.numero, unidade.ativo,unidade.bloco_id];
        let result = await this.db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async listar() {
        let sql = `SELECT unidade.*, bloco.numero as bloco_numero 
                    FROM unidade 
                    INNER JOIN bloco ON unidade.bloco_id = bloco.id
                    WHERE unidade.ativo = 1 
                    ORDER BY unidade.numero ASC;
                    `;

        let lista = [];
        let rows = await this.db.ExecutaComando(sql);

        for (let i = 0; i < rows.length; i++) {
            let unidade = new UnidadeEntity();
            unidade.id = rows[i].id;
            unidade.numero = rows[i].numero;
            unidade.bloco_id = rows[i].bloco_id;
            unidade.ativo = rows[i].ativo;
            unidade.bloco_numero = rows[i].bloco_numero;
            lista.push(unidade);
        }

        return lista;
    }


    async buscarPorId(id) {
            let sql = `SELECT unidade.*, bloco.numero as bloco_numero FROM unidade 
                    inner join bloco on unidade.bloco_id = bloco.id
                    where unidade.id = ?`;
            let valores = [id];
            let rows = await this.db.ExecutaComando(sql, valores);
    
            console.log("UnidadeRepository buscarPorId (rows):", rows);
    
            if(rows.length === 0){
                return null;
            }
            
            let unidade = new UnidadeEntity(
                rows[0].id,
                rows[0].numero,
                rows[0].bloco_id,
                rows[0].ativo
            );
            unidade.bloco_numero = rows[0].bloco_numero;
            
            return unidade;
        
        }
    

    async alterar(unidade) {
        const sql = "UPDATE unidade SET numero = ?, ativo = ?, bloco_id = ? WHERE id = ?";
        const valores = [unidade.numero, unidade.ativo,unidade.bloco_id, unidade.id];
        let result = await this.db.ExecutaComandoNonQuery(sql, valores);
        return result;
        
    }

    async desabilitar(entidade) {
        try {
            let sql = 'update unidade set ativo = ? where id = ?';
            let valores = [false,entidade.id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            return result;
            
        } catch (error) {
            console.error("Erro ao desabilitar unidade:", error);
            throw error; 
        }
    }

    async obterPorNumeroEBlocoId(numero, bloco_id) {
        let sql = "SELECT * FROM unidade WHERE numero = ? and bloco_id = ?";
        let valores = [numero, bloco_id];
        let rows = await this.db.ExecutaComando(sql, valores);

        console.log("Resultado da consulta obterPorNumeroEBlocoId:", rows);

        if(rows.length === 0){
            return null;
        }
        
        return new UnidadeEntity(
            rows[0].id,
            rows[0].numero,
            rows[0].bloco_id,
            rows[0].ativo
        );
    
    }

    async reativar(entidade) {
        try {
            let sql = 'update unidade set ativo = ? where id = ?';
            let valores = [true,entidade.id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            return result;
            
        } catch (error) {
            console.error("Erro ao desabilitar unidade:", error);
            throw error; 
        }
        
    }

    // Método para buscar uma unidade pelo número e bloco e verificar se está ativo
    async buscarPorNumeroEBlocoEAtivo(numeroUnidade, bloco, ativo) {
        
        try {

            // if (!bloco) {
            //     throw new Error("Bloco não fornecido");
            // }

            if (numeroUnidade == null || bloco == null || ativo == null) {
                throw new Error("Número da unidade, bloco e status de ativo são obrigatórios");
            }

            let sql = 'SELECT * FROM unidade WHERE numero = ? AND bloco_id = ? AND ativo = ?';
            let valores = [numeroUnidade, bloco, ativo];

            console.log("valores", valores);

            let result = await this.db.ExecutaComando(sql, valores);
            return result[0] || null;  
        } catch (error) {
            console.error("Erro ao buscar unidade por número e bloco:", error);
            throw error;  
        }
    }

    async buscarPorNumeroEBloco(numeroUnidade, bloco) {
        
        try {

            if (!bloco) {
                throw new Error("Bloco não fornecido");
            }

            let sql = 'SELECT * FROM unidade WHERE numero = ? AND bloco_id = ?';
            let valores = [numeroUnidade, bloco];

            console.log("valores", valores);

            let result = await this.db.ExecutaComando(sql, valores);
            return result[0] || null;  
        } catch (error) {
            console.error("Erro ao buscar unidade por número e bloco:", error);
            throw error;  
        }
    }

    async buscarPorBloco(bloco) {
        
        try {

            if (!bloco) {
                throw new Error("Bloco não fornecido");
            }

            let sql = 'SELECT * FROM unidade WHERE bloco_id = ?';
            let valores = [bloco];

            let result = await this.db.ExecutaComando(sql, valores);
            return result[0] || null;  
        } catch (error) {
            console.error("Erro ao buscar unidade por número e bloco:", error);
            throw error;  
        }
    }
    


    toMap(row) {
        if (!row) return null;
    
        const Unidade = new UnidadeEntity();
        Unidade.id = row["id"];
        Unidade.numero = row["numero"];
        Unidade.ativo = row["ativo"];
        Unidade.bloco_id = row["bloco_id"];

        console.log("unidade mapeado tomap:", Unidade); 
    
        return Unidade;
    }
}
