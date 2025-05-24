import BaseEntity from "./baseEntity.js";

export default class PerguntasPesquisaEntity extends BaseEntity {
    
    #pergunta_id;
    #pesquisa_id;
  
    get pergunta_id() { return this.#pergunta_id; }
    set pergunta_id(value) { this.#pergunta_id = value; }

    get pesquisa_id() { return this.#pesquisa_id; }
    set pesquisa_id(value) { this.#pesquisa_id = value; }

    constructor(pergunta_id, pesquisa_id) {
        super();
        this.#pergunta_id = pergunta_id;
        this.#pesquisa_id = pesquisa_id;
    }
    
    toJSON() {
        return {
            pergunta_id: this.#pergunta_id,
            pesquisa_id: this.#pesquisa_id,
        };
    }
}
