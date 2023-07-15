class PauseMenu {
    constructor({onComplete}) {
        this.onComplete = onComplete;
    }

    getOptions(pageKey) {

        if (pageKey === "root") {

        return [
            //all dynamic content
            {
                label: "Inventory",
                description: "Check your inventory",
                handler: () => {
                 "pizza2";
                }
            },
            {
                label: "Save",
                description: "Save your progress",
                handler: () => {
                //thing to do if save selected
                }
            },
            {
                label: "Close",
                description: "Close menu",
                handler: () => {
                    this.close();
                }
            }
        ]  
    }
        


        return [

        ];
    }


    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("overlayMenu");
        this.element.innerHTML = (`
        <h2>Pause Menu</h2>
        `)
    }


    close() {
        this.esc?.unbind();
        this.keyboardMenu.end();
        this.element.remove();
        this.onComplete();
    }

    async init (container) {
        this.createElement();
        this.keyboardMenu = new KeyboardMenu({
            descriptionContainer: container
        })
        this.keyboardMenu.init(this.element);
        this.keyboardMenu.setOptions(this.getOptions("root"));

        container.appendChild(this.element);
        /* console.log(playerState.Plantlineup, playerState.Plantlineup[0]); */
        utils.wait(200);//create option to escape after menu loads
        this.esc = new KeyPressListener("Escape", () => {
            this.close();
        })
    }

}