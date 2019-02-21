/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/
function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

// no inheritance
function Background(game, spritesheet) {
    this.x = -800;
    this.y = 1;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
    // Entity.call(this, game, 0, 400);
    this.radius = 200;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
    this.x, this.y);
};

Background.prototype.update = function () {
    this.x += 1;
    if(this.x > 0) this.x = -800;
}

Background.prototype.reset = function () {

}

/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

function Foreground(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
}

Foreground.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
    this.x, this.y);
};

Foreground.prototype.update = function () {
    this.x -= 1;
    if(this.x < -800) this.x = 0;
}

Foreground.prototype.reset = function() {

}

/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

function BoundingBox(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.left = x;
    this.top = y;
    this.right = this.left + width;
    this.bottom = this.top + height;
}


BoundingBox.prototype.collide = function (other) {
    if (Math.abs(other.boundingbox.right - this.right) < 64) {
        if (this.bottom > other.boundingbox.top) {
            return true;
        }
    }
    return false;
}


BoundingBox.prototype.collide = function (other) {
    
    if (this.right >= other.left && this.left <= other.right && this.top <= other.bottom && this.bottom >= other.top) {
        return true;
    }
    return false;
}
/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

function PlayGame(game, x, y) {
    Entity.call(this, game, x, y);
}

PlayGame.prototype = new Entity();
PlayGame.prototype.constructor = PlayGame;

PlayGame.prototype.reset = function () {
    this.game.running = false;
}
PlayGame.prototype.update = function () {
    if (this.game.click && this.game.alive) {
        this.game.running = true;
    }
}

PlayGame.prototype.draw = function (ctx) {
    if (!this.game.running) {
        ctx.font = "30pt Impact";
        ctx.fillStyle = "red";
        
        if(!this.game.alive) {
            ctx.fillText("Game Over", 325, 250);
            ctx.fillText("Replay?", 346, 300);
            if (this.game.click != null && this.game.click.x >= 346 &&
                this.game.click.x <= 480 && this.game.click.y >= 265 &&
                this.game.click.y <= 300) {
                    this.game.running = true;
                    this.game.actualTime.gameTime = 0;
            }
            if (this.game.mouse != null && this.game.mouse.x >= 346 && this.game.mouse.x <= 480 && 
                this.game.mouse.y >= 265 && this.game.mouse.y <= 300) {
                ctx.fillStyle = "white";
                ctx.fillText("Replay?", 346, 300); 
            }
            
        } else {
            ctx.fillText("Enter the adeventure through space...", 100, 250);
        }
    }
}

/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

function Character(game) {
    cubeSlideBeginning = new Animation(ASSET_MANAGER.getAsset("./img/cube_slide.png"), 0, 0, 64, 64, 0.10, 15, true, false);
    this.animation = cubeSlideBeginning;
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/cube_jump.png"), 0, 0, 64, 64, 0.08, 8, false, false);
    this.jumping = false;
    this.falling = false;
    this.dead = false;
    this.height = 0;
    game.alive = !this.dead;
    this.ground = 350;
    this.platform = game.platforms[0];
    console.log('CUBE: ' + this.animation.frameWidth, this.animation.frameHeight);
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
    Entity.call(this, game, 32, 270);
}

Character.prototype = new Entity();
Character.prototype.constructor = Character;

