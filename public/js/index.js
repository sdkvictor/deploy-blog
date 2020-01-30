

function fetchShowComments(){
    let url = "/blog-api/comentarios";

    $.ajax({
        url: url,
        method: "GET",
        dataType: "json",
        success:function(responseJSON){
            console.log(responseJSON);
            showComments(responseJSON);
        },
        error: function(error){
            console.log(error);
        }
    });
}

function showComments(responseJSON){
    $('#listaComentarios').empty();
    responseJSON.forEach (elemento => {
        $('#listaComentarios').append(
            `
            <li>
            <h2>${elemento.titulo}</h2>
            <h3> by ${elemento.autor}</h3>
            <p>${elemento.contenido}</p>
            <p> ${elemento.fecha} </p>
            <p> <button type="button" value="${elemento._id}" class="editButton">Edit</button> <button type="button" value="${elemento._id}" class="deleteButton">Delete</button> </p>
            </li>
            `
        );
    });
}

function addComment(comentario){
    let url = "/blog-api/nuevo-comentario";

    $.ajax({
        url: url,
        method: "POST",
        data: JSON.stringify(comentario),
        contentType: 'application/json; charset=utf-8',
        dataType: "json",
        success:function(responseJSON){
            console.log("mandado");
            fetchShowComments();
        },
        error: function(error){
            if (error.status == 406) {
                alert("Error 406: No se han recibido todos los parametros");
            } 
            console.log(error);
        }
    });
}

function editComment(comentario,commentId){
    let url = "/blog-api/actualizar-comentario/" + commentId;

    $.ajax({
        url: url,
        method: "PUT",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(comentario),
        dataType: "json",
        success:function(responseJSON){
            console.log(responseJSON);
            fetchShowComments();
        },
        error: function(error){
            console.log("failed put");
            if(error.status==404){
                alert("Error 404: No se ha encontrado el comentario");
            }
            else if(error.status==406){
                alert("Error 406: No se han definido datos a actualizar");
            }
            else if(error.status==409){
                alert("IDs no coinciden");
            }
            console.log(error);
        }
    });
}

function deleteComment(commentId){
    let url = "/blog-api/remover-comentario/" + commentId;

    $.ajax({
        url: url,
        method: "DELETE",
        contentType: "application/json",
        dataType: "json",
        success:function(responseJSON){
            console.log(responseJSON);
            fetchShowComments();
        },
        error: function(error){
            if (error.status == 404) {
                alert("Error 404: No se ha encontrado el comentario");
            }
            console.log(error);
            fetchShowComments();
        }
    });
}

function showByAutor(autor){
    let url = `/blog-api/comentarios-por-autor?autor=${autor}`;
    $.ajax({
        url: url,
        method: "GET",
        data: JSON.stringify(autor),
        contentType: "application/json",
        dataType: "json",
        success:function(responseJSON){
            showComments(responseJSON);
        },
        error: function(error){
            if(error.status==404){
                alert("Error 404: El autor no tiene comentarios");
            }
            console.log(error);
        }
    });
}

function watchForm(){
    let form = document.getElementById("commentsForm");

    form.addEventListener("submit", (event)=>{
        console.log("submit");
        event.preventDefault();
        let author = document.getElementById("autorBox").value;
        let title = document.getElementById("tituloBox").value;
        let content = document.getElementById("contenidoBox").value;
        let comentario = {
            autor: author,
            titulo : title,
            contenido: content
        }
        addComment(comentario);
        document.getElementById("autorBox").value = "";
        document.getElementById("tituloBox").value = "";
        document.getElementById("contenidoBox").value = "";
    });
}

function watchEdit(){
    $('#listaComentarios').on('click', '.editButton', function(event){
        console.log($(this).parent().parent());
        let id = $(this).val();
        $(this).parent().append(
            `
            <h3> Editar comentario <h3>

            <form class="editForm">
                <div>
                    <p>
                    <label for="autor"></label>
                       Autor:
                    <input type="text" name="autor" id="editAutor"></input>
                    </p>
                    <p>
                    <label for="titulo"></label>
                      Titulo:
                    <input type="textarea" name="titulo" id="editTitulo" rows="4" cols="50"></input>
                    </p>
                    <label for="contenido"></label>
                        <p>Comentario:</p>
                    <textarea name="contenido" id="editContenido" rows="4" cols="30"></textarea>
                </div>
                <p>
                <div>
                    <input type="submit" id="editCommentBtn" name="AddComment"></input> 
                </div>
                </p>
            </form>
            `

        );
    });

    $('#listaComentarios').on('submit', '.editForm', function(event) {
        event.preventDefault();
        let title = $('#editTitulo').val();
        let author = $('#editAutor').val();
        let content = $('#editContenido').val();
        console.log(author);
        console.log(title);
        console.log(content);

        if (title == "" && author == "" && content == "") {
            fetchShowComments();
            return;
        }
        else{
            let comentario = {
                
            };
            if (author != "") {
                comentario.autor = author;
            }
            if (title != "") {
                comentario.titulo = title;
            }
            if (content != "") {
                comentario.contenido = content;
            }


            comentario.id = $(this).parent().parent().find('.editButton').val();

            console.log($(this).parent().parent().find('.editButton').val());
            
            editComment(comentario, comentario.id);
        }
    });
}

function watchDelete(){
    $('#listaComentarios').on('click', '.deleteButton', function(event){
        console.log($(this).parent().parent());
        let id = $('.deleteButton').val();
        console.log(id);
        deleteComment(id);
    });
}

function watchAuthorFilter(){
    $('#searchByAutor').on('submit', function(event) {
        event.preventDefault();
        let autor = $('#filtroAutor').val();
        console.log("filtering");
        if (autor != "") {
            showByAutor(autor);
        }
    });
}

init();

function init(){
    fetchShowComments();
    watchForm();
    watchEdit();
    watchDelete();
    watchAuthorFilter();
}