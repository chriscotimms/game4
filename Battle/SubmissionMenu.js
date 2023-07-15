class SubmissionMenu {
    constructor( { caster, enemy, onComplete, items, replacements }) {
        this.caster = caster;
        this.enemy = enemy;
        this.replacements = replacements;
        this.onComplete = onComplete;


        //method for counting quantity of each item on caster team
        let quantityMap = {};
        items.forEach(item => {
            if (item.team === caster.team) {

                let existing = quantityMap[item.actionId];
                if (existing) {
                    existing.quantity += 1;

                } else {
                quantityMap[item.actionId] = {
                    actionId: item.actionId,
                    quantity: 1,
                    instanceId: item.instanceId,
                }
            }
            }
        })
        this.items = Object.values(quantityMap);
    }//end constructer
    
    
    getPages() {

        //static back option to return to root
        const backOption = {
            label: "Go Back",
            description: "Return to previous page",
            handler: () => {
                this.keyboardMenu.setOptions(this.getPages().root)
            }
        };

        //root menu to make choices
        return {
            root: [
                {
                    label:"Attack",
                    description: "Choose an attack",
                    handler: () => {
                        // Do something when chosen
                        this.keyboardMenu.setOptions( this.getPages().attacks )//references attack options or others below
                    },
                    /* right: () => {
                        return "ammount";
                    } */
                },
                {
                    label:"Items",
                    description: "Choose an item",
                    handler: () => {
                        // Do something when chosen
                        this.keyboardMenu.setOptions( this.getPages().items )
                    }
                },
                {
                    label:"Swap",
                    description: "Change to another plant",
                    //disabled: true,
                    handler: () => {
                        // Do something when chosen
                        this.keyboardMenu.setOptions( this.getPages().replacements )
                    }
                },
            ],
            attacks: [
                ...this.caster.actions.map(key => {
                    const action = Actions[key];
                    return { 
                        label: action.name,
                        description: action.description,
                        handler: () => {
                            this.menuSubmit(action);//doing what decide does below, returning an action decision from the menu
                        }
                    }
                }),
                backOption
            ],
            items: [
                ...this.items.map(item => {
                    const action = Actions[item.actionId];
                    return { 
                        label: action.name,
                        description: action.description,
                        right: () => {
                            return "x"+item.quantity
                        },
                        handler: () => {
                            this.menuSubmit(action, item.instanceId)//doing what decide does below, returning an action decision from the menu
                        }
                    }
                }),
                backOption
            ],
            replacements: [
                ...this.replacements.map(replacement => {
                    return {
                        label: replacement.name,
                        description: replacement.description,
                        handler: () => {
                            this.menuSubmitReplacement(replacement);
                        }
                    }
                }),
                backOption
            ],
        }
    }


    menuSubmitReplacement(replacement) {
        this.keyboardMenu?.end();
        this.onComplete({
            replacement
        })
    }



    menuSubmit(action, instanceId=null) {

        this.keyboardMenu?.end();

        this.onComplete({
            action,
            target: action.targetType === "friendly" ? this.caster : this.enemy,
            instanceId
        })
    }


    //kind of very basic computer choices in the battle game
    decide() {
        //to do - enemies randomly decide what to do
        this.menuSubmit(Actions[ this.enemy .actions[0] ]);
    }



    showMenu(container) {
        this.keyboardMenu = new KeyboardMenu();
        this.keyboardMenu.init(container);
        this.keyboardMenu.setOptions( this.getPages().root )
    }



    init(container) {
        //check whether isPlayerControlled: true, then initiate menu
        if (this.caster.isPlayerControlled){
            //show some UI
            this.showMenu(container);
        } else {
        this.decide();
        }
    }//end init


}

