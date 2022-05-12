// Nombre fichero: firebase.js
// Fecha: WIP
// Autor: Jorge Grau Giannakakis
// Descripción: Aqui se especifican todos los datos necesaros para conectar con firebase

import { initializeApp} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js'
import { getFirestore, collection, query, where, getDocs, doc, setDoc} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js'
import { getDatabase, set, ref as storageRef} from 'https://www.gstatic.com/firebasejs/9.6.1/firebase-database.js'
import * as firebaseAuth from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js"
import { getStorage, ref, uploadBytes, getDownloadURL} from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";


// Configuración de firebase
var firebaseConfig = {
    apiKey: "AIzaSyDPjhcoNszTjWKoe_rubmmYZE--GX9tTL0",
    authDomain: "hamponator-web.firebaseapp.com",
    databaseURL: "https://hamponator-web-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "hamponator-web",
    storageBucket: "hamponator-web.appspot.com",
    messagingSenderId: "910773774186",
    appId: "1:910773774186:web:f0031246f5e9ef1211e713"
};



// Inicializar app de Firebase
const app = initializeApp(firebaseConfig);

// Inicializar y exportar instancia de Firestore
const db = getFirestore(app);

const dbStorage = getStorage(app);

const database = getDatabase(app);

export { db, dbStorage, database, collection, query, where, getDocs, firebaseAuth, getStorage, ref, uploadBytes, getDownloadURL, setDoc, doc, set, storageRef};