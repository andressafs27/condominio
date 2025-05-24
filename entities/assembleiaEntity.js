import BaseEntity from "./baseEntity.js";

export default class AssembleiaEntity extends BaseEntity {
    
    #id;
    #data;
    #horario;

    #pautas;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get data() { return this.#data; }
    set data(value) { this.#data = value; }

    get horario() { return this.#horario; }
    set horario(value) { this.#horario = value; }

    get pautas() { return this.#pautas; }
    set pautas(value) { this.#pautas = value; }

    constructor(id, data,horario) {
        super();
        this.#id = id;
        this.#data = data;
        this.#horario = horario;
    }
}
