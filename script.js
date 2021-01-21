const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
//makeing our canvas across whole screen
canvas.width = innerWidth;
canvas.height = innerHeight;
const x = canvas.width/2;
const y = canvas.height/2;
const keys = [];

//create canvas imgaes
const playerSprite = new Image();
//should be called spipSpriteSheet to be precise
playerSprite.src = "img/shipSprite.png";
const backgrond = new Image();
backgrond.src = "img/background.png";

//create player 
//creating custom function that will take image and determine which part of an image should be drawn by frameX in player object
function drawPlayer(img, sX, sY, sW, sH, pX, pY, pW, pH){
    ctx.drawImage(img, sX, sY, sW, sH, pX, pY, pW, pH);
};
//makeing player and configureing improtant things
const player = {
    x: x,
    y: y,
    //width of our sprite
    width: 32,
    //heigt of our sprite 
    height: 32,
    //starting frame of our sprite
    frameX: 0,
    speed: 4 ,
    moving: false
}

//makeing projectile
class projectile {
    constructor(x, y, radius, collor, velocity){
    this.x = x,
    this.y = y,
    this.radius = radius,
    this.collor = collor,
    this.velocity = velocity
    }
    //makeing projectile as a circle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.fillStyle = this.collor;
        ctx.fill();
    };
    //updateing projectile's coordinates
    update(){
        this.draw();
        this.x = this.x + this.velocity.y;
        this.y = this.y + this.velocity.x;
    };
};

//makeing an enemy
class enemy {
    constructor(x, y, radius, collor, velocity){
        this.x = x,
        this.y = y,
        this.radius = radius,
        this.collor = collor,
        this.velocity = velocity
        }
        //makeing enemy into a circle
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
            ctx.fillStyle = this.collor;
            ctx.fill();
        };
        //updateing enemy coordinates
        update(){
            this.draw();
            this.x = this.x + this.velocity.y;
            this.y = this.y + this.velocity.x;
        };
};

let shots = [];
let enemies = [];

//create animation
//initializing empty let so that game can stop leter in code
let animationId;
function animate(){
    //drawing image across canvas
    ctx.clearRect(0, 0, canvas.width, canvas.heigt);
    ctx.drawImage(backgrond, 0, 0, canvas.width, canvas.height);
    //drawing plyer sprite
    drawPlayer(playerSprite, player.width * player.frameX, 0, player.width, player.height, player.x, player.y, player.width, player.height);
    //drawing our player movement on screen
    move();
    animationId = requestAnimationFrame(animate);
    
    shots.forEach((shot, shotIndex) => {
        shot.update();
        //if our shot will fly it self out of our canvas it will be removed from an array
        if(shot.x + shot.radius < 0 || shot.x - shot.radius > canvas.width || shot.y + shot.radius < 0 || shot.y - shot.radius > canvas.height){
            setTimeout(() => {
                shots.splice(shotIndex, 1);
            });
        };
    });
    enemies.forEach((enemy, index) => {
        enemy.update();
        //counting distance from our player to enemies
        let dist = Math.hypot(player.x + player.width/2 - enemy.x, player.y + player.height/2 - enemy.y);
        //if our player will get too close to an enemy game will stop animatin (but will not stop spawning enemies)
        if(dist - enemy.radius - (player.width+player.height)/6 < 1){

            cancelAnimationFrame(animationId);
        }
        else if(enemy.x + enemy.radius < 0 || enemy.x - enemy.radius > canvas.width || enemy.y + enemy.radius < 0 || enemy.y - enemy.radius > canvas.height){
            setTimeout(() => {
                enemies.splice(index, 1);
            });
        };
        shots.forEach((shot, shotIndex) => {
            //counting distance from our enemies to our projectile
            let dist = Math.hypot(shot.x - enemy.x, shot.y - enemy.y);
            
            if (dist - enemy.radius - shot.radius < 1){

                // if enemies are larger than 10 after we subtract 15 from their radius they will shrink,
                if (enemy.radius - 15 > 10) {
                    enemy.radius -= 10;
                    setTimeout(() => {
                    shots.splice(shotIndex, 1);
                    });
                }
                //..., But if they are not larger they will disappear
                else {
                    setTimeout(() => {
                    enemies.splice(index, 1);
                    shots.splice(shotIndex, 1);
                });
                }
            }
        });
    });
}

//shooting
addEventListener("click", (e) => {
    //get angle from center of our player to our mouse
    let angle = Math.atan2(e.clientX - player.x, e.clientY - player.y);
    //set speed for our shots
    let velocity = {x: Math.cos(angle) * 10, y: Math.sin(angle) * 10};
    //create new shot on click
    shots.push(new projectile(player.x + player.width/2, player.y + player.height/2, 5, "white", velocity));
    console.log(shots);
});

//enemies
function spawnEnemy(){
    //set interval so that our enemies spawn constantly in resonable time
    setInterval(() => {
        let x;
        let y;
        //set their min and max radius
        const radius = Math.random() * (70 - 10) + 10;
        const collor = "red";

        //randomize spawn location on canvas x and y axis
        if (Math.random() < 0.5){
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }
        else {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        }
        
        //get an in which our enemies need to atack so that they aim right at our player
        let angle = Math.atan2(player.x - x, player.y - y);
        //set an max and min velocity for our enemies
        let velocity = {x: Math.cos(angle) * (Math.random() * (10 - 8) + 8), y: Math.sin(angle) *  (Math.random() * (10 - 8) + 8)};
        //create enemy
        enemies.push(new enemy(x, y, radius, collor, velocity));
        console.log(enemies);
    }, 300);
}

animate();
spawnEnemy();
//create game movement
/*if player presses any key it will get pushed into keys array
where we will read it, use it later in move function and delete it right after player stops holding down the key*/
//add key to array
window.addEventListener("keydown", function(event){
    keys[event.key] = true;
    console.log(keys);
});
//delete key from array
window.addEventListener("keyup", function(event){
    delete keys[event.key];
});

//how to move player and lazy way of telling it to him
console.log("move player useing W S A D\n W-up\n S-down\n A-left\n D-right");
function move (){
    if (keys["w"] && player.y > 0){
        player.y -= player.speed;
        player.frameX = 0;
    }
    if (keys["a"] && player.x > 0){
        player.x -= player.speed;
        player.frameX = 3;
    }
    if (keys["s"] && player.y < canvas.height - player.height){
        player.y += player.speed;
        player.frameX = 2;
    }
    if (keys["d"] && player.x < canvas.width - player.width){
        player.x += player.speed;
        player.frameX = 1;
    }
}
