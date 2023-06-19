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
    
        for (let i=0; i<events.length; i+=1) {
          const eventHandler = new OverworldEvent({
            event: events[i],
            map: this,
          })
          await eventHandler.init();
        }
    
        this.isCutscenePlaying = false;
    
        //Reset NPCs to do their idle behavior
        Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
      }//end of startCutScene





//checking for actionCutscenes
checkForActionCutscene() {
    const odVar = this.gameObjects["odVar"];
    const nextCoords = utils.nextPosition(odVar.x, odVar.y, odVar.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
  }


//checking for if character steps into area intiating cutscene
checkForFootstepCutscene() {
    const odVar = this.gameObjects["odVar"];
    const match = this.cutsceneSpaces[ `${odVar.x},${odVar.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
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
      gameObjects: {
        odVar: new Person({
          isPlayerControlled: true,
          x: utils.withGrid(5),
          y: utils.withGrid(6),
        }),
        npcA: new Person({
          x: utils.withGrid(7),
          y: utils.withGrid(9),
          src: "./images/characters/people/npc1.png",
          behaviorLoop: [
            { type: "stand",  direction: "left", time: 800 },
            { type: "stand",  direction: "up", time: 800 },
            { type: "stand",  direction: "right", time: 1200 },
            { type: "stand",  direction: "up", time: 300 },
          ],
          talking: [
            {
              events: [
                { type: "textMessage", text: "I'm busy...", faceHero: "npcA" },
                { type: "textMessage", text: "Go away!"},
                { who: "odVar", type: "walk",  direction: "up" },
              ]
            }
          ]
        }),
        npcB: new Person({
          x: utils.withGrid(8),
          y: utils.withGrid(5),
          src: "./images/characters/people/npc2.png",
          // behaviorLoop: [
          //   { type: "walk",  direction: "left" },
          //   { type: "stand",  direction: "up", time: 800 },
          //   { type: "walk",  direction: "up" },
          //   { type: "walk",  direction: "right" },
          //   { type: "walk",  direction: "down" },
          // ]
        }),
      },
      walls: {
        [utils.asGridCoord(7,6)] : true,
        [utils.asGridCoord(8,6)] : true,
        [utils.asGridCoord(7,7)] : true,
        [utils.asGridCoord(8,7)] : true,
      },
      cutsceneSpaces: {
        [utils.asGridCoord(7,4)]: [
          {
            events: [
              { who: "npcB", type: "walk",  direction: "left" },
              { who: "npcB", type: "stand",  direction: "up", time: 500 },
              { type: "textMessage", text:"You can't be in there!"},
              { who: "npcB", type: "walk",  direction: "right" },
              { who: "odVar", type: "walk",  direction: "down" },
              { who: "odVar", type: "walk",  direction: "left" },
            ]
          }
        ],
        [utils.asGridCoord(5,10)]: [
          {
            events: [
              { type: "changeMap", map: "Kitchen" }
            ]
          }
        ]
      }
      
    },
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
          x: utils.withGrid(10),
          y: utils.withGrid(8),
          src: "./images/characters/people/npc3.png",
          talking: [
            {
              events: [
                { type: "textMessage", text: "You made it!", faceHero:"npcB" },
              ]
            }
          ]
        })
      }
    },
  }