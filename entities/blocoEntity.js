import BaseEntity from "./baseEntity.js";

export default class BlocoEntity extends BaseEntity {
    
    #id;
    #numero;
    #ativo;
  
    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get numero() { return this.#numero; }
    set numero(value) { this.#numero = value; }

    get ativo() { return this.#ativo; }
    set ativo(value) { this.#ativo = value; }

    constructor(id, numero,ativo) {
        super();
        this.#id = id;
        this.#numero = numero;
        this.#ativo = ativo;
    }
}
