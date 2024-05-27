let arregloTareas = [];
let elementosGuardados = 0;

let done = new Audio('done.mp3');
let undone = new Audio('undone.mp3');

function init() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(function(registration) {
            console.log('SW registrado correctamente');
        }, function(err) {
            console.log('SW fallo', err);
        });
    } else {
        console.log("ERROR");
    }

    if (localStorage.getItem('tareas')) {
        arregloTareas = JSON.parse(localStorage.getItem('tareas'));
        loadTareas();
    } else {
        localStorage.setItem('tareas', JSON.stringify([]));
    }
}

function loadTareas() {
    arregloTareas.forEach(tarea => {
        agregarTareaAUI(tarea.texto, tarea.categoria);
    });
}

function agregarNota() {
    const textarea = document.querySelector('textarea');
    const categoria = document.querySelector('#lang').value;
    const color = document.querySelector('#lang2').value; 
    const notaTexto = textarea.value.trim();

    if (notaTexto === '' || categoria === 'seleccionar' || color === 'seleccionar') {
        alert('Por favor, escribe una nota, selecciona una categoría y un color.');
        return;
    }

    const nuevaTarea = { texto: notaTexto, categoria: categoria, color: color }; // Añade el color a la tarea
    arregloTareas.push(nuevaTarea);
    localStorage.setItem('tareas', JSON.stringify(arregloTareas));

    agregarTareaAUI(notaTexto, categoria, color); // Pasa el color como argumento
    textarea.value = '';
    done.play();
}

function agregarTareaAUI(texto, categoria, color) {
    const nuevoParrafo = document.createElement('p');
    nuevoParrafo.textContent = texto;
    nuevoParrafo.style.backgroundColor = color

    if (categoria === 'fin') {
        document.querySelector('.final .estilo2.f2').appendChild(nuevoParrafo);
    } else if (categoria === 'pend') {
        document.querySelector('.pendiente .estilo2').appendChild(nuevoParrafo);
    } else if (categoria === 'por') {
        document.querySelector('.porhacer .estilo2').appendChild(nuevoParrafo);
    }

    // Agregar el botón de eliminar y editar a cada nota
    const eliminarBtn = document.createElement('button');
    eliminarBtn.textContent = 'Eliminar';
    eliminarBtn.classList.add('eliminado');
    eliminarBtn.addEventListener('click', eliminarNota);

    const editarBtn = document.createElement('button');
    editarBtn.textContent = 'Editar';
    editarBtn.classList.add('editar');
    editarBtn.addEventListener('click', editarNota);

    const container = document.createElement('div');
    container.appendChild(nuevoParrafo);
    container.appendChild(editarBtn);
    container.appendChild(eliminarBtn);

    if (categoria === 'fin') {
        document.querySelector('.final .estilo2.f2').appendChild(container);
    } else if (categoria === 'pend') {
        document.querySelector('.pendiente .estilo2').appendChild(container);
    } else if (categoria === 'por') {
        document.querySelector('.porhacer .estilo2').appendChild(container);
    }
}

function eliminarNota(event) {
    const boton = event.target;
    const notaContainer = boton.parentElement;
    const notaTexto = notaContainer.querySelector('p').textContent;
    notaContainer.remove();

    arregloTareas = arregloTareas.filter(tarea => tarea.texto !== notaTexto);
    localStorage.setItem('tareas', JSON.stringify(arregloTareas));
    undone.play();
}

function editarNota(event) {
    const boton = event.target;
    const notaContainer = boton.parentElement;
    const notaTextoElemento = notaContainer.querySelector('p');
    const notaTexto = notaTextoElemento.textContent;

    const nuevoTexto = prompt('Edita tu nota:', notaTexto);
    if (nuevoTexto !== null && nuevoTexto.trim() !== '') {
        notaTextoElemento.textContent = nuevoTexto;

        const categoria = notaContainer.parentElement.parentElement.querySelector('h2').textContent.toLowerCase();
        const tareaIndex = arregloTareas.findIndex(tarea => tarea.texto === notaTexto && tarea.categoria === categoria);

        if (tareaIndex > -1) {
            arregloTareas[tareaIndex].texto = nuevoTexto;
            localStorage.setItem('tareas', JSON.stringify(arregloTareas));
        }
    }
    done.play
}

document.querySelectorAll('.eliminado').forEach(boton => {
    boton.addEventListener('click', eliminarNota);
});

document.querySelectorAll('.editar').forEach(boton => {
    boton.addEventListener('click', editarNota);
});


