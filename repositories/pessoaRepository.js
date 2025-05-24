import PessoaEntity from "../entities/pessoaEntity.js";
import BaseRepository from "./baseRepository.js";

export default class PessoaRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }

    async obter(id) {
        try{
            await this.db.AbreTransacao();
            let sql = "select * from pessoa where id = ?";
            let valores = [id];
            let rows = await this.db.ExecutaComando(sql, valores);
            if (rows.length === 0) return null;
            await this.db.Commit();
            return this.toMap(rows[0]);
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao obter pessoas por id:", error.message);
            throw error;
        } 
    }

    async cadastrar(entidadePessoa) {
        try{
            await this.db.AbreTransacao();
            let sql = `
                INSERT INTO pessoa (nome, cpf, telefone, email, data_nascimento, rg, sindico,senha, ativo, adm) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?,?,?)
            `;
            let valores = [entidadePessoa.nome, entidadePessoa.cpf, entidadePessoa.telefone, entidadePessoa.email, entidadePessoa.data_nascimento, entidadePessoa.rg, entidadePessoa.sindico,entidadePessoa.senha, true, entidadePessoa.adm];
            let result = await this.db.ExecutaComandoLastInserted(sql, valores);
            await this.db.Commit();
            return result;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao cadastrar pessoa :", error.message);
            throw error;
        }
    }
    
    async alterar(entidade) {
        try{
            await this.db.AbreTransacao();
            let sql = "update pessoa set nome = ?, cpf = ?, telefone = ?, email = ?, data_nascimento = ?, rg = ?, sindico = ? ,senha = ?, adm = ? where id = ?";
            let valores = [entidade.nome, entidade.cpf, entidade.telefone, entidade.email, entidade.data_nascimento, entidade.rg, entidade.sindico,entidade.senha,entidade.adm, entidade.id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            await this.db.Commit();
            return result;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao alterar pessoa:", error.message);
            throw error;
        }
    }

    async buscarPorId(id) {
        try{
            await this.db.AbreTransacao();
            let sql = `SELECT 
            p.*,
            u.id as unidade_id,
            u.numero as unidade_numero,
            pu.responsavel as responsavel,
            b.id as bloco_id,
            b.numero as bloco_numero
            FROM 
                pessoa p
            left JOIN 
                pessoa_has_unidade pu ON p.id = pu.pessoa_id
            left JOIN 
                unidade u ON u.id = pu.unidade_id
            left JOIN 
                bloco b ON u.bloco_id = b.id
            where p.id = ?`;
            let valores = [id];
            let rows = await this.db.ExecutaComando(sql, valores);
            await this.db.Commit();
            if (rows.length === 0) {
            return null;
            }

            let pessoa = new PessoaEntity(
            rows[0].id,
            rows[0].nome,
            rows[0].cpf,
            rows[0].telefone,
            rows[0].email,
            rows[0].data_nascimento,
            rows[0].rg,
            rows[0].sindico,
            rows[0].senha,
            rows[0].ativo,
            rows[0].adm
            );

            let unidades = [];
            for(let i = 0; i < rows.length; i++){
            unidades.push({ 
                unidade_id : rows[i].unidade_id,
                unidade_numero: rows[i].unidade_numero,
                responsavel: rows[i].responsavel,
                bloco_id: rows[i].bloco_id,
                bloco_numero: rows[i].bloco_numero
            });
            }
            pessoa.unidades = unidades;
            return pessoa;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao buscar por id da pessoa:", error.message);
            throw error;
        }
    }

    async obter(id) {
        try{
            await this.db.AbreTransacao();
            let sql = "select * from pessoa where id = ?";
            let valores = [id];
            let rows = await this.db.ExecutaComando(sql, valores);
            if (rows.length === 0) return null;
            await this.db.Commit();
            return this.toMap(rows[0]);
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao obter pessoa por id:", error.message);
            throw error;
        } 
    }
    
    async listar() {
        try{
            await this.db.AbreTransacao();
            let sql = `SELECT 
                            p.*,
                            b.numero as bloco_numero,
                            u.numero as unidade_numero
                        FROM pessoa p
                        left join pessoa_has_unidade pu on pu.pessoa_id = p.id
                        left join unidade u on u.id = pu.unidade_id
                        left join bloco b on b.id = u.bloco_id
                        where p.ativo = 1`;
            let lista = [];
            let rows = await this.db.ExecutaComando(sql);

            await this.db.Commit();
            for (let i = 0; i < rows.length; i++) {
                let pessoa = new PessoaEntity();
                pessoa.id = rows[i].id;
                pessoa.nome = rows[i].nome;
                pessoa.cpf = rows[i].cpf;
                pessoa.telefone = rows[i].telefone;
                pessoa.email = rows[i].email;
                pessoa.data_nascimento = rows[i].data_nascimento;
                pessoa.rg = rows[i].rg;
                pessoa.sindico = rows[i].sindico;
                pessoa.senha = rows[i].senha;
                pessoa.adm = rows[i].adm;
                pessoa.bloco_numero = rows[i].bloco_numero;
                pessoa.unidade_numero = rows[i].unidade_numero;
                lista.push(pessoa);
            }
            return lista;
        }
        catch(error){
            await this.db.Rollback();
            console.error("Erro ao listar pessoas ativas:", error.message);
            throw error;
        }
    }

    async obterPorEmailSenha(email, senha) {
        try {
            await this.db.AbreTransacao();
            const sql = `SELECT p.id, p.nome, p.sindico, p.adm, p.email, p.senha, phu.responsavel
                            FROM pessoa p
                            LEFT JOIN pessoa_has_unidade phu ON phu.pessoa_id = p.id
                            WHERE p.email = ? AND p.senha = ?`;
            let valores = [email, senha];
            let row = await this.db.ExecutaComando(sql, valores);
            await this.db.Commit();

            if (row.length > 0) {
                return new PessoaEntity(
                    row[0]["id"], 
                    row[0]["nome"], 
                    row[0]["cpf"], 
                    row[0]["telefone"],
                    row[0]["email"], 
                    row[0]["data_nascimento"], 
                    row[0]["rg"], 
                    row[0]["sindico"], 
                    row[0]["senha"], 
                    row[0]["ativo"], 
                    row[0]["adm"],
                    row[0]["responsavel"]  
                );
                
            }

            return null; 

        } catch (error) {
            await this.db.Rollback();
            console.error("Erro ao obter por email e senha da pessoa:", error.message);
            throw error;
        }
    }

    async obterPorCpf(cpf) {
        try {
            await this.db.AbreTransacao();
            let sql  = `
                SELECT * FROM pessoa WHERE cpf = ? AND ativo = true
            `;
            let valores = [cpf];
            let row = await this.db.ExecutaComando(sql, valores);
            await this.db.Commit();
            if (row.length > 0) {
                return new PessoaEntity(row[0]["id"], row[0]["nome"],row[0]["cpf"], row[0]["telefone"],row[0]["email"], row[0]["data_nascimento"],row[0]["rg"], row[0]["sindico"],row[0]["senha"], row[0]["adm"]); 
            }
            return null;
        } catch (error) {
            await this.db.Rollback();
            console.error("Erro ao buscar pessoa por cpf:", error.message);
            throw error;
        }
    }
    
    async desabilitar(entidade) {
        try {
            if (!entidade.id) {
                throw new Error("ID da pessoa não encontrado!");
            }

            const pessoaExistente = await this.obter(entidade.id);
            if (!pessoaExistente) {
                throw new Error(`Pessoa com ID ${entidade.id} não existe no banco.`);
            }

            await this.db.AbreTransacao();

            const sqlPessoa = 'UPDATE pessoa SET ativo = ? WHERE id = ?';
            const valoresPessoa = [entidade.ativo, entidade.id];
            await this.db.ExecutaComandoNonQuery(sqlPessoa, valoresPessoa);
    
            const sqlVeiculos = 'UPDATE veiculos SET ativo = ? WHERE pessoa_id = ?';
            const valoresVeiculos = [false, entidade.id];
            await this.db.ExecutaComandoNonQuery(sqlVeiculos, valoresVeiculos);

            const sqlPessoaUnidade = 'delete from pessoa_has_unidade where pessoa_id = ?';
            const valoresPessoaUnidade = [entidade.id];
            await this.db.ExecutaComandoNonQuery(sqlPessoaUnidade, valoresPessoaUnidade);
    
            await this.db.Commit();
            console.log("Pessoa desabilitada com sucesso.");

            return true;
    
        } catch (error) {
            await this.db.Rollback();
            console.error("Erro ao desabilitar pessoa:", error.message);
            throw error;
        }
    }

    async listarParaRelatorio(termo, filtro) 
        {
            let sqlFiltro = "";
            let valores = [];
    
            if (filtro == "1") {
                if (termo != "") {
                    sqlFiltro = ` WHERE p.id = ?`;
                    valores.push(termo);
                }
            } else if (filtro == "2") {
                if (termo != "") {
                    sqlFiltro = ` WHERE p.cpf = ?`;
                    valores.push(termo);
                }
            } 
            else if (filtro == "3") {
                if (termo != "") {
                    termo = '%' + termo + '%';
                    sqlFiltro = ` WHERE p.nome like ?`;
                    valores.push(termo);
                }
            }
            else if (filtro == "4") {
                if (termo != "") {
                    sqlFiltro = ` WHERE b.numero = ?`;
                    valores.push(termo);
                }
            } 
    
            let sql = ` select 
                            p.*, 
                            b.numero as bloco_numero, 
                            u.numero as unidade_numero
                        from pessoa as p
                        left join pessoa_has_unidade pu on pu.pessoa_id = p.id
                        left join unidade u on u.id = pu.unidade_id
                        left join bloco b on b.id = u.bloco_id
                        
                        ${sqlFiltro}`;
            let rows = await this.db.ExecutaComando(sql, valores);
            let lista = [];
    
            for (let i = 0; i < rows.length; i++) {
                let pessoa = new PessoaEntity();
                pessoa.id = rows[i].id;
                pessoa.telefone = rows[i].telefone;
                pessoa.nome = rows[i].nome; 
                pessoa.data_nascimento = rows[i].data_nascimento;
                pessoa.cpf = rows[i].cpf;
                pessoa.sindico = rows[i].sindico;  
                pessoa.email = rows[i].email;
                pessoa.rg = rows[i].rg;
                pessoa.senha = rows[i].senha;
                pessoa.ativo = rows[i].ativo;   
                pessoa.adm = rows[i].adm;
                pessoa.bloco_numero = rows[i].bloco_numero;
                pessoa.unidade_numero = rows[i].unidade_numero;

                lista.push(pessoa);
            }
    
            return lista;
        }
        
    toMap(row) {
        if (!row) return null;
    
        const pessoa = new PessoaEntity();
        pessoa.id = row["id"];
        pessoa.nome = row["nome"];
        pessoa.cpf = row["cpf"];
        pessoa.telefone = row["telefone"];
        pessoa.email = row["email"];
        pessoa.data_nascimento = row["data_nascimento"];
        pessoa.rg = row["rg"];  
        pessoa.sindico = row["sindico"];
        pessoa.senha = row["senha"];
        pessoa.ativo = row["ativo"];
        pessoa.adm = row["adm"];
    
        return pessoa;
    }
}
