class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = {}; //where live objects are
    this.configObjects = config.configObjects;// config content


    this.cutsceneSpaces = config.cutsceneSpaces || {};
    this.walls = config.walls || {};
    this.roomDescription = config.roomDescription || {};

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

  //scene description
  sceneDescription() {
      this.startCutscene( this.roomDescription.events)
}



}//end OverworldMap


window.OverworldMaps = {


  /* DemoRoom: {
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
  }, */

  Bedroom: {
    lowerSrc: "./images/maps/bedroom.png",
    upperSrc: "",
    configObjects: {
      hero: {
        type: "Person",
        useShadow: true,
        isPlayerControlled: true,
        x: utils.withGrid(0),
        y: utils.withGrid(1),
      },
       Bed: {
        type: "Person",
        useShadow: false,
        x: utils.withGrid(1),
        y: utils.withGrid(1),
        src: "./images/objects/empty.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "My consoling log...soon, soon, I'll get to sleep again..." },
            ]
          }
        ]
      },
      Window: {
        type: "Person",
        useShadow: false,
        x: utils.withGrid(0),
        y: utils.withGrid(0),
        src: "./images/objects/empty.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "Ah, another glorious summer day in the city. I see the rats have found a dead pigeon. They'll sleep well tonight!" },
            ]
          }
        ]
      },
      Computer: {
        type: "Person",
        x: utils.withGrid(2),
        y: utils.withGrid(0),
        src: "./images/objects/empty.png",
        talking: [
          {
            events: [
              { type: "textMessage", text: "No time to work on my projects now unfortunately. Perhaps after my daily toil... " },
            ]
          }
        ]
      }


    },//end of config objects

    walls: {
      [utils.asGridCoord(1,0)] : true,
      [utils.asGridCoord(-1,1)] : true,
      [utils.asGridCoord(-1,2)] : true,
      [utils.asGridCoord(0,3)] : true,
      [utils.asGridCoord(0,4)] : true,
      [utils.asGridCoord(1,5)] : true,
      [utils.asGridCoord(2,4)] : true,
      [utils.asGridCoord(2,3)] : true,
      [utils.asGridCoord(3,2)] : true,
      [utils.asGridCoord(3,1)] : true,

    },//end of walls

    roomDescription: {
          events: [
            { type: "textMessage", text:"Odvar awakes in their small bedroom. There is a bed in the center, a desk to the right, and Odvar stands on the left by a window."},
            { type: "textMessage", text:"The bed is unmade, there are clothes on the floor, and there is an exit at the bottom of the room"},
            { type: "textMessage", text:"Odvar: Hey!...that seems a little ...rude... to call it \"small\" !"},
            { type: "textMessage", text:"Odvar: ...it's...modest...what did the estate agent call it?...\"neat\" !"},
            { type: "textMessage", text:"Odvar: ...and it's not really that messy! Just..."},
            { type: "textMessage", text:"Odvar: ...um..."},
            { type: "textMessage", text:"Odvar: ...lived in!"},
            { type: "textMessage", text:"Odvar: ...besides, I didn't know I'd be having guests!"},
          ]
    },//end of roomDescription

    cutsceneSpaces: {
      [utils.asGridCoord(1,4)]: [
        {
          events: [
            { type: "changeMap", map: "Livingroom"}
          ]
        }
      ],
    },

},//end of Bedroom


Livingroom: {
  lowerSrc: "./images/maps/livingroom.png",
  upperSrc: "",
  configObjects: {
    hero: {
      type: "Person",
      isPlayerControlled: true,
      useShadow: true,
      x: utils.withGrid(0),
      y: utils.withGrid(1),
    },
     Bed: {
      type: "Person",
      x: utils.withGrid(1),
      y: utils.withGrid(1),
      src: "./images/objects/empty.png",
      talking: [
        {
          events: [
            { type: "textMessage", text: "My consoling log...soon, soon, I'll get to sleep again..." },
          ]
        }
      ]
    },
    Window: {
      type: "Person",
      x: utils.withGrid(0),
      y: utils.withGrid(0),
      src: "./images/objects/empty.png",
      talking: [
        {
          events: [
            { type: "textMessage", text: "Ah, another glorious summer day in the city. I see the rats have found a dead pigeon. They'll sleep well tonight!" },
          ]
        }
      ]
    },
    Computer: {
      type: "Person",
      x: utils.withGrid(2),
      y: utils.withGrid(0),
      src: "./images/objects/empty.png",
      talking: [
        {
          events: [
            { type: "textMessage", text: "No time to work on my projects now unfortunately. Perhaps after my daily toil... " },
          ]
        }
      ]
    }


  },//end of config objects

  walls: {
    /* [utils.asGridCoord(1,0)] : true,
    [utils.asGridCoord(-1,1)] : true,
    [utils.asGridCoord(-1,2)] : true,
    [utils.asGridCoord(0,3)] : true,
    [utils.asGridCoord(0,4)] : true,
    [utils.asGridCoord(1,5)] : true,
    [utils.asGridCoord(2,4)] : true,
    [utils.asGridCoord(2,3)] : true,
    [utils.asGridCoord(3,2)] : true,
    [utils.asGridCoord(3,1)] : true, */

  },//end of walls

  roomDescription: {
        events: [
          { type: "textMessage", text:"The Living Room and Kitchen and Workspace"},
        ]
  },//end of roomDescription

  cutsceneSpaces: {
    [utils.asGridCoord(1,4)]: [
      {
        events: [
          { type: "changeMap", map: "Kitchen"}
        ]
      }
    ],
  },//end of cutsceneSpaces

},//end of Bedroom



}//end of window.OverworldMaps