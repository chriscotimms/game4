class Battle {
    constructor() {

    }//end constructor

    createElement() {
        //POssibly create canvas element for game here

        this.element = document.createElement("div");
        this.element.classList.add("Battle");
        this.element.innerHTML = "";
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);


        setTimeout(() => {
            console.log("finish");
            this.element.remove();
            this.onComplete();
          }, "4000");


       
    }


}//end Battle

