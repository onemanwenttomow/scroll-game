
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
var ball = Bodies.circle(windowWidth/2, 20, 30, {
    render: {
        fillStyle: '#f73859'
    },
    restitution: 0.5 
});

var ledgeAndGroundOptions = { 
    render: {
        fillStyle: '#7ac7c4'
    },
    isStatic: true 
}

var ledgeAndGroundOptionsPink = { 
    render: {
        fillStyle: 'pink'
    },
    isStatic: true 
}

var ground = Bodies.rectangle(windowWidth/2, pageHeight, windowWidth, 40, ledgeAndGroundOptions);
var rotatableLedge = Bodies.rectangle(windowWidth/2, window.innerHeight/2, windowWidth/6, 20, ledgeAndGroundOptions);
var leftStaticLedge = Bodies.rectangle(windowWidth/5, window.innerHeight, windowWidth/2, 20, ledgeAndGroundOptionsPink);
var rightStaticLedge = Bodies.rectangle(windowWidth - windowWidth/7, window.innerHeight, windowWidth/1.5, 20, ledgeAndGroundOptions);

var pointerFromRight = Bodies.rectangle(windowWidth + windowWidth/1.5, window.innerHeight - 40, windowWidth/1.5, 20, ledgeAndGroundOptions);
var pointerFromLeft = Bodies.rectangle(-windowWidth, window.innerHeight - 40, windowWidth/1.5, 20, ledgeAndGroundOptions);


// add all of the bodies to the world
World.add(engine.world, [ball, rotatableLedge, leftStaticLedge, rightStaticLedge, ground, pointerFromRight, pointerFromLeft]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

document.addEventListener('click', function() {
    console.log('ball',ball);
    // Body.scale(ball, 0.5, 0.5);
    Body.translate(pointerFromRight, {x: -30, y:0})

});

function moveRightLedgeIn(pixels) {
    if (pointerFromRight.position.x < windowWidth - windowWidth/6 && pixels > 0) {
        pixels = 0;
    }
    Body.translate(pointerFromRight, {x: -pixels, y:0})
}

function moveLeftLedgeIn(pixels) {
    if (pixels > 0 && Math.floor(pointerFromLeft.position.x) < - (windowWidth/3)) {
        pixels = 0;
    }
    if (pointerFromLeft.position.x > windowWidth/10 && pixels < 0) {
        pixels = 0;
    }
    Body.translate(pointerFromLeft, {x: -pixels, y:0})
}

function rotateOnScroll(angle) {
    Body.rotate(rotatableLedge, angle);
}

ScrollTrigger.create({
    start: "top top",
    end: "bottom 50%+=100px",
    onToggle: self => console.log("toggled, isActive:", self.isActive),
    onUpdate: self => {
        console.log("progress:", self.progress.toFixed(3), "direction:", self.direction, "velocity", self.getVelocity());
        if (self.progress.toFixed(3) < 0.11) {
            rotateOnScroll(self.getVelocity()/2000);
        }
        if (self.progress.toFixed(3) > 0.11) {
            moveRightLedgeIn(self.getVelocity()/10)
            moveLeftLedgeIn(self.getVelocity()/10)
        }
    }
});