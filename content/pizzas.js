 window.PizzaTypes = {
    normal: "normal",
    spicy: "spicy",
    veggie: "veggie",
    fungi: "fungi",
    chill: "chill",
} 

window.Pizzas = {
    "s001": {
        name:"Slice Samaurai",
        description: "Pizza desc here",
        type: PizzaTypes.spicy,
        src: "images/characters/pizzas/s001.png",
        icon: "images/icons/spicy.png",
        actions: ["saucyStatus", "clumsyStatus","damage1"],//defined in action.js
    },
    "s002": {
        name:"Bacon Brigade",
        description: "A salty dog",
        type: PizzaTypes.spicy,
        src: "images/characters/pizzas/s002.png",
        icon: "images/icons/spicy.png",
        actions: ["saucyStatus", "clumsyStatus","damage1"],
    },
    "v001": {
        name:"Call Me Kale",
        description: "Pizza desc here",
        type: PizzaTypes.veggie,
        src: "images/characters/pizzas/v001.png",
        icon: "images/icons/veggie.png",
        actions: ["damage1"],//defined in action.js
    },
    "f001": {
        name:"Portobello Express",
        description: "Pizza desc here",
        type: PizzaTypes.fungi,
        src: "images/characters/pizzas/f001.png",
        icon: "images/icons/fungi.png",
        actions: ["damage1"],//defined in action.js
    },
}//end window.Pizzas




window.Plants = {
    "s01": {
        name:"Thyme",
        description: "Smells like wood",
        //type: PizzasTypes.spicy,
        src: "images/characters/pizzas/s001.png",
        icon: "images/icons/spicy.png",
    },
    "v01": {
        name:"Rosemary",
        description: "Pungent, somewhat astringent",
        //type: PizzasTypes.veggie,
        src: "images/characters/pizzas/v001.png",
        icon: "images/icons/veggie.png",
    },
    "f01": {
        name:"Sage",
        description: "Earthy aroma, slightly sweet",
        //type: PizzasTypes.fungi,
        src: "images/characters/pizzas/f001.png",
        icon: "images/icons/fungi.png",
    },
}//end window.Plants