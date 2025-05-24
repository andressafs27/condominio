import BaseEntity from "./baseEntity.js";

export default class PerguntasEntity extends BaseEntity {
    
    #id;
    #enunciado;
    #status;

    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get enunciado() { return this.#enunciado; }
    set enunciado(value) { this.#enunciado = value; }

    get status() { return this.#status; }
    set status(value) { this.#status = value; }

    /* Query Stack */
    #selecionada
    get selecionada() { return this.#selecionada; }
    set selecionada(value) { this.#selecionada = value; }

    constructor(id, enunciado,status) {
        super();
        this.#id = id;
        this.#enunciado = enunciado;
        this.#status = status;
    }

    toJSON() {
        return {
          id: this.#id,
          enunciado: this.#enunciado,
          status: this.#status
        };
      }
      
}
