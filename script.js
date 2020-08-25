
// https://colorhunt.co/palette/42533
// https://greensock.com/scrolltrigger/

// module aliases

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

var Engine = Matter.Engine,
    Render = Matter.Render,
    World = Matter.World,
    Bodies = Matter.Bodies;
    Body = Matter.Body;
    Events = Matter.Events;



var moveBallLeft = false;
var moveBallRight = false;

var gameOver = false;
var gameWon = false;



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
    restitution: 0.5,
    label: 'ball'
});

function createRectangle(x, y, width, height, colour, label) {
    var ledgeAndGroundOptions = { 
        render: {
            fillStyle: colour
        },
        isStatic: true,
        label: label
    }
    return Bodies.rectangle(x, y, width, height, ledgeAndGroundOptions);
}

var ground = createRectangle(windowWidth/2, pageHeight, windowWidth, 40, '#7ac7c4', 'ground');
var rotatableLedge = createRectangle(windowWidth/2, window.innerHeight/2, windowWidth/6, 20, '#7ac7c4', 'rotateable ledge');
var leftStaticLedge = createRectangle(windowWidth/5, window.innerHeight, windowWidth/2, 20, 'pink', 'left static ledge');
var rightStaticLedge = createRectangle(windowWidth - windowWidth/7, window.innerHeight, windowWidth/1.5, 20, '#7ac7c4', 'right static ledge');

var pointerFromRight = createRectangle(windowWidth + windowWidth/1.5, window.innerHeight - 40, windowWidth/1.5, 20, '#7ac7c4', 'pointer from right');
var pointerFromLeft = createRectangle(-windowWidth, window.innerHeight - 40, windowWidth/1.5, 20, '#7ac7c4', 'pointer from left');


// add all of the bodies to the world
World.add(engine.world, [ball, rotatableLedge, leftStaticLedge, rightStaticLedge, ground, pointerFromRight, pointerFromLeft]);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

document.addEventListener('click', function() {
    Body.scale(ball, 0.5, 0.5);
    // Body.translate(pointerFromRight, {x: -30, y:0})

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
        // console.log("progress:", self.progress.toFixed(3), "direction:", self.direction, "velocity", self.getVelocity());
        if (self.progress.toFixed(3) < 0.11) {
            rotateOnScroll(self.getVelocity()/2000);
        }
        if (self.progress.toFixed(3) > 0.11) {
            moveRightLedgeIn(self.getVelocity()/10)
            moveLeftLedgeIn(self.getVelocity()/10)
        }
    }
});


Matter.Events.on(engine, 'collisionStart', function(event) {
    var bodyA = event.pairs[0].bodyA.label;
    var bodyB = event.pairs[0].bodyB.label;
    if (bodyA === "ball" && bodyB === "pointer from right") {
        moveBallLeft = true;
    }

    if (bodyA === "ball" && bodyB === "pointer from left") {
        moveBallRight = true;
    }

    if (bodyA === "ball" && bodyB === "ground") {
        gameWon = "true";
    }
});


Events.on(engine, 'beforeUpdate', function() {
    if (gameOver) {
        console.log("you lose!");
        return;
    }

    if (gameWon) {
        console.log("you win!");
        return;
    }

    if (ball.position.x < -30 || ball.position.x > windowWidth + 30) {
        console.log('gameover !');
        gameOver = true;
    }
    
    console.log('ball.position: ',ball.position);
    if (moveBallLeft) {
        moveBallLeft = false;
        Body.applyForce(ball, ball.position, {x: -0.05, y: 0});
    }

    if (moveBallRight) {
        moveBallRight = false;
        Body.applyForce(ball, ball.position, {x: 0.05, y: 0});
    }
});