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
        const odVar = new GameObject({
            x:5,
            y:6,
        })

        //test other char
        const npc1 = new GameObject({
            x:7,
            y:4,
            src:"./images/characters/people/npc1.png"
        })

    setTimeout(() => {
    odVar.sprite.draw(this.ctx);
    npc1.sprite.draw(this.ctx);
}, 200);

    }//end of Init

}//end of Overworld class