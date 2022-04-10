
document.addEventListener('DOMContentLoaded', event => {
    console.log("entro en la pagina")

    botonConectar = document.getElementById("btn_con")
    botonDesconectar = document.getElementById("btn_dis")
    botonCheckpoints = document.getElementById("btn_modo_check")
    botonRuta = document.getElementById("btn_modo_ruta")
    textoConexion = document.getElementById("estadoConexion")
    titulo = document.getElementById("title")
    modo = document.getElementById("modo")


    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");

    var img = new Image();
    img.src = 'my_map.jpg';
    img.onload = function () {

        drawImageScaled(img, ctx)
    }

    let date = new Date()


    function drawImageScaled(img, ctx) {
        var canvas = ctx.canvas;
        var hRatio = canvas.width / img.width;
        var vRatio = canvas.height / img.height;
        var ratio = Math.min(hRatio, vRatio);
        var centerShift_x = (canvas.width - img.width * ratio) / 2;
        var centerShift_y = (canvas.height - img.height * ratio) / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, img.width, img.height,
            centerShift_x, centerShift_y, img.width * ratio, img.height * ratio);
    }

    botonConectar.addEventListener("click", connect)
    botonRuta.addEventListener("click", function iniciar_ruta(params) {
        f_modo_ruta()
    })
    botonDesconectar.addEventListener("click", disconnect)
    botonCheckpoints.addEventListener("click", function click_modo_checkpoints(params) {
        if (!modo_checkpoints) {
            ctx.clearRect(0, 0, c.width, c.height)
            drawImageScaled(img, ctx)
            checkpoints.forEach(element => {
                pos = relativePosRobot(element[0], element[1], ctx.canvas)

                //console.log(pos)
                ctx.beginPath();
                ctx.strokeStyle = "#0000ff";
                ctx.arc(pos.x, pos.y, 3, 0, 2 * Math.PI);
                ctx.fillStyle = "blue";
                ctx.fill();
                ctx.stroke();
            });
        }

        modo_checkpoints = !modo_checkpoints
        modo.innerHTML = "Modo checkpoints : " + modo_checkpoints
    })

    botonDesconectar.disabled = true
    textoConexion.innerHTML = "Desconectado"
    textoConexion.style.color = "#FF0000"

    data = {
        // ros connection
        ros: null,
        rosbridge_address: 'ws://127.0.0.1:9090/',
        connected: false,
    }

    var goal_pose = new ROSLIB.Topic({
        ros: null,
        name: '/goal_pose',
        messageType: 'geometry_msgs/msg/PoseStamped'
    });

    var odom = new ROSLIB.Topic({
        ros: null,
        name: '/odom',
        messageType: 'nav_msgs/msg/Odometry'
    });

    var waypoints = new ROSLIB.Topic({
        ros: null,
        name: '/waypoints',
        messageType: 'visualization_msgs/msg/MarkerArray'
    });

    let mensaje = new ROSLIB.Message({
        header: {
            stamp: {
                sec: 1649056173,
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
            robos_x = message.pose.pose.position.x
            robos_y = message.pose.pose.position.y
            dibujar()
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


    function destino_alcanzado(x, y) {

        if (Math.abs(robos_x - x) < 0.3 && Math.abs(robos_y - y) < 0.3) {
            //console.log("destino")
            checkpoint_actual++
            if(checkpoint_actual >= checkpoints.length){
                checkpoint_actual = 0
            }
            titulo.innerHTML = "Destino alcanzado"
            titulo.style.color = "#00ff00"


        } else {
            titulo.innerHTML = "En camino"
            titulo.style.color = "#ff0000"

            //console.log(robos_x,destino_x)
            //console.log(robos_y,destino_y)

        }
    }

    let robos_x = 0
    let robos_y = 0

    let destino_x = 0
    let destino_y = 0

    let dibujar_disponible = true
    function dibujar() {
        if (dibujar_disponible) {
            dibujar_disponible = false
            setTimeout(function () {
                dibujar_disponible = true
                pos = relativePosRobot(robos_x, robos_y, ctx.canvas)
                ctx.beginPath();
                ctx.arc(pos.x, pos.y, 1, 0, 2 * Math.PI);

                ctx.stroke();


            }, 300)
        }

    }

    function f_modo_ruta() {
        if (modo_checkpoints) {
            setTimeout(function () {
                let checkpoint = checkpoints[checkpoint_actual]
                destino_alcanzado(checkpoint[0], checkpoint[1])
                f_modo_ruta()
            }, 30)
        }

    }

    function relativePos(event, rect) {
        return {
            x: Math.floor(event.clientX - rect.left),
            y: Math.floor(event.clientY - rect.top)
        };
    }


    function relativePosRobot(px, py, element) {
        var rect = element.getBoundingClientRect();
        px = px + 5.6
        py = py + 6.4

        return {
            x: Math.floor(px * rect.width / 11.6),
            y: Math.floor(py * rect.height / 9.4)
        };
    }


    c.addEventListener("click", function (event) {



        var ctx = c.getContext("2d");

        var rect = ctx.canvas.getBoundingClientRect();
        pos = relativePos(event, rect);

        ctx.beginPath();
        ctx.strokeStyle = "#FF0000";
        ctx.arc((pos.x), (pos.y), 3, 0, 2 * Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.stroke();

        destino_x = ((pos.x * 11.6) / rect.width - 5.6)
        destino_y = ((pos.y * 9.4) / rect.height - 6.4)

        mensaje.pose.position.x = destino_x
        mensaje.pose.position.y = destino_y

        if (modo_checkpoints) {
            checkpoints.push([destino_x, destino_y])
            console.log(checkpoints)
        }

        //cmdVel.publish(mensaje);
        //odom.publish(create_waypoints())
    })


    let checkpoints = []
    let checkpoint_actual = 0
    let modo_checkpoints = false






});