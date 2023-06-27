class OverworldMap {
  constructor(config) {
    this.overworld = null;
    this.gameObjects = {}; //where live objects are
    this.configObjects = config.configObjects;// config content
    console.log(this.gameObjects);


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
      let coll = {
        first: true,
        second: "blocked",
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
        x: utils.withGrid(1),
        y: utils.withGrid(1),
        src: "./images/objects/empty.png",
        useShadow: false,
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
        useShadow: false,
        talking: [
          {
            events: [
              { type: "textMessage", text: "Ah, another glorious summer day in the city. I see the rats have found a dead pigeon. They'll eat well tonight!" },
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
            /* { type: "textMessage", text:"The bed is unmade, there are clothes on the floor, and there is an exit at the bottom of the room"},
            { type: "textMessage", text:"Odvar: Hey!...that seems a little ...rude... to call it \"small\" !"},
            { type: "textMessage", text:"Odvar: ...it's...modest...what did the estate agent call it?...\"neat\" !"},
            { type: "textMessage", text:"Odvar: ...and it's not really that messy! Just..."},
            { type: "textMessage", text:"Odvar: ...um..."},
            { type: "textMessage", text:"Odvar: ...lived in!"},
            { type: "textMessage", text:"Odvar: ...besides, I didn't know I'd be having guests!"}, */
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
  lowerSrc: "./images/maps/livingroom_lower.png",
  upperSrc: "./images/maps/livingroom_upper.png",

  configObjects: {

    hero: {
      type: "Person",
      isPlayerControlled: true,
      useShadow: true,
      x: utils.withGrid(1),
      y: utils.withGrid(1),
    },

    Const: {
      type: "Person",
      useShadow: true,
      x: utils.withGrid(4),
      y: utils.withGrid(6),
      src: "./images/characters/people/constsit.png",
      talking: [
        {
          events: [
            { type: "textMessage", text: " [tapping sounds]" },
            { type: "textMessage", text: "Odvar: ...morning...?" },
            { type: "textMessage", text: "Const: urgh, almost ready to go to bed, just one last line of code to solve..." },
            { type: "textMessage", text: "Odvar: It's quite a push to offer help, but anything a noob can help with?" },
            { type: "textMessage", text: "Const: I'm close to tearing my hair out! I'm stuck on a \"for\" loop...but...it keeps returning undefined..." },
            { type: "textMessage", text: " [awkward silence as Odvar leans in pretending to scrutinise code]" },
            { type: "textMessage", text: "Const: Don't worry, I'll...figure...something..." },
            { type: "textMessage", text: "Const: ...aha! Odvar you genius! The Push function!" },
            { type: "textMessage", text: "Odvar: What a relief! I'm headed out. Good luck!" },
          ]
        }
      ],
    },

    //Objects
    Coffee_table: {
      type: "Person",
      x: utils.withGrid(2),
      y: utils.withGrid(5),
      src: "./images/objects/empty.png",
      talking: [
        {
          events: [
            { type: "textMessage", text: "...the finest in Swedish mass-produced craftsmenship..." },
          ]
        }
      ]
    },

    Sink: {
      type: "Person",
      x: utils.withGrid(5),
      y: utils.withGrid(2),
      src: "./images/objects/empty.png",
      talking: [
        {
          events: [
            { type: "textMessage", text: "...if it isn't old Mount Jenga! Someday I'll say something...for now I'll just quietly seethe..." },
            { type: "textMessage", text: " [quiet seething]" },
          ]
        }
      ]
    },
    
  },//end of config objects

  walls: {
    //perimeter
    [utils.asGridCoord(0,1)] : true,
    [utils.asGridCoord(0,2)] : true,
    [utils.asGridCoord(-1,3)] : true,
    [utils.asGridCoord(-1,4)] : true,
    [utils.asGridCoord(0,5)] : true,
    [utils.asGridCoord(0,6)] : true,
    [utils.asGridCoord(1,7)] : true,
    [utils.asGridCoord(2,7)] : true,
    [utils.asGridCoord(3,8)] : true,
    [utils.asGridCoord(4,8)] : true,
    [utils.asGridCoord(4,9)] : true,
    [utils.asGridCoord(6,9)] : true, 
    [utils.asGridCoord(6,8)] : true, 
    [utils.asGridCoord(7,8)] : true, 
    [utils.asGridCoord(8,8)] : true, 
    [utils.asGridCoord(9,7)] : true,
    [utils.asGridCoord(9,6)] : true,
    [utils.asGridCoord(9,5)] : true,
    [utils.asGridCoord(9,4)] : true,
    [utils.asGridCoord(9,3)] : true,
    [utils.asGridCoord(9,2)] : true,
    [utils.asGridCoord(8,1)] : true,
    [utils.asGridCoord(7,2)] : true,
    [utils.asGridCoord(6,2)] : true,
    //[utils.asGridCoord(5,2)] : true,
    [utils.asGridCoord(4,2)] : true,
    [utils.asGridCoord(3,2)] : true,
    [utils.asGridCoord(2,2)] : true,
    [utils.asGridCoord(2,1)] : true,
    //objects in room
    [utils.asGridCoord(4,5)] : true,
    [utils.asGridCoord(5,5)] : true,


  },//end of walls

  roomDescription: {
        events: [
          { type: "textMessage", text:"The Living Room and Kitchen"},
          { type: "textMessage", text:"...and Workspace"},
          { type: "textMessage", text:"...and sometimes Dancefloor..."},
          { type: "textMessage", text:"Odvar: ...it's not a Hub though. Everything else might be becoming a Hub, but this is definitely NOT a Hub!"},
          { type: "textMessage", text:"Odvar stands at the top left of the space. At the top of the room is a kitchenette. At the bottom left is a set of couches."},
          { type: "textMessage", text:"In the center of the room is a kitchen table, with a person sat facing up toward a laptop. There is an exit at the bottom of the room."},
        ]
  },//end of roomDescription

  cutsceneSpaces: {
    [utils.asGridCoord(1,0)]: [
      {
        events: [
          { type: "changeMap", map: "Bedroom"}
        ]
      }
    ],
    [utils.asGridCoord(5,9)]: [
      {
        events: [
          { type: "changeMap", map: "outsideFlat"}
        ]
      }
    ],
  },//end of cutsceneSpaces

},//end of Livingroom


outsideFlat: {
  lowerSrc: "./images/maps/outsideFlat_lower.png",
  upperSrc: "./images/maps/outsideFlat_upper.png",

  configObjects: {

    hero: {
      type: "Person",
      useShadow: true,
      isPlayerControlled: true,
      x: utils.withGrid(5),
      y: utils.withGrid(1),
    },
    NaN: {
      type: "Person",
      useShadow: false,
      isPlayerControlled: false,
      x: utils.withGrid(23),
      y: utils.withGrid(0),
      src: "./images/objects/empty.png",
      talking: [
        {
          events: [
            { type: "textMessage", text: " [knocking]" },
            { type: "textMessage", text: " [indeterminate noises, loud crashing]" },
            { type: "textMessage", text: "NaN: ...hello?" },
            { type: "textMessage", text: "NaN: ...who is it and what do you want!?" },
            { type: "textMessage", text: "Odvar: It's me NaN!" },
            { type: "textMessage", text: "NaN: ...Ah Odvar! Why didn't you say!" },
            { type: "textMessage", text: " [more indeterminate noises, more loud crashing]" },
            { type: "textMessage", text: "NaN: ...come on in!" },
            { type: "changeMap", map: "NaN" }
          ]
        }
      ]
    },

  },//end of config objects

  walls: {
    [utils.asGridCoord(0,0)] : true,
    [utils.asGridCoord(-1,1)] : true,
    [utils.asGridCoord(-1,2)] : true,
    [utils.asGridCoord(-1,3)] : true,
    [utils.asGridCoord(1,0)] : true,
    [utils.asGridCoord(2,0)] : true,
    [utils.asGridCoord(4,0)] : true,
    [utils.asGridCoord(5,0)] : true,
    [utils.asGridCoord(6,0)] : true,
    [utils.asGridCoord(7,0)] : true,
    [utils.asGridCoord(8,0)] : true,
    [utils.asGridCoord(9,-1)] : true,
    [utils.asGridCoord(10,-1)] : true,
    [utils.asGridCoord(11,-1)] : true,
    [utils.asGridCoord(12,-1)] : true,
    [utils.asGridCoord(13,-1)] : true,
    [utils.asGridCoord(14,-1)] : true,
    [utils.asGridCoord(15,0)] : true,
    [utils.asGridCoord(15,1)] : true,
    [utils.asGridCoord(16,1)] : true,
    [utils.asGridCoord(17,1)] : true,
    [utils.asGridCoord(18,1)] : true,
    [utils.asGridCoord(19,1)] : true,
    [utils.asGridCoord(20,1)] : true,
    [utils.asGridCoord(21,1)] : true,
    [utils.asGridCoord(22,1)] : true,
    [utils.asGridCoord(24,1)] : true,
    [utils.asGridCoord(25,1)] : true,
    [utils.asGridCoord(26,2)] : true,
    [utils.asGridCoord(26,3)] : true,
    [utils.asGridCoord(0,4)] : true,
    [utils.asGridCoord(1,4)] : true,
    [utils.asGridCoord(2,4)] : true, 
    [utils.asGridCoord(3,4)] : true,
    [utils.asGridCoord(4,4)] : true,
    [utils.asGridCoord(5,4)] : true,
    [utils.asGridCoord(6,4)] : true,
    [utils.asGridCoord(7,4)] : true,
    [utils.asGridCoord(8,4)] : true,
    [utils.asGridCoord(9,4)] : true, 
    [utils.asGridCoord(10,4)] : true,
    [utils.asGridCoord(11,4)] : true,
    [utils.asGridCoord(12,4)] : true,
    [utils.asGridCoord(13,4)] : true,
    [utils.asGridCoord(14,4)] : true,
    [utils.asGridCoord(15,4)] : true,
    [utils.asGridCoord(16,4)] : true,
    [utils.asGridCoord(17,4)] : true,
    [utils.asGridCoord(18,4)] : true, 
    [utils.asGridCoord(19,4)] : true,
    [utils.asGridCoord(20,4)] : true,
    [utils.asGridCoord(21,4)] : true,
    [utils.asGridCoord(22,4)] : true,
    [utils.asGridCoord(23,4)] : true,
    [utils.asGridCoord(24,4)] : true,
    [utils.asGridCoord(25,4)] : true,

  },//end of walls

  roomDescription: {
        events: [
          { type: "textMessage", text:"Odvar exits via steps onto a desolate concrete city path leading left to work or right to NaN's."},
          { type: "textMessage", text:"Odvar: Its pretty grim alright..!"},
          { type: "textMessage", text: "I could get to work early..."},
          { type: "textMessage", text: "...or I could use the extra time to check up on NaN?"},
        ]
  },//end of roomDescription

  cutsceneSpaces: {
    [utils.asGridCoord(0,2)]: [
      {
        events: [
          { type: "textMessage", text: "I guess it'll be good to get in early for work. I'll have a chance to get ahead on those iterations!" },
          { type: "textMessage", text: "Although now that I think of it, I do hate my job!" },
          
        ]
      }
    ],
    [utils.asGridCoord(6,2)]: [
      {
        events: [
          { type: "textMessage", text: "I haven't seen NaN in a while. This is a much better idea than going to work early!" },
          { type: "textMessage", text: "She always has some sage advice for me too" },
          
        ]
      }
    ],
    /* [utils.asGridCoord(6,2)]: [
      {
        events: [
          { type: "changeMap", map: "NaN" },
          
        ]
      }
    ], */
  },

},//end of outsideFlat


NaN: {
  lowerSrc: "./images/maps/NaN.png",
  upperSrc: "",

  configObjects: {

    hero: {
      type: "Person",
      useShadow: true,
      isPlayerControlled: true,
      x: utils.withGrid(3),
      y: utils.withGrid(1),
    },

  },//end of config objects

  walls: {
    /* [utils.asGridCoord(0,0)] : true,
    [utils.asGridCoord(-1,1)] : true,
    [utils.asGridCoord(-1,2)] : true,
    [utils.asGridCoord(-1,3)] : true,
    [utils.asGridCoord(1,0)] : true,
    [utils.asGridCoord(2,0)] : true,
    [utils.asGridCoord(4,0)] : true,
    [utils.asGridCoord(5,0)] : true,
    [utils.asGridCoord(6,0)] : true,
    [utils.asGridCoord(0,4)] : true,
    [utils.asGridCoord(1,4)] : true,
    [utils.asGridCoord(2,4)] : true, 
    [utils.asGridCoord(3,4)] : true,
    [utils.asGridCoord(4,4)] : true,
    [utils.asGridCoord(5,4)] : true,
    [utils.asGridCoord(6,4)] : true, */

  },//end of walls

  roomDescription: {
        events: [
          { type: "textMessage", text:"Odvar exits via steps onto a desolate concrete city path leading left to work or right to NaN's."},
        ]
  },//end of roomDescription

  cutsceneSpaces: {
    [utils.asGridCoord(0,2)]: [
      {
        events: [
          { type: "textMessage", text: "I guess it'll be good to get in early for work. I'll have a chance to get ahead on those iterations!" },
          { type: "textMessage", text: "Although now that I think of it, I do hate my job!" },
          
        ]
      }
    ],
    [utils.asGridCoord(4,2)]: [
      {
        events: [
          { type: "textMessage", text: "I haven't seen NaN in a while. This is a much better idea than going to work early!" },
          { type: "textMessage", text: "She always has some sage advice for me too" },
          
        ]
      }
    ],
    [utils.asGridCoord(6,2)]: [
      {
        events: [
          { type: "changeMap", map: "NaN" },
          
        ]
      }
    ],
  },

},//end of NaN

}//end of window.OverworldMaps