import BaseEntity from "./baseEntity.js";

export default class VotacaoEntity extends BaseEntity {
    
    #id;
    #voto;
    #pauta_id;
    #pessoa_id;
    #data_inicio;
    #data_fim;
    #status;
    
    #pauta_descricao;
    
    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get voto() { return this.#voto; }
    set voto(value) { this.#voto = value; }

    get pessoa_id() { return this.#pessoa_id; }
    set pessoa_id(value) { this.#pessoa_id = value; }

    get pauta_id() { return this.#pauta_id; }
    set pauta_id(value) { this.#pauta_id = value; }

    get pauta_descricao() { return this.#pauta_descricao; }
    set pauta_descricao(value) { this.#pauta_descricao = value; }

    get data_inicio() { return this.#data_inicio; }
    set data_inicio(value) { this.#data_inicio = value; }

    get data_fim() { return this.#data_fim; }
    set data_fim(value) { this.#data_fim = value; }

    get status() { return this.#status; }
    set status(value) { this.#status = value; }

    constructor(id, voto = null, pessoa_id = null, pauta_id, data_inicio = null, data_fim = null, status = null) {
        super();
        this.#id = id;
        this.#voto = voto;
        this.#pessoa_id = pessoa_id;
        this.#pauta_id = pauta_id;
        this.#data_inicio = data_inicio;
        this.#data_fim = data_fim;
        this.#status = status;
    }

    toJSON() {
        return {
            id: this.id,
            voto: this.voto,
            pessoa_id: this.pessoa_id,
            pauta_id: this.pauta_id,
            pauta_descricao: this.pauta_descricao,
            data_inicio: this.data_inicio,
            data_fim: this.data_fim,
            status: this.status
        };
    }
}