class Sprite {
    constructor(config) {

        //set up image
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }
        
        //shadow
        this.shadow = new Image();
        this.useShadow = true; // config.useShadow || false
        if (this.useShadow){//only download if shadow true
        this.shadow.src = "./images/characters/shadow.png";
        }
        this.shadow.onload = () => {
            this.isShadowLoaded = true;
        }
        
        //configure animations and inital state
        this.animations = config.animations || {
            "idle-down":[ [0,0] ],
            "idle-down":[ [0,1] ],
            "idle-down":[ [0,2] ],
            "idle-down":[ [0,3] ],
            "walk-down": [ [1,0],[0,0],[3,0],[0,0] ],
            "walk-right": [ [1,1],[0,1],[3,1],[0,1] ],
            "walk-up": [ [1,2],[0,2],[3,2],[0,2] ],
            "walk-left": [ [1,3],[0,3],[3,3],[0,3] ],
        }//end this.animations

        //var config.currentAnimation or else default to idledown
        this.currentAnimation = config.currentAnimation || "walk-up";
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 16;
        this.animationFrameProgress = this.animationFrameLimit;

        //reference the game object
        this.gameObject = config.gameObject;
    }//end of Constructor


    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }



    




    updateAnimationProgress() {
        //Downtick frame progress
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        } 

        //reset the counter
        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;

        if (this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }

    }//end updateAnimationProgress



    draw(ctx) {
        const x = this.gameObject.x - 8;
        const y = this.gameObject.y - 18;

        this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);


        const [frameX, frameY] = this.frame;
    
        this.isLoaded && ctx.drawImage(this.image,
            frameX * 32,frameY * 32,
            32,32,
            x,y,
            32,32
            )


            this.updateAnimationProgress();//update called within draw
    }//end of draw()


    

}//end of Sprite class


