// Nombre fichero: logica.js
// Fecha: WIP
// Autor: Jorge Grau Giannakakis
// Descripción: Gestiona la logica del centro de datos

import {dbStorage, getStorage, ref, uploadBytes, getDownloadURL, firebaseAuth} from '../firebase.js';

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
export { subirDatos, actualizarPlano, recogerImagen };