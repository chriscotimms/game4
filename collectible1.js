class collectible1 extends GameObject {
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
          gameObject: this,
          src: "images/characters/pizza-stone.png",
          animations: {
            "used-down"   : [ [0,0] ],
            "unused-down" : [ [1,0] ],
          },
          currentAnimation: "used-down"
        });
        this.storyFlag = config.storyFlag;
        //this.pizzas = config.pizzas; -->reintroduce once menu set up

        this.talking = [
            {
                required: [this.storyFlag],
                events: [
                    { type:"textMessage", text: "you've already used this"},
                ]
            },
            {
                events: [
                    { type:"textMessage", text: "want to use it?"},
                    { type: "craftingMenu"},//, pizzas: this.pizzas}, 
                    { type:"addStoryFlag", flag: this.storyFlag },
                ]
            }
        ]

    }

    update() {
        this.sprite.currentAnimation = playerState.storyFlags[this.storyFlag]
        ? "used-down"
        : "unused-down"
    }


}//end collectible1 class