const searchButton = document.getElementById("search-button"); // opcional
//nomeclatura: $searchButton ou searchButtonElement
const overlay = document.getElementById("modal-overlay");
const movieName = document.getElementById("movie-name");
const movieYear = document.getElementById("movie-year");
const movieListContainer = document.getElementById("movie-list");


// let movieList = [];

let movieList = JSON.parse(localStorage.getItem("movieList")) ?? [];
async function searchButtonClickHandler() {
try{    let url = `https://www.omdbapi.com/?apikey=${'1c0c6d6b'}&t=${movieNameParameterGenerator()}${movieYearParameterGenerator()}`;
const response = await fetch(`https://www.omdbapi.com/?apikey=${'1c0c6d6b'}&t=${movieNameParameterGenerator()}${movieYearParameterGenerator()}`);
const data = await response.json();
console.log("data: ", data);
if(data.Error){
    throw new Error("Filme não encontrado");
}
createModal(data);
overlay.classList.add("open");
}catch(error){
    notie.alert({ type: 'error', text: error.message });
}
}

function isMovieAlreadyInList(id){
    function doesThisIdBelongToThisMovie(movieObject){
        return movieObject.imdbID === id;
    }
    return Boolean(movieList.find(doesThisIdBelongToThisMovie)); 
}



function movieNameParameterGenerator(){
    if(movieName.value === ""){
        throw new Error("O nome do filme deve ser informado");
    }
    return movieName.value.split(" ").join("+");
}

function movieYearParameterGenerator(){
    if(movieYear.value === ""){
        return "";
    }
    if (movieYear.value.length !== 4 || isNaN(Number(movieYear.value))){
        throw new Error("O ano deve conter 4 dígitos numéricos");

    }
    return `&y=${movieYear.value}`;

}
function addToMovieList(movieObject){
    movieList.push(movieObject);
}

function updateUI(movieObject){

    movieListContainer.innerHTML += ` <article id="movie-card-${movieObject.imdbID}">
        <img src="${movieObject.Poster}" alt="Poster do filme ${movieObject.Title}"/>
        <button class="remove-button" onclick="removeMovieFromList('${movieObject.imdbID}')"><i class="bi bi-trash"></i>Remover</button>
    </article>`;

}







function removeMovieFromList(id){
    notie.confirm({
        text: 'Tem certeza que deseja remover o filme da lista?',
        submitText: 'Sim',
        cancelText: 'Não',
        position: 'top',
        submitCallback: function removeMovie() {
    movieList = movieList.filter((movie) => movie.imdbID !== id);
    document.getElementById(`movie-card-${id}`).remove();
    updateLocalStorage();
        },
    });
}
   
    // movieList = movieList.filter((movie) => movie.imdbID !== id);
    // document.getElementById(`movie-card-${id}`).remove();
    // updateLocalStorage();
 

function updateLocalStorage(){
    localStorage.setItem("movieList", JSON.stringify(movieList));
}

for (const movieInfo of movieList){
    updateUI(movieInfo);
}




searchButton.addEventListener("click", searchButtonClickHandler);
