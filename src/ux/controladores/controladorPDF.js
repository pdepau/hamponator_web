function aceptar(i) {
    destruir(i, 1);
  }
  function falsaAlarma(i) {
    destruir(i, 2);
  }

  function demoFromHTML(cantidadAlertas,lista) {

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
    console.log("Aqui viene los logs del pdf");
    var contador=0;
    console.log("no va"); 
    for(var i=0;i<lista.length; i++){
      console.log("/////////////////")

      if(lista[i]==1){
      var text = "imagenes"+i;
      var textImagen = "imagen" + i;
      var imagen = document.getElementById(textImagen);
      var imagen =  localStorage.getItem(text);
      console.log(imagen)
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