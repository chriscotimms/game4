//Overworld Event
class Battle {
    constructor({ onComplete }) {
        console.log(onComplete);
        this.onComplete = onComplete;
    }//end constructor

    createElement() {

        //POssibly create canvas element for game here
        
        /* this.element = document.createElement("div");
        this.element.classList.add("Battle");
        this.element.innerHTML = "Battle time";  */
        this.battleCanvas = document.createElement("canvas");
        this.battleCanvas.classList.add("Battle");
        this.ctx = this.battleCanvas.getContext("2d");
        

      
    }

    init(container) {
        this.createElement();
        container.appendChild(this.battleCanvas);

        this.ctx.fillRect(25, 25, 200, 200);
        this.ctx.clearRect(45, 45, 60, 60);
        this.ctx.strokeRect(50, 50, 50, 50);


        setTimeout(() => {
            console.log("finish");
            this.battleCanvas.remove();
            this.onComplete();
          }, "4000");

    }


}//end Battle