Character.prototype.update = function () {
    if (this.game.running) {
        if (this.dead) {
            this.game.alive = false;
            this.game.reset();
            console.log("reset");
            return;
        }

        if (this.game.space && !this.falling && !this.jumping) {
            this.jumping = true;
            this.ground = this.y;
            
        }
        if (this.jumping) {
            if (this.jumpAnimation.isDone()) {
                this.jumpAnimation.elapsedTime = 0;
                this.jumping = false;
                Character.animation = cubeSlideBeginning;

            }


            var jumpDistance = this.jumpAnimation.elapsedTime / this.jumpAnimation.totalTime;
        
            var totalHeight = 400;
            

            if (jumpDistance > 0.5) {
                jumpDistance = 1 - jumpDistance;
            }  
            height = totalHeight * (-2 * (jumpDistance * jumpDistance - jumpDistance));  
            this.lastBottom = this.boundingbox.bottom;      
            this.y = this.ground - height;

            this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);

        

            for (let i =0; i < this.game.platforms.length; i++){
                let currentPlatform = this.game.platforms[i];

                if(this.boundingbox.collide(currentPlatform.boundingbox) && this.lastBottom < currentPlatform.boundingbox.top
                && currentPlatform instanceof Platform){
                    console.log("shouldve jumped onto platform");
                    this.jumping = false;
                    this.y = currentPlatform.boundingbox.top - this.animation.frameHeight - 65;
                    this.platform = currentPlatform;
                    this.jumpAnimation.elapsedTime = 0;

                }  

            }
           
        }
        if(this.falling) {

            console.log("falling");


            this.lastBottom = this.boundingbox.bottom;
            this.y += 15;
            this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
            
            
            for(let i = 0; i < this.game.platforms.length; i++){
                let currentPlatform = this.game.platforms[i];
                if(this.boundingbox.collide(currentPlatform.boundingbox) && this.lastBottom < currentPlatform.boundingbox.top){
                    console.log("landed on another platform");
                    this.falling = false;
                    this.y = currentPlatform.boundingbox.top - this.animation.frameWidth - 65;
                    this.platform = currentPlatform;

                }

            }

        }

        
        if (!this.jumping && !this.falling) {

            //console.log("sliding");
            //console.log("LEFT : " + this.boundingbox.left + "> RIGHT: " + this.platform.boundingbox.right);
            this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
            if (this.boundingbox.left > this.platform.boundingbox.right) {
                this.falling = true;
                console.log("should fall");
            }
        }
        this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
      
        for (let i = 0; i < this.game.platforms.length; i++) {
            var pf = this.game.platforms[i];
            if (this.boundingbox.collide(pf.boundingbox)) {
                this.dead = true;
            }
        }

        for (let i = 0; i < this.game.spikes.length; i++) {
            let currentPlatform = this.game.spikes[i];
            if (this.boundingbox.collide(currentPlatform.boundingbox)) {
                this.dead = true;
            }
        }
        
    }
    Entity.prototype.update.call(this);
}

Character.prototype.draw = function (ctx) {
    if (this.game.running) {
        if (this.dead) {
            return;
        } else if (this.jumping) {
            this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
            // if(this.jumpAnimation.isDone){
            // this.jumpAnimation.elapsedTime = 0;
            // this.jumping = false;
            // this.falling = true;
            // }
        } else {
            this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);

        } 
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + 64, this.y + 64, 64, 64);
        Entity.prototype.draw.call(this);
    }
}
Character.prototype.reset = function() {
    this.dead = false;
    this.x = 32;
    this.y = 270;
    this.ground = 350;
    this.jumping = false;
    this.falling = false;
}

/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

function Platform(game, x, y, width, height, color) {
    this.width = width;
    this.height = height;
    this.startX = x;
    this.startY = y;
    this.boundingbox = new BoundingBox(x, y, width, height);
    this.color = color;
    Entity.call(this, game, x, y);
}

Platform.prototype = new Entity();

Platform.prototype.constructor = Platform;

Platform.prototype.reset = function () {
    this.x = this.startX;
    this.y = this.startY;
}

Platform.prototype.update = function () {
    // if (this.x < -250) {
    //     this.x = 800; 
    // } 

    if (!this.game.running) {
        return;
    }
    this.x -= 200 * this.game.clockTick;
    // if (this.x + this.width < 0) {
    //     this.x += 3200;
    // }
    this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
    Entity.prototype.update.call(this);
}

Platform.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
}
/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

function Spike(game, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/spike.png"), 0, 0, 64, 64, 0.5, 2, true);
    this.ground = 350;
    this.startX = x;
    this.startY = y;
    this.boundingbox = new BoundingBox(this.x, this.y, 64, 64);
    Entity.call(this, game, x , y);
}

Spike.prototype = new Entity();
Spike.prototype.constructor = Spike;


Spike.prototype.reset = function() {
    this.x = this.startX;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
}

Spike.prototype.update = function () {
    if (!this.game.running) {
        return;    
    }
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
    this.x -= 200 * this.game.clockTick;
    Entity.prototype.update.call(this);
}

Spike.prototype.draw = function (ctx) {
    if (this.game.running) {
        // if (this.x < -64) {
        //     this.x = 800; 
        // }
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + 64, this.y + 64, 64, 64);
    }
    Entity.prototype.draw.call(this);
}

/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

