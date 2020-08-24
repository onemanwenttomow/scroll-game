
// https://colorhunt.co/palette/42533
// https://greensock.com/scrolltrigger/

// module aliases
var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;
    Body = Matter.Body;


// create an engine
var engine = Engine.create();

var windowWidth = window.innerWidth;
var pageHeight = document.body.scrollHeight;

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        height: pageHeight,
        width: windowWidth,
        background: '#384259',
        wireframes: false
    }
});

// create two boxes and a ground
var boxA = Bodies.circle(windowWidth/2, 20, 30, {
    render: {
        fillStyle: '#f73859'
    }
});

var ledgeAndGroundOptions = { 
    render: {
        fillStyle: '#7ac7c4'
    },
    isStatic: true 
}

var ledge = Bodies.rectangle(windowWidth/2, window.innerHeight/2, windowWidth/6, 20, ledgeAndGroundOptions);

var ground = Bodies.rectangle(windowWidth/2, pageHeight, windowWidth, 40, ledgeAndGroundOptions);

// add all of the bodies to the world
World.add(engine.world, [boxA, ledge, ground]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

document.addEventListener('click', function() {
    Body.rotate( ledge, Math.PI/6);
});