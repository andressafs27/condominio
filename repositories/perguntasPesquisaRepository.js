import BaseRepository from "./baseRepository.js";
import PerguntasPesquisaEntity from "../entities/perguntasPesquisaEntity.js";

export default class PerguntasPesquisaRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }

    async associarPerguntaPesquisa(perguntaPesquisa) {
        try {
            const { pergunta_id, pesquisa_id } = perguntaPesquisa;

            if (!pergunta_id) {
                throw new Error("O ID da pergunta não foi fornecido.");
            }
            
            const sql = `
                INSERT INTO perguntas_has_pesquisa(pergunta_id, pesquisa_id)
                VALUES (?, ?)
            `;
            let valores = [pergunta_id, pesquisa_id];

            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            return result;

        } catch (error) {
            console.error("Erro ao associar pergunta à pesquisa:", error);
            throw new Error("Erro ao associar pergunta à pesquisa");
        }
    }

    async obterPerguntasPorPesquisa(pesquisa_id) {
        try {
            const sql = `
                SELECT 
                    p.id AS pergunta_id,
                    php.pesquisa_id
                FROM 
                    perguntas_has_pesquisa php
                JOIN 
                    perguntas p ON p.id = php.pergunta_id
                WHERE 
                    php.pesquisa_id  = ?
            `;
            let valores = [pesquisa_id];

            let rows = await this.db.ExecutaComando(sql, valores);
            if (rows.length === 0) return null;

            return new PerguntasPesquisaEntity(
                rows[0].pergunta_id,
                rows[0].pesquisa_id,
            );

        } catch (error) {
            console.error("Erro ao buscar perguntas de pesquisa:", error);
            throw new Error("Erro ao buscar perguntas de pesquisa");
        }
    }

    async obterPesquisaDaPerguntaPorId(pergunta_id) {
        try {
            const sql = `
                SELECT *
                FROM perguntas_has_pesquisa
                WHERE pergunta_id = ?
            `;
            const valores = [pergunta_id];
            const rows = await this.db.ExecutaComando(sql, valores);
    
            if (rows.length === 0) return null;
    
            return rows.map(row => ({
                pergunta_id: row.pergunta_id,
                pesquisa_id: row.pesquisa_id
            }));
    
        } catch (error) {
            console.error("Erro ao buscar pesquisas da pergunta:", error);
            throw new Error("Erro ao buscar pesquisas da pergunta");
        }
    }

    async removerAssociacao(pergunta_id, pesquisa_id) {
        try {
            const sql = `
                DELETE FROM perguntas_has_pesquisa
                WHERE pergunta_id = ? AND pesquisa_id = ?
            `;
            const valores = [pergunta_id, pesquisa_id];
            const result = await this.db.ExecutaComandoNonQuery(sql, valores);
    
            return result;
        } catch (error) {
            console.error("Erro ao remover associação entre pergunta e pesquisa:", error);
            throw new Error("Erro ao remover associação entre pergunta e pesquisa");
        }
    }
    
    async removerPorPerguntaId(pergunta_id) {
        try {
            const sql = `
                DELETE FROM perguntas_has_pesquisa
                WHERE pergunta_id = ?
            `;
            const valores = [pergunta_id];
            const result = await this.db.ExecutaComandoNonQuery(sql, valores);
    
            return result;
        } catch (error) {
            console.error("Erro ao remover associações da pergunta:", error);
            throw new Error("Erro ao remover associações da pergunta");
        }
    }  
    
    async removerPorPesquisaId(pesquisa_id) {
        try {
            const sql = `
                DELETE FROM perguntas_has_pesquisa
                WHERE pesquisa_id = ?
            `;
            const valores = [pesquisa_id];
            const result = await this.db.ExecutaComandoNonQuery(sql, valores);
    
            return result;
        } catch (error) {
            console.error("Erro ao remover associações da pesquisa:", error);
            throw new Error("Erro ao remover associações da pesquisa");
        }
    }

    async buscarPorPesquisaId(pesquisa_id) {
        try {
          console.log("retorno da repo buscarpesquisaid ", pesquisa_id);
      
          const sql = `
            SELECT 
              p.id AS id, 
              p.enunciado AS enunciado
            FROM perguntas_has_pesquisa php
            JOIN perguntas p ON php.pergunta_id = p.id
            WHERE php.pesquisa_id = ?
          `;
      
          const rows = await this.db.ExecutaComando(sql, [pesquisa_id]);
      
          return rows.map(row => ({
            id: row.id,
            enunciado: row.enunciado
          }));
          
        } catch (error) {
          console.error("Erro ao buscar perguntas da pesquisa:", error);
          throw error;
        }
      }

      async buscarPorPesquisaParaResponder(pesquisa_id, pessoa_id) {
        try {
          console.log("retorno da repo buscarpesquisaid ", pesquisa_id);
      
          const sql = `
            SELECT 
                p.id AS id, 
                p.enunciado AS enunciado,
                php.pesquisa_id,
                rp.alternativas_id as alternativa_respondida
                FROM perguntas_has_pesquisa php
                JOIN perguntas p ON php.pergunta_id = p.id
                LEFT JOIN resposta_pesquisa rp on rp.pesquisa_id = php.pesquisa_id 
                                            and rp.pergunta_id = p.id 
                                            and rp.pessoa_id = ?
                WHERE php.pesquisa_id = ?
          `;
        const valores = [pessoa_id, pesquisa_id];

          const rows = await this.db.ExecutaComando(sql, valores);
      
          return rows.map(row => ({
            id: row.id,
            enunciado: row.enunciado,
            pesquisa_id: row.pesquisa_id,
            alternativa_respondida: row.alternativa_respondida
          }));
          
        } catch (error) {
          console.error("Erro ao buscar perguntas da pesquisa:", error);
          throw error;
        }
      }
      

    async adicionarAssociacao(pergunta_id, pesquisa_id) {
        const sql = `
            INSERT INTO perguntas_has_pesquisa (pergunta_id, pesquisa_id)
            VALUES (?, ?)
        `;
        const valores = [pergunta_id, pesquisa_id];
        const result = await this.db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async buscarPrimeiraPergunta(pesquisa_id) {
        try {
            console.log("Repository -> buscarPrimeiraPergunta");

            if (!pesquisa_id) {
                throw new Error("ID da pesquisa não informado!");
            }

            const sql = `
                 SELECT pp.pergunta_id, pp.pesquisa_id
                FROM perguntas_has_pesquisa pp
                WHERE pp.pesquisa_id = ?
                ORDER BY pp.pergunta_id ASC
                LIMIT 1
            `;

            const rows = await this.db.ExecutaComando(sql, [pesquisa_id]);

            if (rows.length === 0) {
                return null;  
            }

            return rows[0];

        } catch (error) {
            console.error("Erro ao buscar primeira pergunta no repositório:", error.message);
            throw error; 
        }
    }
    
}
