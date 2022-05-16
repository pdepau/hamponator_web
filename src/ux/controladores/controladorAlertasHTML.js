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
                                    </div>
                                    
                                    <div class = "contenidoPdf">
                                    
                                    </div>
                                    
                                    <div class = "finalPdf">
                                    <p class = "fecha">
                                    7/7/5
                                    </p>
                                    <button class = "descarga">
                                    Descarga
                                    </button>
                                    </div>`;
            document.body.appendChild(element);
    }

    
}
