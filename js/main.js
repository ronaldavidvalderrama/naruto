const galeria = document.getElementById('list_naruto');
const botonSiguiente = document.getElementById('next');
const contenedorPaginas = document.getElementById('page-number');

let paginaActual = 1;
let totalPaginas = 1;
let todosLosPersonajes = [];
const personajesPorPagina = 8;

async function obtenerPersonajes() {
    const respuesta = await fetch(`https://dattebayo-api.onrender.com/characters`);
    const datos = await respuesta.json();
    return datos.characters; 
}

function mostrarPersonajes(personajes) {
    galeria.innerHTML = '';
    personajes.forEach(personaje => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'card';

        // Verificamos si hay título, y si no, mostramos cumpleaños
        const titulo = personaje.personal?.titles?.[0];
        const cumple = personaje.personal?.birthdate || 'Desconocido';
        const datoExtra = titulo && titulo.trim() !== '' ? titulo : cumple;

        tarjeta.innerHTML = `
            <img src="${personaje.images[0]}" alt="${personaje.name}">
            <h2>${personaje.name}</h2>
            <p><strong>Clan:</strong> ${personaje.personal.clan || 'Sin clan'}</p>
            <p>${datoExtra}</p>
        `;
        galeria.appendChild(tarjeta);
    });
}

function actualizarPaginacion() {
    contenedorPaginas.innerHTML = '';
    for (let i = 1; i <= totalPaginas; i++) {
        const boton = document.createElement('button');
        boton.textContent = i;
        if (i === paginaActual) {
            boton.classList.add('active');
        }
        boton.addEventListener('click', () => cargarPagina(i));
        contenedorPaginas.appendChild(boton);
    }

    botonSiguiente.disabled = paginaActual === totalPaginas;
}

function cargarPagina(pagina) {
    const inicio = (pagina - 1) * personajesPorPagina;
    const fin = inicio + personajesPorPagina;
    const personajesDeLaPagina = todosLosPersonajes.slice(inicio, fin);

    mostrarPersonajes(personajesDeLaPagina);
    paginaActual = pagina;
    actualizarPaginacion();
}

botonSiguiente.addEventListener('click', () => {
    if (paginaActual < totalPaginas) cargarPagina(paginaActual + 1);
});

async function iniciar() {
    const datos = await obtenerPersonajes();
    todosLosPersonajes = datos;
    totalPaginas = Math.ceil(todosLosPersonajes.length / personajesPorPagina);
    cargarPagina(1);
}

iniciar();
