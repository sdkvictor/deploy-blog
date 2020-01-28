let express = require('express');
let bodyParser = require('body-parser');
let morgan = require('morgan');
let jsonParser = bodyParser.json();
let app = express();
let uuid = require('uuid/v4');
let mongoose = require('mongoose');

let {CommentController} = require('./model');
let {DATABASE_URL, PORT} = require('./config');

app.use(express.static('public'));

app.use(morgan('dev'));

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type,Authorization");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
    if (req.method === "OPTIONS") {
    return res.send(204);
    }
    next();
});

app.listen(8080, function(){
    console.log("App is running");
});

let comentarios = [{
    id: uuid(),
    titulo: "Hola",
    contenido: "me llamo Carlitos",
    autor: "Carlos",
    fecha: new Date()
},
{
    id: uuid(),
    titulo: "Adios",
    contenido: "se la lavan",
    autor: "Moises",
    fecha: new Date()
}];



app.get('/blog-api/comentarios', (req,res) => {
    CommentController.getAll()
    .then(comments=>{
        return status(200).json(comments);
    })
    .catch(error=>{
        console.log(error);
        res.statusMessage = "Database error";
        return res.status(200).send();
    });
});

app.get('/blog-api/comentarios-por-autor', (req,res) => {
    let autor = req.query.autor;
    console.log(req.query.autor);
    if(autor == undefined){
        res.statusMessage = "No se ha proporcionado un autor correctamente";
        return res.status(406).send();
    }

    CommentController.getByAutor(autor)
    .tjrn(aut =>{
        return res.status(200).json(aut);
    })
    .catch(error=> {
        console.log(error);
    })
});

app.post('/blog-api/nuevo-comentario', jsonParser, (req,res) => {
    if(req.body.autor==undefined||req.body.contenido==undefined||req.body.titulo==undefined){
        res.statusMessage = "No se han recibido todos los parametros";
        return res.status(406).send();
    }
    else{
        let comentario = {
            autor : req.body.autor,
            titulo: req.body.titulo,
            contenido: req.body.contenido,
            date: new Date(),
            id: uuid()
        }
        comentarios.push(comentario);
        return res.status(201).json(comentario);
    }
});

app.delete('/blog-api/remover-comentario/:id', (req,res)=>{
    let id = req.params.id;
    let index;
    let result = comentarios.find((elemento)=>{
        if(elemento.id == id){
            index = comentarios.indexOf(elemento);
            return elemento;
        }
    });
    if(result){
        comentarios.splice(index,1);
        return res.status(200).send();
    }
    else{
        res.statusMessage ="No se ha encontrado el comentario";
        return res.status(404).send();
    }  
});

app.put('/blog-api/actualizar-comentario/:id', jsonParser, (req,res)=>{
    let id = req.body.id;
    if(id==undefined){
        res.statusMessage = "ID no proporcionado en el cuerpo";
        return res.status(406).send();
    }  
    if(req.params.id != id){
        res.statusMessage = "IDs no coinciden";
        return res.status(409).send();
    }
    if(req.body.titulo == undefined && req.body.contenido == undefined && req.body.autor == undefined){
        res.statusMessage = "No se han definido datos a actualizar";
        return res.status(406).send();
    }
    let foundId = false;
    comentarios.forEach((elemento)=>{
        if(elemento.id.toString() == id){
            foundId = true;
            if(req.body.autor != undefined){
                elemento.autor = req.body.autor;
            }
            if(req.body.titulo != undefined){
                elemento.titulo = req.body.titulo;
            }
            if(req.body.contenido != undefined){
                elemento.contenido = req.body.contenido;
            }
            let comentario = elemento;
            console.log("se actualizo");
            res.statusMessage = "Se ha actualizado el comentario";
            return res.status(202).json(comentario);
        }
    });
    if(!foundId){
        res.statusMessage = "No se ha encontrado el comentario";
        return res.status(404).send();

    }
    else{
        res.statusMessage = "Se ha actualizado el comentario";
        return res.status(202).json(comentario);
    }
});

let server;

function runServer(port, databaseUrl){
    return new Promise( (resolve, reject ) => {
        mongoose.connect(databaseUrl, response => {
            if ( response ){
                return reject(response);
            }
            else{
                server = app.listen(port, () => {
                console.log( "App is running on port " + port );
                resolve();
            })
                .on( 'error', err => {
                    mongoose.disconnect();
                    return reject(err);
                })
            }
        });
    });
   }
   
   function closeServer(){
        return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log('Closing the server');
                server.close( err => {
                    if (err){
                        return reject(err);
                    }
                    else{
                        resolve();
                    }
                });
            });
        });
   }

runServer(PORT,DATABASE_URL);
module.exports = {app,runServer, closeServer};

