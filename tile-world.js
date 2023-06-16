(function() {

    var buffer, context, drawMap, map, size;

    buffer = document.createElement("canvas").getContext("2d");
    context = document.querySelector("canvas").getContext("2d");

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



})