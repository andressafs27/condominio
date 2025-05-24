import BaseEntity from "./baseEntity.js";

export default class ServicoEntity extends BaseEntity {
    
    #id;
    #descricao;
    #ativo;
  
    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get descricao() { return this.#descricao; }
    set descricao(value) { this.#descricao = value; }

    get ativo() { return this.#ativo; }     
    set ativo(value) { this.#ativo = value; }

    constructor(id, descricao, ativo) {
        super();
        this.#id = id;
        this.#descricao = descricao;
        this.#ativo = ativo;
    }
}
