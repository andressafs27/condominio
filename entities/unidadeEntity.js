import BaseEntity from "./baseEntity.js";

export default class UnidadeEntity extends BaseEntity {
    
    #id;
    #numero;
    #bloco_id;
    #ativo;

    #bloco_numero;
  
    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get numero() { return this.#numero; }
    set numero(value) { this.#numero = value; }

    get bloco_id() { return this.#bloco_id; }
    set bloco_id(value) { this.#bloco_id = value; }

    get ativo() { return this.#ativo; }
    set ativo(value) { this.#ativo = value; }

    get bloco_numero() { return this.#bloco_numero; }
    set bloco_numero(value) { this.#bloco_numero = value; }

    constructor(id, numero,bloco_id,ativo) {
        super();
        this.#id = id;
        this.#numero = numero;
        this.#bloco_id = bloco_id;
        this.#ativo = ativo;
    }

    toJSON() {
        return {
            id: this.id,
            numero: this.numero,
            bloco_id: this.bloco_id,
            ativo: this.ativo,
            bloco_numero: this.bloco_numero
        };
    }
    
}