// Nombre fichero: firebase.js
// Fecha: WIP
// Autor: Abidán Brito Clavijo
// Descripción: Aqui se especifican todos los datos necesaros para conectar con firebase

import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js'
import { getFirestore, collection, query, where, getDocs, doc } from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js'
import * as firebaseAuth from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"


// Configuración de firebase
var firebaseConfig = {
    apiKey: "AIzaSyDPjhcoNszTjWKoe_rubmmYZE--GX9tTL0",
    authDomain: "hamponator-web.firebaseapp.com",
    projectId: "hamponator-web",
    storageBucket: "hamponator-web.appspot.com",
    messagingSenderId: "910773774186",
    appId: "1:910773774186:web:f0031246f5e9ef1211e713"
};

// Inicializar app de Firebase
initializeApp(firebaseConfig);

// Inicializar y exportar instancia de Firestore
const db = getFirestore();
export { db, collection, query, where, getDocs, firebaseAuth };