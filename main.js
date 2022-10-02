const baseURL = "https://pokeapi.co/api/v2/pokemon/";
const loader = document.getElementById("container-pokemons");
const caja = document.getElementById("caja");

let option = {

    next: null,
    trabajando: false,
}

const buscarPokemons = async () => {

    let respuesta = await fetch(`${baseURL}?limit=8&offset=0`);
    let data = await respuesta.json();
    console.log(data);
    return data;
  

};

buscarPokemons();

const mapearPokemons = async () => {

    let pokemons = await buscarPokemons();

    let URLS = pokemons.results.map((poke) => poke.url);
    let mapeoURLS = URLS.map(async (url) => {

        let pokes = await fetch(url);
        return await pokes.json();

    })

    let infoPokemons = await Promise.all(mapeoURLS);
    return infoPokemons;
};

const dibujarPokemons = (pokemon) => {

    console.log(pokemon);
    let {id, name, sprites, height, weight, types, base_experience} = pokemon;

    return `
    <div class="pokemon">
    <img class="imagen-pokemon" src="${sprites.other.home.front_default}" alt="imagen del pokemon">
    <p class="id-pokemon">#${id}</p>
    <h2>${name.toUpperCase()}</h2>
    <div class="caja-data">
    <span class="exp">EXP: ${base_experience}</span>

    <div class="caja-tipos">
        ${
            types.map((tipo) => `<span class="${tipo.type.name} poke-tipo">${tipo.type.name}</span>`).join('')}
    
            </div>
    <div class="datos-detalles">
    
    <p class="height">height: #${height / 10}kg</p>
    <p class="weight">weight: #${weight / 10}m</p>
    </div>
    </div>
</div>
    `;
};

const dibujarListaPokemons = (listaPokemons) => {

    let tarjetas = listaPokemons.map((pokemon) => {

       return dibujarPokemons(pokemon)
    }).join(''); 

    caja.innerHTML += tarjetas;
};


const cargaPokemones = (listaPokemons) => {

    loader.classList.add("mostrar");
    setTimeout(() => {

        loader.classList.remove("mostrar");
        dibujarListaPokemons(listaPokemons);

        option.trabajando = false;
    }, 1500);
};

const init = () => {

    window.addEventListener("DOMContentLoaded", async () => {

        let {next, results} = await buscarPokemons();
        option.next = next;

        let  URLS = results.map((poke) => poke.url);
        let mapeoURL = URLS.map(async url => {

            let nextPokemons = await fetch(url);
            return await nextPokemons.json();
        });

        let infoPokemones = await Promise.all(mapeoURL);
        dibujarListaPokemons(infoPokemones);

    })

    window.addEventListener("scroll", async () => {

        let {scrollTop, clientHeight, scrollHeight} = document.documentElement;
        const bottom = scrollTop + clientHeight >= scrollHeight - 1;

        if (bottom && !option.trabajando) {
            option.trabajando = true;
            let nextPokemons = await fetch(option.next);
            let {next, results} = await nextPokemons.json();
            option.next = next;
            let URLS = results.map((poke) => poke.url);
            let mapeoURL = URLS.map(async url => {

                let nextPokemons = await fetch(url);
                return await nextPokemons.json();
            })
            let infoPokemones = await Promise.all(mapeoURL);
            cargaPokemones(infoPokemones);
    
        };
    })

   
};

init();

