import BaseEntity from "./baseEntity.js";

export default class AlternativasEntity extends BaseEntity {
    
    #id;
    #enunciado;
    #pergunta_id;
  
    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get enunciado() { return this.#enunciado; }
    set enunciado(value) { this.#enunciado = value; }

    get pergunta_id() { return this.#pergunta_id; }     
    set pergunta_id(value) { this.#pergunta_id = value; }

    constructor(id, enunciado, pergunta_id) {
        super();
        this.#id = id;
        this.#enunciado = enunciado;
        this.#pergunta_id = pergunta_id;
    }

    toJSON() {
        return {
            id: this.id,
            enunciado: this.enunciado,
            pergunta_id: this.pergunta_id,
        };
    }
}
