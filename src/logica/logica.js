// Nombre fichero: logica.js
// Fecha: WIP
// Autor: Jorge Grau Giannakakis
// Descripción: Gestiona la logica del centro de datos

import { constants } from 'buffer';
import {dbStorage, database, getStorage, ref, uploadBytes, getDownloadURL, firebaseAuth, setDoc, doc, set, db, storageRef, collection, query, where, getDocs, get, child} from '../firebase.js';

const mapa = document.getElementById("mapa");
const cargarMapa = document.getElementById("cargarMapa");
const mySidebar = document.getElementById("mySidebar");
const main = document.getElementById("main");
const herramientas = document.getElementById("herramientas");

// CONFIGURACION ESCALA DEL MAPA
var scale = {
    x: 10,
    y: 10
}
window.addEventListener("resize",function(){
    updateScale(scale, canvas);
});
/*
    0,0 -------> +x
    |
    |
    |
    v 
    +y

    Medido en píxeles, siempre tienen la misma posición independientemente del
    tamaño del canvas. Debería saber cuánto de grande se ha hecho la imagen y ajustar la
    escala en consecuencia.
*/

/**
 * Sube datos a Firestore Storage
 * file -> subirDatos -> 
 */
async function subirDatos(file){
    
    //Comprobamos que la sesion esta iniciada
    var sesion = localStorage.getItem("SesionIniciada");
    var uid = localStorage.getItem("UID");
    
    if (sesion == 1) {
    // Create the file metadata
    const metadata = {
    contentType: 'image/jpeg'
    };
    
    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(dbStorage, 'images/'+ uid +'/Plano.jpg');
    uploadBytes(storageRef, file).then((snapshot) => {
        //console.log('Uploaded a blob or file!');
    });

    // Subimos el archivo y llamamos a la funcion recoger imagen pasado 1 segundo
    cargarMapa.style.display = "none";
    mapa.style.display = "block";
    setTimeout(function(){
        //console.log("ahora");
        recogerImagen()
    }, 1000);
    }
}

/**
 * Sube datos a Firestore Storage
 * file -> actualizarPlano -> 
 */
 async function actualizarPlano(file){
    
    //Comprobamos que la sesion esta iniciada
    var sesion = localStorage.getItem("SesionIniciada");
    var uid = localStorage.getItem("UID");
    
    if (sesion == 1) {
    // Create the file metadata
    const metadata = {
    contentType: 'image/jpeg'
    };
    
    // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(dbStorage, 'images/'+ uid +'/Plano.jpg');
    uploadBytes(storageRef, file).then((snapshot) => {
        //console.log('Uploaded a blob or file!');
    });

    // Subimos el archivo y mostramos la subida completada tras 1 segundo
    setTimeout(function(){
        alert ("Subida con exito"); 
    }, 1000);
    }
}

/**
 * Recoge el plano y lo muestra
 * -> recogerImagen -> 
 */
async function recogerImagen(){
    var sesion = localStorage.getItem("SesionIniciada");
    var uid = localStorage.getItem("UID");
    
    if (sesion == 1) {
        // Create a reference from a Google Cloud Storage URI
        const gsReference = ref(dbStorage, 'gs://hamponator-web.appspot.com/images/'+ uid +'/Plano.jpg');

        // Get the download URL
        getDownloadURL(gsReference)
        .then((url) => {
        // Insert url into an <img> tag to "download"
        document.querySelector("#display_image2").style.backgroundImage = `url(${url})`;
        })
        
        // Si encuentra algun error dispone la pagina para insertar una imagen
        .catch((error) => {
            cargarMapa.style.display = "block";
            mapa.style.display = "none";
            mySidebar.style.display = "none";
            main.style.display = "none";
            herramientas.style.display = "none";
        });

        cargarMapa.style.display = "none";
        mapa.style.display = "block";
        mySidebar.style.display = "block";
        main.style.display = "block";
        herramientas.style.display = "block";

    }else{
        cargarMapa.style.display = "block";
        mapa.style.display = "none";
        mySidebar.style.display = "none";
        main.style.display = "none";
        herramientas.style.display = "none";
    }
}

function dibujarRuta(canvas, event, ctx, puntos){
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let rect = canvas.getBoundingClientRect();
    let x = ((event.clientX - rect.left)/width)*1000;
    let y = ((event.clientY - rect.top)/height)*1000;

    puntos.push(x);
    puntos.push(y);

    //console.log("Coordinate x: " + x, "Coordinate y: " + y);
    ctx.fillStyle = '#f00';
    ctx.lineTo(x,y);
    ctx.stroke();
}

