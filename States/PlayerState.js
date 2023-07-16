class PlayerState {
    constructor() {
        this.plants = {
            /* "p1": {
                plantId:"s001",
                hp:1,
                maxHp: 50,
                xp: 90,
                maxXp: 100,
                level: 1,
                quantity: 1,
                status: null,
            }, */
            /* "p2": {
                plantId:"f001",
                hp:50,
                maxHp: 50,
                xp: 75,
                maxXp: 100,
                level: 1,
                quantity: 1,
                status: {type:"mushie"},
            }, */
        },
    
        /* this.plants = {
            "plant0": {
                plantId:"s01",
                hp:50,
                maxHp: 50,
                xp: 75,
                maxXp: 100,
                level: 1,
                status: null,
            },
            "plant1": {
                plantId:"f01",
                hp:1,
                maxHp: 50,
                xp: 90,
                maxXp: 100,
                level: 1,
                status: null,
            },
        } */
        this.lineup = ["p1"];
        this.Plantlineup = [];
        this.items = [
            { actionId: "item_recoverHp", instanceId: "item1"},
            { actionId: "item_recoverHp", instanceId: "item2"},
        ]

        this.storyFlags = {
            //"DID_SOMETHING" = true,
            //"DID_ANOTHER_THING" = true,
            //"OUTSIDE_FIRST": true,
        };

    }//end constructor

    addPlant2(plantId) {
        let counter = 0;
        for (let i = 0; i < this.Plantlineup.length; i+=1) {
            if (plantId === this.plants[this.Plantlineup[i]].plantId) {
                //add to quantity
                counter += 1;
                this.plants[this.Plantlineup[i]].quantity += 1;
            } 
        }
        if (counter === 0) {
        ///if no match add new item
        const newId = `p${Date.now()}`+Math.floor(Math.random() * 99999);
        this.plants[newId] = {
            plantId,
            hp:50, 
            maxHp: 50,
            xp: 0,
            maxXp: 100,
            level:1,
            quantity:1,
            status:null,
        }
        this.Plantlineup.push(newId);
        }
    utils.emitEvent("LineupChanged");
    }











    
    addPlant(plantId) {
        this.Plantlineup.push(plantId);
        //console.log(plantId);
        //console.log(this + "from within playerstate");
        utils.emitEvent("LineupChanged");
    }


}//end PlayerState
window.playerState = new PlayerState();