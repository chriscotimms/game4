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

        //draw lower layer
        this.map.drawLowerImage(this.ctx);

        //Draw game objects
        Object.values(this.map.gameObject).forEach(object => {
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
    this.startGameLoop();
        
    }//end of Init



}//end of Overworld class
