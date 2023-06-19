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

        //Establish a camera person to follow
        const cameraPerson = this.map.gameObjects.odVar;

        //Update all objects
        Object.values(this.map.gameObjects).forEach(object => {
            object.update({
                arrow: this.directionInput.direction,
                map: this.map,
            })
        })

        //draw lower layer
        this.map.drawLowerImage(this.ctx, cameraPerson);

        //Draw game objects
        Object.values(this.map.gameObjects).sort((a,b) => {
            return a.y - b.y;
        })
        .forEach(object => {
            object.sprite.draw(this.ctx, cameraPerson);
        })

        //draw upper layer
        this.map.drawUpperImage(this.ctx, cameraPerson);

        requestAnimationFrame(() => {
            step();
        })
    }
    step();
}//end of game loop



//this loads everything! map, walls, direction, gameloop
init() {

    this.map = new OverWorldMap(window.OverWorldMaps.DemoRoom);
    this.map.mountObjects();

    this.directionInput = new DirectionInput();
    this.directionInput.init();

    this.startGameLoop();

    this.map.startCutscene([
        { who:"odVar", type:"walk", direction:"down" },
        { who:"odVar", type:"walk", direction:"down" },
        { who:"odVar", type:"walk", direction:"left" },
        { who:"odVar", type:"walk", direction:"down" },
        { who:"npcA", type:"walk", direction:"left" },
        { who:"npcA", type:"walk", direction:"left" },
        { who:"npcA", type:"walk", direction:"left" },
        { who:"odVar", type:"stand", direction:"right" },
    ])
        
    }//end of Init



}//end of Overworld class
