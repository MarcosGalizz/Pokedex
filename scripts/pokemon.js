// Se obtiene el nombre del Pokémon guardado previamente en localStorage por la página anterior.
const pokemonBuscado = localStorage.getItem("pokemon");
const contenido = document.getElementById("pokemon-data");

// El evento DOMContentLoaded asegura que el script se ejecute sólo cuando el DOM está completamente cargado.
document.addEventListener("DOMContentLoaded", (e) => {
    // Si no se encontró ningún nombre en localStorage, se muestra un error.
    if (!pokemonBuscado) {
        mostrarErrores("No se encontró el pokemon ingresado.");
        return
    }

    // Se muestra una animación de carga con una pokebola SVG mientras se espera la respuesta de la API.
    contenido.innerHTML = `
        <div id="loading-pokeball">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" 
                stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pokeball">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
                <path d="M3 12h6" />
                <path d="M15 12h6" />
            </svg>
        </div>
    `;

    // Se realiza una petición HTTP a la PokeAPI para obtener los datos del Pokémon guardado.
    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonBuscado}`)
        // Verificamos que la respuesta sea válida. Si no, lanzamos un error manual.
        .then(res => {
            if (!res.ok) {
                throw new Error("Pokémon no encontrado.");
            }
            return res.json(); // Convertimos la respuesta a formato JSON.
        })
        // Si la respuesta fue exitosa, se pasa el objeto de datos al renderizador principal.
        .then(data => mostrarPokemon(data))
        // Si hubo algún error en la búsqueda o conexión, se muestra en pantalla.
        .catch(error => mostrarErrores(error));
});


function mostrarErrores(error) {
    contenido.innerHTML = `<p class="error">${error}</p>`;
}


function mostrarPokemon(pokemon) {
    // Actualiza el título del documento con el nombre del Pokémon.
    document.title = `${(pokemon.name).toUpperCase()}`;
    
    // URL de la imagen del Pokémon.
    const imagenPokemon = `https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg`;

    // Construcción del contenido HTML principal con la información del Pokémon.
    contenido.innerHTML = `
        <h2 id="nombre-pokemon">${(pokemon.name).toUpperCase()}</h2>
        <div class="data-container">
            <div class="img-container">
                <img src="${imagenPokemon}" alt="Pokémon Buscado">
            </div>
            <div class="data-pokemon">
                <p><strong>🔍Tipo:</strong> 
                    ${pokemon.types.map(t => `
                        <span class="tipo" data-tipo="${t.type.name}">
                            ${t.type.name}
                        </span>
                    `).join(", ")}
                </p>
                <p><strong>⚖️Peso:</strong> ${pokemon.weight / 10} kg</p>
                <p><strong>↕️Altura:</strong> ${pokemon.height / 10} m</p>
                <p><strong>🎯Habilidades:</strong> ${pokemon.abilities.map(t => t.ability.name).join(", ")}</p>
                <p><strong>✨Experiencia Base:</strong> ${pokemon.base_experience}</p>
            </div> 
        </div>
        <div id="tooltip" class="tooltip"></div>
    `;
    contenido.style.backgroundColor = "#F0F0F0";

    // Se agregan los eventos que permiten mostrar los tooltips al pasar el mouse sobre un tipo.
    agregarEventosTipos();
}



function agregarEventosTipos() {
    const tipos = document.querySelectorAll(".tipo");
    const tooltip = document.getElementById("tooltip");

    tipos.forEach(tipo => {
        // Cuando el mouse entra en el nombre del tipo, se hace una petición a la API para obtener
        // sus fortalezas y debilidades, y se muestra un tooltip con esos datos.
        tipo.addEventListener("mouseenter", async e => {
            const nombreTipo = e.target.dataset.tipo;

            const response = await fetch(`https://pokeapi.co/api/v2/type/${nombreTipo}`);
            const data = await response.json();
            const rel = data.damage_relations;

            const fuertes = rel.double_damage_to.map(t => t.name).join(", ") || "Ninguno";
            const debiles = rel.double_damage_from.map(t => t.name).join(", ") || "Ninguno";

            tooltip.innerHTML = `
                <strong>${nombreTipo.toUpperCase()}</strong><br>
                🟢 Fuerte contra: ${fuertes}<br>
                🔴 Débil contra: ${debiles}
            `;
            tooltip.style.display = "block";
            tooltip.style.left = e.pageX + 10 + "px";
            tooltip.style.top = e.pageY + 10 + "px";
        });

        // Mientras el mouse se mueve, el tooltip sigue la posición del puntero.
        tipo.addEventListener("mousemove", e => {
            tooltip.style.left = e.pageX + 10 + "px";
            tooltip.style.top = e.pageY + 10 + "px";
        });

        // Al salir del área del tipo, se oculta el tooltip.
        tipo.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });
    });
}
