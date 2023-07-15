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

    //introducing change form turn event (defined in actions.js)
    async stateChange(resolve) {
        const {caster, target, damage, recover, status, action} = this.event;
        let who = this.event.onCaster ? caster : target;

       

        if (damage) {
            //modify the target to have less HP
            target.update({
                hp: target.hp - damage,
            })
            //start blinking
            target.plantElement.classList.add("battle-damage-blink");
        }

        if (recover) {
            let newHp = who.hp + recover;
            if (newHp > who.maxHp) {
                newHp = who.maxHp;
            }
            who.update({
                hp: newHp
            })
        }

        if (status) {
            who.update({
                status: {...status}
            })
        }
        if (status === null) {
            who.update({
                status: null
            })
        }


        //Wait a ittle bit
        await utils.wait(600);

        //update team (from Team.js into Battle.js)
        this.battle.playerTeam.update();
        this.battle.enemyTeam.update();

        //stop blinking
        target.plantElement.classList.remove("battle-damage-blink");
        resolve();

    }





    //finds info about caster and enemy for battle
    submissionMenu(resolve) {
        const {caster} = this.event;
        const menu = new SubmissionMenu({
            caster: caster,
            enemy: this.event.enemy,
            items: this.battle.items,
            replacements: Object.values(this.battle.combatants).filter(c => {
                return c.id !== caster.id && c.team === caster.team && c.hp > 0
            }),
            onComplete: submission => {
                //submission {what move to use, what to use it on}
                resolve(submission)
            }
        })
        menu.init( this.battle.element )
    }


    replacementMenu(resolve) {
        const menu = new ReplacementMenu({
          replacements: Object.values(this.battle.combatants).filter(c => {
            return c.team === this.event.team && c.hp > 0
          }),
          onComplete: replacement => {
            resolve(replacement)
          }
        })
        menu.init( this.battle.element )
      }


    async replace(resolve) {
        const {replacement} = this.event;
    
        //Clear out the old combatant
        const prevCombatant = this.battle.combatants[this.battle.activeCombatants[replacement.team]];
        this.battle.activeCombatants[replacement.team] = null;
        prevCombatant.update();
        await utils.wait(400);
    
        //In with the new!
        this.battle.activeCombatants[replacement.team] = replacement.id;
        replacement.update();
        await utils.wait(400);

        //update team (from Team.js into Battle.js)
        this.battle.playerTeam.update();
        this.battle.enemyTeam.update();
    
        resolve();
      }

    
    //a new way of animating the xp visibility on screen instead of css animations
    giveXp(resolve) {
        let amount = this.event.xp;
        const {combatant} = this.event;
        //stepped animation where xp is trasnferred to combatatent step by step
        const step = () => {
            if (amount > 0) {
                amount -= 1;
                combatant.xp +=1;

                //checking if htting a certain level
                if (combatant.xp === combatant.maxXp) {
                    combatant.xp = 0;
                    combatant.maxXp = 100;
                    combatant.level += 1;
                }


                combatant.update();
                requestAnimationFrame(step);
                return;
            }
            resolve();
        }
        requestAnimationFrame(step);
    }


    animation(resolve){
        const fn = BattleAnimations[this.event.animation];
        fn(this.event, resolve);
    }



    init(resolve) {
        this[this.event.type](resolve);
    }


}