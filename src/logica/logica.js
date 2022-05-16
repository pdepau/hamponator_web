// Nombre fichero: logica.js
// Fecha: WIP
// Autor: Jorge Grau Giannakakis
// Descripción: Gestiona la logica del centro de datos

import {dbStorage, database, getStorage, ref, uploadBytes, getDownloadURL, firebaseAuth, setDoc, doc, set, db, storageRef, collection, query, where, getDocs} from '../firebase.js';

const mapa = document.getElementById("mapa");
const cargarMapa = document.getElementById("cargarMapa");
const mySidebar = document.getElementById("mySidebar");
const main = document.getElementById("main");
const herramientas = document.getElementById("herramientas");

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
        console.log('Uploaded a blob or file!');
    });

    // Subimos el archivo y llamamos a la funcion recoger imagen pasado 1 segundo
    cargarMapa.style.display = "none";
    mapa.style.display = "block";
    setTimeout(function(){
        console.log("ahora");
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
        console.log('Uploaded a blob or file!');
    });

    // Subimos el archivo y mostramos la subida completada tras 1 segundo
    setTimeout(function(){
        alert ("Subida con exito"); 
    }, 1000);
    }
}

/**
 * Recoge cada varios segundos el mensaje del realtime y si es nuevo guarda su imagen en storage
 */
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

// Al declarar la funcion, empieza su ejecucion
startImageService();

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
    
    var keys = Object.keys(orden);
    var punticos = [];
    console.log(keys.length);
    let result = "";
    
    for(var i = 0; i < keys.length; i++){

        result = keys[i].slice(0, 1);
        console.log(keys[i]);
        // Si es una foto
        if(result == "F"){
            ctx.beginPath();
            console.log("Entro foto");
            punticos = orden[keys[i]];
            for(var j = 0; j < punticos.length; j = j+2){
                ctx.arc(punticos[j], punticos[j+1], 5, 0, 10);
            }
            ctx.closePath();
            ctx.fill();
            
        }

        else if(result == "R"){

            ctx.beginPath();
            console.log("Entro ruta");
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

async function subirRuta(orden, ordenDeAcciones, canvas){

    var keys = Object.keys(orden);
    console.log(keys.length);
    let result = "";
    var subida = [];

    let JSON = {
        time: new Date().getTime(),
        msg:[
            
        ]
    
    }

    for(var i = 0; i < ordenDeAcciones.length; i++){

        result = ordenDeAcciones[i].slice(0, 1);
        console.log(ordenDeAcciones[i]);

        // Si es una foto
        if(result == "F"){
            var puntos = orden[ordenDeAcciones[i]];
            
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

            JSON.msg.push(punto);

            /*
            let text = '{ '+ ordenDeAcciones[i] +' : [' +
            '{ "posicionX":'+ (puntos[0]/10) +' , "posicionY":'+ (puntos[1]/10) +' },' +
            '{ "orientacionX":'+ (puntos[2]/10) +' , "orientacionY":'+ (puntos[3]/10) +']}';
            console.log(text);
            */
            //subida.push(text);
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
                    x: (puntos[j]/10) , 
                    y: (puntos[j+1]/10)
                }

                punto.posiciones.push(pos)

                //text+='{ "posicionX":'+ (puntos[j]/10) +' , "posicionY":'+ (puntos[j+1]/10) +' },';
            }
            //text+=']}';
            
            console.log(text);
            subida.push(text);



            JSON.msg.push(punto);
        }
    }

    console.log(subida);
    // Add a new document in collection "cities"
    await setDoc(doc(db, "pruebas", "orden"), {
        tipo: "Envio",
        JSON: subida,
        orden: ordenDeAcciones
     });

    var uid = localStorage.getItem("UID");
    const q = query(collection(db, "Empresas"), where('UID', '==', uid));
        // Obtenemos los documentos en forma de objetos DocumentSnapshots
    await getDocs(q).then(querySnapshot => {
        querySnapshot.forEach(doc => {
            let value = doc.data();
            console.log(Object.values(value));
            let objeto = Object.values(value);
            for(var i = 0; i<objeto.length; i++){
                if(Number.isInteger(objeto[i])){
                    var codigoVer = objeto[i];
                }
            }

            set(storageRef(database, +codigoVer+'-web/'), JSON);
            
        })
        return;
    }).catch(e => {
        console.log(e);
    });
      
}

export { subirDatos, actualizarPlano, recogerImagen, dibujarRuta, dibujarCirculo, reDibujarPlano, subirRuta };