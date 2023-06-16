//top level component, keeping track of lots of lower level states below
class Overworld {

    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    init() {
        //map
        const image = new Image();
        image.onload = () => {//load image
            this.ctx.drawImage(image, 0, 0);//refers back to image variable
        };
        image.src = "./images/maps/DemoLower.png" //map src

        //odVar
        const x = 5;
        const y = 6;

        const shadow = new Image();
        shadow.onload = () => {
            this.ctx.drawImage(
                shadow, //variable name
                0, //starting points of left and top cut
                0, //starting points of left and top cut
                32,//pixel width of cut
                32,//pixel height of cut
                x * 16 -8,//position to draw image
                y * 16 -18, //position to draw image
                32,//width of image, change to skew
                32 //height of image
                );
        }
        shadow.src = "./images/characters/shadow.png";

        const odVar = new Image();
        odVar.onload = () => {
            this.ctx.drawImage(
                odVar, //variable name
                0, //starting points of left and top cut
                0, //starting points of left and top cut
                32,//pixel width of cut
                32,//pixel height of cut
                x * 16 -8,//position to draw image
                y * 16 -18, //position to draw image
                32,//width of image, change to skew
                32 //height of image
                );
        }
        odVar.src = "./images/characters/people/hero.png"; //odVar src



    }//end of Init

}//end of Overworld class