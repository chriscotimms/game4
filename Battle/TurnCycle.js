class TurnCycle {
    constructor({ battle, onNewEvent }) {
        this.battle = battle;
        this.onNewEvent = onNewEvent;
        this.currentTeam = "player";//or enemy
    }

    async turn() {
        //Get the caster
        const casterId = this.battle.activeCombatants[this.currentTeam];
        const caster = this.battle.combatants[casterId];
        const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"];
        const enemy = this.battle.combatants[enemyId];

        //all this occurs in the sub
        const submission = await this.onNewEvent({
            type: "submissionMenu",
            caster,
            enemy
        })
        const resultingEvents = submission.action.success;
        for (let i=0; i<resultingEvents.length; i+=1) {
            //this event will include all of the info from battle event
            const event = {
                ...resultingEvents[i],//spreads all the events, textmessage, etc,
                submission,
                action: submission.action,
                caster,
                target: submission.target,
            }
            await this.onNewEvent(event);
        }

        //check for post-events, after the turn
        const postEvents = caster.getPostEvents();
        for (let i=0; i < postEvents.length; i+=1) {
            const event = {
                ...postEvents[i],
                submission,
                action: submission.action,
                caster,
                target: submission.target,
            }
            await this.onNewEvent(event);
        }

        //Chck for status expire
        const expiredEvent = caster.decrementStatus();//if expires, capture
        if (expiredEvent) {
            await this.onNewEvent(expiredEvent);//pass this as the next event in the turncycle
        }




        //switch whos turn it is, player or enemy
        this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
        this.turn();


    }//end of async turn








    async init() {
        await this.onNewEvent({
            type: "textMessage",
            text: "The battle is starting!"
        })

        //Start first turn
        this.turn();
    }
}