function dibujarCirculo(canvas, event, ctx, punto){
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let rect = canvas.getBoundingClientRect();
    let x = ((event.clientX - rect.left)/width)*1000;
    let y = ((event.clientY - rect.top)/height)*1000;

    punto.push(x);
    punto.push(y);

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 10);
    ctx.fill();
}

function reDibujarPlano(canvas, ctx, orden){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Update Scale
    updateScale(scale, canvas);

    var keys = Object.keys(orden);
    var punticos = [];
    //console.log(keys.length);
    let result = "";
    
    for(var i = 0; i < keys.length; i++){

        result = keys[i].slice(0, 1);
        //console.log(keys[i]);
        // Si es una foto
        if(result == "F"){
            ctx.beginPath();
            //console.log("Entro foto");
            punticos = orden[keys[i]];
            for(var j = 0; j < punticos.length; j = j+2){
                ctx.arc(punticos[j], punticos[j+1], 5, 0, 10);
            }
            ctx.closePath();
            ctx.fill();
            
        }

        else if(result == "R"){

            ctx.beginPath();
            //console.log("Entro ruta");
            punticos = orden[keys[i]];
            ctx.moveTo(punticos[0], punticos[1])
            for(var j = 2; j < punticos.length; j = j+2){
                ctx.lineTo(punticos[j], punticos[j+1]);
            }
            ctx.closePath();
            ctx.stroke();
            
        }
    }
    
}

/**
 * Calculate the scale of the image inside the canvas
 * @param {object} scale x, y
 * @param {Canvas tag} canvas 
 */
function updateScale(scale, canvas) {
    var ctx = canvas.getContext('2d');
    ctx.scale(scale.x, scale.y);
}

async function subirRuta(orden, ordenDeAcciones, canvas){

    var keys = Object.keys(orden);
    //console.log(keys.length);
    let result = "";
    var subida = [];

    let JSON = {
        time: new Date().getTime(),
        msg:[
            
        ]
    
    }

    for(var i = 0; i < ordenDeAcciones.length; i++){

        result = ordenDeAcciones[i].slice(0, 1);
        //console.log(ordenDeAcciones[i]);

        // Si es una foto
        if(result == "F"){
            var puntos = orden[ordenDeAcciones[i]];
            
            let punto ={
                tipo: "foto",
                posicion: {
                    x: (puntos[0]/scale.x),
                    y: (puntos[1]/scale.y)
                },
                orientacion: {
                    x: (puntos[2]/scale.x),
                    y: (puntos[3]/scale.y)
                }
            }

            JSON.msg.push(punto);
        }

        else if(result == "R"){

            let punto ={
                tipo: "ruta",
                posiciones: [

                ]
            }

            var puntos = orden[ordenDeAcciones[i]];

            let text = '{ '+ ordenDeAcciones[i] +' : [';
            for(var j = 0; j < puntos.length; j = j+2){

                let pos = {
                    x: (puntos[j]/scale.x) , 
                    y: (puntos[j+1]/scale.y)
                }

                punto.posiciones.push(pos)

            }

            //console.log(text);
            subida.push(text);
            JSON.msg.push(punto);
        }
    }

    // Add a new document in collection "cities"
    var codigoVer = localStorage.getItem("CodigoVer");
    let texto = codigoVer + "-web"
    await setDoc(doc(db, "orden", texto), {
        JSON: JSON
     });

    set(storageRef(database, +codigoVer+'-web/'), JSON);
}

async function recogerRuta(orden, ordenDeAcciones, c, ctx){
    
    var i = 0;
    var lista = [];

    const q = query(collection(db, "orden"));

    // Obtenemos los documentos en forma de objetos DocumentSnapshots
    await getDocs(q).then(querySnapshot => {
        querySnapshot.forEach(doc => {

            let valores = doc.data();
            let result = valores.JSON;

            result.msg.forEach(element => {
                if (element.tipo == "ruta") {
                    let texto = "Ruta" + i;
                    element.posiciones.forEach(pos => {
                        lista.push(pos.x*10);
                        lista.push(pos.y*10);
                    });
                    orden[texto] = lista;
                    lista = [];
                    ordenDeAcciones.push(texto);
                    i++;
                } else if (element.tipo == "foto") {
                    let texto = "Foto" + i;
                    lista.push(element.posicion.x*10);
                    lista.push(element.posicion.y*10);
                    lista.push(element.orientacion.x*10);
                    lista.push(element.orientacion.y*10);
                    orden[texto] = lista;
                    lista = [];
                    ordenDeAcciones.push(texto);
                    i++;
            }})
            reDibujarPlano(c,ctx, orden);
            localStorage.setItem("nRuta", i);
            actualizarOrden(ordenDeAcciones);
        })

        return;
    }).catch(error => { });
    
      
}

