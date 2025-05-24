import BaseEntity from "./baseEntity.js";

export default class PautasEntity extends BaseEntity {
    
    #id;
    #descricao;
    #assembleia_id;
  
    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get descricao() { return this.#descricao; }
    set descricao(value) { this.#descricao = value; }

    get assembleia_id() { return this.#assembleia_id; }     
    set assembleia_id(value) { this.#assembleia_id = value; }

    /* Query Stack */
    #votacao_id;
  
    get votacao_id() { return this.#votacao_id; }
    set votacao_id(value) { this.#votacao_id = value; }

    constructor(id, descricao, assembleia_id) {
        super();
        this.#id = id;
        this.#descricao = descricao;
        this.#assembleia_id = assembleia_id;
    }

    toJSON() {
        return {
            id: this.id,
            descricao: this.descricao,
            assembleia_id: this.assembleia_id,
        };
    }
}
