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
            idleDown:[
                [0,0]
            ]
        }//end this.animations

        //var config.currentAnimation or else default to idledown
        this.currentAnimation = config.currentAnimation || "idleDown";
        this.currentAnimationFrame = 0;

        //reference the game object
        this.gameObject = config.gameObject;
    }//end of Constructor


    draw(ctx) {
        const x = this.gameObject.x - 8;
        const y = this.gameObject.y - 18;

        this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);
    
        this.isLoaded && ctx.drawImage(this.image,
            0,0,
            32,32,
            x,y,
            32,32
            )
    }//end of draw(ctx)


}//end of Sprite class


