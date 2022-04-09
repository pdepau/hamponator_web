// Nombre fichero: controladorStorage.js
// Fecha: WIP
// Autor: Jorge Grau Giannakakis
// Descripción: El controlador de la pagina storage, llama a las funciones de la logica que necesite

import { subirDatos, recogerImagen } from '../../logica/storage.js'
import { cerrarSesion } from '../../logica/login.js'

const aceptar = document.getElementById("subir");
const archivo = document.getElementById("myfile");
const boton = document.getElementById("openbtn");


// Cuando la pagina cargue empezamos la funcion
window.addEventListener("DOMContentLoaded", async (e) => {
  var sesion = localStorage.getItem("SesionIniciada");
  if(sesion == 0){
    location.href = '../ux/login.html';
  }
  recogerImagen();
  const image_input = document.querySelector("#myfile");
  var uploaded_image;
    
  document.getElementById("btn-cerrar-sesion").addEventListener("click", () => {
  cerrarSesion()});

  image_input.addEventListener('change', function() {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      uploaded_image = reader.result;
      document.querySelector("#imagen").style.backgroundImage = `url(${uploaded_image})`;
    });
    reader.readAsDataURL(this.files[0]);
    });

    aceptar.addEventListener('click', async (e) => {  
      console.log("Subiendo");
      var files = archivo.files;
      var file;

      for (var i = 0; i < files.length; i++) {

          // get item
          file = files.item(i);
          //or
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