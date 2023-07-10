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
        playerState.addPlant(object.id);//add object to playerState.Plantlineup[]
        
        //object.sprite.setAnimation("idle-right");//either this
        //object.sprite.currentAnimation = "idle-right";//or this
        
      }
      
    });
    console.log(playerState);
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
    let result = needed.every(i => retrieved.includes(i));//check for required collection
    if (result) {
    window.playerState.storyFlags[this.event.flag] = true;//if true add flag
    console.log(this.event.true);
    } else {
      console.log(this.event.false);
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

  init() {
    return new Promise(resolve => {
      this[this.event.type](resolve)      
    })
  }

}