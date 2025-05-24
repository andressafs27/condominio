import PessoaRepository from "../repositories/pessoaRepository.js";

export default class LoginController {
    constructor() {
        this.pessoaRepository = new PessoaRepository();
    }

    loginView(req, res) {
        const pessoaLogado = req.cookies.pessoaLogado ? JSON.parse(req.cookies.pessoaLogado) : null;

        res.render('login/login', { layout: false, pessoaLogado, msg: null }); 
    }

    // async login(req, res) {
    //     let msg = "";
    //     const { email, senha } = req.body;

    //     console.log("Tentando logar com:", email, senha);

    //     if (email && senha) {
    //         try {
    //             const pessoa = await this.pessoaRepository.obterPorEmailSenha(email, senha);
               
    //             if (pessoa) {
    //                 res.cookie("pessoaLogado", JSON.stringify({ id: pessoa.id, nome: pessoa.nome, email: pessoa.email }), {
    //                     httpOnly: true,
    //                     secure: true,
    //                     maxAge: 24 * 60 * 60 * 1000// Expiração de 1 dia
    //                 });

    //                 return res.redirect("/");
    //             } else {
    //                 msg = "Usuário/Senha incorretos!";
    //                 console.log("Nenhuma pessoa encontrada com esse email/senha");
    //             }
    //         } catch (error) {
    //             msg = "Erro interno ao tentar fazer login!";
    //             console.error(error);
    //         }
    //     } else {
    //         msg = "Usuário/Senha incorretos!";
    //         console.log("Email ou senha não informados");
    //     }

    //     res.render('login/login', { layout: false, pessoaLogado: null, msg  });
    // }

    
    // ************************************************************
    // verifica se é sindico ativo ou se é morador
    async login(req, res) {
        
        let msg = "";
        const { email, senha } = req.body;
    
        console.log("Tentando logar com:");
        console.log("Email:", email);
        console.log("Senha", senha);
    
        if (email && senha) {
            try {
                const pessoa = await this.pessoaRepository.obterPorEmailSenha(email, senha);
    
                console.log("Pessoa encontrada:", pessoa);
                if (pessoa) {
                    

                    res.cookie("pessoaLogado", JSON.stringify({
                        id: pessoa.id,
                        nome: pessoa.nome,
                        email: pessoa.email,
                        adm: pessoa.adm,
                        
                    }), {
                        httpOnly: true,
                        secure: true,
                        maxAge: 24 * 60 * 60 * 1000
                    });
    
                    res.redirect("/home");
                    return;
                   
                } else {
                    msg = "Usuário/Senha incorretos!";
                    console.log("Nenhuma pessoa encontrada com esse email/senha");
                }
            } catch (error) {
                msg = "Erro interno ao tentar fazer login!";
                console.error(error);
            }
        } else {
            msg = "Usuário/Senha incorretos!";
            console.log("Email ou senha não informados");
        }
    
        res.render('login/login', { layout: false, pessoaLogado: null, msg });
    }
    
    logout(req, res) {
        res.clearCookie("pessoaLogado");
        res.redirect("/login");
    }
}