//gameobjects.js objects are created here, the actual data which calls on class objects to construct

class OverworldMap {

    constructor(config) {
        this.overworld = null;
        this.gameObjects = config.gameObjects;
        this.cutsceneSpaces = config.cutsceneSpaces || {};
        this.walls = config.walls || {};

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;

        this.isCutscenePlaying = false;

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
        this.isCutscenePlaying = true;

        for (let i = 0; i<events.length; i += 1) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map:this,
            });
            await eventHandler.init();
        }

        //switch cutscene boolean to allow other behaviours to continue
        this.isCutscenePlaying = false;

        // reset npc's to do their idle behaviour
        Object.values(this.gameObjects).forEach(object => object.doBehaviourEvent(this))

    }//end of startCutscene





//checking for actionCutscenes
checkForActionCutscene() {
    const odVar = this.gameObjects["odVar"];
    const nextCoords = utils.nextPosition(odVar.x, odVar.y, odVar.direction);
    const match = Object.values(this.gameObjects).find(object => {
        return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`;
    });
    if (!this.isCutscenePLaying && match && match.talking.length) {
        this.startCutscene(match.talking[0].events);
    }
}


//checking for if character steps into area intiating cutscene
checkForFootstepCutscene() {
    const odVar = this.gameObjects["odVar"];
    const match = this.cutsceneSpaces[ `${odVar.x},${odVar.y}` ];
    console.log({match});
    if (!this.isCutscenePlaying && match){ 
        this.startCutscene(match[0].events);
    }
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
window.OverworldMaps = {
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
            ],
            talking: [
                {
                   events: [
                    { type: "textMessage", text: "what do you want?", faceHero: "npcA" },
                    { type: "textMessage", text: "I'm busy with my toil, go away!" },
                    { who:"odVar", type:"walk", direction:"left" },
                   ] 
                }
            ]
        }),  
        npcB: new Person({
            isPlayerControlled: false,
            x: utils.withGrid(8),
            y: utils.withGrid(5),
            src: "./images/characters/people/npc2.png",
            /* behaviourLoop: [
                { type:"walk", direction:"left" },
                { type:"stand", direction:"down", time:800 },
                { type:"walk", direction:"up" },
                { type:"walk", direction:"right" },
                { type:"walk", direction:"down" },
            ] */
        }), 

        },//end of gameObjects
        //wall co-ordinates in this map
        walls:{
            [utils.asGridCoord(7,6)]:true,
            [utils.asGridCoord(8,6)]:true,
            [utils.asGridCoord(7,7)]:true,
            [utils.asGridCoord(8,7)]:true,
        },
        cutsceneSpaces:{
            [utils.asGridCoord(7,4)]: [
                {
                events:[
                    { who:"npcB", type:"walk", direction:"left" },
                    { who:"npcB", type:"stand", direction:"up", time:500 },
                    { type:"textMessage", text:"You can't be in there!", faceHero:"npcA"},
                    { who:"npcB", type:"stand", direction:"up", time:500 },
                    { who:"npcB", type:"walk", direction:"right" },
                    { who:"odVar", type:"walk", direction:"down" },
                
                    ]
                }
            ],
            [utils.asGridCoord(5,10)]:[
                {
                    events:[
                        { type:"changeMap", map:"Kitchen" }
                    ]
                }
            ]
        }//end cutsceneSpaces 
    },//end of DemoRoom

    Kitchen: {
        lowerSrc: "./images/maps/KitchenLower.png",
        upperSrc: "./images/maps/KitchenUpper.png",
        gameObjects: {
        odVar: new Person({
            isPlayerControlled: true,
            x: utils.withGrid(5),
            y: utils.withGrid(5),
        }),
        npcB: new Person({
            isPlayerControlled: false,
            x: utils.withGrid(10),
            y: utils.withGrid(8),
            src: "./images/characters/people/npc3.png",
            talking:[
                {
                    events:[
                        { type: "textMessage", text:"You Made it!", faceHero:"npcB"},
                    ]
                }
            ]
        })//end npcB
        }//end of gameObjects
    },//end of DemoRoom


}//end of Overworld MAps