const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;
const x = canvas.width/2;
const y = canvas.height/2;
const keys = [];

//create canvas
const playerSprite = new Image();
playerSprite.src = "img/player.png";
const backgrond = new Image();
backgrond.src = "img/background.png";
const cross = new Image();
cross.src = "img/cross.png";

//create player 
function drawPlayer(img, pX, pY, pW, pH){
    ctx.drawImage(img, pX, pY, pW, pH);
};

/*class player {
    constructor(x, y, collor, radius, velocity){
    this.x = x,
    this.y = y,
    this.collor = collor,
    this.radius = radius,
    this.velocity = velocity,
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
    speed: 4 ,
    moving: false
}

class projectile {
    constructor(x, y, radius, collor, velocity){
    this.x = x,
    this.y = y,
    this.radius = radius,
    this.collor = collor,
    this.velocity = velocity
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = this.collor;
        ctx.fill();
    };
    update(){
        this.draw();
        this.x = this.x + this.velocity.y;
        this.y = this.y + this.velocity.x;
    };
};

class enemy {
    constructor(x, y, radius, collor, velocity){
        this.x = x,
        this.y = y,
        this.radius = radius,
        this.collor = collor,
        this.velocity = velocity
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.fillStyle = this.collor;
            ctx.fill();
        };
        update(){
            this.draw();
            this.x = this.x + this.velocity.y;
            this.y = this.y + this.velocity.x;
        };
};

const shots = [];
const enemies = [];

//create animation
let animationId;
function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.heigt);
    ctx.drawImage(backgrond, 0, 0, canvas.width, canvas.height);
    drawPlayer(playerSprite, player.x, player.y, player.width, player.height);
    move();

    animationId = requestAnimationFrame(animate);
    shots.forEach((shot, shotIndex) => {
        shot.update();

        if(shot.x + shot.radius < 0 || shot.x - shot.radius > canvas.width || shot.y + shot.radius < 0 || shot.y - shot.radius > canvas.height){
            setTimeout(() => {
                shots.splice(shotIndex, 1);
            });
        };
    });
    
    enemies.forEach((enemy, index) => {
        enemy.update();
        const dist = Math.hypot(player.x + player.width/2 - enemy.x, player.y + player.height/2 - enemy.y);
        if(dist - enemy.radius - (player.width+player.height)/5 < 1){
            cancelAnimationFrame(animationId);
        }
        
        shots.forEach((shot, shotIndex) => {
            const dist = Math.hypot(shot.x - enemy.x, shot.y - enemy.y);

            if (dist - enemy.radius - shot.radius < 1){
                setTimeout(() => {

                    enemies.splice(index, 1);
                    shots.splice(shotIndex, 1);
                });
                
              // console.log("remove enemy from screen");
            }
        });
    });
}

//shooting
addEventListener("click", (e) => {
    const angle = Math.atan2(e.clientX - player.x, e.clientY - player.y);
    const velocity = {x: Math.cos(angle) * 10, y: Math.sin(angle) * 10};
    shots.push(new projectile(player.x + player.width/2, player.y + player.height/2, 5, "white", velocity));
    console.log(shots);
});

//enemies
function spawnEnemy(){
    //setInterval(() => {
        let x;
        let y;
        const radius = Math.random() * (70 - 10) + 10;
        const collor = "black";
        if (Math.random() < 0.5){
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }
        else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        }
        
        const angle = Math.atan2(player.x - x, player.y - y);
        const velocity = {x: Math.cos(angle) * (Math.random() * (10 - 8) + 8), y: Math.sin(angle) *  (Math.random() * (10 - 8) + 8)};
        enemies.push(new enemy(x, y, radius, collor, velocity));
        console.log(enemies);
    //}, 250);
}
animate();
spawnEnemy();
//create game movement
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