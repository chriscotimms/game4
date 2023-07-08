class collectible2 extends GameObject {
    constructor(config) {
        super(config);

        this.id = config.id;
        this.visible1 = config.visible1;
        console.log(this.visible1);
        this.sprite = new Sprite({
          gameObject: this,
          src: config.src,// || "images/objects/Plant1.png",
          animations: {
            "used-down"   : [ [1,0] ],
            "unused-down" : [ [0,0] ],
          },
          currentAnimation: "used-down",
        });
        this.storyFlag = config.storyFlag;
        this.pizzas = config.pizzas;
        this.plants = config.plants;

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
                    { type: "objectCollected", id: this.id},
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