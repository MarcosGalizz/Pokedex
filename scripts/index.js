const pokemonBuscado = document.getElementById("form-input");
const btnBuscar = document.getElementById("form-button");

const formulario = document.getElementById("main-form");

formulario.addEventListener("submit", (e) =>{
    e.preventDefault();

    const nombre = pokemonBuscado.value.trim().toLowerCase();
    if(!nombre){
        mostrarErrores("Ingrese el nombre de un Pokémon");
    }
    localStorage.setItem("pokemon", nombre);
    window.location.href = "vistas/pokemon.html";
})
