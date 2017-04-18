var c = document.getElementsByTagName('canvas')[0];
var ctx = c.getContext("2d");
var w = 400;
var h = 400;
var ROWS = 49;
var COLS = 49;
var BLOCK_W = Math.floor(w / COLS);
var BLOCK_H = Math.floor(h / ROWS);

var tickInterval;
var drawInterval;

// size of grid nxn
var size = ROWS;

// initialize grid of size 49
var maze = grid(size);

// starting values, top left
var start_x = 0;
var start_y = 0;

var frontierList = new Array();

// *note: t1 & t2 used to determine passage node
function Node(x, y) {
    this.block = true; // false = passage
    this.x = x;
    this.y = y;
    this.t1; // t1 = x val of the node between itself and it's frontier
    this.t2; // t2 = y val of the node between itself and it's frontier'
}

// create 2D grid of of nxn where n = size
function grid(size) {

    // create array 
    var grid = new Array(size);
    for (var i = 0; i < size; i++) {
        grid[i] = new Array(size);
    }

    // associate each element with a node object
    for (var i = 0; i < size; i++) {
        for (var j = 0; j < size; j++) {
            if (grid[i][j] != "-") {
                grid[i][j] = new Node(j, i);
            }
        }
    }

    return grid;
}

// get the frontiers of the given location in array
function getFrontier(x, y) {
    if (inBoundsCheck(maze[y][x], 0, -2)) {
        maze[y][x - 2].t1 = x - 1;
        maze[y][x - 2].t2 = y;
        frontierList.push(maze[y][x - 2]);
    }
    if (inBoundsCheck(maze[y][x], 0, 2)) {
        maze[y][x + 2].t1 = x + 1;
        maze[y][x + 2].t2 = y;
        frontierList.push(maze[y][x + 2]);
    }
    if (inBoundsCheck(maze[y][x], -2, 0)) {
        maze[y - 2][x].t1 = x;
        maze[y - 2][x].t2 = y - 1;
        frontierList.push(maze[y - 2][x]);
    }
    if (inBoundsCheck(maze[y][x], 0, 2)) {
        maze[y + 2][x].t1 = x;
        maze[y + 2][x].t2 = y + 1;
        frontierList.push(maze[y + 2][x]);
    }
}

// checks to see if the currentNode should be looked at
function inBoundsCheck(currentNode, i, j) {

    // out of bounds
    if (((currentNode.x + j) < 0) || ((currentNode.x + j) > size - 1) || ((currentNode.y + i) < 0) || ((currentNode.y + i) > size - 1)) {
        return false;
    }


    // check to see if block is within the grid
    if (!(maze[currentNode.y + i][currentNode.x + j].block)) {
        return false;
    }

    // if it passed all possible checks
    return true;
}

// draws the board and the moving shape
function draw() {
    for (var x = 0; x < COLS; ++x) {
        for (var y = 0; y < ROWS; ++y) {

            if (maze[y][x].block) {
                ctx.fillStyle = "black";
                
            } else {
                ctx.fillStyle = "white";
            }
        ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W, BLOCK_H);
        }

    }
}
  
function tick() {
    console.log("1");
    // while the frontierList is not empty
    if (frontierList.length > 0) {

        // get random value from frontierList (since their weights are all the same)
        var rand = Math.floor((Math.random() * (frontierList.length-1)));
        var randFrontier = frontierList[rand];

        if (maze[randFrontier.y][randFrontier.x].block) {

            maze[randFrontier.y][randFrontier.x].block = false;
            maze[randFrontier.t2][randFrontier.t1].block = false;

            // insert frontiers of the current frontier
            getFrontier(randFrontier.x, randFrontier.y);
        }

        // remove the current frontier from the list
        frontierList.splice(frontierList.indexOf(randFrontier), 1);

    } else {
        // stop running the program
        clearInterval(tickInterval);
        clearInterval(drawInterval);
    }
    
}


function startGame() {

    // initialize first node - top left
    maze[start_y][start_x].t1 = start_x;
    maze[start_y][start_x].t2 = start_y;
    frontierList.push(maze[start_y][start_x]);

    draw();

    tickInterval = setInterval(tick, 1);
    drawInterval = setInterval(draw, 50);

}

startGame();
