<?php
    $destinatario = 'blanespau@gmail.com'
    $nombre = $_POST['nombre'];
    $email = $_POST['correo'];
    $empresa = $_POST['empresa']
    $mensaje = $_POST['mensaje']

    $header = "Contacto realizado desde la pagina de Hamponator"
    $mensajeCompleto = $mensaje . "\nAtentamente: " . $nombre;

    mail($destinatario, $empresa, $mensajeCompleto, $header);
    echo "<script>alert('correo enviado exitosamente')</script>"
    echo "<script> setTimeout(\"location.href='index.html'\",1000)</script>";

?>