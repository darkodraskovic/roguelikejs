// scenery tile w and h in px
var TILE_WIDTH = 20;
var TILE_HEIGHT = 20;

// number of scenery tiles per screen
var DISP_WIDTH = 32;     
var DISP_HEIGHT = 20;

// the scenery container div contains individual tile div elements
var sceneryContainerDiv = document.getElementById("sceneryContainer");
// var sceneryStr = ""; 

// this is the array of the divs containing individual scenery tiles
var sceneryDivArr = new Array();  

for (i = 0; i < DISP_WIDTH; i++) {
    sceneryDivArr[i] = new Array();
}

initializeSceneryDivArr();
function initializeSceneryDivArr() {
    // i represents the x-axis
    for (i = 0; i < sceneryDivArr.length; i++) {
        // y represents the y-axis
        for (j = 0; j < DISP_HEIGHT; j++) {
            sceneryDivArr[i][j] = document.createElement("div");                      
            sceneryDivArr[i][j].style.width = TILE_WIDTH + "px";
            sceneryDivArr[i][j].style.height = TILE_HEIGHT + "px";
            sceneryDivArr[i][j].style.position = "absolute";
            sceneryDivArr[i][j].style.left = i * TILE_WIDTH + "px";
            sceneryDivArr[i][j].style.top = j * TILE_HEIGHT + "px";
            // unique id of the scenery tile div; format: "<x>,<y>" 
            sceneryDivArr[i][j].id = i + "," + j;           
            sceneryContainerDiv.appendChild(sceneryDivArr[i][j]);
        }
    }
}

// div element conaining player
//var playerDiv = document.getElementById("player");

// current tile inventory div element
var currentTileInvDiv = document.getElementById("tileInventory");

// player inventory div
var playerInvDiv = document.getElementById("playerInventory");

// game log div
var gameLogDiv = document.getElementById("gameLog");