import mysql from 'mysql2';
import pool from './connection.js';


export default class Database {

    #conexao;

    get conexao() { return this.#conexao;} set conexao(conexao) { this.#conexao = conexao; }

    constructor() {

        //localhost
        // this.#conexao = mysql.createPool({
        //     host: 'localhost', 
        //     database: 'condominio', 
        //     user: 'root', 
        //     password: '',
        // });

        /* ------------------ HEROKU ------------------*/
        //  this.#conexao = mysql.createPool({
        
        //     host: 'mna97msstjnkkp7h.cbetxkdyhwsb.us-east-1.rds.amazonaws.com', 
        //     database: 'go7ffgi5q7wv6e2w', 
        //     user: 'ynbmkshqdbn8vdlb', 
        //     password: 'htka2yqm9yyaz095',
        // });

        this.#conexao = pool;
    }

    AbreTransacao() {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query("START TRANSACTION", function (error, results, fields) {
                if (error) 
                    rej(error);
                else
                    res(results);
            });
        })
    }
     
    Rollback() {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query("ROLLBACK", function (error, results, fields) {
                if (error) 
                    rej(error);
                else
                    res(results);
            });
        })
    }
     
    Commit() {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query("COMMIT", function (error, results, fields) {
                if (error) 
                    rej(error);
                else
                    res(results);
            });
        })
    }

    ExecutaComando(sql, valores) {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query(sql, valores, function (error, results, fields) {


                if (error) 
                    rej(error);
                else 
                    res(results); 
            });
        })
    }
    
    ExecutaComandoNonQuery(sql, valores) {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query(sql, valores, function (error, results, fields) {
                

                if (error) 
                    rej(error);
                else 
                    res(results.affectedRows > 0);
            });
        })
    }

    ExecutaComandoLastInserted(sql, valores) {
        var cnn = this.#conexao;
        return new Promise(function(res, rej) {
            cnn.query(sql, valores, function (error, results, fields) {
                if (error) 
                    rej(error);
                else 
                    res(results.insertId);
            });
        })
    }
}