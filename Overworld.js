class Overworld {
  constructor(config) {
    /* console.log(config.element); */
    this.element = config.element;
    this.canvas = this.element.querySelector(".game-canvas");
    this.ctx = this.canvas.getContext("2d");
    this.map = null;
  }
 
   startGameLoop() {
     const step = () => {
       //Clear off the canvas
       this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
 
       //Establish the camera person
       const cameraPerson = this.map.gameObjects.hero;
 
       //Update all objects
       Object.values(this.map.gameObjects).forEach(object => {
         object.update({
           arrow: this.directionInput.direction,
           map: this.map,
         })
       })
 
       //Draw Lower layer
       this.map.drawLowerImage(this.ctx, cameraPerson);
 
       //Draw Game Objects
       Object.values(this.map.gameObjects).sort((a,b) => {
         return a.y - b.y;
       }).forEach(object => {
         object.sprite.draw(this.ctx, cameraPerson);
       })
 
       //Draw Upper layer
       this.map.drawUpperImage(this.ctx, cameraPerson);
       
      if (!this.map.isPaused) {
        requestAnimationFrame(() => {
          step();   
        })
      }
     }
     step();
  }
 
  bindActionInput() {
    new KeyPressListener("Enter", () => {
      //Is there a person here to talk to?
      this.map.checkForActionCutscene()
    })
    new KeyPressListener("Escape", () => {
      if (!this.map.isCutscenePlaying) {
        this.map.startCutscene([
          {type: "pause" }
        ])
      }
      
    })
  }

  
 
  bindHeroPositionCheck() {
    document.addEventListener("PersonWalkingComplete", e => {
      if (e.detail.whoId === "hero") {
        //Hero's position has changed
        this.map.FootstepCutscene()
      }
    })
  }
  
  //added room description each time you enter a room
  initDescription() {
    // /console.log(this.roomDescription.events[0]);
    this.map.sceneDescription();
    }

 
 
  startMap(mapConfig, heroInitialState=null) {
   this.map = new OverworldMap(mapConfig);
   this.map.overworld = this;
   this.map.mountObjects();

   if(heroInitialState) {
      this.map.gameObjects.hero.x = heroInitialState.x;
      this.map.gameObjects.hero.y = heroInitialState.y;
      this.map.gameObjects.hero.direction = heroInitialState.direction;
   }
  }
 
  async init() {

  this.titleScreen = new TitleScreen({
  })
  await this.titleScreen.init(document.querySelector(".game-container"));


    /* this.hud = new Hud();
    this.hud.init(document.querySelector(".game-container")); */

  //this.startMap(window.OverworldMaps.First);
   this.startMap(window.OverworldMaps.First);
 
 
   this.bindActionInput();
   this.bindHeroPositionCheck();
   
   //inital Audio Description of room
   this.initDescription();
 
   this.directionInput = new DirectionInput();
   this.directionInput.init();
 
   this.startGameLoop();

   
   /* this.map.startCutscene([
    { type: "battle" }
   ]) */

 
   // this.map.startCutscene([
   //   { who: "hero", type: "walk",  direction: "down" },
   //   { who: "hero", type: "walk",  direction: "down" },
   //   { who: "npcA", type: "walk",  direction: "up" },
   //   { who: "npcA", type: "walk",  direction: "left" },
   //   { who: "hero", type: "stand",  direction: "right", time: 200 },
   //   { type: "textMessage", text: "WHY HELLO THERE!"}
   //   // { who: "npcA", type: "walk",  direction: "left" },
   //   // { who: "npcA", type: "walk",  direction: "left" },
   //   // { who: "npcA", type: "stand",  direction: "up", time: 800 },
   // ])
 
  }
 }