// initialize input
window.addEventListener("keydown", keydownHandler, false);
var interfaceState = "move";
// handle input
function keydownHandler(event) {
    console.log(event.keyCode);
    if (interfaceState === "move") {
        // numlock keys
        if (event.keyCode >= 97 && event.keyCode <= 105) {
            player.move(event.keyCode - 96);
        }
        // 'g' = 80, get
        else if (event.keyCode === 71) {
            var get = player.canGet();
            if (get === 0) {  // if tile's inv is empty
                gameLogDiv.innerHTML = "Nothing to pick up.</br>";
            } else if (get === 1) {      // if player's inv is full
                gameLogDiv.innerHTML = "The inventory is full.</br>";
            }
            else {
                gameLogDiv.innerHTML = "What do you want to pick up?</br>";
                interfaceState = "get";
            }
        }
        // 'd' = 68, drop
        else if (event.keyCode === 68) {
            var drop = player.canDrop();
            if (drop === 0) {       // if player's inv is empty
                gameLogDiv.innerHTML = "Nothing to drop.</br>";
            } else if (drop === 1) {                 // if tiles's inv is full
                gameLogDiv.innerHTML = "The space here is occupied by other objects.</br>";
            }
            else {
                gameLogDiv.innerHTML = "What do you want to drop?</br>";
                interfaceState = "drop";
            }
        }
    } else if (interfaceState === "get") {
        if (player.get(event.keyCode - 65) !== 0) {
            gameLogDiv.innerHTML = "Picked up.</br>";
            interfaceState = "move";
        } else {
            gameLogDiv.innerHTML = "That item does not exist.</br>";
            interfaceState = "move";
        }
    } else if (interfaceState === "drop") {
        if (player.drop(event.keyCode - 65) !== 0) {
            gameLogDiv.innerHTML = "Droped.</br>";
            interfaceState = "move";
        } else {
            gameLogDiv.innerHTML = "Canceled.</br>";
            interfaceState = "move";
        }
    }
    gameLoop();

}