function createMap(platforms, spikes, gameEngine){

    let spike;
    let start;
    let currentPlatform
    let w;

    // w = new Wall(gameEngine, 1650,250);
    // gameEngine.addEntity(w);
    // walls.push(w);




    //UP STAIRS
    currentPlatform = new Platform(gameEngine, 800, 325, 50, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);
    currentPlatform = new Platform(gameEngine, 1000, 300, 50, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);
    currentPlatform = new Platform(gameEngine, 1200, 275, 50, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);
    currentPlatform = new Platform(gameEngine, 1400, 250, 50, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);

    /*
    *Spikes in tunnel
    */

   start = 1650;

   for(var i = 0; i < 12; i++){
       
       start = start + 65;
       

       spike = new Spike(gameEngine, start , -5);
       gameEngine.addEntity(spike);
       spikes.push(spike);

   }



    //Tunnel
    currentPlatform = new Platform(gameEngine, 1600, 200, 800, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);
    currentPlatform = new Platform(gameEngine, 1600, 0, 900, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);

    /*
    *Spike under stairs
    */

   start = 2375;

   for(var i = 0; i < 28; i++){
    
       start = start + 65;
       

       spike = new Spike(gameEngine, start ,270);
       gameEngine.addEntity(spike);
       spikes.push(spike);

   }


    //DOWNSTAIRS
    currentPlatform = new Platform(gameEngine, 2450, 280, 50, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);
    currentPlatform = new Platform(gameEngine, 2650, 280, 50, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);
    currentPlatform = new Platform(gameEngine, 2800, 200, 50, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);
    currentPlatform = new Platform(gameEngine, 3000, 225, 50, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);
    currentPlatform = new Platform(gameEngine, 3200, 250, 50, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);
    currentPlatform = new Platform(gameEngine, 3400, 275, 50, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);

    spike = new Spike(gameEngine, 2700 , -200 , true);
    gameEngine.addEntity(spike);
    spikes.push(spike);
    spike = new Spike(gameEngine, 2900 , -200 , true);
    gameEngine.addEntity(spike);
    spikes.push(spike);
    spike = new Spike(gameEngine, 3100 , -200 , true);
    gameEngine.addEntity(spike);
    spikes.push(spike);

    //UPSTAIRS

    currentPlatform = new Platform(gameEngine, 3600, 250, 50, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);
    currentPlatform = new Platform(gameEngine, 3800, 225, 50, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);
    currentPlatform = new Platform(gameEngine, 4000, 200, 50, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);
    currentPlatform = new Platform(gameEngine, 4200, 225, 50, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);



    spike = new Spike(gameEngine, 4300, 150);
    gameEngine.addEntity(spike);
    spikes.push(spike);
    spike = new Spike(gameEngine, 4300, 200);
    gameEngine.addEntity(spike);
    spikes.push(spike);
    spike = new Spike(gameEngine, 4300, 250);
    gameEngine.addEntity(spike);
    spikes.push(spike);
    spike = new Spike(gameEngine, 4300, 300);
    gameEngine.addEntity(spike);
    spikes.push(spike);



    //TUNNEL

    currentPlatform = new Platform(gameEngine, 4400, 250, 1000, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);
    currentPlatform = new Platform(gameEngine, 4500, 100, 1000, 50, "grey");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);

    // w = new Wall(gameEngine, 5000,-100);
    // gameEngine.addEntity(w);
    // walls.push(w);


    // w = new Wall(gameEngine, 5000,300);
    // gameEngine.addEntity(w);
    // walls.push(w);

    

    //GROUND
    currentPlatform = new Platform(gameEngine, 0,400,1000000000000000,100,"black");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);    


}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/cube_slide.png");
ASSET_MANAGER.queueDownload("./img/cube_jump.png");
ASSET_MANAGER.queueDownload("./img/bg.png");
ASSET_MANAGER.queueDownload("./img/transparent_bg.png");
ASSET_MANAGER.queueDownload("./img/spike.png");


ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    document.getElementById('gameWorld').focus();
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();

    var platforms = [];
    gameEngine.platforms = platforms;

    var spikes = [];
    gameEngine.spikes = spikes;
 
    gameEngine.init(ctx);
    gameEngine.start();
    let timer = new VisibleTimer(gameEngine);
    let pg = new PlayGame(gameEngine, 320, 350);
    gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/bg.png")));
    //gameEngine.addEntity(new Foreground(gameEngine, ASSET_MANAGER.getAsset("./img/transparent_bg.png")));
    

    createMap(platforms, spikes, gameEngine);


    gameEngine.addEntity(new Character(gameEngine)); 
    gameEngine.running = false;
    gameEngine.addEntity(timer);
    gameEngine.addEntity(pg);
});

