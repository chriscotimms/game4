(function() {

    var buffer, context, controller, drawMap, loop, map, output, size;

    buffer = document.createElement("canvas").getContext("2d");
    context = document.querySelector("canvas").getContext("2d");
    output = document.querySelector("p");

    map = [
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,0,1,1,1,0,0,1,0,0,1,0,0,1,0,1,
            1,0,0,1,0,1,0,1,0,1,0,1,0,1,0,1,
            1,0,0,1,0,0,0,1,0,1,1,1,0,1,0,1,
            1,0,0,1,0,1,0,1,0,1,0,0,0,0,0,1,
            1,0,0,1,0,1,0,1,0,0,1,1,0,1,0,1,
            1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
            1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
        ];

    size = 32;

    buffer.canvas.width = 16 * size;
    buffer.canvas.height = 9 * size;

controller = {
    pointer_x:0,
    pointer_y:0,

    move:function(event) {
        var rectangle = context.canvas.getBoundingClientRect();

        controller.pointer_x = event.clientX - rectangle.left;
        controller.pointer_y = event.clientY - rectangle.top;

    }
};



drawMap = function() {

        for (let index = 0; index < map.length; index +=1) {

            buffer.fillStyle = (map[index] == 1)?"#000000":"#ffffff";
            buffer.fillRect((index % 16) * size, Math.floor(index/16) * size, size, size);
        }

        

};


loop = function(time_stamp) {

    var tile_x, tile_y, value;

    tile_x = Math.floor(controller.pointer_x / (context.canvas.width/16));
    tile_y = Math.floor(controller.pointer_y / (context.canvas.height/9));
    value = map[tile_y * 16 + tile_x];

    drawMap();

    buffer.fillStyle = "rgba(128, 128, 128, 0.5)";
    buffer.fillRect(tile_x * size, tile_y * size, size, size);

    context.drawImage(buffer.canvas, 0, 0, buffer.canvas.width, buffer.canvas.height, 0, 0, context.canvas.width, context.canvas.height);

    output.innerHTML = "tile_x: "+ tile_x + "<br>tile_y: " + tile_y + "<br>value: " + value;

    window.requestAnimationFrame(loop);

};



resize = function(event) {
    context.canvas.width = Math.floor(document.documentElement.clientWidth - 32);

    if (context.canvas.width > document.documentElement.clientHeight) {
        context.canvas.width = Math.floor(document.documentElement.clientHeight);

    }

    context.canvas.height = Math.floor(context.canvas.width * 0.5625);
    drawMap();
};

window.addEventListener("resize", resize, {passive:true});
context.canvas.addEventListener("mousemove", controller.move);

resize();

window.requestAnimationFrame(loop);


})();