//is called in Person.js

function throttle(callback, delay) {
  let shouldWait = false;
  return (...args) => {
    if (shouldWait) return;
    callback(...args);
    shouldWait = true;
    setTimeout(() => {
          shouldWait = false;
    }, delay);
  };
}



const AccessMessage = throttle(function(text){
  document.getElementById("Access_p").textContent = text;
}, 1000)

const AccessMessageWalk = throttle(function(text){
  document.getElementById("Access_p").textContent = text;
}, 50)



