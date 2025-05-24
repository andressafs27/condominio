import categoriaReclamacaoEntity from "../entities/categoriaReclamacaoEntity.js";
import BaseRepository from "./baseRepository.js";

export default class categoriaReclamacaoRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }

    async obter(id) {
        let sql = "select * from categoria_reclamacao where id = ?";
        let valores = [id];

        let row = await this.db.ExecutaComando(sql, valores);
        return this.toMap(row[0]);
    }

    async obterPorNome(nome) {
        let sql = "SELECT * FROM categoria_reclamacao WHERE nome = ?";
        let valores = [nome];
    
        try {
            let rows = await this.db.ExecutaComando(sql, valores);
    
            if (rows.length === 0) {
                return null; // Retorna null se não encontrar a categoria
            }
    
            return this.toMap(rows[0]);
        } catch (error) {
            console.error("Erro ao executar a query:", error);
            throw error; // Relança o erro para ser tratado na camada superior
        }
    }
    
    

    async cadastrar(entidade) {
        
        let sql = "insert into categoria_reclamacao (nome, penalidade, multa,ativo) values (?,?,?,?)";

        let valores = [entidade.nome, entidade.penalidade, entidade.multa, entidade.ativo];

        let result = await this.db.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async alterar(entidade) {
        
        let sql = "update categoria_reclamacao set nome = ?, penalidade = ?, multa = ?, ativo =? where id = ?";

        let valores = [entidade.nome, entidade.penalidade, entidade.multa,entidade.ativo, entidade.id];

        let result = await this.db.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async desabilitar(entidade) {
        try {
            let sql = 'update categoria_reclamacao set ativo = ? where id = ?';
            let valores = [false,entidade.id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            return result;
            
        } catch (error) {
            console.error("Erro ao desabilitar categoria:", error);
            throw error; 
        }
    }
    

    async buscarPorId(id) {
        let sql = "SELECT * FROM categoria_reclamacao WHERE id = ?";
        let valores = [id];
        let rows = await this.db.ExecutaComando(sql, valores);


        console.log("Resultado da consulta:", rows);

        if(rows.length === 0){
            return null;
        }
        
        return new categoriaReclamacaoEntity(
            rows[0].id,
            rows[0].nome,
            rows[0].penalidade,
            rows[0].multa,
            rows[0].ativo
        );

            
    }
    
    async listar() {
        let sql = `SELECT * FROM categoria_reclamacao where ativo = 1`;
        let lista = [];
        let rows = await this.db.ExecutaComando(sql);

        for (let i = 0; i < rows.length; i++) {
            let categoria = new categoriaReclamacaoEntity();
            categoria.id = rows[i].id;
            categoria.nome = rows[i].nome;
            categoria.penalidade = rows[i].penalidade;
            categoria.multa = rows[i].multa;
            categoria.ativo = rows[i].ativo;
            lista.push(categoria);
        }

        return lista;
    }

    async reativar(entidade) {
        try {
            let sql = 'update categoria_reclamacao set ativo = ? where id = ?';
            let valores = [true,entidade.id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            return result;
            
        } catch (error) {
            console.error("Erro ao desabilitar Categoria de Reclamacao:", error);
            throw error; 
        }
        
    }

    toMap(row) {
        if (!row) return null;
    
        const categoria = new categoriaReclamacaoEntity();
        categoria.id = row["id"];
        categoria.nome = row["nome"];
        categoria.penalidade = row["penalidade"];
        categoria.multa = row["multa"];
        categoria.ativo = row["ativo"];

        console.log("Categoria mapeada:", categoria); 
    
        return categoria;
    }
    
}