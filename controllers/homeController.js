import PessoaController from "./pessoaController.js";

class HomeController {

    index(req, res) {
        const pessoaLogado = req.cookies.pessoaLogado ? JSON.parse(req.cookies.pessoaLogado) : null;
            res.render('home/home', {pessoaLogado});
    }
    
    homeMorador(req, res) {
        const pessoaLogado = req.cookies.pessoaLogado ? JSON.parse(req.cookies.pessoaLogado) : null;
        console.log("req.cookies.pessoaLogado: ", req.cookies.pessoaLogado); 
        return res.render("morador/homeMorador", {
            layout: "layoutMorador",
            pessoaLogado
        });
        
    }


    cadastrarPessoa(req, res) {
        res.render('pessoa/cadastrar');
    }

    async listarPessoas(req, res) {
        let lista = await PessoaController.listar(); 
        res.render('pessoa/listar', { lista: lista });
    }

    async alterarPessoas(req, res) {
        let pessoa = await PessoaController.alterar(); 
        res.render('pessoa/alterar', {pessoa: pessoa});
    }

    async excluirPessoas(req, res) {
        let pessoa = await PessoaController.excluir(); 
        res.render('pessoa/excluir', {pessoa: pessoa});
    }
}

export default HomeController;


    


