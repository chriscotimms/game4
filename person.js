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
            if (this.isPlayerControlled && state.arrow) {
                this.startBehaviour(state, {
                    type: "walk",
                    direction: state.arrow
                });
            }
            this.updateSprite(state);
        }
        


    }//end of update


    startBehaviour(state, behaviour) {
        // Set character direction to whatever behaviour paths
        this.direction = behaviour.direction;

        if (behaviour.type === "walk") {

            //Stope here if space not free
            if (state.map.isSpaceTaken(this.x, this.y, this.direction)){
                return;
            }
            //ready to walk
            this.movingProgressRemaining = 16;
        }
    }


    updatePosition(){
        
            const [property, change] = this.directionUpdate[this.direction];
            this[property] += change;
            this.movingProgressRemaining -= 1;
        
    }//end of updatePosition


    updateSprite(){

        if (this.movingProgressRemaining > 0){
            this.sprite.setAnimation("walk-"+this.direction);
            return;
        }
        this.sprite.setAnimation("idle-"+this.direction);

    }//end of updateSprite
   


}//end of person class