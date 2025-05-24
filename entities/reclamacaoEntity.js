import BaseEntity from "./baseEntity.js";

export default class ReclamacaoEntity extends BaseEntity {
    
    #id;
    #descricao;
    #data;
    #status;
    #pessoa_id;
    #categoria_id;

    #pessoa_nome;
    #categoria_nome
  
    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get descricao() { return this.#descricao; }
    set descricao(value) { this.#descricao = value; }

    get data() { return this.#data; }
    set data(value) { this.#data = value; }

    get status() { return this.#status; }
    set status(value) { this.#status = value; }

    get pessoa_id() { return this.#pessoa_id; }
    set pessoa_id(value) { this.#pessoa_id = value; }

    get categoria_id() { return this.#categoria_id; }
    set categoria_id(value) { this.#categoria_id = value; }

    get pessoa_nome() { return this.#pessoa_nome; }
    set pessoa_nome(value) { this.#pessoa_nome = value; }

    get categoria_nome() { return this.#categoria_nome; }
    set categoria_nome(value) { this.#categoria_nome = value; }

    constructor(id, descricao, data, status, pessoa_id, categoria_id) {
        super();
        this.#id = id;
        this.#descricao = descricao;
        this.#data = data;
        this.#status = status;
        this.#pessoa_id = pessoa_id;
        this.#categoria_id = categoria_id;
    }

    
    toJSON() {
        return {
            id: this.id,
            descricao: this.descricao,
            data: this.data,
            status: this.status,
            pessoa_id: this.#pessoa_id,
            categoria_id: this.categoria_id,
            pessoa_nome: this.#pessoa_nome,
            categoria_nome: this.categoria_nome,
        };
    }
}
