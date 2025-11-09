// Se obtienen las referencias a los elementos del formulario.
const pokemonBuscado = document.getElementById("form-input");
const formulario = document.getElementById("main-form");


formulario.addEventListener("submit", (e) => {
    // preventDefault evita el comportamiento por defecto del formulario (recargar o cambiar de página),
    e.preventDefault();

    // Se obtiene el valor ingresado, se eliminan espacios innecesarios y se pasa a minúsculas 
    // para buscar al Pokémon.
    const nombre = pokemonBuscado.value.trim().toLowerCase();

    // Si el usuario no ingresó nada, se muestra un mensaje de error.
    if (!nombre) {
        mostrarErrores("Ingrese el nombre de un Pokémon");
        return
    }

    // Se guarda el nombre en localStorage, lo que permite que otra página (por ejemplo, "pokemon.html")
    // pueda recuperar este valor sin necesidad de pasar datos por la URL.
    localStorage.setItem("pokemon", nombre);

    // Finalmente, se redirige al usuario a la página donde se mostrará la información del Pokémon buscado.
    window.location.href = "vistas/pokemon.html";
});

function mostrarErrores(error){
    formulario.innerHTML = `<p>${error}</p>`;
}