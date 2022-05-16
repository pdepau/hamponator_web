// Nombre fichero: logicaAuth.js
// Fecha: WIP
// Autor: Jorge Grau Giannakakis
// Descripción: Gestiona la logica del registro e inicio de sesión a la pagina web

import{ firebaseAuth } from  '../firebase.js';


/**
 * Efectua el registro por correo y contraseña
 * -> registroCorreoYContrasena -> 
 */
function registroCorreoYContrasena(){

    var correo = document.getElementById("campo_correo").value;
    var contrasena = document.getElementById("campo_contrasena").value;
    var contrasenaConfirmar = document.getElementById("campo_contrasena_confirmar").value;
    
    if(correo != "" && contrasena != "" && contrasenaConfirmar != "" && contrasena == contrasenaConfirmar){
      firebaseAuth.createUserWithEmailAndPassword(firebaseAuth.getAuth(),correo, contrasena).catch(function(error) {

            var errorCode = error.code;
            var errorMessage = error.message;
        
            window.alert("Error : " + errorMessage + " Codigo de error: " + errorCode);
        
          });
    }

}

/**
 * Permite inicar sesión usando el correo y la contraseña
 * -> iniciarSesion -> 
 */
function iniciarSesion(codigoVer){
  var correo = document.getElementById("campo_correo").value;
  var contrasena = document.getElementById("campo_contrasena").value;
  localStorage.setItem("SesionIniciada", 1);
  localStorage.setItem("CodigoVer", codigoVer)
  firebaseAuth.signInWithEmailAndPassword(firebaseAuth.getAuth(), correo, contrasena).catch(function(error) {
  });

  setTimeout(function(){
    location.reload();
}, 700);
  
}
  
/**
 * Cerrar sesión
 * -> cerrarSesion -> 
 */
function cerrarSesion(){
  firebaseAuth.signOut(firebaseAuth.getAuth());
  localStorage.setItem("SesionIniciada", 0);
  localStorage.setItem("CodigoVer", -1)
  location.href = '../index.html'; 
}

export {cerrarSesion, iniciarSesion, registroCorreoYContrasena };