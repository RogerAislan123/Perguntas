const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Perguntas = require("./database/Perguntas");
const Resposta = require("./database/Resposta");

//Database
connection //estrutura promisse
    .authenticate()
    .then(() =>{
        console.log("Conexão feita com o banco de dados!")
    })
    .catch((msgErro) =>{
        console.log(msgErro);
    })


//estou dizendo para o Express que é para usar o EJS como View engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

//BODY PARSER
app.use(bodyParser.urlencoded({extended: false})); //pega os dados do formulario e traduz para uma estrutura JS
app.use(bodyParser.json()); //permite a leitura de dados de formularios via json... só é usado quando estiver usando API

//ROTAS
app.get("/", (req, res) => {
    Perguntas.findAll({raw: true, order:[
        ['id', 'DESC']
    ]}).then(perguntas =>{
        res.render("index", {
            perguntas: perguntas
        });
    });
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
})

app.post("/salvarpergunta",(req, res) => {
    
    var titulo = req.body.titulo;
    var descricao = req.body.descricao;
    
    Perguntas.create({  //aqui ele insere os dados no formulário (mesmo que INSERT INTO "no banco de dados" )
        titulo: titulo,
        descricao: descricao
    }).then(() => { //aqui ele redireciona o usuário após preencher para...
        res.redirect("/"); //... página principal
    });
});

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    Perguntas.findOne({
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined){ //pergunta encontrada

            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order: [
                    ['id', 'DESC']
                ]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                });
            });
        }else{ //pergunta não encontrada
            res.redirect("/");
        }
    });
})
app.post("/responder",(req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;
    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() =>{
        res.redirect("./pergunta/"+perguntaId);
    });
});

app.listen(8080, () => { console.log("App rodando!"); });