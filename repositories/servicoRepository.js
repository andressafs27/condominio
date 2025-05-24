import AgendaEntity from "../entities/agendaEntity.js";
import ServicoEntity from "../entities/ServicoEntity.js";
import BaseRepository from "./baseRepository.js";

export default class ServicoRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }

    async obter(id) {
        let sql = "select * from servico where id = ?";
        let valores = [id];

        let row = await this.db.ExecutaComando(sql, valores);
        return this.toMap(row[0]);
    }

    async obterPorNome(descricao) {
        let sql = "SELECT * FROM servico WHERE descricao = ? ";
        let valores = [descricao];
    
        try {
            let rows = await this.db.ExecutaComando(sql, valores);
    
            if (rows.length === 0) {
                return null; // Retorna null se não encontrar a servico
            }
    
            return this.toMap(rows[0]);
        } catch (error) {
            console.error("Erro ao executar a query:", error);
            throw error; // Relança o erro para ser tratado na camada superior
        }
    }

    async cadastrar(entidade) {
        
        let sql = "insert into servico (descricao, ativo) values (?,?)";

        let valores = [entidade.descricao, entidade.ativo];

        let result = await this.db.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async alterar(entidade) {
        
        let sql = "update servico set descricao = ?, ativo = ? where id = ?";

        let valores = [entidade.descricao, entidade.ativo,entidade.id];

        let result = await this.db.ExecutaComandoNonQuery(sql, valores);

        return result;
    }

    async desabilitar(entidade) {
        try {
            let sql = 'update servico set ativo = ? where id = ?';
            let valores = [false,entidade.id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            return result;
            
        } catch (error) {
            console.error("Erro ao desabilitar servico:", error);
            throw error; 
        }
    }
    

    async buscarPorId(id) {
        let sql = "SELECT * FROM servico WHERE id = ?";
        let valores = [id];
        let rows = await this.db.ExecutaComando(sql, valores);

        console.log("Resultado da consulta:", rows);

        if(rows.length === 0){
            return null;
        }
        
        return new ServicoEntity(
            rows[0].id,
            rows[0].descricao,
            rows[0].ativo
        );
    
    }

    async listar() {
        let sql = `SELECT * FROM servico where ativo = 1`;
        let lista = [];
        let rows = await this.db.ExecutaComando(sql);

        for (let i = 0; i < rows.length; i++) {
            let Servico = new ServicoEntity();
            Servico.id = rows[i].id;
            Servico.descricao = rows[i].descricao;
            Servico.ativo = rows[i].ativo;
            lista.push(Servico);
        }

        return lista;
    }

    
    async listarParaMorador(pessoaId) {
        let sql = ` SELECT 
                        distinct a.*,
                        s.descricao as servico_descricao
                    FROM servico as s
                    JOIN agenda as a on a.servico_id = s.id
                    join bloco as b on b.id = a.bloco_id
                    join unidade as u on u.bloco_id = b.Id
                    join pessoa_has_unidade pu on pu.unidade_id = u.id
                    where s.ativo = 1
                    and pu.pessoa_Id = ?`;
        let lista = [];
        let rows = await this.db.ExecutaComando(sql, [pessoaId]);

        for (let i = 0; i < rows.length; i++) {
            let agenda = new AgendaEntity();
            agenda.id = rows[i].id;
            agenda.data = rows[i].data;
            agenda.data_final = rows[i].data_final;
            agenda.descricao = rows[i].descricao;
            agenda.servico_descricao = rows[i].servico_descricao;

            lista.push(agenda);
        }

        return lista;
    }

    async reativar(entidade) {
        try {
            let sql = 'update servico set ativo = ? where id = ?';
            let valores = [true,entidade.id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            return result;
            
        } catch (error) {
            console.error("Erro ao desabilitar servico:", error);
            throw error; 
        }
        
    }

    toMap(row) {
        if (!row) return null;
    
        const Servico = new ServicoEntity();
        Servico.id = row["id"];
        Servico.descricao = row["descricao"];
        Servico.ativo = row["ativo"];

        console.log("Servico mapeado:", Servico); 
    
        return Servico;
    }
    
}