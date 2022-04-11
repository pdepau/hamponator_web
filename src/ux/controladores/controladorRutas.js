// Nombre fichero: controladorRutas.js
// Fecha: WIP
// Autor: Jorge Grau Giannakakis
// Descripción: El controlador de la pagina rutas, llama a las funciones de la logica que necesite

import { subirDatos, recogerImagen } from '../../logica/logica.js'
import { cerrarSesion } from '../../logica/logicaAuth.js'

const aceptar = document.getElementById("subir");
const archivo = document.getElementById("myfile");
const boton = document.getElementById("openbtn");
const image_input = document.querySelector("#myfile");


// Cuando la pagina cargue empezamos la funcion
window.addEventListener("DOMContentLoaded", async (e) => {
  // Si la sesion no esta iniciada vuelves a la landing page
  var sesion = localStorage.getItem("SesionIniciada");
  if(sesion == 0){
    location.href = '../ux/login.html';
  }

  // Se llama a recoger imagen para mostrar la imagen de la base de datos
  recogerImagen();

  var uploaded_image;
    
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
      
          subirDatos(file);
      }
    });

    boton.addEventListener('click', async (e) => {

      /* Set the width of the sidebar to 250px and the left margin of the page content to 250px */
      if(document.getElementById("openbtn").style.marginRight == "250px"){
        document.getElementById("mySidebar").style.width = "0";
        document.getElementById("main").style.marginRight = "0";
        document.getElementById("openbtn").style.marginRight = "0";
      }
      else{
      document.getElementById("mySidebar").style.width = "250px";
      document.getElementById("main").style.marginRight = "250px";
      document.getElementById("openbtn").style.marginRight = "250px";
      }
  
    });
});