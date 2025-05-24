import pessoaRepository from "../repositories/pessoaRepository.js";
import pessoaEntity from "../entities/pessoaEntity.js";
import BaseRepository from "../repositories/baseRepository.js";

export default class AuthMiddleware extends BaseRepository {
    constructor() {
        super();
        this.pessoaRepository = new pessoaRepository();
    }

    // Alteração: Usar arrow function para preservar o contexto de 'this'
    verificarpessoaLogado = async (req, res, next) => {

        if (req.cookies && req.cookies.pessoaLogado) {
            try {
                let pessoaCookie = JSON.parse(req.cookies.pessoaLogado);
                let pessoaId = pessoaCookie.id;
                let pessoaData = await this.pessoaRepository.obter(pessoaId);
                if (pessoaData) {
                    res.locals.pessoaLogado = { id: pessoaData.Id, nome: pessoaData.Nome, email: pessoaData.Email };
                    return next();
                }
            } catch (error) {
                console.error("Erro ao verificar usuário logado:", error);
            }
        }
        
        return res.redirect("/login");
    };
}
