// Nombre fichero: controladorRutas.js
// Fecha: WIP
// Autor: Jorge Grau Giannakakis
// Descripción: El controlador de la pagina rutas, llama a las funciones de la logica que necesite

import { subirDatos, recogerImagen, dibujarRuta, dibujarCirculo, reDibujarPlano, subirRuta, recogerRuta, actualizarPlano, actualizarOrden} from '../../logica/logica.js'
import { cerrarSesion } from '../../logica/logicaAuth.js'

const aceptar = document.getElementById("subir");
const archivo = document.getElementById("myfile");
const boton = document.getElementById("openbtn");
const image_input = document.querySelector("#myfile");

var rutaActivada = false;
var fotoActivada = false;
var pausaActivada = false;
var borrarActivada = false;
var c = document.getElementById("display_image2");
var ctx = c.getContext("2d");

var punto = []
var puntos = []
var orden = {};
var nRuta = 0;
var contador = 0;

var punticos = [];
var cosicasDeBorrar = [];

var ordenDeAcciones = [];

const ruta = document.getElementById("ruta");
const foto = document.getElementById("foto");
const pausa = document.getElementById("esperar");
const borrar = document.getElementById("borrar");
const guardar = document.getElementById("guardar");
const eliminar = document.getElementById("eliminar");

// Cuando la pagina cargue empezamos la funcion
window.addEventListener("DOMContentLoaded", async (e) => {
  // Si la sesion no esta iniciada vuelves a la landing page
  var sesion = localStorage.getItem("SesionIniciada");
  var codigoVer = localStorage.getItem("CodigoVer");
  if(sesion == 0){
    location.href = '../ux/login.html';
  }

  if(codigoVer.length == 9){
    recogerRuta(orden, ordenDeAcciones, c, ctx);
    nRuta = localStorage.getItem("nRuta");
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

    ruta.addEventListener('click', async (e) => {
      if(rutaActivada == false){
        resetHerramientas();
        ruta.style.backgroundColor = '#edb506';
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        rutaActivada = true;
      }
      else{ 
        if(puntos.length > 0){
          let texto = "Ruta" + nRuta;
          orden[texto] = puntos;
          ordenDeAcciones.push(texto);
          puntos = [];
          nRuta++;
          actualizarOrden(ordenDeAcciones);
        }
        resetHerramientas();
      }
    });

    foto.addEventListener('click', async (e) => {
      if(fotoActivada == false){
        resetHerramientas();
        foto.style.backgroundColor = '#edb506';
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        fotoActivada = true;
      }
      else{
        let texto = "Foto" + nRuta;
        orden[texto] = punto;
        ordenDeAcciones.push(texto);
        punto = [];
        nRuta++;
        actualizarOrden(ordenDeAcciones);
        resetHerramientas();
      }
    });

    pausa.addEventListener('click', async (e) => {
      if(pausaActivada == false){
        resetHerramientas();
        pausa.style.backgroundColor = '#edb506';
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        pausaActivada = true;
      }
      else{ 
        if(punto.length > 0){
          let texto = "Pausa" + nRuta;
          orden[texto] = punto;
          ordenDeAcciones.push(texto);
          punto = [];
          nRuta++;
          actualizarOrden(ordenDeAcciones);
        }
        resetHerramientas();
      }
    });

    guardar.addEventListener('click', async (e) => {
      // Se sube la configuracion a la base de datos, la configuracion es el diccionario orden y el orden valga la redundancia
      subirRuta(orden, ordenDeAcciones, canvasElem);
    });

    borrar.addEventListener('click', async (e) => {
      // Al hacer click en un sitio busca los putnos adyacentes y los borra
      // Se hace un clear y se redibujan con el diccionario orden
      if(borrarActivada == false){
        resetHerramientas();
        borrar.style.backgroundColor = '#edb506';
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        borrarActivada = true;
      }
      else{ 
        resetHerramientas();
      }

    });

    // Elimina todas las marcas del canvas
    eliminar.addEventListener('click', async (e) => {
      ctx.clearRect(0, 0, c.width, c.height);
      orden = {};
      ordenDeAcciones = [];
      actualizarOrden(ordenDeAcciones);
    });

    let canvasElem = document.querySelector(".canvas");
    canvasElem.addEventListener("click", function(e)
    {
      if(rutaActivada){
        dibujarRuta(canvasElem, e, ctx, puntos);
        actualizarOrden(ordenDeAcciones);
      }
      if(fotoActivada){
        contador++;
        dibujarCirculo(canvasElem, e, ctx, punto);
        if(contador == 2){
          contador = 0;
          let texto = "Foto" + nRuta;
          orden[texto] = punto;
          ordenDeAcciones.push(texto);
          punto = [];
          nRuta++;
          actualizarOrden(ordenDeAcciones);
          resetHerramientas();
        }
      }
      if(pausaActivada){

      }
      if(borrarActivada){
        let width = c.offsetWidth;
        let height = c.offsetHeight;
        let rect = c.getBoundingClientRect();
        let x = ((e.clientX - rect.left)/width)*1000;
        let y = ((e.clientY - rect.top)/height)*1000;

        for (var key in orden){
          //key will be -> 'id'
          //dictionary[key] -> 'value'
          punticos = orden[key];
          for(var i = 0; i < punticos.length; i++){
            if(x+10 > punticos[i] && x-10 < punticos[i] && y+10 > punticos[i+1] && y-10 < punticos[i+1]){
              cosicasDeBorrar.push(key);
            }
          }
        }
        for(var i = 0; i < cosicasDeBorrar.length; i++){
          delete orden[cosicasDeBorrar[i]];
        }

        for(var i = 0; i < cosicasDeBorrar.length; i++){

          var text = cosicasDeBorrar[i];
          for(var j = 0; j < ordenDeAcciones.length; j++){
            if(text == ordenDeAcciones[j]){
              var text = ordenDeAcciones[j];
              const collection = document.getElementById(text);

              if(collection!=null){
                  collection.remove();
              }
              ordenDeAcciones.splice(j, 1);
            }
          }
        }
        
        reDibujarPlano(c,ctx, orden);
        cosicasDeBorrar = [];
        actualizarOrden(ordenDeAcciones);
        
      }
    });
    
});

function resetHerramientas(){
  rutaActivada = false;
  fotoActivada = false;
  pausaActivada = false;
  borrarActivada = false;
  ruta.style.backgroundColor = '#820053';
  foto.style.backgroundColor = '#820053';
  pausa.style.backgroundColor = '#820053';
  borrar.style.backgroundColor = '#820053';
  actualizarOrden(ordenDeAcciones);
}
