# Odvar
A top-down RPG following Odvar, a variable character who is trying to find their way.

Based on a [youtube tutorial series by Drew Conley](https://www.youtube.com/@DrewConley/videos "Drew Conley tutorial series"), I have adapted not just the content of the game, but also implemented some changes to the form of the game. 

I worked on adding accessibility features: 

1. An access screen added above the main game container which feeds back to the player what x and y tile they are on, as well as when a collison occurs, if it is named, such as an object or a person, then it feeds back the name, or else if the object has no id and is just a collison tile, then it feeds back the space as blocked.  

2. A function which intiates a description of the spatial layout of each space when it is first entered. It describes the most important objects and characters first, alongside entrances, and occassionally also intorduces some humour into the descriptions too, with the characters speaking back to the description. 

I have also added a minature game-within-a-game where the character is intiated to collect objects from a space to return to another character. I developed this myself, using an object model from the tutorials to make my own objects with different functions, for example, they stop being collison objects when they are collected, and their sprite animation changes to allow flexibility to either become transparent, or else leave some kind of trace of their consumption once they have been collected. The objects are stored in a temporary object array. There is then a comparative check on this array initied by a story flag which then determines whether or not all of the objects have been completed (using Array.prototype.every() running through a hard-coded array to compare with). 




