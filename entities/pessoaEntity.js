import BaseEntity from "./baseEntity.js";

export default class PessoaEntity extends BaseEntity {
    
    #id;
    #nome;
    #cpf;
    #telefone;
    #email;
    #data_nascimento;
    #rg;
    #sindico;
    #senha;
    #ativo;
    #adm;

    #unidades;
    #responsavel;

    #bloco_numero;
    #unidade_numero;
  
    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get nome() { return this.#nome; }
    set nome(value) { this.#nome = value; }

    get cpf() { return this.#cpf; }
    set cpf(value) { this.#cpf = value; }

    get telefone() { return this.#telefone; }
    set telefone(value) { this.#telefone = value; }

    get email() { return this.#email; }
    set email(value) { this.#email = value; }

    get data_nascimento() { return this.#data_nascimento; }
    set data_nascimento(value) { this.#data_nascimento = value; }

    get rg() { return this.#rg; }
    set rg(value) { this.#rg = value; }

    get sindico() { return this.#sindico; }
    set sindico(value) { this.#sindico = value; }

    get senha() { return this.#senha; }
    set senha(value) { this.#senha = value; }

    get ativo() { return this.#ativo;}
    set ativo(value) {this.#ativo = value;}

    get adm() { return this.#adm;}
    set adm(value) {this.#adm = value;}

    get unidades() { return this.#unidades;}
    set unidades(value) {this.#unidades = value;}

    get responsavel() { return this.#responsavel;}
    set responsavel(value) {this.#responsavel = value;}

    get bloco_numero() { return this.#bloco_numero; }
    set bloco_numero(value) { this.#bloco_numero = value; }

    get unidade_numero() { return this.#unidade_numero; }
    set unidade_numero(value) { this.#unidade_numero = value; }

    constructor(id, nome, cpf, telefone, email, data_nascimento, rg, sindico, senha, ativo, adm, responsavel) {
        super();
        this.#id = id;
        this.#nome = nome;
        this.#cpf = cpf;
        this.#telefone = telefone;
        this.#email = email;
        this.#data_nascimento = data_nascimento; 
        this.#rg = rg; 
        this.#sindico = sindico; 
        this.#senha = senha;
        this.#ativo = ativo;
        this.#adm = adm;

        this.#responsavel = responsavel; 
    }
    
    toJSON() {
        return {
            id: this.#id,
            nome: this.#nome,
            cpf: this.#cpf,
            telefone: this.#telefone,
            email: this.#email,
            data_nascimento: this.#data_nascimento,
            rg: this.#rg,
            sindico: this.#sindico,
            senha: this.#senha,
            ativo: this.#ativo,
            adm: this.#adm,
            responsavel: this.#responsavel,
            bloco_numero: this.#bloco_numero,
            unidade_numero: this.#unidade_numero
        };
    }
}
