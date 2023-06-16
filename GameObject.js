class GameObject {
    constructor(config) {//can pass variable info if needed via config
        this.x = config.x || 0;//eg
        this.y = config.y || 0;
        this.sprite = new Sprite({
            gameObject: this,
            src:config.src || "./images/characters/people/hero.png",
        })
    }
}//end of game object