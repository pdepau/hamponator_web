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
  localStorage.setItem("reloadPreventivo", false)
  firebaseAuth.signInWithEmailAndPassword(firebaseAuth.getAuth(), correo, contrasena).catch(function(error) {
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
  localStorage.setItem("reloadPreventivo", false);
  location.href = '../index.html'; 
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

function comprobarUsuario(){
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
}

export {cerrarSesion, iniciarSesion, registroCorreoYContrasena };