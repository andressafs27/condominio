import veiculoEntity from "../entities/veiculoEntity.js";
import BaseRepository from "./baseRepository.js";

export default class VeiculoRepository extends BaseRepository {

    constructor(db) {
        super(db);
    }
    
    async cadastrar(veiculo) {
        const sql = "INSERT INTO veiculos (placa, modelo, cor, marca, ativo, pessoa_id) VALUES (?, ?, ?, ?, ?, ?)";
        const valores = [veiculo.placa, veiculo.modelo, veiculo.cor, veiculo.marca, veiculo.ativo, veiculo.pessoa_id];        
        let result = await this.db.ExecutaComandoNonQuery(sql, valores);
        return result;
    }

    async listar() {
        let sql = `SELECT 
                        veiculos.*, 
                        pessoa.id as pessoa_id,
                        pessoa.cpf as pessoa_cpf,
                        pessoa.nome as pessoa_nome
                    FROM veiculos
                    inner join pessoa on veiculos.pessoa_id = pessoa.id
                    where veiculos.ativo = 1`;

        let lista = [];
        let rows = await this.db.ExecutaComando(sql);

        for (let i = 0; i < rows.length; i++) {
            let veiculo = new veiculoEntity(
                rows[i].id,
                rows[i].placa,
                rows[i].modelo,
                rows[i].cor,
                rows[i].marca,
                rows[i].ativo,
                rows[i].pessoa_id
            );
            veiculo.pessoa_nome = rows[i].pessoa_nome;
            veiculo.pessoa_cpf = rows[i].pessoa_cpf;
            lista.push(veiculo);
        }

        return lista;
    }


    async buscarPorId(id) {
            let sql = `SELECT veiculos.*, pessoa.id as pessoa_id FROM veiculos 
                    inner join pessoa on veiculos.pessoa_id = pessoa.id
                    where veiculos.id = ?`;
            let valores = [id];
            let rows = await this.db.ExecutaComando(sql, valores);
    
            console.log("Resultado da consulta buscarPorId:", rows);
    
            if(rows.length === 0){
                return null;
            }
            
            let veiculo = new veiculoEntity(
                rows[0].id,
                rows[0].placa,
                rows[0].modelo,
                rows[0].cor,
                rows[0].marca,
                rows[0].ativo,
                rows[0].pessoa_id
            );
            
            
            return veiculo;
        
        }
    

    async alterar(veiculo) {
        const sql = "UPDATE veiculos SET placa = ?, modelo = ?, cor = ?, marca =? , ativo= ?, pessoa_id = ? WHERE id = ?";
        const valores = [veiculo.placa, veiculo.modelo,veiculo.cor, veiculo.marca, veiculo.ativo, veiculo.pessoa_id,veiculo.id];

        console.log("Alterando veiculo com valores:", veiculo);
        console.log("Valores para SQL:", valores);

        let result = await this.db.ExecutaComandoNonQuery(sql, valores);
        return result;
        
    }

    async desabilitar(entidade) {
        try {
            let sql = 'update veiculos set ativo = ? where id = ?';
            let valores = [false,entidade.id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            return result;
            
        } catch (error) {
            console.error("Erro ao desabilitar veiculo:", error);
            throw error; 
        }
    }

      
    async buscarPorPlaca(placa) {
        let sql = "SELECT * FROM veiculos WHERE placa = ? ";
        let valores = [placa];
        let rows = await this.db.ExecutaComando(sql, valores);

        console.log("Resultado da consulta obterPorPlaca:", rows);

        if(rows.length === 0){
            return null;
        }
        
        const veiculo = new veiculoEntity(
            rows[0].id,
            rows[0].placa,
            rows[0].modelo,
            rows[0].cor,
            rows[0].marca,
            rows[0].ativo,
            rows[0].pessoa_id 
        );
        
        return veiculo;

    }

    async reativar(entidade) {
        try {
            let sql = 'update veiculos set ativo = ? where id = ?';
            let valores = [true,entidade.id];
            let result = await this.db.ExecutaComandoNonQuery(sql, valores);
            return result;
            
        } catch (error) {
            console.error("Erro ao desabilitar veiculo:", error);
            throw error; 
        }
        
    }
      

    toMap(row) {
        if (!row) return null;
    
        const veiculo = new veiculoEntity();
        veiculo.id = row["id"];
        veiculo.placa = row["placa"];
        veiculo.modelo = row["modelo"];
        veiculo.cor = row["cor"];
        veiculo.marca = row["marca"];
        veiculo.ativo = row["ativo"];
        veiculo.pessoa_id = row["pessoa_id"];

        console.log("veiculo mapeado tomap:", veiculo); 
    
        return veiculo;
    }
}
