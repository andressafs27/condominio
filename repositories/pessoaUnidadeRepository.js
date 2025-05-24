import BaseRepository from "./baseRepository.js";
import PessoaUnidadeEntity from "../entities/pessoaUnidadeEntity.js";

export default class PessoaUnidadeRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }

    // Método para associar uma pessoa a uma unidade
    async associarPessoaUnidade(pessoaUnidade) {
        try {
            const { pessoa_id, unidade_id, responsavel } = pessoaUnidade;

            if (!pessoa_id) {
                throw new Error("O ID da pessoa não foi fornecido.");
            }
            
            // Inserção na tabela Pessoa_has_Unidade
            const sql = `
                INSERT INTO pessoa_has_unidade (pessoa_id, unidade_id, responsavel)
                VALUES (?, ?, ?)
            `;
            let valores = [pessoa_id, unidade_id, responsavel];

            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            return result;

        } catch (error) {
            console.error("Erro ao associar pessoa à unidade:", error);
            throw new Error("Erro ao associar pessoa à unidade");
        }
    }

    // Método para obter todas as unidades de uma pessoa
    async obterUnidadesPorPessoa(pessoa_id) {
        try {
            const sql = `
                SELECT u.id, u.bloco_id, u.numero, p.responsavel
                FROM pessoa_has_unidade p
                JOIN unidade u ON u.id = p.unidade_id
                WHERE p.pessoa_id = ?
            `;
            let valores = [pessoa_id];

            let rows = await this.db.ExecutaComando(sql, valores);
            if (rows.length === 0) return null;

            return new PessoaUnidadeEntity(
                rows[0].pessoa_id,
                rows[0].unidade_id,
                rows[0].responsavel,
            );

        } catch (error) {
            console.error("Erro ao buscar unidades de pessoa:", error);
            throw new Error("Erro ao buscar unidades de pessoa");
        }
    }

    async obterUnidadesDaPessoaPorId(unidade_id) {
        try {
            const sql = `SELECT * FROM pessoa_has_unidade WHERE unidade_id = ?`;
            let valores = [unidade_id];

            let rows = await this.db.ExecutaComando(sql, valores);

            console.log("Resultado da consulta obterUnidadesDaPessoaPorId da PessoaUnidadeRepo:", rows);

            if (rows.length === 0) return null;

            return new PessoaUnidadeEntity(
                rows[0].pessoa_id,
                rows[0].unidade_id,
                rows[0].responsavel,
            );

        } catch (error) {
            console.error("Erro ao buscar unidades de pessoa:", error);
            throw new Error("Erro ao buscar unidades de pessoa");
        }
    }

    // Método para remover a associação entre pessoa e unidade (caso necessário)
    async removerAssociacao(pessoa_id, unidade_id) {
        try {
            const sql = `
                DELETE FROM pessoa_has_unidade
                WHERE pessoa_id = ? AND unidade_id = ?
            `;
            let valores = [ pessoa_id, unidade_id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            return result;

            
        } catch (error) {
            console.error("Erro ao remover associação:", error);
            throw new Error("Erro ao remover associação entre pessoa e unidade");
        }
    }

    async removerPorPessoaId(pessoa_id) {
        try {
            console.log(`Removendo associações de unidades para a pessoa com ID: ${pessoa_id}`);
            
            // Supondo que você tenha uma tabela que relaciona pessoa e unidades
            // Vamos usar um comando SQL para remover as associações. 
            // Se você estiver usando um ORM como o Sequelize ou TypeORM, a sintaxe será diferente.
            
            const sql = 'DELETE FROM pessoa_has_unidade WHERE pessoa_id = ?';
            const valores = [ pessoa_id]
            const result= await this.db.ExecutaComandoNonQuery(sql, valores); 

            return result;
        } catch (error) {
            console.error("Erro ao remover associações de unidades:", error);
            throw new Error("Erro ao remover associações de unidades");
        }
    }
}
