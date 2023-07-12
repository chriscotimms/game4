class SubmissionMenu {
    constructor( { caster, enemy, onComplete }) {
        this.caster = caster;
        this.enemy = enemy;
        this.onComplete = onComplete;
    }//end constructer
    
    
    getPages() {

        const backOption = {
            label: "Go Back",
            description: "Return to previous page",
            handler: () => {
                this.keyboardMenu.setOptions(this.getPages().root)
            }
        };



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
                    description: "Change to another pizza",
                    disabled: true,
                    handler: () => {
                        // Do something when chosen
                        console.log("go to pizzas page");
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
                //items will g here
                backOption
            ]
        }
    }


    menuSubmit(action, instanceId=null) {

        this.keyboardMenu?.end();

        this.onComplete({
            action,
            target: action.targetType === "friendly" ? this.caster : this.enemy,
        })
    }


    //kind of very basic computer choices in the battle game
    decide() {
        //to do - enemies randomly decide what to do
        this.menuSubmit(Actions[ this.enemy.actions[0] ]);
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

