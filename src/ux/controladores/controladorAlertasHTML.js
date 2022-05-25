var lista = [];
var datosImagenes = [];
var datosTexto = [];

var convertir = false;

/**
 * Recoge los datos de las alertas y los convierte a arrays para su uso futuro
 * -> convertirLista -> datosImagenes, lista
 */
function convertirLista(){
    var alertas = localStorage.getItem("alertas");
    var alertasImagenes = localStorage.getItem("imagenes");
    console.log(alertasImagenes);
    for(var i = 0; i < alertas.length; i++){
        if(Number.isInteger(parseInt(alertas[i]))){
            lista.push(parseInt(alertas[i]));
        }
    }
    console.log(lista);

    for(var i = 0; i < lista.length; i++){
        var text = "imagenes"+i;
        var alertasImagenes = localStorage.getItem(text);
        var text = "alertasTexto"+i;
        var alertasTexto = localStorage.getItem(text);
        datosImagenes.push(alertasImagenes);
        datosTexto.push(alertasTexto);
    }
    console.log("Viene alertasImagenes");
    console.log(datosImagenes[0]);
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

    console.log("Aqui vienen alertas");
    console.log(alertas);
    console.log("Aqui vienen lista");
    console.log(lista);
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
                                        <button class = "botonDescarga" onclick="demoFromHTML()"> Descarga </button>
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

            // Si existe un elemento con esa id lo eliminamos y creamos uno nuevo
            if(collection!=null){
                collection.remove();
            }
            var element = document.createElement(text);

            element.innerHTML =`<div class="contenido">
                                    <div class="imagen">
                                        <img class="imagenAlertas"src="${datosImagenes[i]}">
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
