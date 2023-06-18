class OverWorldMap {

    constructor(config) {
        this.gameObject = config.gameObjects;
        this.walls = config.walls || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;
    }// end of cronstructor

    drawLowerImage(ctx, cameraPerson) { // this is called in Init game loop
        ctx.drawImage(
            this.lowerImage, 
            utils.withGrid(10.5) - cameraPerson.x, 
            utils.withGrid(6) - cameraPerson.y
            )
    }

    drawUpperImage(ctx, cameraPerson) { // this is called in Init game loop
        ctx.drawImage(
            this.upperImage, 
            utils.withGrid(10.5) - cameraPerson.x, 
            utils.withGrid(6) - cameraPerson.y
            )
    }

    isSpaceTaken(currentX, currentY, direction){
        const {x,y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }


    mountObjects() {
        Object.values(this.gameObject).forEach(o => {

            //todo: determine if object should mount

            o.mount(this);

        })
    }



    //if gameObject (say npc) enters scene, create a wall object for them
    addWall(x,y){
        this.walls[`${x},${y}`] = true;
    }

    //or remove if they go
    removeWall(x,y){
        delete this.walls[`${x},${y}`]
    }

    //or move if they move
    moveWall(wasX, wasY, direction) {
        this.removeWall(wasX, wasY);
        const {x, y} = utils.nextPosition(wasX, wasY, direction);
        this.addWall(x,y);
    }



}// end of OverWorldMap class

window.OverWorldMaps = {
    DemoRoom: {
        lowerSrc: "./images/maps/DemoLower.png",
        upperSrc: "./images/maps/DemoUpper.png",
        gameObjects: { //is called in Overworld.js Init game loop
        odVar: new Person({
            isPlayerControlled: true,
            x: utils.withGrid(5),
            y: utils.withGrid(6),
        }),
          npc1: new Person({
            isPlayerControlled: false,
            x: utils.withGrid(8),
            y: utils.withGrid(9),
            src: "./images/characters/people/npc1.png"
        })  
        },//end of gameObjects
        walls:{
            [utils.asGridCoord(7,6)]:true,
            [utils.asGridCoord(8,6)]:true,
            [utils.asGridCoord(7,7)]:true,
            [utils.asGridCoord(8,7)]:true,
        }
    },//end of DemoRoom

    Kitchen: {
        lowerSrc: "./images/maps/KitchenLower.png",
        upperSrc: "./images/maps/KitchenUpper.png",
        gameObjects: {
        odVar: new GameObject({
            x: 3,
            y: 1,
        }),
        npc2: new GameObject({
            x: 9,
            y: 9,
            src: "./images/characters/people/npc2.png"
        }),
        npc3: new GameObject({
            x: 4,
            y: 10,
            src: "./images/characters/people/npc3.png"
        })
        }//end of gameObjects
    },//end of DemoRoom


}//end of Overworld MAps