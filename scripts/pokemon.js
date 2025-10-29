const pokemonBuscado = localStorage.getItem("pokemon");
const contenido = document.getElementById("pokemon-data");

document.addEventListener("DOMContentLoaded", (e) =>{
    if(!pokemonBuscado){
        mostrarErrores("No se encontró el pokemon ingresado.");
    }
    contenido.innerHTML = `
    <div id="loading-pokeball">
        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pokeball"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" /><path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" /><path d="M3 12h6" /><path d="M15 12h6" /></svg>
    </div>
    `

    fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonBuscado}`)
    .then(res => {
        if(!res.ok){
            throw new Error("Pokémon no encontrado.");
        }
        return res.json();
    })
    .then(data => mostrarPokemon(data))
    .catch(error => mostrarErrores(error));
});
/*
function mostrarPokemon(pokemon){
    const imagenPokemon = `https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg`;

    contenido.innerHTML = `
        <h2 id="nombre-pokemon">${pokemon.name}</h2>
        <div class="data-container">
            <div class="img-container">
                <img src="${imagenPokemon}" alt="Pokémon Buscado">
            </div>
            <div class="data-pokemon">
                <p><strong>🔍Tipo:</strong> ${pokemon.types.map(t => t.type.name).join(", ")}</p>
                <p><strong>⚖️Peso:</strong> ${pokemon.weight / 10} kg</p>
                <p><strong>↕️Altura:</strong> ${pokemon.height / 10} m</p>
                <p><strong>🎯Habilidades:</strong> ${pokemon.abilities.map(t => t.ability.name).join(", ")}</p>
                <p><strong>✨Experiencia Base:</strong> ${pokemon.base_experience}</p>
            </div> 
        </div>
    `
    contenido.style.backgroundColor = "#F0F0F0";
}
*/
function mostrarErrores(error){
    contenido.innerHTML = `<p class="error">${error}</p>`;
}

/* IA */

function mostrarPokemon(pokemon) {
    const imagenPokemon = `https://img.pokemondb.net/artwork/large/${pokemon.name}.jpg`;

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

    agregarEventosTipos();
}

function agregarEventosTipos() {
    const tipos = document.querySelectorAll(".tipo");
    const tooltip = document.getElementById("tooltip");

    tipos.forEach(tipo => {
        tipo.addEventListener("mouseenter", async e => {
            const nombreTipo = e.target.dataset.tipo;

            // Llamamos a la API de tipos
            const response = await fetch(`https://pokeapi.co/api/v2/type/${nombreTipo}`);
            const data = await response.json();

            const rel = data.damage_relations;

            // Armamos el contenido del tooltip
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

        tipo.addEventListener("mousemove", e => {
            tooltip.style.left = e.pageX + 10 + "px";
            tooltip.style.top = e.pageY + 10 + "px";
        });

        tipo.addEventListener("mouseleave", () => {
            tooltip.style.display = "none";
        });
    });
}

