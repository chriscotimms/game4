class Battle {
    constructor({ onComplete }) {
        this.onComplete = onComplete;
    }//end constructor

    createElement() {
        //POssibly create canvas element for game here

        this.element = document.createElement("div");
        this.element.classList.add("Battle");
        this.element.innerHTML = "Hi There";
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);


        setTimeout(() => {
            console.log("finish");
            this.element.remove();
            this.onComplete();
          }, "1500");

    }


}//end Battle

