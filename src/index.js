/**
 * es6 modules and imports
 */
import sayHello from './hello';

sayHello('World');

/**
 * require style imports
 */
const getMovies = require('./api.js');




function showAllMovies() {
    table();
    getMovies().then((movies) => {
        console.log('Here are all the movies:');
        document.getElementById("loading").innerHTML = 'Here are all the movies:'
        console.log()
        movies.forEach(({title, rating}) => {
            addMovieToHtml(title, rating)
        });
    }).catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.');
        console.log(error);
    });
}

showAllMovies();





const header = new Headers({
    'Accept': 'application/json',
    'Content-Type': 'application/json'
});



function addMovieToHtml( title, rating){
    document.getElementById("movie-list").innerHTML +=`<tr><td>${title}</td><td>rating: ${rating}</td></tr>`
}
function table() {
    document.getElementById("movie-list").innerHTML = `<tr><th>Movie Title</th><th>Movie Rating</th></tr>`

}


function movieAdded() {
    document.getElementById("heading").innerHTML = "Movie Added"
}

function addMovie() {
    let movieTitle = document.getElementById("title").value;
    let movieRating = document.getElementById("rating").value;

    if (movieTitle === "") {
        alert("It's Empty")
    } else {
        let movieObj = {
            title: movieTitle,
            rating: movieRating
        };
        let fetchOptions = {
            method: "POST",
            body: JSON.stringify(movieObj),
            headers: header
        };
        document.getElementById("title").value = "";
        document.getElementById("rating").value = "1";
        fetch("/api/movies", fetchOptions)
            .then((response) => console.log(response.json()))
        addMovieToHtml(movieTitle, movieRating)


    }

}



document.getElementById("sub").addEventListener("click", addMovie)
document.getElementById("sub").addEventListener("click", function () {
    movieAdded()
    setInterval(hello, 2000)

})







function unHide(elementId) {

    document.getElementById(elementId).hidden = false;
    document.getElementById(elementId).style.display = "initial";


}


function hide(elementId) {
    document.getElementById(elementId).setAttribute("hidden", "true");
    document.getElementById(elementId).style.display = "none";
}



function enableButton(id) {
    document.getElementById(id).removeAttribute("disabled");

}
function disableButton(buttonId){
    document.getElementById(buttonId).disabled= "true"
}

function deleteAMovie(){
    document.getElementById("heading").innerHTML = "delete a movie"
}


function movieDeleted(){
    document.getElementById("heading").innerHTML = "Movie Deleted"
}






function addMovieToDelete(title, id) {
    document.getElementById("delete-movie").innerHTML +=  `<option value=${id}>${title}</option>`
}



function deleteButtonDialog() {
    hide("edit-button")
    hide("delete-a-movie");
    hide("new-movie-form");
    hide("movie-list-container")
    unHide("delete-form");
    unHide("delete-this-movie");

    getMovies().then((movies) => {
        document.getElementById("delete-movie").innerHTML = "";


        movies.forEach(({title, id}) => {
            addMovieToDelete(title, id)
        });


        enableButton("delete-this-movie")

    }).catch((error) => {

        console.log(error)
    } );
    deleteAMovie()


}

document.getElementById("delete-a-movie").addEventListener("click", deleteButtonDialog);






function deleteButton() {
    let movieToDeleteId = document.getElementById("delete-movie").value;

    let fetchOptions = {
        method: "DELETE",
        headers: header
    };

    fetch(`/api/movies/${movieToDeleteId}`, fetchOptions).then(() => {

        document.getElementById("movie-list").innerHTML = "";
        unHide("movie-list-container");
        hide("delete-form");
        unHide("new-movie-form");
        unHide("delete-a-movie");
        unHide("edit-button");
        disableButton("delete-this-movie")


    })

        .then(() => {showAllMovies()})
}




document.getElementById("delete-this-movie").addEventListener("click", deleteButton);

document.getElementById("delete-this-movie").addEventListener("click", function(){
    movieDeleted()
    setInterval(hello,3000)
    //event listener for delete a movie button

});

function hello(){
    document.getElementById("heading").innerHTML = "Hello Again";


}







function addMovieToEdit(title, id){
    document.getElementById("edit-movie").innerHTML +=`<option value=${id}>${title}</option>`
}



function editButton() {
    hide("delete-a-movie");
    hide("movie-list-container");
    hide("new-movie-form");
    hide("edit-button");
    unHide("edit-form");
    unHide("edit-this-movie");
    enableButton("edit-this-movie");
    getMovies().then((movies) => {
        console.log('Editing movies...');
        document.getElementById("edit-movie").innerHTML = "";
        movies.forEach(({title, id}) => {
            addMovieToEdit(title, id)
        });
    }).then(()=>{enableButton("edit-this-movie")})
        .catch((error) => {
        alert('Oh no! Something went wrong.\nCheck the console for details.');
        console.log(error);
    });
}

document.getElementById("edit-button").addEventListener("click",function () {
    editAMovieMsg()
})

document.getElementById("edit-button").addEventListener("click", editButton);



function editAMovieMsg() {
    document.getElementById("heading").innerHTML = "edit a Movie"
}
function editThisMovieMsg() {
    document.getElementById("heading").innerHTML = "edit this Movie"
}

function movieEditedMsg() {
    document.getElementById("heading").innerHTML = " Movie Edited"
}



function editThisMovie(){
    unHide("edit-another");
    hide("edit-form");
    hide("edit-this-movie");
    unHide("edit-submit-form");
    disableButton("edit-this-movie");
    enableButton("confirm-edit-button")
    let movieToEditId= (document.getElementById("edit-movie").value);
    let movieToEditIndex= movieToEditId -1;
    console.log(movieToEditIndex);
    getMovies(movieToEditId).then((movies)=>{
        console.log(movies);
        let movieToEditTitle = movies.title;
        let movieToEditRating = movies.rating;
        document.getElementById("edit-title").value = movieToEditTitle;
        document.getElementById("edit-rating").value = movieToEditRating

    }).then(()=>enableButton("confirm-edit-button"));

}
document.getElementById("edit-this-movie").addEventListener("click",function () {
    editThisMovieMsg()
})

document.getElementById("edit-this-movie").addEventListener("click", editThisMovie);




function submitEditForm() {
    let editedMovieTitle = document.getElementById("edit-title").value;
    let editedMovieRating = document.getElementById("edit-rating").value;
    let movieToEditId = document.getElementById("edit-movie").value;
    let editedMovieObj = {title:editedMovieTitle,rating:editedMovieRating,id:movieToEditId};
    console.log(editedMovieObj);
    let fetchOptions = {
        method: "PUT",
        body: JSON.stringify(editedMovieObj),
        headers: header
    };
    fetch(`/api/movies/${movieToEditId}`,fetchOptions).then(()=>{
        document.getElementById("movie-list").innerHTML = "";
        unHide("movie-list-container");
        hide("edit-submit-form");
        unHide("new-movie-form");
        unHide("edit-button");
        unHide("delete-a-movie");
        hide("edit-another");
        disableButton("confirm-edit-button")

    }).then(()=>{showAllMovies()});
    setInterval(hello, 2000)

}

document.getElementById("confirm-edit-button").addEventListener("click", submitEditForm);

document.getElementById("confirm-edit-button").addEventListener("click", function () {
    movieEditedMsg()
});








