import express from 'express';
import HomeController from '../controllers/homeController.js';

const router = express.Router();
const ctrl = new HomeController();

// router.get("/", (req, res) => {
//     if(!req.cookies.pessoaLogado){
//         res.redirect('/login');
//     }
//     //#swagger.tags = ['Home'] 
//     //#swagger.summary = 'Endpoint para acessar a página inicial'
//     ctrl.index(req, res);
// });

router.get("/", (req, res) => {
    const pessoaLogado = JSON.parse(req.cookies.pessoaLogado);
    console.log("Pessoa logada na home:", pessoaLogado);

    if(pessoaLogado.adm){
        ctrl.index(req,res);
    }else if(pessoaLogado.sindico){
        ctrl.homeSindico(req, res);
    }else{
        ctrl.homeMorador(req, res);  
    }
});

router.get('/pessoa/cadastrar', (req,res) => {
    ctrl.cadastrarPessoa(req,res);
});

router.get('/pessoa/listar', (req,res) => {
    ctrl.listarPessoas(req,res);
});

router.get('/pessoa/alterar', (req,res) => {
    ctrl.alterarPessoas(req,res);
});

router.get('/pessoa/excluir', (req,res) => {
    ctrl.excluirPessoas(req,res);
});


export default router;


