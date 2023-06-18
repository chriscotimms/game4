//the overall class game object. When sprites get initiaialised they call this class.
class GameObject {
    constructor(config) {//can pass variable info if needed via config
        this.x = config.x || 0;//eg
        this.y = config.y || 0;
        this.direction = config.direction || "down";
        this.sprite = new Sprite({
            gameObject: this,
            src:config.src || "./images/characters/people/hero.png",
        })
    }

    update() {


    }



}//end of game object