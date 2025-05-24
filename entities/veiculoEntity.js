import BaseEntity from "./baseEntity.js";

export default class VeiculoEntity extends BaseEntity {
    
    #id;
    #placa;
    #modelo;
    #cor;
    #marca;
    #ativo;
    #pessoa_id;
    
    #pessoa_nome;
    #pessoa_cpf;    

    get pessoa_nome() { return this.#pessoa_nome; }
    set pessoa_nome(value) { this.#pessoa_nome = value; }
    
    get pessoa_cpf() { return this.#pessoa_cpf; }
    set pessoa_cpf(value) { this.#pessoa_cpf = value; }

    get id() { return this.#id; }
    set id(value) { this.#id = value; }

    get placa() { return this.#placa; }
    set placa(value) { this.#placa = value; }

    get modelo() { return this.#modelo; }
    set modelo(value) { this.#modelo = value; }

    get cor() { return this.#cor; }
    set cor(value) { this.#cor = value; }

    get marca() { return this.#marca; }
    set marca(value) { this.#marca = value; }

    get ativo() { return this.#ativo; } 
    set ativo(value) { this.#ativo = value; }

    get pessoa_id() { return this.#pessoa_id; }
    set pessoa_id(value) { this.#pessoa_id = value; }

    constructor(id, placa, modelo, cor, marca, ativo, pessoa_id) {
        super();
        this.id = id;
        this.placa = placa;
        this.modelo = modelo;
        this.cor = cor;
        this.marca = marca;
        this.ativo = ativo;
        this.pessoa_id = pessoa_id;
    }

    toJSON() {
        return {
            id: this.id,
            placa: this.placa,
            modelo: this.modelo,
            cor: this.cor,
            marca: this.marca,
            ativo: this.ativo,
            pessoa_id: this.pessoa_id
        };
    }
}