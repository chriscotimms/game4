class Battle {
    constructor({ onComplete }) {
        this.element = config.element;
        this.battlecanvas = document.querySelector(".game-canvas");
        this.battlectx = this.canvas.getContext("2d");
        this.onComplete = onComplete;
    }//end constructor

    createElement() {
        //POssibly create canvas element for game here
        
        /* this.element = document.createElement("div");
        this.element.classList.add("Battle");
        this.element.innerHTML = "Battle time"; */
        
        this.battlectx.clearRect(0, 0, this.canvas.width, this.canvas.height);



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

