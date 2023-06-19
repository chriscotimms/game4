//gameobjects.js objects are created here, the actual data which calls on class objects to construct

class OverWorldMap {

    constructor(config) {

        this.gameObjects = config.gameObjects;
        this.walls = config.walls || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = true;

    }// end of constructor



    // this is called in Init game loop
    drawLowerImage(ctx, cameraPerson) { 
        ctx.drawImage(
            this.lowerImage, 
            //offset map to follow central characters movements
            utils.withGrid(10.5) - cameraPerson.x, 
            utils.withGrid(6) - cameraPerson.y
            )
    }

    // this is called in Init game loop
    drawUpperImage(ctx, cameraPerson) { 
        ctx.drawImage(
            this.upperImage, 
            //offset map to follow central characters movements
            utils.withGrid(10.5) - cameraPerson.x, 
            utils.withGrid(6) - cameraPerson.y
            )
    }

    //collision detection establishing function
    isSpaceTaken(currentX, currentY, direction){
        const {x,y} = utils.nextPosition(currentX, currentY, direction);
        return this.walls[`${x},${y}`] || false;
    }

    //loads collisions conditionals to all objects
    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {

            let object = this.gameObjects[key];
            object.id = key;

            object.mount(this);

        })
    }



async startCutscene(events) {
        this.isCutscenePLaying = true;

        for (let i = 0; i<events.length; i += 1) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map:this,
            });
            await eventHandler.init();
        }


        this.isCutscenePLaying = false;
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
        const {x,y} = utils.nextPosition(wasX, wasY, direction);
        this.addWall(x,y);
    }


}// end of OverWorldMap class




//actual map objects, ie this.map.gameObjects.odVar.x
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
        npcA: new Person({
            isPlayerControlled: false,
            x: utils.withGrid(8),
            y: utils.withGrid(9),
            src: "./images/characters/people/npc1.png",
            behaviourLoop: [
                { type:"stand", direction:"left", time:800 },
                { type:"walk", direction:"left" },
                { type:"stand", direction:"down", time:800 },
                { type:"walk", direction:"up" },
                { type:"walk", direction:"right" },
                { type:"stand", direction:"right", time:800 },
                { type:"walk", direction:"down" },
            ]
        }),  
        npcB: new Person({
            isPlayerControlled: false,
            x: utils.withGrid(3),
            y: utils.withGrid(6),
            src: "./images/characters/people/npc2.png",
            behaviourLoop: [
                { type:"walk", direction:"left" },
                { type:"stand", direction:"down", time:800 },
                { type:"walk", direction:"up" },
                { type:"walk", direction:"right" },
                { type:"walk", direction:"down" },
            ]
        }), 

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