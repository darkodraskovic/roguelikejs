// DISPLAY VARIABLES + INITIALIZATION
var MAP_WIDTH = 128;
var MAP_HEIGHT = 80;


// GAME OBJECT VARIABLES

// init scenery
// array containing the scenery objects
var sceneryArr = readSceneryString(sceneryStr);

// parse the string containing scenery into the scenery array
// scenery array is plotted directly to the screen giving the background of the main view
function readSceneryString(sceneryStr) {
    // create the array of strings; each string represents one raw of the scenery
    var sceneryStrArr = sceneryStr.split('\n');

    var sceneryArr = new Array();
    for (i = 0; i < sceneryStrArr[0].length; i++) {      // sceneryStrArr[0].length is the length of the string
        sceneryArr[i] = new Array();                     // it represents the width of the scenery map
    }

    // length of the scenery arr represents the number of the rows in the tile
    for (i = 0; i < sceneryArr.length; i++) {
        for (j = 0; j < sceneryStrArr.length; j++) {    // the number of the rows, that is the height of the scenery map
            switch (sceneryStrArr[j].charAt(i)) {        // take i-th (x-axis) carracter from the j-th (y-axis) column
                case '.':
                    sceneryArr[i][j] = new sceneryObj(i, j, false, '.');        // i = x-axis pos; j = y-axis pos
                    break;
                case '#':
                    sceneryArr[i][j] = new sceneryObj(i, j, true, '#');
                    break;
            }
        }
    }

    MAP_WIDTH = sceneryArr.length;
    MAP_HEIGHT = sceneryArr[0].length;

    return sceneryArr;
}

// init items
var itemsArr = readItemsStr(itemsStr);

// parse the string containg items into the items array
// the members of the items array are pushed in the inventory of the tiles
function readItemsStr(itemsStr) {
    var itemsArr = new Array();

    // increment is i+2 because we leave empty space in 
    // the string after the item char for better readability
    for (i = 0; i < itemsStr.length; i = i + 2) {
        itemsArr[i / 2] = new itemObj(Math.floor(Math.random() * MAP_WIDTH),
                Math.floor(Math.random() * MAP_HEIGHT), itemsStr[i]);
        // push the item in the current tile's array holding NPCs and items
        sceneryArr[itemsArr[i / 2].posX][itemsArr[i / 2].posY].inv.push(itemsArr[i / 2]);
    }

    // CONS LOG
//    for (i = 0; i < itemsArr.length; i++) {
//        console.log(itemsArr[i].char + " " + "X: " + itemsArr[i].posX + 
//            ", Y: " + itemsArr[i].posY);
//    }

    return itemsArr;
}

//var sceneryArr = new Array();        
//for (i = 0; i < MAP_WIDTH; i++) {
//    sceneryArr[i] = new Array();
//}
//
//function initializeScenery() {
//    for (i = 0; i < sceneryArr.length; i++) { 
//        for (j = 0; j < MAP_HEIGHT; j++) {
//            if (Math.random() > 0.15) {
//                sceneryArr[i][j] = new sceneryObj(i, j, false, ".");
//            }
//            else {
//                sceneryArr[i][j] = new sceneryObj(i, j, true, "#");
//            }
//        }
//    }
//}

function sceneryObj(posX, posY, solid, char) {
    this.posX = posX;
    this.posY = posY;
    this.solid = solid;
    this.char = char;

    this.inv = new Array();    // items that are on this tile
    this.MAX_INV = 5;           // maximal num of items on the tile

    this.charObj = null;                // Char (PC or NPC) on the tile - only one NPC can occupy one tile
}

function itemObj(posX, posY, char) {
    this.posX = posX;
    this.posY = posY;
    this.char = char;
}

// create player charObj
// var player = new charObj(20, 20, 3, "@");
var player = sceneryArr[20][20].charObj = new charObj(20, 20, 3, "@", "blue");

// create test monster
var NPC1 = sceneryArr[18][18].charObj
        = new charObj(18, 18, 3, "r", "red");

var NPC2 = sceneryArr[16][16].charObj
        = new charObj(16, 16, 3, "s", "red");

