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
    getByAutor: function(autor){
        return Comment.find({autor:autor})
        .then(comments=>{
            return comments;
        })
        .catch(error=>{
            throw Error(error);
        });
    },
    create: function(newComment){
        return Comment.create(newComment)
        .then(comment => {
            return comment;
        })
        .catch(error =>{
            throw Error(error);
        });
    },
    delete: function(id){
        return Comment.findByIdAndRemove(id)
        .then(comment=>{
            return comment;
        })
        .catch(error=>{
            throw Error(error);
        });
    },
    update: function(newComment){
        return Comment.findByIdAndUpdate(id,newComment)
        .then(comment=>{
            return comment;
        })
        .catch(error=>{
            throw Error(error);
        });
    },
    getById: function(id){
        return Comment.findById(id)
        .then(comment=>{
            return comment;
        })
        .catch(error=>{
            throw Error(error);
        });
    }
}

module.exports = {CommentController}