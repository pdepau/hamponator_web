// Nombre fichero: controladorAlertas.js
// Fecha: WIP
// Autor: Jorge Grau Giannakakis
// Descripción: El controlador de la pagina alertas, llama a las funciones de la logica que necesite

import {recogerAlertas} from '../../logica/logica.js'
import { cerrarSesion } from '../../logica/logicaAuth.js'

const body = document.getElementById("body");

// Cuando la pagina cargue empezamos la funcion
window.addEventListener("DOMContentLoaded", async (e) => {
    // Si la sesion no esta iniciada vuelves a la landing page
    var sesion = localStorage.getItem("SesionIniciada");
    if(sesion == 0){
    location.href = '../ux/login.html';
    }

    var alertas = null;
    alertas = recogerAlertas(body);

    // Escuchador del boton de cerrar sesion
    document.getElementById("btn-cerrar-sesion").addEventListener("click", () => {
        cerrarSesion()});

});