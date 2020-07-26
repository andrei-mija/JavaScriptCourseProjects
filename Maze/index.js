const {
    World,
    Render,
    Runner,
    Engine,
    Bodies
} = Matter;

const width = 600;
const height = 600;

const engine = Engine.create();
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
    Bodies.rectangle(width/2, 0, width, 40, {isStatic: true}),
    Bodies.rectangle(width/2, height, width, 40, {isStatic: true}),
    Bodies.rectangle(0, height/2, 40, height, {isStatic: true}),
    Bodies.rectangle(width, height/2, 40, height, {isStatic: true})
];
World.add(world, walls);

// Grid generation
const d = 3; // dimension of the square array

const grid = Array(d)
    .fill(null)
    .map(() => Array(d).fill(false));

const verticals = Array(d)
    .fill(null)
    .map(() => Array(d-1).fill(false));

const horizontals = Array(d-1)
    .fill(null)
    .map(() => Array(d).fill(false));
