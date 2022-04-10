
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