var context, controller, rectangle, loop; 

context = document.getElementById("display").getContext("2d");

context.canvas.height = 180;
context.canvas.width = 320;

rectangle = {
    height:32,
    jumping:true,
    width:32,
    x:0,
    x_velocity:0,
    y:72,
    y_velocity:0,
};

controller = {

    left:false,
    right:false,
    up:false,
    down:false,
    keyListener:function(event) {

        var key_state = (event.type == "keydown")?true:false;

        switch(event.keyCode) {
            case 37: //left key
            controller.left = key_state;
            break;
            case 38: //up key
            controller.up = key_state;
            break;
            case 39: //right key
            controller.right = key_state;
            break;
        }

    }

};

loop = function() {

    if (controller.up && rectangle.jumping == false) {
        rectangle.y_velocity -= 20;
        rectangle.jumping = true;
    }

    if (controller.left) {
        rectangle.x_velocity -= 0.5;
    }

    if (controller.right) {
        rectangle.x_velocity += 0.5;
    }

    rectangle.y_velocity += 1.1;//gravity
    rectangle.x += rectangle.x_velocity;
    rectangle.y += rectangle.y_velocity;
    rectangle.x_velocity *= 0.9;//friction
    rectangle.y_velocity *= 0.9; //friction


    //collision
    //if rectangle is falling below floor line
    if (rectangle.y > context.canvas.height - rectangle.height -16) {
        rectangle.jumping = false;
        rectangle.y = context.canvas.height - rectangle.height -16;
        rectangle.y_velocity =0;
    }

    //not-quite-collison
    if(rectangle.x < -rectangle.width) {
        rectangle.x = context.canvas.width;
    } else if (rectangle.x > context.canvas.width) {
        rectangle.x = -rectangle.width;
    }




    context.fillStyle = "#202020";
    context.fillRect(0,0,320,180);
    context.fillStyle = "#ff0000";
    context.beginPath();
    context.rect(rectangle.x, rectangle.y, rectangle.width, rectangle.height);
    context.fill();
    context.strokeStyle = "#202830";
    context.lineWidth = 4;
    context.beginPath();
    context.moveTo(0,164);
    context.lineTo(320, 164);
    context.stroke();

// call update when browser is ready to update at end of function
    window.requestAnimationFrame(loop);


};


window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);

//first initiate function 
window.requestAnimationFrame(loop);