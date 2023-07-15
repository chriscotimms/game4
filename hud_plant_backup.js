class Hud {
    constructor() {

    }

    update() {

    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Hud");

        const {playerState} = window;
        playerState.Plantlineup.forEach(key => {
            const pizza = playerState.Plantlineup[key];
        })
    }

    init(container) {
        this.createElement();
        container.appendChild(container);
    }


}