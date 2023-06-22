let textContent = "";

function throttle(callback, delay = 1000) {
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
  textContent = text;
  console.log(textContent);
})

/* function AccessMessage(text){
  console.log(text);
  document.getElementById("Access_p").textContent = text;
} */

