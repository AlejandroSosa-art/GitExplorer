//función principal para buscar repositorios
async function buscar() {

    //obtiene el texto escrito en el input de búsqueda
    let query = document.getElementById("search").value.trim();

    //obtiene el lenguaje seleccionado en el select
    let language = document.getElementById("language").value;

    //obtiene el número de estrellas ingresado
    let stars = document.getElementById("stars").value;

    //obtiene el div del loader (cargando...)
    let loader = document.getElementById("loader");

    //obtiene el div donde se mostrarán los errores
    let errorDiv = document.getElementById("error");

    //obtiene el div donde irán los resultados
    let resultsDiv = document.getElementById("results");

    //limpia los resultados anteriores
    resultsDiv.innerHTML = "";

    //limpia los errores anteriores
    errorDiv.innerHTML = "";

    //muestra el loader mientras carga
    loader.style.display = "block";

    try {
        //si el usuario no escribe nada,
        //busca repositorios con más de 100 estrellas
        let filtro = query || "stars:>100";

        //si elige un lenguaje, se agrega al filtro
        if (language)
            filtro += `+language:${language}`;

        //si escribe estrellas, se agrega al filtro
        if (stars)
            filtro += `+stars:>=${stars}`;

        //url para consultar la api de github
        let url = `https://api.github.com/search/repositories?q=${filtro}`;

        //hace la petición a la api
        let res = await fetch(url);

        //si la respuesta falla, lanza un error
        if (!res.ok)
            throw new Error("Error en la API");

        //convierte la respuesta a json
        let data = await res.json();

        //envía solo los primeros 10 resultados
        mostrar(data.items.slice(0, 10));

    } catch (err) {

        //si ocurre un error, muestra mensaje
        errorDiv.innerHTML = "Ocurrió un error al buscar.";

    } finally {

        //oculta el loader al terminar
        loader.style.display = "none";
    }
}



//función para mostrar los repositorios
function mostrar(repos) {

    //obtiene el div de resultados
    let resultsDiv = document.getElementById("results");

    //si no hay resultados
    if (repos.length === 0) {

        //muestra mensaje
        resultsDiv.innerHTML = "<p>No hay resultados</p>";

        //termina la función
        return;
    }

    //recorre cada repositorio
    repos.forEach(repo => {

        //crea un div para la tarjeta
        let card = document.createElement("div");

        //le agrega la clase "card"
        card.className = "card";

        //inserta el contenido html de la tarjeta
        card.innerHTML = `

            //nombre del repositorio
            <h3>${repo.name}</h3>

            //descripcion
            <p>${repo.description || "Sin descripción"}</p>

            //estrellas y forks
            <strong>Estrellas:</strong> ${repo.stargazers_count}
            |
            <strong>Forks:</strong> ${repo.forks_count}
            <br>

            //link al repositorio
            <a href="${repo.html_url}" target="_blank">
                Ver repositorio
            </a>
        `;

        //agrega la tarjeta al div de resultados
        resultsDiv.appendChild(card);
    });
}


//cuando el usuario presiona una tecla
document.getElementById("search").addEventListener("keypress", function(e){

    //si la tecla es enter
    if (e.key === "Enter")

        //ejecuta la función buscar()
        buscar();
});