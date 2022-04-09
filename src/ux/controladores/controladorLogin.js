// Nombre fichero: controladorLogin.js
// Fecha: WIP
// Autor: Jorge Grau Giannakakis
// Descripción: El controlador de la pagina del login, llama a las funciones de la logica que necesite

import { firebaseAuth } from '../../firebase.js';
import { GoogleLogin, iniciarSesion } from '../../logica/logicaAuth.js'


window.addEventListener("DOMContentLoaded", async (e) => {

  // Cuando cargue la pagina se ejecutan las funciones

  firebaseAuth.onAuthStateChanged(firebaseAuth.getAuth(), function(user) {
    // Si el usuario esta registrado
    var sesion = localStorage.getItem("SesionIniciada");
    console.log(sesion);
    if (user) {
      if(sesion == 1){
        console.log("Hola2")
        var uid = user.uid;
        console.log(uid + "");
        localStorage.setItem("UID", uid);
  
        location.href = '../ux/rutas.html';
      }
      }
    });
  addButtonEventListeners();
});

function addButtonEventListeners() {
  document.getElementById("btn-iniciar-sesion").addEventListener("click", () => {
    iniciarSesion()});
  document.getElementById("btn-iniciar-sesion-google").addEventListener("click", () => {
    GoogleLogin()});
}