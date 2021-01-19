const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
const x = canvas.width/2;
const y = canvas.height/2;
const keys = [];

//create canvas
const playerSprite = new Image();
playerSprite.src = "player.png";
const backgrond = new Image();
backgrond.src = "background.png";

//create player 
function drawPlayer(img, pX, pY, pW, pH){
    ctx.drawImage(img, pX, pY, pW, pH);
};

/*class player {
    constructor(x, y, collor, radius, speed){
    this.x = x,
    this.y = y,
    this.collor = collor,
    this.radius = radius,
    this.speed = speed,
    this.moving = false
    }
    draw(){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = this.collor;
        ctx.fill();
    };
};
*/
const player = {
    x: x,
    y: y,
    width: 30,
    height: 30,
    speed: 6,
    moving: false
}

class projectile {
    constructor(x, y, radius, collor, speed){
    this.x = x,
    this.y = y,
    this.radius = radius,
    this.collor = collor,
    this.speed = speed
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = this.collor;
        ctx.fill();
    };
    update(){
        this.draw();
        this.x = this.x + this.speed.y;
        this.y = this.y + this.speed.x;
    };
};

/*const player1 = new player(x, y, "red", 30, 6);
player1.draw();*/
const shots = [];

//create animation
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.heigt);
    ctx.drawImage(backgrond, 0, 0, canvas.width, canvas.height);
    drawPlayer(playerSprite, player.x, player.y, player.width, player.height);
    move();
    requestAnimationFrame(animate);
    shots.forEach((shot)=>{
        shot.update();
    });
}
addEventListener("click", (e) => {
    const angle = Math.atan2(e.clientX - player.x, e.clientY - player.y);
    const speed = {x: Math.cos(angle), y: Math.sin(angle)};
    console.log(angle);
    shots.push(new projectile(player.x + player.width/2, player.y + player.height/2, 5, "white", speed));
});
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
/*
const play = new player1(300, 300, 30, "blue")
play.draw();*/
//and shooting

