class collectible2 extends GameObject {
    constructor(config) {
        super(config);
        this.sprite = new Sprite({
          gameObject: this,
          src: config.src,
          animations: {
            "used-down"   : [ [0,0] ],
            "unused-down" : [ [1,0] ],
          },
          currentAnimation: "used-down"
        });
        console.log(this);
        this.storyFlag = config.storyFlag;
        this.pizzas = config.pizzas;

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
                    { type: "craftingMenu", pizzas: this.pizzas}, 
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


}//end collectible2 class