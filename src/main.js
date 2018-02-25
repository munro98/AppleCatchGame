console.log("hello world");

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

document.documentElement.addEventListener("keydown", onKeyDown, false);
document.documentElement.addEventListener("keyup", onKeyUp, false);


let previousTime = 0.0;
let px = 10,
    py = 20;

let texture = new Texture();

let player = new Player(new Vec2(40, 40));
let apples = new Array();


let level = new Level();

let appleSpawnTimer = 0.0;

//Game loop
function main(currentTimeMilli) {
    window.requestAnimationFrame(main);

    let currentTime = currentTimeMilli * 0.001;
    let deltaTime = currentTime - previousTime;
    previousTime = currentTime;
    if (deltaTime > 0.02) {
        deltaTime = 0.02;
    }

    let speed = 20;

    px += speed * deltaTime;

    //console.log(currentTime);
    //console.log(deltaTime);

    appleSpawnTimer += deltaTime;

    if (appleSpawnTimer > 0.6) {
        appleSpawnTimer = 0.0;
        let x = Math.random() * 600;
        let newApple = new Apple(new Vec2(x, 0))
        newApple.vel = new Vec2(00, 120);
        apples.push(newApple);
    }

    for (var i = 0; i < apples.length; i++) {
        apples[i].update(level, deltaTime);
    }

    player.update(level, deltaTime);

    


    //Remove dead apples
    
    for (var i = 0; i < apples.length; i++) {
        if (apples[i].remove) {
            apples.splice(i, 1);
            i--;
        }
    }
    

    //Render
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    level.draw(new Vec2(0, 0));

    for (var i = 0; i < apples.length; i++) {
        apples[i].draw(new Vec2(0, 0));
    }

    player.draw(new Vec2(0, 0));

    

    ctx.fillRect(px, py, 40, 40);


};

function onKeyDown(event) {
    player.downKeys.add(event.keyCode);
    console.log("KeyDown " + event.keyCode);
}

function onKeyUp(event) {
    player.downKeys.delete(event.keyCode);
    //console.log("KeyUp");
}


main(0.0); //start Game Loop