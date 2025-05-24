import PautasEntity from "../entities/pautasEntity.js";
import BaseRepository from "./baseRepository.js";

export default class PautasRepository extends BaseRepository {

    
    constructor(db) {
        super(db);
    }
    
    async cadastrar(pautas) {
        const sql = "INSERT INTO pautas (descricao, assembleia_id) VALUES (?,?)";
        const valores = [pautas.descricao, pautas.assembleia_id];
        let result = await this.db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async listarPautasPorPessoa(pessoa_id) {
        let sql = `select p.*, v.id as votacao_id
                   from pautas p
                   left join votacao v on v.pauta_id = p.id and v.pessoa_id = ?`;

        let valores = [pessoa_id]
        let lista = [];
        let rows = await this.db.ExecutaComando(sql, valores);

        for (let i = 0; i < rows.length; i++) {
            let pautas = new PautasEntity();
            pautas.id = rows[i].id;
            pautas.descricao = rows[i].descricao;
            pautas.assembleia_id = rows[i].assembleia_id;
            pautas.votacao_id = rows[i].votacao_id;
            lista.push(pautas);
        }

        return lista;
    }

    async listar() {
        let sql = "SELECT * from pautas";

        let lista = [];
        let rows = await this.db.ExecutaComando(sql);

        for (let i = 0; i < rows.length; i++) {
            let pautas = new PautasEntity();
            pautas.id = rows[i].id;
            pautas.descricao = rows[i].descricao;
            pautas.assembleia_id = rows[i].assembleia_id;
            lista.push(pautas);
        }

        console.log("Lista de pautas:", lista);
        
        return lista;
    }

    async alterar(pautas) {
        const sql = "UPDATE pautas SET descricao = ?, assembleia_id = ? WHERE id = ?";
        const valores = [pautas.descricao, pautas.assembleia_id, pautas.id];
        let result = await this.db.ExecutaComandoNonQuery(sql, valores);
        return result;
        
    }

    async removerPorAssembleia(assembleia_id) {
        try {
            const sql ="DELETE FROM pautas WHERE assembleia_id = ?";
            const valores = [assembleia_id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            console.log(`Pautas da assembleia ${assembleia_id} removidas com sucesso`);
            return result;
        } catch (ex) {
            console.error("Erro ao remover pautas:", ex);
            throw new Error("Erro ao remover as pautas da assembleia");
        }
    }

    async buscarPorId(id) {
        let sql = "SELECT * FROM pautas WHERE id = ?";
        let valores = [id];
        let rows = await this.db.ExecutaComando(sql, valores);

        if(rows.length === 0){
            return null;
        }
        
        return new PautasEntity(
            rows[0].id,
            rows[0].descricao,
            rows[0].assembleia_id,
        );
                
    }

    async listarPautasSemVotacao() {
        let sql = `
            SELECT p.id, p.descricao
            FROM pautas p
            LEFT JOIN votacao v ON p.id = v.pauta_id
            WHERE v.id IS NULL
        `;

        let rows = await this.db.ExecutaComando(sql);
        let lista = [];

        for (let i = 0; i < rows.length; i++) {
            let pautas = new PautasEntity();
            pautas.id = rows[i].id;
            pautas.descricao = rows[i].descricao;
            pautas.assembleia_id = rows[i].assembleia_id;
            lista.push(pautas);
        }

        console.log("Lista de pautas sem votação:", lista);
        
        return lista;
    }

    //colocar status ou ativo para a pauta
    // async desabilitar(pautas) {
    //     try {
    //         let sql = 'update pautas set ativo = ? where id = ?';
    //         let valores = [false,entidade.id];
    //         let result = await this.db.ExecutaComandoNonQuery(sql, valores);
    //         return result;
            
    //     } catch (error) {
    //         console.error("Erro ao desabilitar unidade:", error);
    //         throw error; 
    //     }
    // }

    // async reativar(entidade) {
    //     try {
    //         let sql = 'update unidade set ativo = ? where id = ?';
    //         let valores = [true,entidade.id];
    //         let result = await this.db.ExecutaComandoNonQuery(sql, valores);
    //         return result;
            
    //     } catch (error) {
    //         console.error("Erro ao desabilitar unidade:", error);
    //         throw error; 
    //     }
        
    // }

    toMap(row) {
        if (!row) return null;
    
        const pautas = new PautasEntity();
        pautas.id = row["id"];
        pautas.descricao = row["descricao"];
        pautas.assembleia_id = row["assembleia_id"];

        console.log("pautas mapeado tomap:", pautas); 
    
        return pautas;
    }
}
