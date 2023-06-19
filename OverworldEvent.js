class OverworldEvent {
    constructor({ map, event }) {
        this.map = map;
        this.event = event;
    }

    stand(resolve){
        const who = this.map.gameObjects[ this.event.who ];
        who.startBehaviour({
            map: this.map
        }, {
            type: "stand",
            direction: this.event.direction,
            time: this.event.time
        })

         //set up a custom eventHandler to resolve event when unique character is finished their animation
        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonStandComplete", completeHandler);
                resolve();
            }
        }
        //custom eventListener established in Person.js
        document.addEventListener("PersonStandComplete", completeHandler) 
    }


    walk(resolve){
        const who = this.map.gameObjects[ this.event.who ];
        who.startBehaviour({
            map: this.map
        }, {
            type: "walk",
            direction: this.event.direction,
            retry: true
        })

        //set up a custom eventHandler to resolve event when unique character is finished their animation
        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("PersonWalkingComplete", completeHandler);
                resolve();
            }
        }
        //custom eventListener established in Person.js
        document.addEventListener("PersonWalkingComplete", completeHandler)

    }//end walk


    textMessage(resolve) {

        if (this.event.faceHero) {
            const obj = this.map.gameObjects[this.event.faceHero];
            obj.direction = utils.oppositeDirection(this.map.gameObjects["odVar"].direction);
        }

        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve()
        })
        message.init( document.querySelector(".game-container"))
    }


    changeMap(resolve) {
        this.map.overworld.startMap( window.OverworldMaps[this.event.map] );
        resolve();
    }

    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }
}//end of OverworldEvent