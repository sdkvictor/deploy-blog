let mongoose = require('mongoose');
let uuid = require('uuid/v4');
mongoose.Promise = global.Promise;

let commentCollection = mongoose.Schema({
    
    titulo: String,
    contenido: String,
    autor: String,
    fecha: Date
});

let Comment = mongoose.model('comment', commentCollection);

let CommentController = {
    getAll: function(){
        return Comment.find()
        .then(comments => {
            return comments;
        })
        .catch (error=> {
            throw Error(error);
        });
    },
    getByAutor: function(){
        return 
    },
    create: function(){
        return Comment.create(newAutor)
        .then(nc => {
            throw new Error(error);
        })
        .catch(nc =>{

        })
    }
}

module.exports = {CommentController}