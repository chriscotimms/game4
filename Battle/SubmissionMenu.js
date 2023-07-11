class SubmissionMenu {
    constructor( { caster, enemy, onComplete }) {
        this.caster = caster;
        this.enemy = enemy;
        this.onComplete = onComplete;
    }//end constructer
    
    //kind of very basic computer choices in the battle game
    decide() {
        this.onComplete({
            action: Actions[ this.caster.actions[0] ],
            target:this.enemy,
        })
    }


    init(container) {
        this.decide();
    }//end init


}

