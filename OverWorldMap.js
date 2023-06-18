class OverWorldMap {

    constructor(config) {
        this.gameObject = config.gameObjects;

        this.lowerImage = new Image();
        this.lowerImage.src = config.lowerSrc;

        this.upperImage = new Image();
        this.upperImage.src = config.upperSrc;
    }// end of cronstructor

    drawLowerImage(ctx) { // this fires in Init game loop
        ctx.drawImage(this.lowerImage, 0, 0)
    }

    drawUpperImage(ctx) { // this fires in Init game loop
        ctx.drawImage(this.upperImage, 0, 0)
    }

}// end of OverWorldMap class

window.OverWorldMaps = {
    DemoRoom: {
        lowerSrc: "./images/maps/DemoLower.png",
        upperSrc: "./images/maps/DemoUpper.png",
        gameObjects: { //is called in Overworld.js Init game loop
        odVar: new Person({
            isPlayerControlled: true,
            x: utils.withGrid(5),
            y: utils.withGrid(6),
        }),
        /*  npc1: new Person({
            x: utils.withGrid(8),
            y: utils.withGrid(9),
            src: "./images/characters/people/npc1.png"
        })  */
        }//end of gameObjects
    },//end of DemoRoom

    Kitchen: {
        lowerSrc: "./images/maps/KitchenLower.png",
        upperSrc: "./images/maps/KitchenUpper.png",
        gameObjects: {
        odVar: new GameObject({
            x: 3,
            y: 1,
        }),
        npc2: new GameObject({
            x: 9,
            y: 9,
            src: "./images/characters/people/npc2.png"
        }),
        npc3: new GameObject({
            x: 4,
            y: 10,
            src: "./images/characters/people/npc3.png"
        })
        }//end of gameObjects
    },//end of DemoRoom


}//end of Overworld MAps