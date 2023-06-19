//the overall class game object. 
//When sprites get initiaialised they call this class.

class GameObject {
    constructor(config) {//can pass variable info if needed via config.x, config.src, etc
        this.id = null;//so every significant object can be called
        this.isMounted = false;//add empty boolean for collision check
        this.x = config.x || 0;//start co-ordinates
        this.y = config.y || 0;//start co-ordinates
        this.direction = config.direction || "down";//start direction
        this.sprite = new Sprite({
            gameObject: this,
            src:config.src || "./images/characters/people/hero.png",
        });
        this.behaviourLoop = config.behaviourLoop || [];
        this.behaviourLoopIndex = 0;

    }//end of constructor

    //adds collisons
    mount(map){
        console.log("mounting");
        this.isMounted = true;
        map.addWall(this.x, this.y);


        //If we have a behaviour, kick off after a short delay
        setTimeout(() => {
            this.doBehaviourEvent(map);
        }, 10)


    }//end of mount


 

    update() {
    }

    //first asynchronous function!! instantiated by "async" id before function name
    //"await" below will pause rest of function until "init()" has completed
    async doBehaviourEvent(map) {

        if (map.isCutscenePlaying || this.behaviourLoop.length === 0) {
            return;
        }

        //setting up info
        let eventConfig = this.behaviourLoop[this.behaviourLoopIndex];
        //dynamically establish id assiging behaviour
        eventConfig.who = this.id;

        //call OverworldEvent class for game events
        const eventHandler = new OverworldEvent({ map, event: eventConfig });
        await eventHandler.init();

        //progress behaviour index
        this.behaviourLoopIndex += 1;

        //looping through index of behaviour
        if (this.behaviourLoopIndex === this.behaviourLoop.length){
            this.behaviourLoopIndex = 0;
        }

        //call next round of function / loop
        this.doBehaviourEvent(map);

    }//end doBehaviourEvent




}//end of game object