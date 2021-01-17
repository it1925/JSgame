const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 800;

const keys = [];
//create canvas
const playerSprite = new Image();
playerSprite.src = "player.png";
const backgrond = new Image();
backgrond.src = "background.png"
//create player 
function drawPlayer(img, pX, pY, pW, pH){
    ctx.drawImage(img, pX, pY, pW, pH);
}
const player = {
    x: 470,
    y: 370,
    width: 30,
    height: 30,
    speed: 6,
    moving: false,
}
//create animation
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.heigt);
    ctx.drawImage(backgrond, 0, 0, canvas.width, canvas.height);
    drawPlayer(playerSprite, player.x, player.y, player.width, player.height);
    move();
    //player slide
    requestAnimationFrame(animate);
}
animate();
//create game mechanics
window.addEventListener("keydown", function(event){
    keys[event.key] = true;
    console.log(keys);
});
window.addEventListener("keyup", function(event){
    delete keys[event.key];
});
//how to move player
function move (){
    if (keys["w"] && player.y > 0){
        player.y -= player.speed;
    }
    if (keys["a"] && player.x > 0){
        player.x -= player.speed;
    }
    if (keys["s"] && player.y < canvas.height - player.height){
        player.y += player.speed;
    }
    if (keys["d"] && player.x < canvas.width - player.width){
        player.x += player.speed;
    }
}
