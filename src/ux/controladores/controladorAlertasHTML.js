var lista = [];


function convertirLista(){
    var alertas = localStorage.getItem("alertas");
    for(var i = 0; i < alertas.length; i++){
        if(Number.isInteger(parseInt(alertas[i]))){
            lista.push(parseInt(alertas[i]));
        }
    }
    console.log(lista);
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

    console.log(alertas);

    if(!alertas.includes(0)){
        var text = "pdf";
        var element = document.createElement(text);

            element.innerHTML = `  <div class = "tituloPdf" id=${text}>
                                    <p>Resumen de las alertas RobotsSL</p>
                                    </div>
                                    
                                    <div class = "contenidoPdf">
                                    
                                    </div>
                                    
                                    <div class = "finalPdf">
                                    <p class = "fecha">
                                    Generar informe dia/mes/año
                                    </p>
                                    <button class = "descarga" href="javascript:demoFromHTML()">
                                    Descarga
                                    </button>
                                    </div>`;
            document.body.appendChild(element);
    }

    
}
