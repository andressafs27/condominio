import BaseEntity from "./baseEntity.js";

export default class RespostaPesquisaEntity extends BaseEntity {
    
    #id;
    #pessoa_id;
    #pergunta_id;
    #pesquisa_id;
    #alternativas_id;
    
    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get pessoa_id() { return this.#pessoa_id; }
    set pessoa_id(value) { this.#pessoa_id = value; }

    get pergunta_id() { return this.#pergunta_id; }
    set pergunta_id(value) { this.#pergunta_id = value; }

    get pesquisa_id() { return this.#pesquisa_id; }
    set pesquisa_id(value) { this.#pesquisa_id = value; }

    get alternativas_id() { return this.#alternativas_id; }
    set alternativas_id(value) { this.#alternativas_id = value; }

    constructor(id, pessoa_id, pergunta_id,pesquisa_id, alternativas_id) {
        super();
        this.#id = id;
        this.#pessoa_id = pessoa_id;
        this.#pergunta_id = pergunta_id;
        this.#pesquisa_id = pesquisa_id;
        this.#alternativas_id = alternativas_id;
    }
}
