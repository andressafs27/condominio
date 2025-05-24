import BaseEntity from "./baseEntity.js";

export default class SugestãoEntity extends BaseEntity {
    
    #id;
    #descricao;
    #data;
    #pessoa_id;
    
    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get descricao() { return this.#descricao; }
    set descricao(value) { this.#descricao = value; }

    get data() { return this.#data; }
    set data(value) { this.#data = value; }

    get pessoa_id() { return this.#pessoa_id; }
    set pessoa_id(value) { this.#pessoa_id = value; }

    constructor(id, descricao, data, pessoa_id) {
        super();
        this.id = id;
        this.descricao = descricao;
        this.data = data;
        this.pessoa_id = pessoa_id;
    }

    toJSON() {
        return {
            id: this.id,
            descricao: this.descricao,
            data: this.data,
            pessoa_id: this.pessoa_id
        };
    }
}