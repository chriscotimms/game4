# Odvar
A top-down RPG following Odvar, a variable character who is trying to find their way.

Based on a [youtube tutorial series by Drew Conley](https://www.youtube.com/@DrewConley/videos "Drew Conley tutorial series"), I have adapted not just the content of the game, but also implemented some significant changes to the form of the game. 

Firstly I worked on adding two significant accessibility features: 

1. An access screen added above the main game container which feeds back to the player what x and y tile they are on, as well as when a collison occurs, if it is named, such as an object or a person, then it feeds back the name (the "Atag" object key), or else if the object has no id and is just a collison tile, then it feeds back the space as blocked. There are moments in the Garden scene when this navigational panel is the only method of navigating the space.   

2. A function "roomDescription()" which intiates a description of the spatial layout of each space when it is first entered. It describes the most important objects and characters first, alongside entrances, and occassionally also intorduces some humour into the descriptions too, with the characters speaking back to the description. 

Secondly, I have introduced some big changes to the game itself. I have added a minature game-within-a-game where the character is intiated to collect objects (herbs) from a space to return to another character. I developed this myself, using some models from the tutorials to make my own  with different functions, and extending how the smaller mission or game-within-a-game is handled.

The mission is initiated when speaking to a character, and upon being intiated a dynamic HUD is initiated. This is an object which sits on top of the scene and makes visible as a kind of inventory what obejcts have been collected. A lot of the groundwork for the HUD came form the tutorial, but I have adapted it to only appear when the mission begins, and to only add new objects, or to otherwise display an ammount or quantity of collected objects. This helps the player keep track of what they have collected.

I used a single use object model and adapted it to lose it's collision status when it has been collected. The object also is adapted so that when the object is dynamically created using a class, the id is no longer automatically assigned from the name of the object. This allows for various objects to have the appearance of mutliples, for example the collection of multiples of herbs.

The objects are stored in a temporary object array, using a fucntion which checks if it already has collected that type of object. If so, it adds that object type another +=1 to it's "quantity" key. Otherwise, it adds it to the array "Plantlineup".

I have then set up a "checkMissionComplete" function, which is an OverworldEvent. It returns the name of the mission stored in Overworldmap, triggered by a the character walking onto a tile, and then used that as a variable in returning keys from an object stored in a seperate file I have created called mission.js. There is then a comparative check on these based on a required set of objects hardocded in mission.js, and if it matches, the game is over, the HUD disappears, and a storyflag is added, pushing the narrative on.

I have also adapted the storyflag functions from the talking events form the characters to the roomDescriptions and the cutSceneSpaces, to address repetition and feeling like the story moves forward once a space has been explored.




