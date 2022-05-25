// Nombre fichero: controladorRutas.js
// Fecha: WIP
// Autores: Jorge Grau Giannakakis, Luis Belloch Martinez
// Descripción: El controlador de la pagina rutas, llama a las funciones de la logica que necesite

import { subirDatos, recogerImagen, dibujarRuta, dibujarCirculo, reDibujarPlano, subirRuta, recogerRuta, actualizarPlano, actualizarOrden} from '../../logica/logica.js'
import { cerrarSesion } from '../../logica/logicaAuth.js'

const aceptar = document.getElementById("subir");
const archivo = document.getElementById("myfile");
const boton = document.getElementById("openbtn");
const image_input = document.querySelector("#myfile");

var rutaActivada = false;
var fotoActivada = false;
var borrarActivada = false;
var c = document.getElementById("display_image2");
var ctx = c.getContext("2d");

var punto = []
var puntos = []
var ordenes = [];
var nRuta = 0;
var contador = 0;

var punticos = [];
var cosicasDeBorrar = [];

var ordenDeAcciones = [];

const ruta = document.getElementById("ruta");
const foto = document.getElementById("foto");
const borrar = document.getElementById("borrar");
const guardar = document.getElementById("guardar");
const eliminar = document.getElementById("eliminar");

// Cuando la pagina cargue empezamos la funcion
window.addEventListener("DOMContentLoaded", async (e) => {
  // Si la sesion no esta iniciada vuelves a la landing page
  var sesion = localStorage.getItem("SesionIniciada");
  var codigoVer = localStorage.getItem("CodigoVer");

  // Si la sesion no esta iniciada mandamos al usuario al login
  if(sesion == 0){
    location.href = '../ux/login.html';
  }

  // Recogemos ruta de firebase
  if(codigoVer.length == 9){
    recogerRuta(ordenes, c, ctx, guardarOrdenes);
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

    // Boton ruta crear y guardar
    ruta.addEventListener('click', async (e) => {
      if(rutaActivada == false){
        resetHerramientas();
        ruta.style.backgroundColor = '#edb506';
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        rutaActivada = true;
      }
      else{ 
        // si ya se han puesto puntos, se guarda la ruta en el ordenes
        guardarRutaPuntos();
        resetHerramientas();
      }
    });

    // Boton foto
    foto.addEventListener('click', async (e) => {
      if(fotoActivada == false){
        guardarRutaPuntos();
        foto.style.backgroundColor = '#edb506';
        ctx.fillStyle = '#f00';
        ctx.beginPath();
        fotoActivada = true;
      }
      else{
        if(contador == 0){
          resetHerramientas();
        }
        else if(punto.length > 0 && contador > 1){
          let texto = "Foto" + nRuta;
          ordenes[texto] = punto;
          ordenDeAcciones.push(texto);
          punto = [];
          nRuta++;
          actualizarOrden(ordenes);
          resetHerramientas();
        }
      }
    });

    // Boton guardar
    guardar.addEventListener('click', async (e) => {
      guardarRutaPuntos();
      // Se sube la configuracion a la base de datos, la configuracion es el diccionario ordenes y el ordenes valga la redundancia
      subirRuta(ordenes, canvasElem);
      console.log("Rutas (ordenes)");
      console.log(ordenes);
    });
    
    // Boton borrar
    borrar.addEventListener('click', async (e) => {
      // Al hacer click en un sitio busca los putnos adyacentes y los borra
      // Se hace un clear y se redibujan con el diccionario ordenes
      if(borrarActivada == false){
        guardarRutaPuntos();
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
      punto = [];
      puntos = [];
      guardarRutaPuntos();
      ctx.clearRect(0, 0, c.width, c.height);
      ordenes = [];

      for(var j = 0; j < ordenDeAcciones.length; j++){
        var text = ordenDeAcciones[j];
        const collection = document.getElementById(text);

        if(collection!=null){
            collection.remove();
        }
      }

      ordenDeAcciones = [];
      actualizarOrden(ordenes);
    });

    // Gestor del canvas
    let canvasElem = document.querySelector(".canvas");
    canvasElem.addEventListener("click", function(e)
    {
      if(rutaActivada){
        dibujarRuta(canvasElem, e, ctx, puntos);
        actualizarOrden(ordenes);
      }
      if(fotoActivada){
        contador++;
        dibujarCirculo(canvasElem, e, ctx, punto);
        if(contador == 2){
          contador = 0;
          let texto = "Foto" + nRuta;
          let nuevaOrden = {
            id: texto,
            tipo: "foto",
            orientacion: {x: punto[1].x, y: punto[1].y},
            posicion: {x: punto[0].x, y: punto[0].y},
          }
          ordenes.push(nuevaOrden);
          punto = [];
          nRuta++;
          actualizarOrden(ordenes);
          resetHerramientas();
          reDibujarPlano(c, ctx, ordenes);
        }
      }
      if(borrarActivada){
        let width = c.offsetWidth;
        let height = c.offsetHeight;
        let rect = c.getBoundingClientRect();
        let x = ((e.clientX - rect.left)/width)*1000/10;
        let y = ((e.clientY - rect.top)/height)*1000/10;

        // recorre las ordenes
        for (let i = 0; i < ordenes.length; i++) {
          // si la orden es de tipo foto
          if(ordenes[i].tipo == "foto"){
            // comprueba que su posicion estan a menos distancia de 10 de x e y
            if(Math.abs(ordenes[i].posicion.x - x) < 2 && Math.abs(ordenes[i].posicion.y - y) < 2){
              console.log("Foto borrada");
              ordenes.splice(i, 1);
            }
          // si es del tipo ruta
          }else if(ordenes[i].tipo == "ruta"){
            // comprueba si alguno de sus puntos esta a menos distancia de 10 de x e y
            for (let j = 0; j < ordenes[i].puntos.length; j++) {
              if(Math.abs(ordenes[i].puntos[j].x - x) < 2 && Math.abs(ordenes[i].puntos[j].y - y) < 2){
                console.log("Ruta borrada");
                ordenes.splice(i, 1);
              }
            } // for
          } // else
        } // for
        
        reDibujarPlano(c,ctx, ordenes);
        actualizarOrden(ordenes);
      }
    });
    
});

function resetHerramientas(){
  rutaActivada = false;
  fotoActivada = false;
  borrarActivada = false;
  ruta.style.backgroundColor = '#820053';
  foto.style.backgroundColor = '#820053';
  borrar.style.backgroundColor = '#820053';
  actualizarOrden(ordenes);
}

function guardarRutaPuntos(){
  if(puntos.length > 0){
    let nuevaOrden = {
      id: "Ruta" + nRuta,
      tipo: "ruta",
      puntos: puntos
    }
    // vaciamos los puntos
    puntos = [];
    // Aumentamos en 1 las rutas creadas
    nRuta++;
    // Lo añadimos al ordenes
    ordenes.push(nuevaOrden);
    reDibujarPlano(c, ctx, ordenes);
    actualizarOrden(ordenes);
  }
}

/**
 * Guarda una lista de ordenes en las ordenes actuales. Llamado cuando se reciben de Firebase
 * @param {array} listaOrdenes 
 */
function guardarOrdenes(listaOrdenes) {
  ordenes = listaOrdenes;
  // Llamamos a redibujarPlano
  reDibujarPlano(c,ctx, ordenes);
}