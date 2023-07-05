class PlayerState {
    constructor() {
        this.pizzas = {
            "p1": {
                pizzaId:"s001",
                hp:1,
                maxHp: 50,
                xp: 90,
                maxXp: 100,
                level: 1,
                status: {type:"saucy"},
            },
            "p2": {
                pizzaId:"v001",
                hp:50,
                maxHp: 50,
                xp: 75,
                maxXp: 100,
                level: 1,
                status: {type:"veg-tastic"},
            },
            "p3": {
                pizzaId:"f001",
                hp:50,
                maxHp: 50,
                xp: 75,
                maxXp: 100,
                level: 1,
                status: {type:"mushie"},
            },
        },
    
        this.plants = {
            "plant0": {
                plantId: "fern",
            },
        }
        this.lineup = ["p1"];
        this.Plantlineup = ["No plants"];
        this.storyFlags = {
            //"DID_SOMETHING" = true,
            //"DID_ANOTHER_THING" = true,
            //"OUTSIDE_FIRST": true,
        };

    }//end constructor

    addPizza(pizzaId) {
        const newId = `p${Date.now()}`+Math.floor(Math.random() * 99999);
        this.pizzas[newId] = {
            pizzaId,
            hp:50, 
            maxHp: 50,
            xp: 0,
            maxXp: 100,
            level:1,
            status:null,
        }
        this.lineup.push(newId);
        utils.emitEvent("LineupChanged");
    }

    addPlant(plantId) {
        this.Plantlineup.push(plantId);
        console.log(plantId);
        utils.emitEvent("LineupChanged");
    }


}//end PlayerState
window.playerState = new PlayerState();