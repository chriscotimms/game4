class Hud {
    constructor() {
        //collect the range of scoreboard Hud elements created onscreen
        this.scoreboards = [];
    }

    //update the scoreboards hud elements to reflect live values
    //look at persistent values from playerState and run them through combatant update() method 
    update() {
        this.scoreboards.forEach(s => {
            s.update(window.playerState.pizzas[s.id]);//id established below in createElement()
        })
    }

    createElement() {
        //create DOM element of hud
        this.element = document.createElement("div");
        this.element.classList.add("Hud");

        //adding info to the hud element which is created above
        //destructure to break down components
        const {playerState} = window;

        //access array in playerState
        //grabbing each premade "pizza" by their key
        //and assigning it to the const "pizza"
        playerState.lineup.forEach(key => {
            const pizza = playerState.pizzas[key];
            //scoreboard is the over HUD object, whihc uses the Combatant class
            const scoreboard = new Combatant({
                id: key,//to identify which scoreboard to update
                //then similar to "addCombatant()" in Battle.js, dynamically calling on info from playerState
                ...Pizzas[pizza.pizzaId],//calling on pre-made Pizzas in pizzas.js, then pizza.pizzaId in playerState
                ...pizza,
            }, null)//this addresses the function looking for battle type, but this is an overworld function
            scoreboard.createElement();//each "scoreboard" is created
            this.scoreboards.push(scoreboard);
            //finally adds scorebaord Hud element to the screen
            this.element.appendChild(scoreboard.hudElement);
        })
        this.update();
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);

        //sets up a custom event listener, so any time "PlayerStateUpdated" is iterated, 
        //the Hud will call this update() method
        //eg at end of battle, before removing elements, this line of code: 
        //utils.emitEvent("PlayerStateUpdated");
        document.addEventListener("PlayerStateUpdated", () => {
            this.update();
        })
    }


}