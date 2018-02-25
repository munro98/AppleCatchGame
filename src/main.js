console.log("hello world");

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");


let previousTime = 0.0;
let px = 10,
    py = 20;

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

    //Render
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    ctx.fillRect(px, py, 40, 40);


};



main(0.0); //start Game Loop