// this is PC and NPC constructor
function charObj(posX, posY, MAX_INV, char, color) {
    this.posX = posX;
    this.posY = posY;
    this.solid = true;          // NPC collides with PC and vice versa
    this.inv = new Array();
    this.MAX_INV = MAX_INV;             // max num of objs in player's inv    

    this.char = char;
    this.color = color;

    this.move = function move(dir) {
        var prevX = this.posX;
        var prevY = this.posY;

        // dir values correspond to the num keypad dirs
        switch (dir) {
            case 1:
                this.posX--;
                this.posY++;
                break;
            case 2:
                this.posY++;
                break;
            case 3:
                this.posX++;
                this.posY++;
                break;
            case 4:
                this.posX--;
                break;
            case 5:
                break;
            case 6:
                this.posX++;
                break;
            case 7:
                this.posX--;
                this.posY--;
                break;
            case 8:
                this.posY--;
                break;
            case 9:
                this.posX++;
                this.posY--;
                break;
            default:
                break;
        }

        if (this.collidesWith(sceneryArr[this.posX][this.posY]) ||
                sceneryArr[this.posX][this.posY].charObj !== null) {
            this.posX = prevX;
            this.posY = prevY;
            return;
        }

        swapCharObj(sceneryArr[prevX][prevY], sceneryArr[this.posX][this.posY]);
    };
    this.collidesWith = function collidesWith(obj) {
        return obj.solid;
    };

    this.canGet = function() {
        if (sceneryArr[this.posX][this.posY].inv.length < 1) {  // if tile's inv is empty
            return 0;
        }
        else if (this.inv.length >= this.MAX_INV) {      // if char's inv is full
            return 1;
        }
        else
            return 2;
    };
    this.get = function(i) {
        if (sceneryArr[this.posX][this.posY].inv.length > i) {      // if the referenced obj is in scenObj's inv
            swapObj(sceneryArr[this.posX][this.posY], this, i);
            return 1;
        }
        else {
            return 0;
        }
    };
    this.canDrop = function() {
        if (this.inv.length < 1) {            // if char's inv is empty
            return 0;
        } else if (sceneryArr[this.posX][this.posY].inv.length >=
                sceneryArr[this.posX][this.posY].MAX_INV) {      // if tiles's inv is full
            return 1;
        }
        else
            return 2;
    };
    this.drop = function(i) {
        if (this.inv.length > i) {
            swapObj(this, sceneryArr[this.posX][this.posY], i);  // if the referenced obj is in scenObj's inv
            return 1;
        } else {
            return 0;
        }
    };
}
;

// this function swaps object from inventory of fromObj to inventory of toObj
// n is the ordinal of the child object in the inv array of the parent
// it can be used to swap objects between player, tiles and NPCs
function swapObj(fromObj, toObj, n) {
    // see if the toObj can receive one mor obj; currently not used
    if (toObj.inv.length + 1 > toObj.MAX_INV) {
        return 0;       // if not, return 0
    }

    swapObjArr = new Array();
    swapObjArr = fromObj.inv.splice(n, 1);
    swapObjArr[0].posX = fromObj.posX;
    swapObjArr[0].posY = fromObj.posY;
    toObj.inv.push(swapObjArr[0]);
}

// this function displace NPC or PC from one scenery obj to another
function swapCharObj(fromSceneryObj, toSceneryObj) {
    toSceneryObj.charObj = fromSceneryObj.charObj;
    fromSceneryObj.charObj = null;
}

function animateChar(charObj) {
    charObj.move(Math.floor(Math.random() * 10));
    if (charObj.canGet() > 1) {
        charObj.get(0);
    }
    if (Math.random() > 0.90) {
        if (charObj.canDrop() > 1)
            charObj.drop(0);
    }
}

// SCROLL, RENDER
// this functions returns the display offset from the scenery origin (0,0)
// offset[0] = x-offset; offset[1] = y-offset; 
// it is calculated in respect to the current player's position
function scrollScenery() {
    var offset = new Array();       // array to store x, y offset
    if (player.posX < DISP_WIDTH / 2) {
        if (player.posY < DISP_HEIGHT / 2) {
            offset[0] = 0;
            offset[1] = 0;
            return offset;
        } else if (player.posY < (MAP_HEIGHT - DISP_HEIGHT / 2)) {
            offset[0] = 0;
            offset[1] = player.posY - DISP_HEIGHT / 2;
            return offset;
        } else {
            offset[0] = 0;
            offset[1] = MAP_HEIGHT - DISP_HEIGHT;
            return offset;
        }
    } else if (player.posX > (MAP_WIDTH - DISP_WIDTH / 2)) {
        if (player.posY < DISP_HEIGHT / 2) {
            offset[0] = MAP_WIDTH - DISP_WIDTH;
            offset[1] = 0;
            return offset;
        } else if (player.posY < MAP_HEIGHT - (DISP_HEIGHT / 2)) {
            offset[0] = MAP_WIDTH - DISP_WIDTH;
            offset[1] = player.posY - DISP_HEIGHT / 2;
            return offset;
        } else {
            offset[0] = MAP_WIDTH - DISP_WIDTH;
            offset[1] = MAP_HEIGHT - DISP_HEIGHT;
            return offset;
        }
    } else {
        if (player.posY < (DISP_HEIGHT / 2)) {
            offset[0] = player.posX - DISP_WIDTH / 2;
            offset[1] = 0;
            return offset;
        } else if (player.posY < (MAP_HEIGHT - DISP_HEIGHT / 2)) {
            offset[0] = player.posX - DISP_WIDTH / 2;
            offset[1] = player.posY - DISP_HEIGHT / 2;
            return offset;
        } else {
            offset[0] = player.posX - DISP_WIDTH / 2;
            offset[1] = MAP_HEIGHT - DISP_HEIGHT;
            return offset;
        }
    }
}

