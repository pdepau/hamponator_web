// Nombre fichero: controladorPerfil.js
// Fecha: WIP
// Autor: Jorge Grau Giannakakis
// Descripción: El controlador de la pagina perfil, llama a las funciones de la logica que necesite

import { actualizarPlano } from '../../logica/logica.js'
import { cerrarSesion } from '../../logica/logicaAuth.js'

const aceptar = document.getElementById("subir");
const archivo = document.getElementById("myfile");
const image_input = document.querySelector("#myfile");
const x = document.getElementById("myInput");
const contra = document.getElementById("contra");


// Cuando la pagina cargue empezamos la funcion
window.addEventListener("DOMContentLoaded", async (e) => {

    var codigoVer = localStorage.getItem("CodigoVer");
    contra.value = codigoVer;
    // Si la sesion no esta iniciada vuelves a la landing page
    var sesion = localStorage.getItem("SesionIniciada");
    if(sesion == 0){
        location.href = '../ux/login.html';
    }
    
    // Escuchador del boton de cerrar sesion
    document.getElementById("btn-cerrar-sesion").addEventListener("click", () => {
    cerrarSesion()});

    // La imagen que selecciones se muestra en pantalla
    image_input.addEventListener('change', function() {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      uploaded_image = reader.result;
      document.querySelector("#imagen").style.backgroundImage = `url(${uploaded_image})`;
    });
    reader.readAsDataURL(this.files[0]);
    });

    // Se sube el archivo
    aceptar.addEventListener('click', async (e) => {  
      var files = archivo.files;
      var file;

      for (var i = 0; i < files.length; i++) {

          file = files[i];
      
          actualizarPlano(file);
      }
    });

    x.addEventListener('click', async (e) => {  
        if (contra.type === "password") {
            contra.type = "text";
        } else {
            contra.type = "password";
        }
    });

});