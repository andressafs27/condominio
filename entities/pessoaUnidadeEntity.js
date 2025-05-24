import BaseEntity from "./baseEntity.js";

export default class PessoaUnidadeEntity extends BaseEntity {
    
    #pessoa_id;
    #unidade_id;
    #responsavel;
  
    get pessoa_id() { return this.#pessoa_id; }
    set pessoa_id(value) { this.#pessoa_id = value; }

    get unidade_id() { return this.#unidade_id; }
    set unidade_id(value) { this.#unidade_id = value; }

    get responsavel() { return this.#responsavel; }
    set responsavel(value) { this.#responsavel = value; }

    constructor(pessoa_id, unidade_id, responsavel) {
        super();
        this.#pessoa_id = pessoa_id;
        this.#unidade_id = unidade_id;
        this.#responsavel = responsavel;
    }
    
    toJSON() {
        return {
            pessoa_id: this.#pessoa_id,
            unidade_id: this.#unidade_id,
            responsavel: this.#responsavel
        };
    }
    
    
}
