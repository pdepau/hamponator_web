
document.addEventListener('DOMContentLoaded', event => {
    console.log("entro en la pagina")

    botonConectar = document.getElementById("btn_con")
    botonDesconectar = document.getElementById("btn_dis")
    textoConexion = document.getElementById("estadoConexion")

    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    var img = new Image();
    img.src = 'my_map.jpg';
    img.onload = function () {

        drawImageScaled(img,ctx)
    }

    let date = new Date()


    function drawImageScaled(img, ctx) {
        var canvas = ctx.canvas ;
        var hRatio = canvas.width  / img.width    ;
        var vRatio =  canvas.height / img.height  ;
        var ratio  = Math.min ( hRatio, vRatio );
        var centerShift_x = ( canvas.width - img.width*ratio ) / 2;
        var centerShift_y = ( canvas.height - img.height*ratio ) / 2;  
        ctx.clearRect(0,0,canvas.width, canvas.height);
        ctx.drawImage(img, 0,0, img.width, img.height,
                           centerShift_x,centerShift_y,img.width*ratio, img.height*ratio);  
     }

    botonConectar.addEventListener("click", connect)
    botonDesconectar.addEventListener("click", disconnect)

    botonDesconectar.disabled = true
    textoConexion.innerHTML = "Desconectado"
    textoConexion.style.color = "#FF0000"

    data = {
        // ros connection
        ros: null,
        rosbridge_address: 'ws://127.0.0.1:9090/',
        connected: false,
    }

    var cmdVel = new ROSLIB.Topic({
        ros: null,
        name: '/goal_pose',
        messageType: 'geometry_msgs/msg/PoseStamped'
    });

    var odom = new ROSLIB.Topic({
        ros: null,
        name: '/waypoints',
        messageType: 'visualization_msgs/msg/MarkerArray'
    });

    let mensaje = new ROSLIB.Message({
        header: {
            stamp: {
                sec: 25 ,
                nanosecs: 274857925
            },
            frame_id: 'map'
        },
        pose: {
            position: {
                x: 3.613312244415283,
                y: -3.553152561187744,
                z: 0.0
            },
            orientation: {
                x: 0.0,
                y: 0.0,
                z: 0.0,
                w: 0.8
            }
        }
    })



    function connect() {
        console.log("Clic en connect")

        data.ros = new ROSLIB.Ros({
            url: data.rosbridge_address
        })

        cmdVel.ros = data.ros
        odom.ros = data.ros

        botonDesconectar.disabled = false
        botonConectar.disabled = true
        textoConexion.innerHTML = "Conectado"
        textoConexion.style.color = "#00FF00"

        // Define callbacks
        data.ros.on("connection", () => {
            data.connected = true
            //mover()
            console.log("Conexion con ROSBridge correcta")

        })
        data.ros.on("data", (data) => {
            console.log("Se ha producido algun data")
            console.log(data)
        })
        data.ros.on("error", (error) => {
            console.log("Se ha producido algun error mientras se intentaba realizar la conexion")
            console.log(error)
        })
        data.ros.on("close", () => {
            data.connected = false
            console.log("Conexion con ROSBridge cerrada")
        })




        odom.subscribe(function (message) {
            console.log(message);
        });

       



    }

    function disconnect() {
        data.ros.close()
        data.connected = false
        console.log('Clic en botón de desconexión')
        botonDesconectar.disabled = true
        botonConectar.disabled = false
        textoConexion.innerHTML = "Desconectado"
        textoConexion.style.color = "#FF0000"
    }

    let robos_x = 0
    let robos_y = 0



    let dibujar_disponible = true
    function dibujar(coords) {
        if (dibujar_disponible) {
            dibujar_disponible = false
            setTimeout(function () {
                dibujar_disponible = true
                robos_x = coords.position.x
                robos_y = coords.position.y

                ctx.beginPath();
                ctx.arc((coords.position.x + 10) * 10, (coords.position.y + 10) * 10, 0.1, 0, 2 * Math.PI);
                ctx.stroke();
            }, 30)
        }

    }

    function relativePos(event, element) {
        var rect = element.getBoundingClientRect();
        return {
            x: Math.floor(event.clientX - rect.left),
            y: Math.floor(event.clientY - rect.top)
        };
    }

    c.addEventListener("click", function (event) {

        var ctx = c.getContext("2d");
        ctx.beginPath();
        pos = relativePos(event, ctx.canvas);
        console.log(pos)
        ctx.arc((pos.x), (pos.y), 3, 0, 2 * Math.PI);
        ctx.stroke();

        mensaje.pose.position.x = (pos.x - 35) / 10
        mensaje.pose.position.y = (pos.y - 58) / 10
        //cmdVel.publish(mensaje);
        odom.publish(create_waypoints())
    })

    let w_pressed = false;
    let a_pressed = false;
    let s_pressed = false;
    let d_pressed = false;

    document.addEventListener('keydown', (event) => {

        var name = event.key;
        console.log(name)
        if (name === 'w') {
            w_pressed = true
            twist_msg.linear.x = 0.42
        } if (name == 'a') {
            a_pressed = true
            twist_msg.angular.z = 2
        } if (name == 's') {
            s_pressed = true
            twist_msg.linear.x = -0.42
        } if (name == 'd') {
            d_pressed = true
            twist_msg.angular.z = -2
        }



    }, false);

    document.addEventListener('keyup', (event) => {

        var name = event.key;
        console.log(name)
        if (name === 'w') {
            w_pressed = false
            twist_msg.linear.x = 0
        } if (name == 'a') {
            a_pressed = false
            twist_msg.angular.z = 0
        } if (name == 's') {
            s_pressed = false
            twist_msg.linear.x = 0
        } if (name == 'd') {
            d_pressed = false
            twist_msg.angular.z = 0
        }
    }, false);



    function mover() {
        setTimeout(function () {
            console.log('hello'); //  your code here   
            listener.publish(twist_msg)
            if (data.connected) {
                mover()
            }

        }, 3)

    }





});