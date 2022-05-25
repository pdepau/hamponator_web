// Nombre fichero: logica.js
// Fecha: WIP
// Autor: Jorge Grau Giannakakis
// Descripción: Gestiona la logica del centro de datos

import {dbStorage, database, getStorage, ref, uploadBytes, getDownloadURL, firebaseAuth, setDoc, doc, set, db, storageRef, collection, query, where, getDocs, get, child} from '../firebase.js';

const mapa = document.getElementById("mapa");
const cargarMapa = document.getElementById("cargarMapa");
const mySidebar = document.getElementById("mySidebar");
const main = document.getElementById("main");
const herramientas = document.getElementById("herramientas");

/**
 * Sube datos a Firestore Storage y colocar el mapa
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
 * Actualiza el plano subido a storage
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

/**
 * Dibuja la ruta de puntos dado el canvas, el click y los puntos ya existentes
 * canvas, event, ctx, puntos -> dibujarRuta -> puntos
 */
function dibujarRuta(canvas, event, ctx, puntos){

    // Recogemos el tamaño del canvas
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let rect = canvas.getBoundingClientRect();

    // Vemos donde s ha pulsado y lo hacemos a escala 0-100
    // Se multiplica por 1000 porque esa es la resolucion base del canvas
    let x = ((event.clientX - rect.left)/width)*1000;
    let y = ((event.clientY - rect.top)/height)*1000;

    // Añadimos los puntos a la lista de puntos existentes
    puntos.push(x);
    puntos.push(y);

    //console.log("Coordinate x: " + x, "Coordinate y: " + y);
    // Dibujamos la linea
    ctx.fillStyle = '#f00';
    ctx.lineTo(x,y);
    ctx.stroke();
}

/**
 * Dibuja el circulo de la foto dado el canvas, el click y los puntos ya existentes
 * canvas, event, ctx, puntos -> dibujarCirculo -> puntos
 */
function dibujarCirculo(canvas, event, ctx, punto){

    // Recogemos el tamaño del canvas
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    let rect = canvas.getBoundingClientRect();

    // Vemos donde s ha pulsado y lo hacemos a escala 0-100
    // Se multiplica por 1000 porque esa es la resolucion base del canvas
    let x = ((event.clientX - rect.left)/width)*1000;
    let y = ((event.clientY - rect.top)/height)*1000;

    // Añadimos los puntos a la lista de puntos existentes
    punto.push(x);
    punto.push(y);

    // Dibujamos el circulo
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 10);
    ctx.fill();
}

/**
 * Usa el canvas y el diccionario de orden para redibujar los puntos que deberian estar en el canvas
 * canvas, ctx, orden -> reDibujarPlano ->
 */
