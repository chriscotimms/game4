class CraftingMenu {
    constructor({ plants, onComplete}) {
        this.plants = plants;
        this.onComplete = onComplete;
    }//end constructor

    getOptions() {
        return this.plants.map(id => {
            const base = Plants[id];
            return {
                label: base.name,
                description: base.description,
                handler: () => {
                    //create a way to add items

                    playerState.addPlant(id);
                    this.close();
                }
            }
        })
    }


    /* getOptions() {
        return this.pizzas.map(id => {
            const base = Pizzas[id];
            return {
                label: base.name,
                description: base.description,
                handler: () => {
                    //create a way to add items

                    playerState.addPizza(id);
                    this.close();
                }
            }
        })
    } */

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("CraftingMenu");
        this.element.classList.add("overlayMenu");
        this.element.innerHTML = (`
        <h2>Create a Pizza</h2>
        `)
    }

    close() {
        this.keyboardMenu.end();
        this.element.remove();
        this.onComplete();
    }

    init(container) {
        this.createElement();
        this.keyboardMenu = new KeyboardMenu({
            descriptionContainer: container
        })
        this.keyboardMenu.init(this.element);
        this.keyboardMenu.setOptions(this.getOptions());//specified above
        container.appendChild(this.element);

    }

}