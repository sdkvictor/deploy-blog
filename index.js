let express = require('express');
let morgan = require('morgan')
let bodyParser = require('body-parser');
let jsonParser = bodyParser.json();
let app = express();
let uuid = require('uuid/v4');
let mongoose = require('mongoose');

let {cController} = require('./model');
let {DATABASE_URL, PORT} = require('./config');

app.use(express.static('public'));

app.use(morgan('dev'));

app.get('/blog-api/comentarios', jsonParser, (req, res) => {
    cController.getAll()
        .then(comments => {
            return res.status(200).json(comments);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = "Database error";
            return res.status(500).send();
        });
});

app.get('/blog-api/comentarios-por-autor', jsonParser, (req, res) => {
    let autor = req.query.autor;
    console.log(req.query.autor);
    if (autor == undefined) {
        res.statusMessage = "No se ha proporcionado un autor correctamente";
        return res.status(406).send();
    }

    cController.getByAutor(autor)
        .then(a => {
            return res.status(200).json(a);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = "Database error";
            return res.status(500).send();
        });
});

app.post('/blog-api/nuevo-comentario', jsonParser, (req, res) => {
    let titulo, contenido, autor;

    
    if(req.body.autor==undefined||req.body.contenido==undefined||req.body.titulo==undefined){
        res.statusMessage = "No se han recibido todos los parametros";
        return res.status(406).send();
    }
    
    titulo = req.body.titulo;
    contenido = req.body.contenido;
    autor = req.body.autor;

    let nuevoComentario = {
        titulo: titulo,
        autor: autor,
        contenido: contenido,
        fecha: new Date()
    };

    cController.createComment(nuevoComentario)
        .then(nc => {
            return res.status(201).json(nc);
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = "Database error";
            return res.status(500).send();
        });
});

app.delete('/blog-api/remover-comentario/:id', jsonParser, (req, res) => {
    let id = req.params.id;

    cController.getById(id)
        .then(com => {
            cController.delete(id)
                .then(delc => {
                    return res.status(200).send();
                })
                .catch(error => {
                    console.log(error);
                    res.statusMessage = "Database error";
                    return res.status(500).send();
                });
        })
        .catch(error => {
            console.log(error);
            res.statusMessage ="No se ha encontrado el comentario";
            return res.status(404).send();
        });

    
});

app.put('/blog-api/actualizar-comentario/:id', jsonParser, (req, res) => {
    if (req.params.id != req.body.id) {
        res.statusMessage = "IDs no coinciden";
        return res.status(406).send();
    }

    let id = req.params.id;
    console.log(req.params.id);

    let titulo, contenido, autor;

    titulo = req.body.titulo;
    contenido = req.body.contenido;
    autor = req.body.autor;

    if (titulo == undefined && contenido == undefined && autor == undefined) {
        res.statusMessage = "No se han definido datos a actualizar";
        return res.status(409).send();
    }

    let nuevoComentario = {

    };

    if (titulo != undefined) {
        nuevoComentario.titulo = titulo;
    }
    if (autor != undefined) {
        nuevoComentario.autor = autor;
    }
    if (contenido != undefined) {
        nuevoComentario.contenido = contenido;
    }

    cController.getById(id)
        .then(com => {
            cController.edit(id, nuevoComentario)
                .then(comment => {
                    res.statusMessage = "Se ha actualizado el comentario";
                    return res.status(202).json(comment);
                })
                .catch(error => {
                    console.log(error);
                    res.statusMessage = "Database error";
                    return res.status(500).send();
                });
        })
        .catch(error => {
            console.log(error);
            res.statusMessage = "No se ha encontrado el ID";
            return res.status(404).send();
        });
});

let server;

function runServer(port, databaseUrl) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, { useNewUrlParser: true, useUnifiedTopology: true }, response => {
            if (response) {
                return reject(response);
            }
            else {
                server = app.listen(port, () => {
                    console.log("App is running on port " + port);
                    resolve();
                })
                    .on('error', err => {
                        mongoose.disconnect();
                        return reject(err);
                    })
            }
        });
    });
}

function closeServer() {
    return mongoose.disconnect()
        .then(() => {
            return new Promise((resolve, reject) => {
                console.log('Closing the server');
                server.close(err => {
                    if (err) {
                        return reject(err);
                    }
                    else {
                        resolve();
                    }
                });
            });
        });
}

runServer(PORT, DATABASE_URL);

module.exports = {app, runServer, closeServer};