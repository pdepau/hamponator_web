// Nombre fichero: controladorLogin.js
// Fecha: WIP
// Autor: Jorge Grau Giannakakis
// Descripción: El controlador de la pagina del login, llama a las funciones de la logica que necesite

import { firebaseAuth, db, collection, query, where, getDocs } from '../../firebase.js';
import { iniciarSesion } from '../../logica/logicaAuth.js'


window.addEventListener("DOMContentLoaded", async (e) => {

  // Cuando cargue la pagina se ejecutan las funciones

  firebaseAuth.onAuthStateChanged(firebaseAuth.getAuth(), function(user) {
    // Si el usuario esta registrado
    var sesion = localStorage.getItem("SesionIniciada");
    console.log(sesion);
    if (user) {
      if(sesion == 1){
        var uid = user.uid;
        console.log(uid + "");
        localStorage.setItem("UID", uid);
        recogerCodigo();
      }
      }
    });
  addButtonEventListeners();
});

function addButtonEventListeners() {
  document.getElementById("btn-iniciar-sesion").addEventListener("click", () => {
  iniciarSesion()});
}

async function recogerCodigo(){
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
                    localStorage.setItem("CodigoVer", codigoVer);
                }
            }
        })

        var codigo = localStorage.getItem("CodigoVer");
        if(codigo != null){
        location.href = '../ux/rutas.html';
        }
        return;
    }).catch(e => {
        console.log(e);
    });
}