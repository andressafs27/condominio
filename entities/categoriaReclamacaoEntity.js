import BaseEntity from "./baseEntity.js";

export default class categoriaReclamacaoEntity extends BaseEntity {
    
    #id;
    #nome;
    #penalidade;
    #multa;
    #ativo;
  
    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get nome() { return this.#nome; }
    set nome(value) { this.#nome = value; }

    get penalidade() { return this.#penalidade; }
    set penalidade(value) { this.#penalidade = value; }

    get multa() { return this.#multa; }
    set multa(value) { this.#multa = value; }

    get ativo() { return this.#ativo; }
    set ativo(value) { this.#ativo = value; }

    constructor(id, nome, penalidade, multa, ativo) {
        super();
        this.#id = id;
        this.#nome = nome;
        this.#penalidade = penalidade;
        this.#multa = multa;
        this.#ativo = ativo;
    }
}
