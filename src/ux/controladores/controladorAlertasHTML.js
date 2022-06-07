// Nombre fichero: controladorAlertasHTML.js
// Fecha: WIP
// Autor: Jorge Grau Giannakakis
// Descripción: Gestiona la logica de las alertas y la creación del pdf


var lista = [];
var datosImagenes = [];
var datosTexto = [];

var convertir = false;

function aceptar(i) {
    destruir(i, 1);
  }
  function falsaAlarma(i) {
    destruir(i, 2);
  }

  function crearPDF() {

    const d = new Date();
    var posicionImagen=190;
    var posicionTexto=190;
    var posicionBarra=220;
    var doc = new jsPDF({ putOnlyUsedFonts: true, orientation: "portrait" });
    source = document.getElementById("content");
    doc.setFont("helvetica", "bold");

    doc.setDrawColor(0);
    doc.setFillColor(130, 130, 130);
    doc.rect(30, 10, 150, 10, "FD");
    doc.text("Resumen informe de Vigilancia Robot Hamponator", 38, 17);

    doc.setFont("helvetica", "bold");
    doc.text("Datos de la Empresa", 80, 30);
    doc.line(20, 40, 170, 40); 

    doc.text("Nombre:", 20, 50);
    doc.text("Dirección de la fábrica:", 20, 60);
    doc.text("Población:", 20, 70);
    doc.text("Teléfono:", 20, 80);
    doc.text("Responsable del robot:", 20, 90);
    doc.text("NIF del responsble:", 20, 100);

    doc.text("Modelo:", 20, 140);
    doc.text("Nº de serie:", 20, 150);
    doc.text("Sistema Operativo:", 20, 160);
    //aqui se introducen los datos de la empresa y del robot
           

    doc.setFont("helvetica", "normal");
    doc.text(localStorage.getItem("Nombre"), 44, 50);
    doc.text(localStorage.getItem("Direccion"), 84, 60);
    doc.text(localStorage.getItem("Poblacion"), 50, 70);
    doc.text(localStorage.getItem("Telefono"), 46, 80);
    doc.text(localStorage.getItem("Responsable"), 85, 90);
    doc.text(localStorage.getItem("NIF"), 74, 100);

    doc.setFont("helvetica", "bold");
    doc.text("Datos del robot", 80, 120);
    doc.line(20, 125, 170, 125); // horizontal line

    doc.setFont("helvetica", "normal");
    doc.text(localStorage.getItem("Modelo"), 44, 140);
    doc.text(localStorage.getItem("Serie"), 52, 150);
    doc.text(localStorage.getItem("SO"), 73, 160);



    doc.setFont("helvetica", "bold");
    doc.text("Suceso", 45, 175);
    doc.text("Descripción", 120, 175);
    doc.rect(20, 180, 70, 0);
    doc.rect(100, 180, 70, 0);

    doc.setFont("helvetica", "normal");
    var contador=0;
    for(var i=0;i<lista.length; i++){

      if(lista[i]==1){
      var text = "imagenes"+i;
      var textImagen = "imagen" + i;
      var imagen = document.getElementById(textImagen);
      var imagen =  localStorage.getItem(text);
      doc.addImage(imagen, "JPEG", 45, posicionImagen+contador*40, 25, 25);
      var text = "alertasTexto"+i;
      var predict = localStorage.getItem(text);

      doc.text(predict, 100, posicionTexto+contador*40);
      doc.setLineWidth(0.01);
      doc.line(20, posicionBarra+contador*40, 170, posicionBarra+contador*40); // horizontal line
      contador++;
      if(posicionImagen+i*40>190){
        doc.addPage("a4");
        posicionImagen=5;
        posicionTexto=25;
        posicionBarra=0;
        contador=0;
        }
      }
    
    }     
    var nombrePDF='informe alertas Hamponator dia '+d.getDay()+'-'+d.getMonth()+'-'+d.getFullYear()+'.pdf'
    doc.save(nombrePDF);

  }

/**
 * Recoge los datos de las alertas y los convierte a arrays para su uso futuro
 * -> convertirLista -> datosImagenes, lista
 */
function convertirLista(){
    var alertas = localStorage.getItem("alertas");
    var alertasImagenes = localStorage.getItem("imagenes");
    for(var i = 0; i < alertas.length; i++){
        if(Number.isInteger(parseInt(alertas[i]))){
            lista.push(parseInt(alertas[i]));
        }
    }

    for(var i = 0; i < lista.length; i++){
        var text = "imagenes"+i;
        var alertasImagenes = localStorage.getItem(text);
        var text = "alertasTexto"+i;
        var alertasTexto = localStorage.getItem(text);
        datosImagenes.push(alertasImagenes);
        datosTexto.push(alertasTexto);
    }
}

/**
 * Destruye la alerta y se guarda si ha sido denegada o aceptada
 * i, valor -> destruir ->
 */
function destruir(i, valor){
    var text = "Alerta" + i;
    const element = document.getElementById(text);
    element.style.display = "none";
    
    if (convertir == false){
        convertir = true;
        convertirLista();
   }
    // El valor indica si ha sido denegada o no
    lista[i] = valor;
    comprobarAlertas(lista);
}

/**
 * Si han sido aceptadas o denegadas todas las alertas se muestra el resultado final
 * alertas -> comprobarAlertas ->
 */
function comprobarAlertas(alertas){

    //console.log("Aqui vienen alertas");
    //console.log(alertas);
    //console.log("Aqui vienen lista");
    //console.log(lista);
    if(!alertas.includes(0) && alertas.length > 0){
        var text = "pdf";
        const collection = document.getElementById(text);

        // Si existe un elemento con esa id lo eliminamos y creamos uno nuevo
        if(collection!=null){
            collection.remove();
        }
        var element = document.createElement(text);

            element.innerHTML =`<div class="divContenedorPDF">
                                <div class = "tituloPdf">
                                    <h2>Resumen de las alertas RobotsSL</h2>
                                    </div>

                                    <div class = "contenidoPdf" id="content">

                                    </div>
                                    
                                    <div class = "finalPdf">
                                        <div class = "fecha">
                                        <h3>
                                            Generar informe dia/mes/año
                                        </h3>
                                        </div>
                                        <div class = "descarga">
                                        <button class = "botonDescarga" id="botonDescarga" onclick="crearPDF()"> Descargar informe </button>
                                    </div>
                                </div>
                                </div>`;
        document.body.appendChild(element);


        // Se llama a incluir alertas para añadir al esqueleto final las alertas aceptadas
        incluirAlertas(alertas);
    } 
}

/**
 * Se añaden al esqueleto final las alertas aceptadas
 * alertas -> incluirAlertas ->
 */
function incluirAlertas(alertas){
    const contenido = document.getElementById("content");
    for(var i = 0; i < alertas.length; i++){

        // Si la alerta esta validada
        if(alertas[i] == 1){
            
            var text = "AlertaFinal" + i;
            const collection = document.getElementById(text);
            var textImagen = "imagen" + i;
            

            // Si existe un elemento con esa id lo eliminamos y creamos uno nuevo
            if(collection!=null){
                collection.remove();
            }
            var element = document.createElement(text);

            element.innerHTML =`<div class="contenido">
                                    <div class="imagen">
                                        <img class="imagenAlertas" id="${textImagen}" src="${datosImagenes[i]}">
                                    </div>
                                    <div class="prediccion">
                                    <p>
                                        ${datosTexto[i]}
                                        </p>
                                    </div>
                                </div>`;
            contenido.appendChild(element);
        }
}
}
