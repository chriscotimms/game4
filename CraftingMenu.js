class CraftingMenu {
    constructor({ pizzas, onComplete}) {
        this.pizzas = pizzas;
        this.onComplete = onComplete;
    }//end constructor

    getOptions() {
        return [
            { label: "Test", description: "crafting will go here!"}
        ]
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("CraftingMenu");
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
        this.keyboardMenu.init(this.element)
        this.keyboardMenu.setOptions(this.getOptions())//specified above
        container.appendChild(this.element);

    }

}