import express from 'express';
import expressLayouts from 'express-ejs-layouts';

import pessoaRoute from './routes/pessoaRoutes.js'; 
import homeRoute from './routes/homeRoutes.js';
import loginRoute from './routes/loginRoutes.js';
import servicoRoute from './routes/servicoRoutes.js';
import categoriaRoute from './routes/categoriaReclamacaoRoutes.js';
import blocoRoute from './routes/blocoRoutes.js';
import unidadeRoute from './routes/unidadeRoutes.js';
import veiculosRoute from './routes/veiculosRoutes.js';
import assembleiaRoute from './routes/assembleiaRoutes.js';
import sugestaoRoute from './routes/sugestaoRoutes.js';
import PerguntasRoute from './routes/perguntasRoutes.js';
import PautaRoute from './routes/pautaRoute.js';
import votacaoRoute from './routes/votacaoRoutes.js';
import pesquisaRoute from './routes/pesquisaRoutes.js';
import reclamacaoRoute from './routes/reclamacaoRoutes.js';
import agendaRoute from './routes/agendaRoutes.js';

import authMiddleware from './middlewares/authMiddleware.js';
import cookieParser from "cookie-parser";

const app = express();
const auth = new authMiddleware();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public")); 
app.use(expressLayouts);
app.use(cookieParser());  

app.set("views", "./views");  
app.set("view engine", "ejs");
app.set('layout', 'layout'); 

app.use((req, res, next) => {
    res.locals.pessoaLogado = req.cookies.pessoaLogado ? JSON.parse(req.cookies.pessoaLogado) : null;
    next();
});

app.get("/", (req, res) => {
    if (!req.cookies.pessoaLogado) {
        return res.redirect("/login");
    }
    res.redirect("/home");
});

app.use("/login", loginRoute); 

app.use("/home", auth.verificarpessoaLogado, homeRoute); 
app.use("/pessoa", auth.verificarpessoaLogado, pessoaRoute); 
app.use("/servico", auth.verificarpessoaLogado, servicoRoute);
app.use("/categoria", auth.verificarpessoaLogado, categoriaRoute);
app.use("/bloco", auth.verificarpessoaLogado, blocoRoute);
app.use("/sugestao", auth.verificarpessoaLogado,sugestaoRoute);
app.use("/unidade", auth.verificarpessoaLogado, unidadeRoute);
app.use("/veiculo", auth.verificarpessoaLogado, veiculosRoute);
app.use("/assembleia", auth.verificarpessoaLogado, assembleiaRoute);
app.use("/perguntas", auth.verificarpessoaLogado, PerguntasRoute);
app.use("pauta", auth.verificarpessoaLogado, PautaRoute);
app.use("/votacao", auth.verificarpessoaLogado, votacaoRoute);
app.use("/pesquisa",auth.verificarpessoaLogado, pesquisaRoute);
app.use("/reclamacao",auth.verificarpessoaLogado, reclamacaoRoute);
app.use("/agenda",auth.verificarpessoaLogado, agendaRoute);


app.listen(3000, function () {
    console.log("Servidor web iniciado");
});