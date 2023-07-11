class BattleEvent {
    constructor(event, battle) {
        this.event = event;
        this.battle = battle;
    }

    textMessage(resolve) {

        //updates text to replace placeholder strings with specifics
        const text = this.event.text
        .replace("{CASTER}", this.event.caster?.name)
        .replace("{TARGET}", this.event.target?.name)
        .replace("{ACTION}", this.event.action?.name)

        const message = new TextMessage({
            text,
            onComplete: () => {
                resolve();
            }
        })
        message.init(this.battle.element);
    }

    //introducing change form turn event
    async stateChange(resolve) {
        const {caster, target, damage} = this.event;
        if (damage) {
            //modify the target to have less HP
            target.update({
                hp: target.hp - damage,
            })

            //start blinking
            target.pizzaElement.classList.add("battle-damage-blink");
        }

        //Wait a ittle bit
        await utils.wait(600);
        //stop blinking
        target.pizzaElement.classList.remove("battle-damage-blink");
        resolve();

    }





    //finds info about caster and enemy for battle
    submissionMenu(resolve) {
        const menu = new SubmissionMenu({
            caster: this.event.caster,
            enemy: this.event.enemy,
            onComplete: submission => {
                //submission {what move to use, what to use it on}
                resolve(submission)
            }
        })
        menu.init( this.battle.element );
    }

    animation(resolve){
        const fn = BattleAnimations[this.event.animation];
        fn(this.event, resolve);
    }



    init(resolve) {
        this[this.event.type](resolve);
    }


}