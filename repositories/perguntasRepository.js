import PerguntasEntity from "../entities/perguntasEntity.js";
import BaseRepository from "./baseRepository.js";

export default class PerguntasRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }

    async obter(id) {
        try{
            await this.db.AbreTransacao();
            let sql = "select * from perguntas where id = ?";
            let valores = [id];
            let rows = await this.db.ExecutaComando(sql, valores);
            if (rows.length === 0) return null;
            await this.db.Commit();
            return this.toMap(rows[0]);
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao obter perguntas por id:", error.message);
            throw error;
        } 
    }

    async cadastrar(entidade) {
        try{
            await this.db.AbreTransacao();
            let sql = `
                INSERT INTO perguntas (enunciado, status) 
                VALUES (?, ?)
            `;
            let valores = [entidade.enunciado, entidade.status];
            let result = await this.db.ExecutaComandoLastInserted(sql, valores);
            await this.db.Commit();
            return result;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao cadastrar perguntas :", error.message);
            throw error;
        }
    }
    
    async alterar(entidade) {
        try{
            await this.db.AbreTransacao();
            let sql = "update perguntas set enunciado = ?, status = ? where id = ?";
            let valores = [entidade.enunciado, entidade.status, entidade.id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            await this.db.Commit();
            return result;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao alterar perguntas:", error.message);
            throw error;
        }
    }
    
    async listar() {
        try{
            await this.db.AbreTransacao();
            let sql = `SELECT * FROM perguntas`;
            let lista = [];
            let rows = await this.db.ExecutaComando(sql);

            await this.db.Commit();
            for (let i = 0; i < rows.length; i++) {
                let perguntas = new PerguntasEntity();
                perguntas.id = rows[i].id;
                perguntas.enunciado = rows[i].enunciado;
                perguntas.status = rows[i].status;
                lista.push(perguntas);
            }
            return lista;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao listar perguntass: ", error.message);
            throw error;
        }
    }
    
    async desativar(entidade) {
        try {
            if (!entidade.id) {
                throw new Error("ID da perguntas não encontrada!");
            }

            const perguntasExistente = await this.obter(entidade.id);
            if (!perguntasExistente) {
                throw new Error(`perguntas com ID ${entidade.id} não existe no banco.`);
            }

            await this.db.AbreTransacao();

            // const sqlAlternativas = 'update alternativas WHERE pergunta_id = ?';
            // const valoresAlternativas = [entidade.id];
            // await this.db.ExecutaComandoNonQuery(sqlAlternativas, valoresAlternativas);

            const sqlperguntas = 'update perguntas set status = ? WHERE id = ?';
            const valoresperguntas = [entidade.inativo,entidade.id];
            await this.db.ExecutaComandoNonQuery(sqlperguntas, valoresperguntas);

            await this.db.Commit();
            console.log("perguntas desativada com sucesso.");

            return true;
    
        } catch (error) {
            await this.db.Rollback();
            console.error("Erro ao desativar perguntas:", error.message);
            throw error;
        }
    }

    // async buscarPorId(id) {
    //     try{
    //         console.log("Repository da pergunta buscarPorId- ID da perguntas:", id);
    //         await this.db.AbreTransacao();
    //         let sql = `select p.*, a.id as alternativa_id, a.enunciado as alternativa_enunciado 
    //                     from alternativas a
    //                     left join perguntas p on p.id = a.pergunta_id
    //                     where p.id = ?`;
    //         let valores = [id];
    //         let rows = await this.db.ExecutaComando(sql, valores);
    //         await this.db.Commit();
    //         if (rows.length === 0) {
    //         return null;
    //         }

    //         let perguntas = new PerguntasEntity(
    //             rows[0].id,
    //             rows[0].enunciado,
    //             rows[0].status,
    //         );

    //         let alternativas = [];
    //         for(let i = 0; i < rows.length; i++){
    //             alternativas.push({ 
    //                 id : rows[i].alternativa_id,
    //                 enunciado: rows[i].alternativa_enunciado,
    //             });
    //         }
    //         perguntas.alternativas = alternativas;
    //         return perguntas;
    //     }
    //     catch(error){
    //         await this.db.Rollback();
    //         console.error("Erro ao buscar por id da pergunta:", error.message);
    //         throw error;
    //     }
    // }

    async buscarPorId(id) {
        console.log("Repository da pergunta buscarPorId - ID:", id);
        const sql = `
            SELECT p.*, a.id as alternativa_id, a.enunciado as alternativa_enunciado 
            FROM alternativas a
            LEFT JOIN perguntas p ON p.id = a.pergunta_id
            WHERE p.id = ?`;
    
        const valores = [id];
    
        try {
            const rows = await this.db.ExecutaComando(sql, valores);
    
            if (rows.length === 0) return null;
    
            const pergunta = new PerguntasEntity(
                rows[0].id,
                rows[0].enunciado,
                rows[0].status
            );
    
            pergunta.alternativas = rows.map(row => ({
                id: row.alternativa_id,
                enunciado: row.alternativa_enunciado
            }));
    
            return pergunta;
        } catch (error) {
            console.error("Erro ao buscar por id da pergunta:", error.message);
            throw error;
        }
    }
    

    async buscarIdPerguntaAtivar(id) {
        try{
            console.log("Repository da pergunta buscarIdPerguntaAtivar - ID da perguntas:", id);
            await this.db.AbreTransacao();
            let sql = "select * from perguntas where id = ?";
            let valores = [id];
            let rows = await this.db.ExecutaComando(sql, valores);
            await this.db.Commit();
            if (rows.length === 0) {
            return null;
            }

            let perguntas = new PerguntasEntity(
                rows[0].id,
                rows[0].enunciado,
                rows[0].status,
            );

            
            return perguntas;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao buscar por id da pergunta:", error.message);
            throw error;
        }
    }

    async buscarPerguntaAtiva() {
        try{
            await this.db.AbreTransacao();
            const sql = `SELECT * FROM perguntas WHERE status = 1`;
            let rows = await this.db.ExecutaComando(sql);
            if (rows.length === 0) {
            return [];
            }

            let perguntas = [];
            for(let i=0; i<rows.length;i++){
                perguntas.push(new PerguntasEntity(
                    rows[i].id,
                    rows[i].enunciado,
                    rows[i].status
                ))
            }

            return perguntas;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao buscar por id da pergunta:", error.message);
            throw error;
        }
    }

     async obterPerguntasParaPequisa(pesquisa_id) {
        try{
            await this.db.AbreTransacao();
            const sql = `SELECT p.*, php.pergunta_id as selecionada
                FROM perguntas p
                left join perguntas_has_pesquisa php on php.pergunta_id = p.id and php.pesquisa_id = ?
                WHERE p.status = 1`;

            let valores = [pesquisa_id];
            let rows = await this.db.ExecutaComando(sql, valores);
            if (rows.length === 0) {
            return [];
            }

            let perguntas = [];
            for(let i=0; i<rows.length;i++){
                let pergunta = new PerguntasEntity(
                                    rows[i].id,
                                    rows[i].enunciado,
                                    rows[i].status
                                );
                pergunta.selecionada = rows[i].selecionada;
                perguntas.push(pergunta);
            }
            return perguntas;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao buscar por id da pergunta:", error.message);
            throw error;
        }
    }

    async buscarPerguntaEnunciado(enunciado){
        try{
            console.log("Repository da pergunta buscarPerguntaEnunciado", enunciado);
            await this.db.AbreTransacao();
            let sql = "select * from perguntas where enunciado = ?";
            let valores = [enunciado];
            let rows = await this.db.ExecutaComando(sql, valores);
            await this.db.Commit();
            if (rows.length === 0) {
                return null;
            }

            let perguntas = new PerguntasEntity(
                rows[0].id,
                rows[0].enunciado,
                rows[0].status,
            );

            return perguntas;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao buscar por enunciado da pergunta:", error.message);
            throw error;
        }
        
    }

    async ativar(entidade) {
        try {
            if (!entidade.id) {
                throw new Error("ID da perguntas não encontrada!");
            }

            await this.db.AbreTransacao();

            const sqlperguntas = 'update perguntas set status = 1 WHERE id = ?';
            const valoresperguntas = [entidade.id];
            await this.db.ExecutaComandoNonQuery(sqlperguntas, valoresperguntas);

            await this.db.Commit();
            console.log("perguntas ativada com sucesso.");

            return true;
    
        } catch (error) {
            await this.db.Rollback();
            console.error("Erro ao ativar perguntas:", error.message);
            throw error;
        }
    }

    async buscarPerguntaEnunciadoAtivo(enunciado) {
        try {
            const sql = "SELECT * FROM perguntas WHERE enunciado = ? AND status = 'ativo'";
            const valores = [enunciado];
            const rows = await this.db.ExecutaComando(sql, valores);
            return rows.length > 0 ? rows[0] : null;
        } catch (error) {
            console.error("Erro ao buscar pergunta com enunciado ativo:", error.message);
            throw error;
        }
    }

    async buscarProxima(id) {
        try {
            console.log("Repository da pergunta buscarProxima - ID da pergunta:", id);
            await this.db.AbreTransacao();
    
            const sql = `
                SELECT * FROM perguntas 
                WHERE id > ? 
                ORDER BY id ASC 
                LIMIT 1
            `;
            const valores = [id];
            let rows = await this.db.ExecutaComando(sql, valores);
    
            await this.db.Commit();
    
            if (rows.length === 0) {
                return null;
            }
    
            let pergunta = new PerguntasEntity(
                rows[0].id,
                rows[0].enunciado,
                rows[0].status
            );
    
            return pergunta;
    
        } catch (error) {
            await this.db.Rollback();
            console.error("Erro ao buscar próxima pergunta:", error.message);
            throw error;
        }
    }

    
    
    

   
    
    
        
    toMap(row) {
        if (!row) return null;
    
        const perguntas = new PerguntasEntity();
        perguntas.id = row["id"];
        perguntas.enunciado = row["enunciado"];
        perguntas.status = row["status"];
    
        return perguntas;
    }
}