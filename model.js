let mongoose = require('mongoose');
let uuid = require('uuid/v4');
mongoose.Promise = global.Promise;

let cCollection = mongoose.Schema({
    autor: String,
    titulo: String,
    contenido: String,
    fecha: Date
});

let Comment = mongoose.model('comments', cCollection);

let cController = {
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
    createComment: function(newComment){
        return Comment.create(newComment)
        .then(nc => {
            return nc;
        })
        .catch(error =>{
            throw Error(error);
        });
    },
    delete: function(id){
        return Comment.findByIdAndRemove(id)
        .then(del=>{
            return del;
        })
        .catch(error=>{
            throw Error(error);
        });
    },
    edit: function(id, newComment){
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

module.exports = {cController}