const {
    World,
    Render,
    Runner,
    Engine,
    Bodies, 
    Body,
    Events
} = Matter;

const cellsHorizontal = 4; // dimension of the square array
const cellsVertical = 3
const width = window.innerWidth - 10;
const height = window.innerHeight - 10;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;

const engine = Engine.create();
engine.world.gravity.y = 0;
const {world} = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: false,
        width, 
        height
    }
});

Render.run(render);
Runner.run(Runner.create(), engine);

// Wall generation
const walls = [
    Bodies.rectangle(width/2, 0, width, 2, {isStatic: true}),
    Bodies.rectangle(width/2, height, width, 2, {isStatic: true}),
    Bodies.rectangle(0, height/2, 2, height, {isStatic: true}),
    Bodies.rectangle(width, height/2, 2, height, {isStatic: true})
];
World.add(world, walls);

// Grid generation
const shuffle = (arr) => {
    let counter = arr.length;

    while(counter > 0) {
        const index = Math.floor(Math.random() * counter);

        counter--;

        const temp = arr[counter];
        arr[counter] = arr[index];
        arr[index] = temp;
    }

    return arr;
}
const grid = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical)
    .fill(null)
    .map(() => Array(cellsHorizontal-1).fill(false));

const horizontals = Array(cellsVertical-1)
    .fill(null)
    .map(() => Array(cellsHorizontal).fill(false));



const startRow = Math.floor(Math.random() * cellsVertical);
const startColumn = Math.floor(Math.random() * cellsHorizontal);

const stepThroughCell = (row, column) => {
    // if cell is visisted, then reutrn
    if( grid[row][column])
        return;
    // mark the cell as being visited
    grid[row][column] = true;
    // assemble randomly-ordered list of neighbours
    const neighbours = shuffle([
        [row-1, column, 'up'],
        [row+1, column, 'down'],
        [row, column-1, 'left'],
        [row, column+1, 'right']
    ]);
    // for each neighbour
    for(let neighbour of neighbours) {
        const [nextRow, nextColumn, direction] = neighbour;
        // neigh out of bounds or already visited, go to next
        if(nextRow < 0 || 
            nextRow >= cellsVertical || 
            nextColumn < 0 || 
            nextColumn >= cellsHorizontal || 
            grid[nextRow][nextColumn])
            continue;
        // remove a wall for one of the arrays
        switch(direction){
            case 'left': 
                verticals[row][column-1] = true;
                break;
            case 'right':
                verticals[row][column] = true;
                break;
            case 'up':
                horizontals[row-1][column] = true;
                break;
            case 'down':
                horizontals[row][column] = true;
                break;
        }
        // visit the next cell
        stepThroughCell(nextRow, nextColumn);
    }
};
// creates the grid
stepThroughCell(startRow, startColumn);

// create horizontal walls
horizontals.forEach((row, rowIndex) => {
    row.forEach( (open, columnIndex) => {
        if(open)
            return;
        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX / 2,
            rowIndex * unitLengthY + unitLengthY,
            unitLengthX,
            5,
            { 
                isStatic: true, 
                label: 'wall',
                render: {
                    fillStyle: 'red'
                }
            }
        );
        World.add(world, wall);
    });
});

// create vertical walls
verticals.forEach((column, rowIndex) => {
    column.forEach( (open, columnIndex) => {
        if(open)
            return;
        const wall = Bodies.rectangle(
            columnIndex * unitLengthX + unitLengthX,
            rowIndex * unitLengthY + unitLengthY / 2,
            5,
            unitLengthY,
            { 
                isStatic: true, 
                label: 'wall',
                render: {
                    fillStyle: 'red'
                } 
            }
        );
        World.add(world, wall);
    });
});

// Goal
const goal = Bodies.rectangle(
    width - unitLengthX / 2,
    height - unitLengthY / 2,
    unitLengthX * .7,
    unitLengthY * .7,
    {
        isStatic: true,
        label: 'goal',
        render: {
            fillStyle: 'green'
        }
    }
);
World.add(world, goal);

// Ball
const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(
    unitLengthX / 2,
    unitLengthY / 2,
    ballRadius,
    {
        label: 'ball',
        render: {
            fillStyle: 'blue'
        }
    }
);

World.add(world, ball);

// Collision
document.addEventListener('keydown', event => {
    const {x, y} = ball.velocity;
    if(event.keyCode === 87) {
        Body.setVelocity(ball, {x, y: y - 5});
    }

    if(event.keyCode === 68) {
        Body.setVelocity(ball, {x: x + 5, y});
    }

    if(event.keyCode === 83) {
        Body.setVelocity(ball, {x, y: y + 5});
    }

    if(event.keyCode === 65) {
        Body.setVelocity(ball, {x: x - 5, y});
    }
});

// Win condition
Events.on(engine, 'collisionStart', event => {
    event.pairs.forEach(collision => {
        const labels = ["goal", "ball"];
        if(
            labels.includes(collision.bodyA.label) &&
            labels.includes(collision.bodyB.label)
        ) {
            document.querySelector('.winner').classList.remove('hidden');
            world.gravity.y = 1;
            world.bodies.forEach(body => {
                if(body.label === 'wall') {
                    Body.setStatic(body, false);    
                }
            });
        }
    });
});