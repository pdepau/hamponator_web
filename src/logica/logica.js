// Nombre fichero: logica.js
// Fecha: WIP
// Autores: Jorge Grau Giannakakis, Luis Belloch Martinez
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
    // Se deben guardar en escala de 10 para poder ser enviados
    // Es caótico pero la estructura está hecha así ya
    puntos.push({x: x/10, y: y/10});

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
    punto.push({x: x/10, y: y/10});

    // Dibujamos el circulo
    ctx.fillStyle = '#00f';
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
    // Es redundante porque orden es una lista pero me da pereza cambiarlo (Luis)
    var keys = Object.keys(orden);
    var punticos = [];
    
    // Tomamos los puntos de orden
    for (let i = 0; i < keys.length; i++) {
        // si el punto es una ruta, dibuja sus puntos en ctx
        if (orden[keys[i]].tipo == "ruta") {
            punticos = orden[keys[i]].puntos;
            //console.log(punticos);
            // Si no es el primero y el anterior tambien era una ruta, une el ultimo de la
            // anterior con el primero de esta
            if (i != 0 && orden[keys[i-1]].tipo == "ruta") {
                // toma el ultimo punto de la anterior
                let ultimo = orden[keys[i-1]].puntos[orden[keys[i-1]].puntos.length-1];
                // toma el primer punto de esta
                let primero = punticos[0];
                // une los puntos con una linea
                ctx.beginPath();
                ctx.moveTo(ultimo.x*10, ultimo.y*10);
                ctx.lineTo(primero.x*10, primero.y*10);
                ctx.stroke();
            }
            // Si el anterior era una foto une el ultimo con la posicion de la foto
            else if (i != 0 && orden[keys[i-1]].tipo == "foto") {
                // toma el ultimo punto de la anterior
                let ultimo = orden[keys[i-1]].posicion;
                // toma el primer punto de esta
                let primero = punticos[0];
                ctx.beginPath();
                ctx.moveTo(ultimo.x*10, ultimo.y*10);
                ctx.lineTo(primero.x*10, primero.y*10);
                ctx.stroke();
            }
            // une los puntos con una linea
            for (let j = 0; j < punticos.length; j++) {
                ctx.fillStyle = '#f00';
                ctx.fillRect(punticos[j].x*10, punticos[j].y*10, 10, 10);
                // si no es el primero, lo une con una linea al anterior
                if (j != 0) {
                    ctx.beginPath();
                    ctx.moveTo(punticos[j-1].x*10, punticos[j-1].y*10);
                    ctx.lineTo(punticos[j].x*10, punticos[j].y*10);
                    ctx.stroke();
                } // if
            } // for
            // si es de tipo foto
        } else if (orden[keys[i]].tipo == "foto") {
            // dibuja el circulo de color rojo
            ctx.fillStyle = '#f00';
            ctx.beginPath();
            ctx.arc(orden[keys[i]].posicion.x*10, orden[keys[i]].posicion.y*10, 5, 0, 10);    
            ctx.fill();
            // dibuja el circulo de orientacion de color azul
            ctx.fillStyle = '#00f';
            ctx.beginPath();
            ctx.arc(orden[keys[i]].orientacion.x*10, orden[keys[i]].orientacion.y*10, 5, 0, 10);
            ctx.fill();
            // Dibuja una flecha desde la posicion hasta la orientacion
            ctx.beginPath();
            ctx.moveTo(orden[keys[i]].posicion.x*10, orden[keys[i]].posicion.y*10);
            ctx.lineTo(orden[keys[i]].orientacion.x*10, orden[keys[i]].orientacion.y*10);
            ctx.stroke();
            // si el anterior era una ruta, une el circulo de posicion a la ultima
            // posicion de la ruta
            if (i != 0 && orden[keys[i-1]].tipo == "ruta") {
                // toma el ultimo punto de la anterior
                let ultimo = orden[keys[i-1]].puntos[orden[keys[i-1]].puntos.length-1];
                // une los puntos con una linea
                ctx.beginPath();
                ctx.moveTo(ultimo.x*10, ultimo.y*10);
                ctx.lineTo(orden[keys[i]].posicion.x*10, orden[keys[i]].posicion.y*10);
                ctx.stroke();
            }
            // si el ultimo era una foto une ambos puntos de posicion
            if (i != 0 && orden[keys[i-1]].tipo == "foto") {
                // toma el ultimo punto de la anterior
                let ultimo = orden[keys[i-1]].posicion;
                // une los puntos con una linea
                ctx.beginPath();
                ctx.moveTo(ultimo.x*10, ultimo.y*10);
                ctx.lineTo(orden[keys[i]].posicion.x*10, orden[keys[i]].posicion.y*10);
                ctx.stroke();
            }
        } // if
    } // for
} // ()

