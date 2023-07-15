class OverworldEvent {
  constructor({ map, event}) {
    this.map = map;
    this.event = event;
  }

  stand(resolve) {
    const who = this.map.gameObjects[ this.event.who ];
    who.startBehavior({
      map: this.map
    }, {
      type: "stand",
      direction: this.event.direction,
      time: this.event.time
    })
    
    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonStandComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonStandComplete", completeHandler)
  }

  walk(resolve) {
    const who = this.map.gameObjects[ this.event.who ];
    who.startBehavior({
      map: this.map
    }, {
      type: "walk",
      direction: this.event.direction,
      retry: true
    })

    //Set up a handler to complete when correct person is done walking, then resolve the event
    const completeHandler = e => {
      if (e.detail.whoId === this.event.who) {
        document.removeEventListener("PersonWalkingComplete", completeHandler);
        resolve();
      }
    }
    document.addEventListener("PersonWalkingComplete", completeHandler)
  }

  textMessage(resolve) {

    if (this.event.faceHero) {
      const obj = this.map.gameObjects[this.event.faceHero];
      obj.direction = utils.oppositeDirection(this.map.gameObjects["hero"].direction);
    }

    const message = new TextMessage({
      text: this.event.text,
      onComplete: () => resolve()
    })
    message.init( document.querySelector(".game-container") )
  }

  objectCollected(resolve) {
  
      const match = Object.values(this.map.gameObjects).find(object => {
      if (object.id === this.event.id) {
        object.visible1 = false;//remove collision  
        //working function, but needs expanding below to update Hud inventory 
        //playerState.addPlant(object.id);//add object to playerState.Plantlineup[]
        playerState.addPlant2(object.plants/*object.id*/);//add object to playerState.Plantlineup[]
        utils.emitEvent("PlayerStateUpdated");
        
      } 
      
    });
    resolve();
  } 

  changeMap(resolve) {
    this.map.overworld.startMap( window.OverworldMaps[this.event.map], {
      x: this.event.x,
      y: this.event.y,
      direction: this.event.direction,
    });
    this.map.overworld.initDescription();
    resolve();
  }

  battle(resolve) {
    const battle = new Battle({
      enemy: Enemies[this.event.enemyId],
      onComplete: () => {
        resolve();
      }
    })
    battle.init(document.querySelector(".game-container"));
  }

  addStoryFlag(resolve) {
    window.playerState.storyFlags[this.event.flag] = true;
    resolve();
  }

  checkMissionComplete(resolve) {
    const needed = this.event.check;
    const retrieved = playerState.Plantlineup;
    //console.log(needed[0].herb, needed[0].quantity);
    //console.log(window.playerState.plants[retrieved[1]].plantId, window.playerState.plants[retrieved[1]].quantity);
    
    let counter = 0;
    for(let j=0;j<needed.length; j+=1) {
      let neededherb = needed[j].herb;
      let neededquan = needed[j].quantity;


      for(let i=0;i<retrieved.length; i+=1) {
        let retrievedherb = window.playerState.plants[retrieved[i]].plantId;
        let retrievedquan = window.playerState.plants[retrieved[i]].quantity;
        
        if (retrievedherb === neededherb && retrievedquan === neededquan) {
          counter++;
        } 

      }
    }
    //console.log("needed.lenght = ", needed.length, "counter = ", counter);
    if (counter === needed.length) {
      window.playerState.storyFlags[this.event.flag] = true;//if true add flag
    }
    resolve();
  }
 
  craftingMenu(resolve) {
    const menu = new CraftingMenu({
      plants: this.event.plants,//from OverworldMap
      onComplete: () => {
        resolve();
      }
    })
    menu.init(document.querySelector(".game-container"))
  }

  pause(resolve) {
    this.map.isPaused = true;
    const menu = new PauseMenu({
      onComplete: () => {
        resolve();
        this.map.isPaused = false;
        this.map.overworld.startGameLoop();
      }
    });
    menu.init(document.querySelector(".game-container"));
  }

  addHud(resolve) {
    this.hud = new Hud();
    this.hud.init(document.querySelector(".game-container"));
    resolve();
  }

  removeHud(resolve) {
    const undertheHud = document.querySelector(".Hud");
    undertheHud.remove();
    resolve();
  } 

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)      
    })
  }

}