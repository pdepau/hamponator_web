// Nombre fichero: logicaAuth.js
// Fecha: WIP
// Autor: Jorge Grau Giannakakis
// Descripción: Gestiona la logica del registro e inicio de sesión a la pagina web

import{ firebaseAuth } from  '../firebase.js';


/**
 * Permite inicar sesión usando el correo y la contraseña
 * -> iniciarSesion -> 
 */
function iniciarSesion(){
  var correo = document.getElementById("campo_correo").value;
  var contrasena = document.getElementById("campo_contrasena").value;
  localStorage.setItem("SesionIniciada", 1);
  localStorage.setItem("reloadPreventivo", false)
  firebaseAuth.signInWithEmailAndPassword(firebaseAuth.getAuth(), correo, contrasena).catch(function(error) {
    localStorage.setItem("SesionIniciada", -1);
  });

  comprobarUsuario();
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

/**
 * Comprueba que el usuario existe y guarda su UID
 * -> comprobarUsuario -> 
 */
function comprobarUsuario(){
  firebaseAuth.onAuthStateChanged(firebaseAuth.getAuth(), function(user) {
    // Si el usuario esta registrado
    var sesion = localStorage.getItem("SesionIniciada");
    if (user) {
      if(sesion == 1){
        var uid = user.uid;
        console.log(uid + "");
        localStorage.setItem("UID", uid);
      }
      }
    });
}

export {cerrarSesion, iniciarSesion};