function renderGame(offset) {
    // render scenery
    for (i = 0; i < sceneryDivArr.length; i++) {
        for (j = 0; j < sceneryDivArr[i].length; j++) {            
            // render PC or NPC on the current tile if there is one
            if (sceneryArr[offset[0] + i][offset[1] + j].charObj !== null) {
                sceneryDivArr[i][j].style.color = sceneryArr[offset[0] + i][offset[1] + j].charObj.color;
                sceneryDivArr[i][j].innerHTML = sceneryArr[offset[0] + i][offset[1] + j].charObj.char;
            }
            // if there is no PC or NPCs on the tile render items on the current tile
            else if (sceneryArr[offset[0] + i][offset[1] + j].inv.length > 0) {
                sceneryDivArr[i][j].style.color = "black";
                // if there are more than one item
                if (sceneryArr[offset[0] + i][offset[1] + j].inv.length > 1) {
                    sceneryDivArr[i][j].innerHTML = "&";
                }
                else {
                    sceneryDivArr[i][j].innerHTML = sceneryArr[offset[0] + i][offset[1] + j].inv[0].char;
                }              
            } 
            // else render tile
            else {
                sceneryDivArr[i][j].style.color = "black";
                sceneryDivArr[i][j].innerHTML = sceneryArr[offset[0] + i][offset[1] + j].char;
            }
        }

    }


//    // render items
//    for (i = 0; i < itemsArr.length; i++) {
//        if (itemsArr[i].posX > offset[0] && itemsArr[i].posX < (offset[0] + DISP_WIDTH)) {
//            if (itemsArr[i].posY > offset[1] && itemsArr[i].posY < (offset[1] + DISP_HEIGHT)) {
//                // console.log("X:" + itemsArr[i].posX + " " + "offs: " + offset[0]);
//                sceneryDivArr[itemsArr[i].posX - offset[0]][itemsArr[i].posY - offset[1]].innerHTML = itemsArr[i].char;   
//            }
//        }
//    }


// player
//playerDiv.style.left = (player.posX - offset[0]) * TILE_WIDTH + "px";
//playerDiv.style.top = (player.posY - offset[1]) * TILE_HEIGHT + "px";
//playerDiv.innerHTML = player.char;

//    console.log(player.posX);
//    console.log(player.posY);

    renderTileInv();
    renderPlayerInv();
}

function renderTileInv() {
    var tileInvStr = "<ul>";
    if (sceneryArr[player.posX][player.posY].inv.length > 0) {      // if there are some objs in inv of the tile
        for (k = 0; k < sceneryArr[player.posX][player.posY].inv.length; k++) {
            tileInvStr = tileInvStr + "<li>" + sceneryArr[player.posX][player.posY].inv[k].char + "</li>";
        }
    }
    tileInvStr = tileInvStr + "</ul>";
    currentTileInvDiv.innerHTML = tileInvStr;
}

function renderPlayerInv() {
    var playerInvStr = "<ul>";
    if (player.inv.length > 0) {      // if there are some objs in inv of the player
        for (i = 0; i < player.inv.length; i++) {
            playerInvStr = playerInvStr + "<li>" + player.inv[i].char + "</li>";
        }
    }
    playerInvStr = playerInvStr + "</ul>";
    playerInvDiv.innerHTML = playerInvStr;
}


// INITIALIZE GAME
// initializeScenery();
renderGame(scrollScenery());

function gameLoop() {
    animateChar(NPC1);
    animateChar(NPC2);
    renderGame(scrollScenery());
}
