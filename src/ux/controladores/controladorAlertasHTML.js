var lista = [];
var datosImagenes = [];
var datosTexto = [];

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

convertirLista();

function destruir(i, valor){
    var text = "Alerta" + i;
    const element = document.getElementById(text);
    element.style.display = "none";
    
    lista[i] = valor;
    comprobarAlertas(lista);
}

function comprobarAlertas(alertas){

    reloadPreventivo = localStorage.getItem("reloadPreventivo");
    console.log("Soy reload preventivo");
    console.log(reloadPreventivo);
    if(reloadPreventivo == "false"){
        console.log("ajaja");
        localStorage.setItem("reloadPreventivo", true);
        location.reload();
    }
    console.log(alertas);

    if(!alertas.includes(0)){
        var text = "pdf";
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

        incluirAlertas(alertas);
    } 
}

function incluirAlertas(alertas){
    const contenido = document.getElementById("content");
    for(var i = 0; i < alertas.length; i++){
    if(alertas[i] == 1){
        console.log("Entro");
        
        var text = "AlertaFinal" + i;
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
