const {
    World,
    Render,
    Runner,
    Engine,
    Bodies, 
    Body,
    Events
} = Matter;

const d = 3; // dimension of the square array
const width = 600;
const height = 600;
const unitLength = width / d;

const engine = Engine.create();
engine.world.gravity.y = 0;
const {world} = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        wireframes: true,
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
const grid = Array(d)
    .fill(null)
    .map(() => Array(d).fill(false));

const verticals = Array(d)
    .fill(null)
    .map(() => Array(d-1).fill(false));

const horizontals = Array(d-1)
    .fill(null)
    .map(() => Array(d).fill(false));



const startRow = Math.floor(Math.random() * d);
const startColumn = Math.floor(Math.random() * d);

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
        if(nextRow < 0 || nextRow >= d || nextColumn < 0 || nextColumn >= d || grid[nextRow][nextColumn])
            continue;
        // remove a wall for one of the arrays
        switch(direction){
            case 'left': 
                verticals[row][column-1] = true;
                console.log(direction);
                break;
            case 'right':
                verticals[row][column] = true;
                console.log(direction);
                break;
            case 'up':
                horizontals[row-1][column] = true;
                console.log(direction);
                break;
            case 'down':
                horizontals[row][column] = true;
                console.log(direction);
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
            columnIndex * unitLength + unitLength / 2,
            rowIndex * unitLength + unitLength,
            unitLength,
            5,
            { isStatic: true, label: 'wall' }
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
            columnIndex * unitLength + unitLength,
            rowIndex * unitLength + unitLength / 2,
            5,
            unitLength,
            { isStatic: true, label: 'wall' }
        );
        World.add(world, wall);
    });
});

// Goal
const goal = Bodies.rectangle(
    width - unitLength / 2,
    height - unitLength / 2,
    unitLength * .7,
    unitLength  * .7,
    {isStatic: true,
    label: 'goal'}
);
World.add(world, goal);

// Ball
const ball = Bodies.circle(
    unitLength / 2,
    unitLength / 2,
    unitLength / 4,
    {
        label: 'ball'
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
            world.gravity.y = 1;
            world
        }
    });
});