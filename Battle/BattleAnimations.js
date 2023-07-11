window.BattleAnimations = {
    async spin(event, onComplete) {
        const element = event.caster.pizzaElement;
        const animationClassName = event.caster.team === "player" ? "battle-spin-right" : "battle-spin-left";
        element.classList.add(animationClassName);

        //remove class when animation is fully complete
        element.addEventListener("animationend", () => {
            element.classList.remove(animationClassName);
        }, { once:true });

        //continue rest of event firing of turn, updating hp etc, timed for when pizza makes contact
        await utils.wait(100);
        onComplete();
    }
}