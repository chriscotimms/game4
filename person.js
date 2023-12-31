class Person extends GameObject {
  constructor(config) {
    super(config);
    this.movingProgressRemaining = 0;
    this.isStanding = false;
    this.isSpecial = false;
    this.intentPosition = null; //[x,y];
    this.visible1 = config.visible1;
    this.isPlayerControlled = config.isPlayerControlled || false;
    this.useShadow = config.useShadow || false;
    this.Atag = config.Atag || "not-named"; //new access tags
  
  


    this.directionUpdate = {
      "up": ["y", -1],
      "down": ["y", 1],
      "left": ["x", -1],
      "right": ["x", 1],
    }
    this.standBehaviorTimeout;//not sure about this
  }

  update(state) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {

      //More cases for starting to walk will come here
      //
      //

      //Case: We're keyboard ready and have an arrow pressed
      if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow
        })
      }
    
      this.updateSprite(state);
    }
  }

  startBehavior(state, behavior) {
    //Set character direction to whatever behavior has
    this.direction = behavior.direction;
    
    if (behavior.type === "walk") {
      //Stop here if space is not free

      
      
      if (state.map.isSpaceTaken(this.x, this.y, this.direction) && this.visible1) {
       

        if (this.isPlayerControlled) {
        const aa = state.map.isSpaceTaken(this.x, this.y, this.direction);

        if (aa.second === "blocked"){
          AccessMessage(aa.second);
        /* } else if (aa.collectible) {  
          AccessMessage("disappear");
          AccessMessage(aa.collectible); */
        } else {
          AccessMessage(aa.Atag);

        }
        
      }; 
        

        behavior.retry && setTimeout(() => {
          this.startBehavior(state, behavior)
        }, 20);

        return;
      } 

      //Ready to walk!
      //state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = 16;


      //console.log((state.map.isCollectible(this.x, this.y)));
      /* if (state.map.isCollectible(this.x, this.y)) {
        console.log("Collectible");
      } */

      const intentPosition = utils.nextPosition(this.x, this.y, this.direction);
      this.intentPosition = [
        intentPosition.x,
        intentPosition.y,
      ];



      if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
      AccessMessageWalk("tile x:"+utils.withoutGrid(this.intentPosition[0])+", y:"+utils.withoutGrid(this.intentPosition[1]) );
    }

      this.updateSprite(state);
    }

    if (behavior.type === "stand") {
      this.isStanding = true;
      setTimeout(() => {
        utils.emitEvent("PersonStandComplete", {
          whoId: this.id
        })
        this.isStanding = false;
      }, behavior.time)
    }



  }

  updatePosition() {
      const [property, change] = this.directionUpdate[this.direction];
      this[property] += change;
      this.movingProgressRemaining -= 1;

      if (this.movingProgressRemaining === 0) {
        //We finished the walk!
        
        this.intentPosition = null;
        utils.emitEvent("PersonWalkingComplete", {
          whoId: this.id
        })

      }
  }

  updateSprite() {


    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation("walk-"+this.direction);
      return;
    }
    this.sprite.setAnimation("idle-"+this.direction);    
  }

}