function reDibujarPlano(canvas, ctx, orden){
    
    // Limpiamos el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Recogemos las keys
    var keys = Object.keys(orden);
    var punticos = [];
    //console.log(keys.length);
    let result = "";
    
    // Miramos que contiene el diccionario
    for(var i = 0; i < keys.length; i++){

        result = keys[i].slice(0, 1);
        //console.log(keys[i]);

        // Si es una foto
        if(result == "F"){

            // Dibujamos un circulo
            ctx.beginPath();
            //console.log("Entro foto");
            punticos = orden[keys[i]];
            for(var j = 0; j < punticos.length; j = j+2){
                ctx.arc(punticos[j], punticos[j+1], 5, 0, 10);
            }
            ctx.closePath();
            ctx.fill();
            
        }

        // Si es una ruta
        else if(result == "R"){

            // Dibujamos una ruta
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
 * Se crea un JSON para subir los datos de los puntos a firebase
 * orden, ordenDeAcciones -> subirRuta ->
 */
async function subirRuta(orden, ordenDeAcciones){
    
    let result = "";

    // Dentro del JSON tenemos un marcador de tiempo y un msg, que es donde iran los puntos
    let JSON = {
        time: new Date().getTime(),
        msg:[
            
        ]
    
    }

    for(var i = 0; i < ordenDeAcciones.length; i++){

        result = ordenDeAcciones[i].slice(0, 1);

        // Si es una foto
        if(result == "F"){
            
            // Obtenemos los puntos
            var puntos = orden[ordenDeAcciones[i]];
            
            // Los creamos con formato JSON, el tipo indica que es una foto, el primer par es la posicion y el segundo la orientacion
            let punto ={
                tipo: "foto",
                posicion: {
                    x: (puntos[0]/10),
                    y: (puntos[1]/10)
                },
                orientacion: {
                    x: (puntos[2]/10),
                    y: (puntos[3]/10)
                }
            }

            // Se añade al JSON
            JSON.msg.push(punto);
        }

        else if(result == "R"){

            // Se crea el JSON especificando que es una ruta
            let punto ={
                tipo: "ruta",
                posiciones: [

                ]
            }


            var puntos = orden[ordenDeAcciones[i]];

            for(var j = 0; j < puntos.length; j = j+2){

                let pos = {
                    x: (puntos[j]/10) , 
                    y: (puntos[j+1]/10)
                }

                punto.posiciones.push(pos)

            }

            // Se añade al JSON
            JSON.msg.push(punto);
        }
    }

    // Recogemos el codigoDeVerificacion de este usuario
    var codigoVer = localStorage.getItem("CodigoVer");
    let texto = codigoVer + "-web"

    // Lo subimos a database
    await setDoc(doc(db, "orden", texto), {
        JSON: JSON
    });

    // Lo subimos a realtime
    set(storageRef(database, +codigoVer+'-web/'), JSON);
}

/**
 * Se crea un JSON para subir los datos de los puntos a firebase
 * orden, ordenDeAcciones, c, ctx -> recogerRuta ->
 */
async function recogerRuta(orden, ordenDeAcciones, c, ctx){
    
    var i = 0;
    var lista = [];

    // Lo recogemos de database
    const q = query(collection(db, "orden"));

    // Obtenemos los documentos en forma de objetos DocumentSnapshots
    await getDocs(q).then(querySnapshot => {
        querySnapshot.forEach(doc => {

            let valores = doc.data();
            let result = valores.JSON;

            // Desglosamos el mensaje JSON y lo añadimos a los puntos
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

            // Llamamos a redibujarPlano
            reDibujarPlano(c,ctx, orden);
            
            // Actualizamos el numero de ruta
            localStorage.setItem("nRuta", i);
            
            // Actualizamos el orden
            actualizarOrden(ordenDeAcciones);
        })

        return;
    }).catch(error => { });
    
      
}

/**
 * Actualiza el orden de acciones de la pagina
 * ordenDeAcciones -> actualizarOrden ->
 */
function actualizarOrden(ordenDeAcciones){
    
    // Buscamos el elemento
    const sideBar = document.getElementById("mySidebar");

    for(var i = 0; i < ordenDeAcciones.length; i++){

        var result = ordenDeAcciones[i].slice(0, 1);

        // Si es una foto
        if(result == "F"){
            var text = ordenDeAcciones[i];
            const collection = document.getElementById(text);

            // Si existe un elemento con esa id lo eliminamos y creamos uno nuevo
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

        // Si es una ruta
        if(result == "R"){
            var text = ordenDeAcciones[i];
            const collection = document.getElementById(text);

            // Si existe un elemento con esa id lo eliminamos y creamos uno nuevo
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

/**
 * Recoge las predicciones de realtime y las añade en una lista
 * body -> recogerAlertas ->
 */
async function recogerAlertas(body){
    // Hace una busqueda en la base de datos y recibe una lista de las alertas
    var alertas = ["Test 1", "Test 2", "testFinal"];
    
    // Crea las alertas 
    crearAlertas(alertas, body);
}

/**
 * Recoge las predicciones de realtime y las añade en una lista
 * alertas -> crearAlertas ->
 */
function crearAlertas(alertas){

    // Recogemos las imagenes de realtime
    get(storageRef(database, "-app")).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            
            // Añadimos las imagenes
            var datos = snapshot.val().msg[0].images[0];
            console.log(datos);
            /*
            var text = "FotoTest";
            var element = document.createElement(text);
            element.innerHTML = `<img src="${datos}">`;
            document.body.appendChild(element);
            */

            // Si existen alertas
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

                    // Incluimos los identificadores en el local storage
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

export { subirDatos, actualizarPlano, recogerImagen, dibujarRuta, dibujarCirculo, reDibujarPlano, subirRuta, recogerRuta, recogerAlertas, actualizarOrden};