class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = {}; //where live objects are
    this.configObjects = config.configObjects;// config content


    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};

    this.lowerImage = new Image();
    this.lowerImage.src = config.lowerSrc;

    this.upperImage = new Image();
    this.upperImage.src = config.upperSrc;

    this.isCutscenePlaying = false;
  }

  drawLowerImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.lowerImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
      )
  }

  drawUpperImage(ctx, cameraPerson) {
    ctx.drawImage(
      this.upperImage, 
      utils.withGrid(10.5) - cameraPerson.x, 
      utils.withGrid(6) - cameraPerson.y
    )
  } 

  

  //checking for collisions - triggered in Person.js
  isSpaceTaken(currentX, currentY, direction) {
    const {x,y} = utils.nextPosition(currentX, currentY, direction);
    if (this.walls[`${x},${y}`]) {
      //console.log("wall!");
      let coll = {
        first: true,
        second: "wall",
      }
        return coll;
    }

    

    //check for game objects at this position
    return Object.values(this.gameObjects).find(obj => {
      if (obj.x === x && obj.y === y) {
          return true; 
      }
      if (obj.intentPosition && obj.intentPosition[0] === x && obj.intentPosition && obj.intentPosition[1] === y) {
        return false;
    }
    })
  }//end isSpaceTaken

 

  mountObjects() {
    Object.keys(this.configObjects).forEach(key => {

      let object = this.configObjects[key];
      object.id = key;

      let instance;
      if (object.type === "Person") {
        instance = new Person(object);
      }
      this.gameObjects[key] = instance;
      this.gameObjects[key].id = key;
      instance.mount(this);


    })
  }

  


  async startCutscene(events) {
    this.isCutscenePlaying = true;

    for (let i=0; i<events.length; i++) {
      const eventHandler = new OverworldEvent({
        event: events[i],
        map: this,
      })
      await eventHandler.init();
    }

    this.isCutscenePlaying = false;
    //Reset NPCs to do their idle behavior
    //Object.values(this.gameObjects).forEach(object => object.doBehaviorEvent(this))
  }



  checkForActionCutscene() {
    const hero = this.gameObjects["hero"];
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    const match = Object.values(this.gameObjects).find(object => {
      return `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
    });
    if (!this.isCutscenePlaying && match && match.talking.length) {
      this.startCutscene(match.talking[0].events)
    }
  }

  checkForFootstepCutscene() {
    const hero = this.gameObjects["hero"];
    if (!this.isCutscenePlaying) {
    }
    const match = this.cutsceneSpaces[ `${hero.x},${hero.y}` ];
    if (!this.isCutscenePlaying && match) {
      this.startCutscene( match[0].events )
    }
  }

//my new code

/* checkPositionForAccess(){
  if (!this.isCutscenePlaying) {

  }
} */







/*   checkPositionForAccess(){
    if (!this.isCutscenePlaying) {
    const hero = this.gameObjects["hero"];
    //console.log(hero.x, hero.y, hero.direction);
    const nextCoords = utils.nextPosition(hero.x, hero.y, hero.direction);
    //console.log(nextCoords.x, nextCoords.y);
    const wallFinder = Object.keys(this.walls).find(element => {
      return element === String(nextCoords.x+","+nextCoords.y);
    })
    //console.log(nextCoords.x, nextCoords.y, );

    //function to lookup what main character is colliding with
    if (wallFinder!==undefined){

      const extra = Object.values(this.gameObjects);
      const extra2 = Object.keys(this.walls);

  for (let i=0;i<extra.length;i+=1){
      if (extra[i].x === nextCoords.x && extra[i].y === nextCoords.y) {
      //console.log(extra[i].id, extra[i].x, extra[i].y);
      return;
        } 
      }
  for (let i=0;i<extra2.length;i+=1) { 

    if (extra2[i] === nextCoords.x+","+nextCoords.y) {
      //console.log("it's a wall!", extra2[i]);
      return;
    }//end if
    }//end for loop
 
    }
  }//end if isCutscenePlaying
  }//end checkPositionForAccess */


}//end OverworldMap


window.OverworldMaps = {
  DemoRoom: {
    id: "DemoRoom",
    lowerSrc: "./images/maps/DemoLower.png",
    upperSrc: "./images/maps/DemoUpper.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(6),
      },
      npcA: {
        type: "Person",
        x: utils.withGrid(7),
        y: utils.withGrid(9),
        src: "./images/characters/people/npc1.png",
        behaviorLoop: [
          { type: "stand",  direction: "left", time: 800 },
          { type: "walk",  direction: "left"},
          { type: "stand",  direction: "up", time: 800 },
          { type: "walk",  direction: "up"},
          { type: "stand",  direction: "right", time: 1200 },
          { type: "walk",  direction: "right"},
          { type: "stand",  direction: "up", time: 300 },
          { type: "walk",  direction: "down"},
        ],
        talking: [
          {
            events: [
              { type: "textMessage", text: "I'm busy...", faceHero: "npcA" },
              { type: "textMessage", text: "Go away!"},
              { who: "hero", type: "walk",  direction: "up" },
            ]
          }
        ]
      },
      npcB: {
        type: "Person",
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
      },
    },//end of configObjects
    walls: {
      [utils.asGridCoord(0,4)] : true,
      [utils.asGridCoord(0,5)] : true,
      [utils.asGridCoord(0,6)] : true,
      [utils.asGridCoord(0,7)] : true,
      [utils.asGridCoord(0,8)] : true,
      [utils.asGridCoord(0,9)] : true,
      [utils.asGridCoord(1,10)] : true,
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
            { who: "hero", type: "walk",  direction: "down" },
            { who: "hero", type: "walk",  direction: "left" },
          ]
        }
      ],
      [utils.asGridCoord(5,10)]: [
        {
          events: [
            { type: "changeMap", map: "Kitchen"}
          ]
        }
      ]
    }
    
  },

  Kitchen: {
    lowerSrc: "./images/maps/KitchenLower.png",
    upperSrc: "./images/maps/KitchenUpper.png",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(5),
        y: utils.withGrid(5),
      },
      npcB: {
        type: "Person",
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
      }
    }
  },

  Bedroom: {
    lowerSrc: "./images/maps/bedroom.png",
    upperSrc: "",
    configObjects: {
      hero: {
        type: "Person",
        isPlayerControlled: true,
        x: utils.withGrid(0),
        y: utils.withGrid(1),
      },
      /* npcB: {
        type: "Person",
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
      } */
    },//end of config objects
    walls: {
      [utils.asGridCoord(0,0)] : true,
      [utils.asGridCoord(1,0)] : true,
      [utils.asGridCoord(2,0)] : true,
      [utils.asGridCoord(-1,1)] : true,
      [utils.asGridCoord(-1,2)] : true,
      [utils.asGridCoord(0,3)] : true,
      [utils.asGridCoord(0,4)] : true,
      [utils.asGridCoord(1,5)] : true,
      [utils.asGridCoord(2,4)] : true,
      [utils.asGridCoord(2,3)] : true,
      [utils.asGridCoord(3,2)] : true,
      [utils.asGridCoord(3,1)] : true,
      [utils.asGridCoord(1,1)] : true,

    },
  },

}