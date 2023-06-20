class Battle {
    constructor() {

    }//end constructor

    createElement() {
        //POssibly create canvas element for game here

        /* this.element = document.createElement("div");
        this.element.classList.add("Battle");
        this.element.innerHtml */
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
    }

}//end Battle