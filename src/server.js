const express = require("express")
const server = express()

//pegar o banco de dados
const db = require("./database/db")

//configurar pasta public
server.use(express.static("public"))

//habilitar uso do req.body
server.use(express.urlencoded({ extended: true }))

//utiliando template engine (nunjucks)
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCash: true //evita que o nunjucks me retorne uma informação velha
})
//configurar caminhos da aplicaçao
//página inicial - req: requisição/ res: resposta
server.get("/", (req, res) => { //usando () na função pq tem mais de um elemento
        return res.render("index.html", { title: "Um título"}) //dirname é o diretório do caminho até minha pasta src
})

server.get("/create-point", (req, res) => {
    return res.render("create-point.html") //tiramos o __dirname pq ja direcionei a pasta pelu nunjucks
})

server.post("/savepoint", (req, res) => {
    //req.body: corpo do formulário
    // console.log(req.body)
    //Inserir dados no database

        const query = `
        INSERT INTO places (
            image, 
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items
    ]

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            return res.send("Erro no cadastro") //reação a possíveis erros
        }
        console.log("Cadastrado com sucesso")
        console.log(this)

        return res.render("create-point.html", { saved: true })
    }

     db.run(query, values, afterInsertData) //é o que insere os dados
    
})

server.get("/search", (req, res) => {

    const search = req.query.search
    
    if(search == "") {
        //pesquisa vazia
        return res.render("search-results.html", {total: 0})
    }

    //pegar os daddos do banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function(err, rows) {
        if(err) {
            return console.log(err)
        }

        const total = rows.length //conta quantos elementos tem na minha lista
        
        //mostrar a pagina html com os dados do banco
        return res.render("search-results.html", {places: rows, total: total})
    })
    
})
//ligar o servidor
server.listen(3000) //"ouvir" a porta 3000 quando executar o arquivo
