import BaseEntity from "./baseEntity.js";

export default class AgendaEntity extends BaseEntity {
    
    #id;
    #data;
    #data_final;
    #descricao;
    #bloco_id;
    #servico_id;

    #servico_descricao;
    #bloco_numero;

    get servico_descricao() { return this.#servico_descricao; }
    set servico_descricao(value) { this.#servico_descricao = value; }

    get bloco_numero() { return this.#bloco_numero; }
    set bloco_numero(value) { this.#bloco_numero = value; }

    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get data() { return this.#data; }
    set data(value) { this.#data = value; }

    get data_final() { return this.#data_final; }
    set data_final(value) { this.#data_final = value; }

    get descricao() { return this.#descricao; }
    set descricao(value) { this.#descricao = value; }

    get bloco_id() { return this.#bloco_id; }
    set bloco_id(value) { this.#bloco_id = value; }

    get servico_id() { return this.#servico_id; }
    set servico_id(value) { this.#servico_id = value; }

    constructor(id, data, data_final,descricao, bloco_id, servico_id) {
        super();
        this.#id = id;
        this.#data = data;
        this.#data_final = data_final;
        this.#descricao = descricao;
        this.#bloco_id = bloco_id;
        this.#servico_id = servico_id;
    }
}
