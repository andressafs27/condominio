import BaseEntity from "./baseEntity.js";

export default class PesquisaEntity extends BaseEntity {
    
    #id;
    #titulo;
    #data;
    #status;
    #data_fim;
    
    #perguntas_respondidas;
    #qtde_perguntas

    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get titulo() { return this.#titulo; }
    set titulo(value) { this.#titulo = value; }

    get data() { return this.#data; }
    set data(value) { this.#data = value; }

    get status() { return this.#status; }
    set status(value) { this.#status = value; }

    get perguntas_respondidas() { return this.#perguntas_respondidas; }
    set perguntas_respondidas(value) { this.#perguntas_respondidas = value; }

    get qtde_perguntas() { return this.#qtde_perguntas; }
    set qtde_perguntas(value) { this.#qtde_perguntas = value; }

    get data_fim() { return this.#data_fim; }
    set data_fim(value) { this.#data_fim = value; }

    constructor(id,titulo, data, status, data_fim) {
        super();
        this.#id = id;
        this.#titulo = titulo;
        this.#data = data;
        this.#status = status;
        this.#data_fim = data_fim;
    }
}
