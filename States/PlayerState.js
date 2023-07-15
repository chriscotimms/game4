class PlayerState {
    constructor() {
        this.plants = {
            "p1": {
                plantId:"s001",
                hp:1,
                maxHp: 50,
                xp: 90,
                maxXp: 100,
                level: 1,
                status: null,
            },
            "p2": {
                plantId:"v001",
                hp:50,
                maxHp: 50,
                xp: 75,
                maxXp: 100,
                level: 1,
                status: {type:"veg-tastic"},
            },
            "p3": {
                plantId:"f001",
                hp:50,
                maxHp: 50,
                xp: 75,
                maxXp: 100,
                level: 1,
                status: {type:"mushie"},
            },
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
        this.lineup = ["p1", "p2"];
        this.Plantlineup = ["p1"];
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
        const newId = `p${Date.now()}`+Math.floor(Math.random() * 99999);
        this.plants[newId] = {
            plantId,
            hp:50, 
            maxHp: 50,
            xp: 0,
            maxXp: 100,
            level:1,
            status:null,
        }
        this.Plantlineup.push(newId);
        utils.emitEvent("LineupChanged");
        console.log(this);
        //utils.emitEvent("LineupChanged");
    }











    
    addPlant(plantId) {
        this.Plantlineup.push(plantId);
        //console.log(plantId);
        //console.log(this + "from within playerstate");
        utils.emitEvent("LineupChanged");
    }


}//end PlayerState
window.playerState = new PlayerState();