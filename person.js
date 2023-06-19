class Person extends GameObject {

    constructor(config) {
        super(config);
        this.movingProgressRemaining = 0;//hard coded values here if needed

        this.isPlayerControlled = config.isPlayerControlled || false;
        
        this.directionUpdate = {
            "up": ["y", -1],
            "down": ["y", 1],
            "left": ["x", -1],
            "right": ["x", 1],
        }
    }


    update(state){
        if (this.movingProgressRemaining > 0) {
        this.updatePosition();
        } else { 

            //more cases for starting to walk will come here
            //
            //



            // Case: we're keyboard ready and have an arrow pressed
            if (!state.map.isCutscenePlaying && this.isPlayerControlled && state.arrow) {
                this.startBehaviour(state, {
                    type: "walk",
                    direction: state.arrow
                })
            }
            this.updateSprite(state);
        }
        


    }//end of update


    startBehaviour(state, behaviour) {
        // Set character direction to whatever behaviour paths
        this.direction = behaviour.direction;

        if (behaviour.type === "walk") {

            //Stop here if space not free
            if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {


                //timeout length for retrying behaviour. Could be longer?
                behaviour.retry && setTimeout(() => {
                    this.startBehaviour(state, behaviour)
                  }, 100);

                return;
            }

            //ready to walk
            state.map.moveWall(this.x, this.y, this.direction);
            this.movingProgressRemaining = 16;
            this.updateSprite(state);
        }

        if (behaviour.type === "stand") {
            setTimeout(() => {
                utils.emitEvent("PersonStandComplete", {
                    whoId: this.id
                });
            }, behaviour.time)
        }






    }//end startBehaviour


    updatePosition(){
        
            const [property, change] = this.directionUpdate[this.direction];
            this[property] += change;
            this.movingProgressRemaining -= 1;

            if (this.movingProgressRemaining === 0) {
                //We finish the animation
                //custom eventListener
                utils.emitEvent("PersonWalkingComplete", {
                    whoId: this.id                
                })
            }
        
    }//end of updatePosition


    updateSprite(){

        if (this.movingProgressRemaining > 0){
            this.sprite.setAnimation("walk-"+this.direction);
            return;
        }
        this.sprite.setAnimation("idle-"+this.direction);

    }//end of updateSprite
   


}//end of person class

