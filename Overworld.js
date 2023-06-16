//top level component, keeping track of lots of lower level states below
class Overworld {

    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    init() {
        const image = new Image();
        image.onload = () => {//load image
            this.ctx.drawImage(image, 0, 0);
        };
        image.src = "./images/maps/DemoLower.png"

    }

}//end of Overworld class