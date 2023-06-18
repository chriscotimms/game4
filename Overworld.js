//top level component, keeping track of lots of lower level states below
class Overworld {

    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }


startGameLoop(){
    const step = () => {

        //clear canvas
        this.ctx.clearRect(0,0,this.canvas.width, this.canvas.height);

        //draw lower layer
        this.map.drawLowerImage(this.ctx);

        //Draw game objects
        Object.values(this.map.gameObject).forEach(object => {
            object.update({
                arrow: this.directionInput.direction,
            });
            object.sprite.draw(this.ctx);
        })

        //draw upper layer
        this.map.drawUpperImage(this.ctx);

        requestAnimationFrame(() => {
            step();
        })
    }
    step();
}//end of game loop


init() {

    this.map = new OverWorldMap(window.OverWorldMaps.DemoRoom);

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();
        
    }//end of Init



}//end of Overworld class