function actualizarOrden(ordenDeAcciones){
    
    const sideBar = document.getElementById("mySidebar");

    for(var i = 0; i < ordenDeAcciones.length; i++){

        var result = ordenDeAcciones[i].slice(0, 1);

        if(result == "F"){
            var text = ordenDeAcciones[i];
            const collection = document.getElementById(text);

            if(collection!=null){
                collection.remove();
            }

            var element = document.createElement(text);
    
            element.innerHTML = `<div class = "orden" id=${text}>
                                    <img src="../ux/img/camera-solid.svg" alt="icono" class = "imagen">
                                    <p class = "texto">${text}</p>
                                </div>`;
            sideBar.appendChild(element);
        }

        if(result == "R"){
            var text = ordenDeAcciones[i];
            const collection = document.getElementById(text);

            if(collection!=null){
                collection.remove();
            }

        
            var element = document.createElement(text);
    
            element.innerHTML = `<div class = "orden" id=${text}>
                                    <img src="../ux/img/route-solid.svg" alt="icono" class = "imagen">
                                    <p class = "texto">${text}</p>
                                </div>`;
            sideBar.appendChild(element);
        }

    }
}

//
// A partir de aqui es la pagina de alertas
//

async function recogerAlertas(body){
    // Hace una busqueda en la base de datos y recibe una lista de las alertas
    var alertas = ["Test 1", "Test 2", "testFinal"];
    crearAlertas(alertas, body);
}

function crearAlertas(alertas){

    get(storageRef(database, "-app")).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            var datos = snapshot.val().msg[0].images[0];
            console.log(datos);
            /*
            var text = "FotoTest";
            var element = document.createElement(text);
            element.innerHTML = `<img src="${datos}">`;
            document.body.appendChild(element);
            */
            if(alertas != null){
                var lista = [];
                for(var i = 0; i < alertas.length; i++){
                    lista.push(0);
                    var text = "Alerta" + i;
                    var element = document.createElement(text);
    
                    element.innerHTML =`<div class="padre" id=${text}>
                                            <div class="barraSuperior">
                                            <div class="titulo">
                                                <p class = "blanco">Alerta ${i+1}</p>
                                            </div>
                                            <button class="botonAceptar" onclick="aceptar(${i})"> 
                                                <p class = "blanco">Añadir al informe</p>
                                            </button>
                                            <button class="botonDenegar" onclick="falsaAlarma(${i})">
                                                <p class = "blanco"> Falsa alarma </p>
                                            </button>
                                            </div>
                                            <div class="contenido">
                                            <div class="imagen">
                                                <img class="imagenAlertas"src="${datos}">
                                            </div>
                                            <div class="prediccion">
                                            ${alertas[i]}
                                            </div>
                                            </div>
                                        </div>`;
                    document.body.appendChild(element);
                    var text = "imagenes"+i;
                    localStorage.setItem(text, datos);
                    var text = "alertasTexto"+i;
                    localStorage.setItem(text, alertas[i]);
                }
    
                localStorage.setItem("alertas", lista);
                
            }
    
        } else {
        console.log("No data available");
        }
    }).catch((error) => {
      console.error(error);
    });
}

/**
 * Recoge cada varios segundos el mensaje del realtime y si es nuevo guarda su imagen en storage
 */
/*
function startImageService() {
    setInterval(function waitForImage() {
        var requestOptions = {
            method: 'GET',
            redirect: 'follow'
        };
        // TODO: debe utilizar la ID del robot
        fetch(Constants.url + `123456789-app.json`, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result);
            try {
                actualizarPlano(result.msg[0].image)
            } catch (error) {
                console.error(error);
            }
        })
        .catch(error => console.error(error));
    }, 5000);
}
*/

export { subirDatos, actualizarPlano, recogerImagen, dibujarRuta, dibujarCirculo, reDibujarPlano, subirRuta, recogerRuta, recogerAlertas, actualizarOrden};