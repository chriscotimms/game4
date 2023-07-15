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
    this.isPaused = false;
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
      if (obj.x === x && obj.y === y && obj.visible1 === true) {
          return true; 
      }
      if (obj.intentPosition && obj.intentPosition[0] === x && obj.intentPosition && obj.intentPosition[1] === y) {
        return false;
    }
    })
  }//end isSpaceTaken



  /* isCollectible(currentX, currentY) {
    const x = utils.withoutGrid(currentX);
    const y = utils.withoutGrid(currentY);
    const matchCollectible = Object.values(this.gameObjects).find(obj => {
      if (obj.x === x && obj.y === y && obj.isCollectible) {
          console.log("matchCollectible");
          return [x, y];
      }
    }) */
    
    //console.log("from inside isCollectible function ", x, y);
    //return [x, y];

    /* if (this.walls[`${x},${y}`]) {
      let coll = {
        first: true,
        second: "blocked",
      }
        return coll;
    }

    //check for game objects at this position
    return Object.values(this.gameObjects).find(obj => {
      if (obj.x === x && obj.y === y && !obj.collectible) {
          return true; 
      }
      if (obj.intentPosition && obj.intentPosition[0] === x && obj.intentPosition && obj.intentPosition[1] === y) {
        return false;
    }
    }) */
  //}//end isSpaceTaken

 

  mountObjects() {
    Object.keys(this.configObjects).forEach(key => {

      let object = this.configObjects[key];
      object.id = key;
     
      let instance;
      if (object.type === "Person") {
        instance = new Person(object);
      }
      if (object.type === "collectible1") {
        instance = new collectible1(object);
      }
      if (object.type === "collectible2") {
        instance = new collectible2(object);
      }
      if (object.type === "collectible3") {
        instance = new collectible3(object);
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

      const relevantScenario = match.talking.find(scenario => {
        return(scenario.required || []).every(sf => {
          return  playerState.storyFlags[sf];
        })
      })

      relevantScenario && this.startCutscene(relevantScenario.events)
    }
  }

  FootstepCutscene() {
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

    if (!this.isCutscenePlaying) {

      /* console.log(this.roomDescription); */

      const relevantRoomDescription = this.roomDescription.find(scenario => {
        return(scenario.required || []).every(sf => {
          return  playerState.storyFlags[sf];
        })
      })

      relevantRoomDescription && this.startCutscene(relevantRoomDescription.events)
     
    } 


      //this.startCutscene( this.roomDescription.events)
  }//end of sceneDescription



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
        visible1: true,
        x: utils.withGrid(0),
        y: utils.withGrid(1),
      },
      Bed: {
        type: "Person",
        x: utils.withGrid(1),
        y: utils.withGrid(1),
        visible1: true,
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
        visible1: true,
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
        visible1: true,
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

    roomDescription: [
      {
        required: ["OUTSIDE_FIRST"],
        events: [
          { type: "textMessage", text:"Odvars Bedroom. There is a bed in the center, a window to the top left, and a computer to the top right."},
        ]
    },
      {
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
      },
    ],//end of roomDescription

    cutsceneSpaces: {
      [utils.asGridCoord(1,4)]: [
        {
          events: [
            { 
              type: "changeMap", 
              map: "Livingroom",
              x: utils.withGrid(1),
              y: utils.withGrid(1),
              direction:"down"
            }
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
      visible1: true,
      Atag: "hero",
      x: utils.withGrid(1),
      y: utils.withGrid(1),
    },

    Const: {
      type: "Person",
      useShadow: true,
      visible1: true,
      Atag: "Const",
      x: utils.withGrid(4),
      y: utils.withGrid(6),
      src: "images/characters/people/constSit.png",
      talking: [

        {
          required:["OUTSIDE_FIRST"],
          events:[ 
            { type: "textMessage", text: "Const: back so soon?" },
          ]
        },

        {
          events: [
            { type: "textMessage", text: " [tapping sounds]" },
            { type: "textMessage", text: "Odvar: ...morning...?" },
            { type: "textMessage", text: "Const: urgh, almost ready to go to bed, just one last line of code to solve..." },
            { type: "textMessage", text: "Odvar: Anything a noob can help with?" },
            { type: "textMessage", text: "Const: I'm close to tearing my hair out! I'm stuck on a \"for\" loop...but...it keeps returning...undefined..." },
            { type: "textMessage", text: "Const: F\!\?\!\?\!\*\!\£\&\^\$\\!\!\!\!\!" },
            { type: "textMessage", text: " [awkward silence as Odvar leans in pretending to scrutinise code]" },
            { type: "textMessage", text: "Const: Don't worry, I'll...figure...something..." },
            { type: "textMessage", text: "Odvar: ...jeez, you're really pushing yourself hard!" },
            { type: "textMessage", text: "Const: ...aha! Odvar you genius! The Push function!" },
            { type: "textMessage", text: "Odvar: What a relief! ...I mean, uh, no problem!" },
            { type: "textMessage", text: "Odvar: ...actually, my mother always said I was a genius!" },
            { type: "textMessage", text: "Odvar: I'm headed out for the day. Good luck!" },
          ]
        }
      ],
    },

    //Objects
    Coffee_table: {
      type: "Person",
      visible1: true,
      Atag: "Coffee Table",
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
      visible1: true,
      Atag: "Sink",
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

  roomDescription: [
    {
      required:["OUTSIDE_FIRST"],
      events: [
        { type: "textMessage", text:"The Living Room and Kitchen.At the top of the room is a kitchenette. At the bottom left is a set of couches."},
        { type: "textMessage", text:"In the center of the room is a kitchen table, with a person sat facing up toward a laptop. There is an exit at the bottom of the room."},
      ]
  },
    {
        events: [
          { type: "textMessage", text:"The Living Room and Kitchen"},
          { type: "textMessage", text:"...and Workspace"},
          { type: "textMessage", text:"...and sometimes Dancefloor..."},
          { type: "textMessage", text:"Odvar: ...it's not a Hub though. Everything else might be becoming a Hub, but this is definitely NOT a Hub!"},
          { type: "textMessage", text:"Odvar stands at the top left of the space. At the top of the room is a kitchenette. At the bottom left is a set of couches."},
          { type: "textMessage", text:"In the center of the room is a kitchen table, with a person sat facing up toward a laptop. There is an exit at the bottom of the room."},
        ]
    },
    
], //end of roomDescription


  cutsceneSpaces: {
    [utils.asGridCoord(1,0)]: [
      {
        events: [
          { 
            type: "changeMap", 
            map: "Bedroom",
            x: utils.withGrid(1),
            y: utils.withGrid(4),
            direction:"up"}
        ]
      }
    ],
    [utils.asGridCoord(5,9)]: [
      {
        events: [
          { type: "changeMap", 
          map: "outsideFlat",
          x: utils.withGrid(5),
          y: utils.withGrid(1),
          direction:"down"},
          
        ]
      }
    ],
  },//end of cutsceneSpaces

},//end of Livingroom

/* Livingroom_fromOutside: {
  lowerSrc: "./images/maps/livingroom_lower.png",
  upperSrc: "./images/maps/livingroom_upper.png",

  configObjects: {

    hero: {
      type: "Person",
      isPlayerControlled: true,
      useShadow: true,
      x: utils.withGrid(5),
      y: utils.withGrid(8),
    },

    Const: {
      type: "Person",
      useShadow: true,
      x: utils.withGrid(4),
      y: utils.withGrid(6),
      src: "./images/characters/people/constsit.png",
      talking: [

        {
          required:["OUTSIDE_FIRST"],
          events:[ 
            { type: "textMessage", text: "Const: back so soon?" },
          ]
        },

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
          { type: "textMessage", text:"Odvar stands at the bottom of the space at the exit to outside. At the top of the room is a kitchenette. At the bottom left is a set of couches."},
          { type: "textMessage", text:"In the center of the room is a kitchen table, with a person sat facing up toward a laptop. There is an exit to Odvars' bedroom at the top left."},
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
          { type: "changeMap", map: "outsideFlat"},
          { type: "addStoryFlag", flag:"OUTSIDE_FIRST"}
        ]
      }
    ],
  },//end of cutsceneSpaces

},//end of Livingroom_fromOutside */


outsideFlat: {
  lowerSrc: "./images/maps/outsideFlat_lower.png",
  upperSrc: "./images/maps/outsideFlat_upper.png",

  //entering NaN's occurs after speaking
  configObjects: {

    hero: {
      type: "Person",
      useShadow: true,
      isPlayerControlled: true,
      visible1: true,
      Atag:"hero",
      x: utils.withGrid(5),
      y: utils.withGrid(1),
    },
    Stranger: {
      type: "Person",
      useShadow: true,
      isPlayerControlled: false,
      visible1: true,
      Atag:"Stranger",
      x: utils.withGrid(14),
      y: utils.withGrid(1),
      src: "./images/characters/people/npc1.png",
      behaviorLoop: [
        { type: "stand",  direction: "left", time: 3000 },
        { type: "stand",  direction: "left", time: 3000 },
        { type: "walk",  direction: "up" },
        { type: "stand",  direction: "left", time: 1000 },
        { type: "stand",  direction: "left", time: 1000 },
        { type: "walk",  direction: "down" },
      ],
      talking: [
        {
          required:["OUTSIDE_GARDEN", "OUTSIDE_GARDEN_COMPLETED", "FINISHED_NAN"],
          events:[ 
            { type: "textMessage", text: "Stranger: In case you were wondering...", faceHero:"Stranger" },
            { type: "textMessage", text: "Stranger: I Am A Free, I Am Not Man...A Number!", faceHero:"Stranger" },
          ]
        },
        {
          events: [
            { type: "textMessage", text: "Stranger: Did you hear about the mansplainer who fell down a manhole?", faceHero:"Stranger"},
            { type: "textMessage", text: "Odvar: ..." },
            { type: "textMessage", text: "Stranger: ...it was a well, actually!" },
          ]
        }
      ]
    },
    NaN: {
      type: "Person",
      useShadow: true,
      isPlayerControlled: false,
      visible1: true,
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
            { 
            type: "changeMap", 
            map: "Nans",
            x: utils.withGrid(1),
            y: utils.withGrid(7),
            direction:"up",
           }
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
    //[utils.asGridCoord(5,0)] : true,
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

  roomDescription: [
    {
      required: ["OUTSIDE_FIRST", "OUTSIDE_GARDEN"],
      events: [
        { type: "textMessage", text:"Outside on the street."},
      ]
    },
    { 
      required: ["OUTSIDE_FIRST"],
      events: [
        { type: "textMessage", text:"Odvar: Still pretty grim out here..!"},
      ]
},
    {
        events: [
          { type: "textMessage", text:"Odvar exits via steps onto a desolate concrete city path leading left to work or right to NaN's."},
          { type: "textMessage", text:"Odvar: Its pretty grim alright..!"},
          { type: "textMessage", text: "I could get to work early..."},
          { type: "textMessage", text: "...or I could use the extra time to check up on NaN?"},
          { type: "addStoryFlag", flag:"OUTSIDE_FIRST"}
        ]
  },
],//end of roomDescription

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
    [utils.asGridCoord(5,0)]: [
      {
        events: [
          { 
          type: "changeMap", 
          map: "Livingroom",
          x: utils.withGrid(5),
          y: utils.withGrid(8),
          direction:"up",
         },
          
        ]
      }
    ], 
  },//end of cutSceneSpaces

},//end of outsideFlat

Nans: {
  lowerSrc: "./images/maps/NaN_lower.png",
  upperSrc: "./images/maps/NaN_upper.png",

  configObjects: {

    hero: {
      type: "Person",
      useShadow: true,
      visible1: true,
      Atag: "hero",
      isPlayerControlled: true,
      x: utils.withGrid(1),
      y: utils.withGrid(7),
    },
    NaN: {
      type: "Person",
      useShadow: true,
      isPlayerControlled: false,
      visible1: true,
      Atag: "NaN",
      x: utils.withGrid(4),
      y: utils.withGrid(2),
      src: "./images/characters/people/Nan.png",
      talking: [
        {
          required:["OUTSIDE_GARDEN", "OUTSIDE_GARDEN_COMPLETED", "FINISHED_NAN"],
          events:[ 
            { type: "textMessage", text: "NaN: Odvar, hadn't you'd better be getting to work?", faceHero:"NaN" },
          ]
        },
        {
          required:["OUTSIDE_GARDEN", "OUTSIDE_GARDEN_COMPLETED"],
          events:[ 
            { type: "removeHud"},
            { type: "textMessage", text: "NaN: Odvar, you're a star! I can't thank you enough!", faceHero:"NaN" },
            { type: "textMessage", text: "NaN: I know all you kids are microdosing these days, so here's a mix of my my own making!", faceHero:"NaN" },
            { type: "textMessage", text: "NaN: You'd better get off to work before you get a reputation!", faceHero:"NaN" },
            { who: "NaN", type: "walk",  direction: "left" },
            { who: "NaN", type: "stand",  direction: "up" },
            { who: "NaN", type: "walk",  direction: "left" },
            { who: "NaN", type: "walk",  direction: "down" },
            { who: "NaN", type: "walk",  direction: "left" },
            { who: "NaN", type: "walk",  direction: "left" },
            { who: "NaN", type: "walk",  direction: "down" },
            { type: "addStoryFlag", flag:"FINISHED_NAN"}
          ]
        },
        {
          required:["OUTSIDE_GARDEN"],
          events:[ 
            { type: "textMessage", text: "NaN: Did you find everything? ...every ingredient counts!", faceHero:"NaN" },
          ]
        },
        
        {
          events: [
            { type: "textMessage", text: "NaN: Welcome dear Odvar, how nice of you to drop in!", faceHero:"NaN" },
            { type: "textMessage", text: "NaN: Sorry, I'm in the middle of brewing a new concoction, and it's not going very well!" },
            { type: "textMessage", text: "Odvar: Anything I can help with?" },
            { type: "textMessage", text: "NaN: well if you're offering, yes! there is!" },
            { type: "textMessage", text: "NaN: would you be a dear and grab some herbs from the garden?" },
            { type: "textMessage", text: "Odvar: As long as you don't need me to collect any more nettles, that really hurt!" },
            { 
              type: "changeMap", 
              map: "Garden",
              x: utils.withGrid(1),
              y: utils.withGrid(17),
              direction:"right",
            },
            { type: "addStoryFlag", flag:"OUTSIDE_GARDEN"},
            { type: "addHud" },
          ]
        }
      ],
      
      behaviorLoop: [
        { type: "stand",  direction: "right", time: 8000 },
      ],
    },
    Cauldron: {
      type: "Person",
      x: utils.withGrid(5),
      y: utils.withGrid(2),
      visible1: true,
      Atag:"Cauldron", 
      src: "./images/objects/empty.png",
      useShadow: false,
      talking: [
        {
          events: [
            { type: "textMessage", text: "alluring...smells medicinal...with a whiff of wet dog" },
          ]
        }
      ]
    },
    Table: {
      type: "Person",
      x: utils.withGrid(1),
      y: utils.withGrid(4),
      visible1: true,
      Atag: "Table",
      src: "./images/objects/empty.png",
      useShadow: false,
      talking: [
        {
          events: [
            { type: "textMessage", text: "some dried herbs" },
          ]
        }
      ]
    },
   
  
  

  },//end of config objects

  walls: {
    [utils.asGridCoord(-1,2)] : true,
    [utils.asGridCoord(-1,3)] : true,
    [utils.asGridCoord(-1,4)] : true,
    [utils.asGridCoord(-1,5)] : true,
    [utils.asGridCoord(0,6)] : true,
    [utils.asGridCoord(0,7)] : true,
    [utils.asGridCoord(2,7)] : true,
    [utils.asGridCoord(2,6)] : true,
    [utils.asGridCoord(3,6)] : true,
    [utils.asGridCoord(4,6)] : true,
    [utils.asGridCoord(5,6)] : true,
    [utils.asGridCoord(6,5)] : true,
    [utils.asGridCoord(6,4)] : true,
    [utils.asGridCoord(6,3)] : true,
    [utils.asGridCoord(6,2)] : true,
    [utils.asGridCoord(7,2)] : true,
    [utils.asGridCoord(7,0)] : true,
    [utils.asGridCoord(6,0)] : true,
    [utils.asGridCoord(5,0)] : true,
    [utils.asGridCoord(4,0)] : true,
    [utils.asGridCoord(3,1)] : true,
    [utils.asGridCoord(2,1)] : true,
    [utils.asGridCoord(1,1)] : true,
    [utils.asGridCoord(0,1)] : true,
    [utils.asGridCoord(2,4)] : true,//table
    
  },//end of walls

  roomDescription: [
    {
      required: ["OUTSIDE_GARDEN"],
      events: [
        { type: "textMessage", text:"NaNs"},
      ]
    },
    {
        events: [
          { type: "textMessage", text:"NaNs House is dark and rustic, five tiles wide by five tiles deep. NaN is stood at the top right center of the room facing a cauldron."},
          { type: "textMessage", text:"The street entrance is to the left of the bottom of the room, and a Garden entrance to the top of the right."},
          { type: "textMessage", text:"There is a table to the center left of the room, and a counter to the top left of the room."},
          { type: "textMessage", text:"Odvar: It's the only place I know where the moss grows inside!"},
        ]
    },
],//end of roomDescription

  cutsceneSpaces: {
    //battle prototype
     /* [utils.asGridCoord(0,5)]: [
      {
        events: [
          { type: "textMessage", text: "begin the battle scene" },
          { type: "battle", enemyId: "erio" },
          
        ]
      }
    ],  */
    [utils.asGridCoord(6,1)]: [
      {
        events: [

          { type: "checkMissionComplete", check:[{herb:"s001",quantity:2}, {herb:"v001", quantity:2}], flag:"OUTSIDE_GARDEN_COMPLETED"},
          
        ]
      }
    ],
    [utils.asGridCoord(1,7)]: [
      {
        events: [
          { 
          type: "changeMap", 
          map: "outsideFlat",
          x: utils.withGrid(23),
          y: utils.withGrid(1),
          direction:"down",
         },
          
        ]
      }
    ], 
    [utils.asGridCoord(7,1)]: [
      {
        events: [
          { 
          type: "changeMap", 
          map: "Garden",
          x: utils.withGrid(0),
          y: utils.withGrid(17),
          direction:"right",
         },
          
        ]
      }
    ],
  },//end of cutSceneSpaces



},//end of NaN

Garden: {
  lowerSrc: "./images/maps/Garden_lower.png",
  upperSrc: "./images/maps/Garden_upper.png",

  configObjects: {

    hero: {
      type: "Person",
      useShadow: true,
      isPlayerControlled: true,
      visible1: true,
      Atag: "hero",
      x: utils.withGrid(0),
      y: utils.withGrid(3),
    },
    /* Plant1: {
      type: "Person",
      x: utils.withGrid(5),
      y: utils.withGrid(2),
      src: "./images/objects/Plant1.png",
      visible1: true,
      talking: [
        {
          events: [
            { type: "textMessage", text: "...if it isn't old Mount Jenga! Someday I'll say something...for now I'll just quietly seethe..." },
            { type: "objectCollected", id: "Plant1"},
           
          ]
        }
      ]
    }, */

    Thyme3: {
      type: "collectible3",
      x: utils.withGrid(2),
      y: utils.withGrid(16),
      visible1: true,
      Atag:"Thyme",
      src: "images/objects/Plant1.png",
      storyFlag:"USED_collectibleObjectA",
      plants: "s001",
    },   
    Rosemary1: {
      type: "collectible3",
      x: utils.withGrid(3),
      y: utils.withGrid(18),
      visible1: true,
      Atag:"Rosemary",
      src: "images/objects/Plant1.png",
      storyFlag:"USED_collectibleObjectB",
      plants: "v001",
    }, 
    Rosemary2: {
      type: "collectible3",
      x: utils.withGrid(5),
      y: utils.withGrid(18),
      Atag: "Rosemary",
      visible1: true,
      src: "images/objects/Plant1.png",
      storyFlag:"USED_collectibleObjectC",
      plants: "v001",
    }, 
  
  

  },//end of config objects

  walls: {
    [utils.asGridCoord(-1,0)] : true,
    [utils.asGridCoord(-1,1)] : true,
    [utils.asGridCoord(-1,2)] : true,
    [utils.asGridCoord(-1,3)] : true,
    [utils.asGridCoord(-1,4)] : true,
    [utils.asGridCoord(-1,5)] : true,
    [utils.asGridCoord(-1,6)] : true,
    [utils.asGridCoord(-1,7)] : true,
    [utils.asGridCoord(-1,8)] : true,
    [utils.asGridCoord(-1,9)] : true,
    [utils.asGridCoord(-1,10)] : true,
    [utils.asGridCoord(-1,11)] : true,
    [utils.asGridCoord(-1,12)] : true,
    [utils.asGridCoord(0,13)] : true,
    [utils.asGridCoord(0,14)] : true,
    [utils.asGridCoord(0,15)] : true,
    [utils.asGridCoord(0,16)] : true,
    [utils.asGridCoord(-1,17)] : true,
    [utils.asGridCoord(0,18)] : true,//end of left side
    [utils.asGridCoord(1,19)] : true,//beginning of bottom
    [utils.asGridCoord(2,19)] : true,
    [utils.asGridCoord(3,19)] : true,
    [utils.asGridCoord(4,19)] : true,
    [utils.asGridCoord(5,19)] : true,
    [utils.asGridCoord(6,19)] : true,
    [utils.asGridCoord(7,19)] : true,
    [utils.asGridCoord(8,19)] : true,
    [utils.asGridCoord(9,19)] : true,
    [utils.asGridCoord(10,19)] : true,
    [utils.asGridCoord(11,19)] : true,
    [utils.asGridCoord(12,19)] : true,
    [utils.asGridCoord(13,19)] : true,
    [utils.asGridCoord(14,19)] : true,
    [utils.asGridCoord(15,19)] : true,
    [utils.asGridCoord(16,19)] : true,
    [utils.asGridCoord(17,19)] : true,
    [utils.asGridCoord(18,19)] : true,
    [utils.asGridCoord(19,19)] : true,//end of bottom
    [utils.asGridCoord(19,18)] : true,//beginning of right side
    [utils.asGridCoord(19,17)] : true,
    [utils.asGridCoord(19,16)] : true,
    [utils.asGridCoord(19,15)] : true,
    [utils.asGridCoord(19,14)] : true,
    [utils.asGridCoord(19,13)] : true,
    [utils.asGridCoord(19,12)] : true,
    [utils.asGridCoord(19,11)] : true,
    [utils.asGridCoord(19,10)] : true,
    [utils.asGridCoord(19,9)] : true,
    [utils.asGridCoord(19,8)] : true,
    [utils.asGridCoord(19,7)] : true,
    [utils.asGridCoord(19,6)] : true,
    [utils.asGridCoord(19,5)] : true,
    [utils.asGridCoord(19,4)] : true,
    [utils.asGridCoord(19,3)] : true,
    [utils.asGridCoord(19,2)] : true,
    [utils.asGridCoord(19,1)] : true,//end of right side
    [utils.asGridCoord(18,0)] : true,//beginning of top
    [utils.asGridCoord(17,0)] : true,
    [utils.asGridCoord(16,0)] : true,
    [utils.asGridCoord(15,0)] : true,
    [utils.asGridCoord(14,0)] : true,
    [utils.asGridCoord(13,0)] : true,
    [utils.asGridCoord(12,0)] : true,
    [utils.asGridCoord(11,0)] : true,
    [utils.asGridCoord(10,0)] : true,
    [utils.asGridCoord(9,0)] : true,
    [utils.asGridCoord(8,0)] : true,
    [utils.asGridCoord(7,0)] : true,
    [utils.asGridCoord(6,0)] : true,
    [utils.asGridCoord(5,0)] : true,
    [utils.asGridCoord(4,-1)] : true,
    [utils.asGridCoord(3,-1)] : true,
    [utils.asGridCoord(2,-1)] : true,
    [utils.asGridCoord(1,-1)] : true,
    [utils.asGridCoord(0,-1)] : true,//end of top
    [utils.asGridCoord(5,2)] : true,//beginning of fence
    [utils.asGridCoord(5,3)] : true,
    [utils.asGridCoord(5,4)] : true,
    [utils.asGridCoord(5,5)] : true,
    [utils.asGridCoord(5,6)] : true,
    [utils.asGridCoord(5,7)] : true,
    [utils.asGridCoord(5,8)] : true,
    [utils.asGridCoord(5,9)] : true,
    [utils.asGridCoord(5,10)] : true,
    [utils.asGridCoord(5,11)] : true,
    [utils.asGridCoord(5,12)] : true,//end fence
    [utils.asGridCoord(1,13)] : true,//begin hedge
    [utils.asGridCoord(2,13)] : true,
    [utils.asGridCoord(3,13)] : true,
    [utils.asGridCoord(4,13)] : true,
    [utils.asGridCoord(5,13)] : true,
    [utils.asGridCoord(6,13)] : true,
    [utils.asGridCoord(8,13)] : true,
    [utils.asGridCoord(9,13)] : true,
    [utils.asGridCoord(9,14)] : true,
    [utils.asGridCoord(9,15)] : true,
    [utils.asGridCoord(9,16)] : true,
    [utils.asGridCoord(9,17)] : true,//end hedges
    

    
  },//end of walls

  roomDescription: [
    {
      required: ["OUTSIDE_GARDEN"],
      events: [
        { type: "textMessage", text:"The Garden"},
      ]
    },
    {
        events: [
          { type: "textMessage", text:"NaNs Garden is eight tiles wide by five tiles deep, with the entrance to Nans house near the bottom of the left side."},
          { type: "textMessage", text:"There are plant beds running in horizontal lines, with some plants that can be harvested."},
          { type: "textMessage", text:"There are hedges marking the edges of the garden, with accessible gaps at the top and bottom right leading to wildly overgrown spaces."},
        ]
    },
  ],//end of roomDescription

  
  cutsceneSpaces: {
    [utils.asGridCoord(0,17)]: [
      {
        events: [
          { 
          type: "changeMap", 
          map: "Nans",
          x: utils.withGrid(7),
          y: utils.withGrid(1),
          direction:"left",
         },
          
        ]
      }
    ],
  },//end of cutSceneSpaces
  
},//end of NaNs



}//end of window.OverworldMaps