/**
 * Se crea un JSON para subir los datos de los puntos a firebase
 * orden, ordenDeAcciones -> subirRuta ->
 */
async function subirRuta(orden, canvasElem){

    // Dentro del JSON tenemos un marcador de tiempo y un msg, que es donde iran los puntos
    let JSON = {
        time: new Date().getTime(),
        msg: orden
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
async function recogerRuta(orden, c, ctx, callback){

    // Lo recogemos de database
    const q = query(collection(db, "orden"));

    // Obtenemos los documentos en forma de objetos DocumentSnapshots
    await getDocs(q).then(querySnapshot => {
        querySnapshot.forEach(doc => {

            let valores = doc.data();
            let result = valores.JSON;

            orden = result.msg;

            console.log("Orden recibido de Firebase:")
            console.log(result)

            // Las guardamos en controladorRutas
            callback(orden);
            
            // Actualizamos el numero de ruta
            localStorage.setItem("nRuta", orden.length);
        })

        return;
    }).catch(error => { });
}

/**
 * Actualiza el orden de acciones de la pagina
 * ordenDeAcciones -> actualizarOrden ->
 */
function actualizarOrden(ordenes){
    
    // Buscamos el elemento
    const sideBar = document.getElementById("mySidebar");
    sideBar.innerHTML = "";

    for(var i = 0; i < ordenes.length; i++){
        const collection = document.getElementById(ordenes[i].id);
        

        // Si es una foto
        if(ordenes[i].tipo == "foto"){

            // Si existe un elemento con esa id lo eliminamos y creamos uno nuevo
            if(collection!=null){
                collection.remove();
            }

            var element = document.createElement(ordenes[i].id);
    
            element.innerHTML = `<div class = "orden" id=${ordenes[i].id}>
                                    <img src="../ux/img/camera-solid.svg" alt="icono" class = "imagen">
                                    <p class = "texto">${ordenes[i].id}</p>
                                </div>`;
            sideBar.appendChild(element);
        }

        // Si es una ruta
        if(ordenes[i].tipo == "ruta"){

            // Si existe un elemento con esa id lo eliminamos y creamos uno nuevo
            if(collection!=null){
                collection.remove();
            }
        
            var element = document.createElement(ordenes[i].id);
    
            element.innerHTML = `<div class = "orden" id=${ordenes[i].id}>
                                    <img src="../ux/img/route-solid.svg" alt="icono" class = "imagen">
                                    <p class = "texto">${ordenes[i].id}</p>
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
 * -> recogerAlertas ->
 */
async function recogerAlertas(){

    var codigoVer = localStorage.getItem("CodigoVer");
    let text = codigoVer+"-app"
    let alertas = [];
    let imagenes = [];
    // Recogemos las imagenes de realtime
    get(storageRef(database, text)).then((snapshot) => {
        if (snapshot.exists()) {
            console.log(snapshot.val());
            var data = snapshot.val().msg;
            data.forEach(elementos => {
                console.log(elementos.label);
                alertas.push(elementos.label);
                imagenes.push(elementos.img);
            });

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
                                                <img class="imagenAlertas"src="${imagenes[i]}">
                                            </div>
                                            <div class="prediccion">
                                            ${alertas[i]}
                                            </div>
                                            </div>
                                        </div>`;
                    document.body.appendChild(element);

                    // Incluimos los identificadores en el local storage
                    var text = "imagenes"+i;
                    localStorage.setItem(text, imagenes[i]);
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

async function recogerDatosEmpresa(){

    // Lo recogemos de database
    const q = query(collection(db, "Empresas"));

    var uid = localStorage.getItem("UID");

    // Obtenemos los documentos en forma de objetos DocumentSnapshots
    await getDocs(q).then(querySnapshot => {
        querySnapshot.forEach(doc => {

            let valor = doc.data();
            if(uid == valor.UID){
                console.log(valor);
                localStorage.setItem("Nombre", valor.Nombre);
                localStorage.setItem("Direccion", valor.direccion);
                localStorage.setItem("Poblacion", valor.municipio);
                localStorage.setItem("Telefono", valor.telefono);
                localStorage.setItem("Responsable", valor.responsable);
                localStorage.setItem("NIF", valor.nif);
                localStorage.setItem("Modelo", valor.modelo);
                localStorage.setItem("Serie", valor.serie);
                localStorage.setItem("SO", valor.so);

            }

        })

        return;
    }).catch(error => { });
}

export { subirDatos, actualizarPlano, recogerImagen, dibujarRuta, dibujarCirculo, reDibujarPlano, subirRuta, recogerRuta, recogerAlertas, actualizarOrden, recogerDatosEmpresa};