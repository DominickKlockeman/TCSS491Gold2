
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
    
    if (this.right >= other.left && this.left <= other.right && this.top <= other.bottom && this.bottom >= other.top) {
        return true;
    }
    return false;
}
/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/


HandleClicks = function(game, startX, endX, startY, endY, func) {
    if(game.click != null && game.click.x >= startX &&
        game.click.x <= endX && game.click.y >= startY &&
        game.click.y <= endY) {
            game.inmenus = true;
            if(func == "single"){
                game.inmenus = false;
                game.running = true;
                game.actualTime.gameTime = 0;
            } else if(func == "multi") {
                game.inmenus = false;
                game.actualTime.gameTime = 0;
                game.multi = true;
                game.mainmenu = false;
            } else if(func == "naked") {
                game.naked = true; 
                game.mainmenu = false;
            } else if(func == "controls") {
                game.controls = true;
                game.mainmenu = false;
            } else if(func == "credits") {
                game.credits = true; 
                game.mainmenu = false;
            } else if(func == "credits back") {
                game.credits = false;
                game.mainmenu = true; 
            } else if(func == "dead") {
                game.endscreen = true; 
            } else if(func == "leaderboard") {
                game.leaderboard = true; 
                game.mainmenu = false;
            } else if(func == "end game main menu") {
                game.alive = true;
                game.mainmenu = true;
            }
        }
}

/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/


HighlightSelection = function(ctx, game, startX, endX, startY, endY, func) {
    if (game.mouse != null && game.mouse.x >= startX && game.mouse.x <= endX && 
        game.mouse.y >= startY && game.mouse.y <= endY) {
            ctx.fillStyle = "white";
            if(func == "single"){
                ctx.fillText("Single Player", 300, 150);

            } else if(func == "multi") {
                ctx.fillText("Multi Player", 310, 200);

            } else if(func == "naked") {
                ctx.fillText("Naked", 350, 250); 

            } else if(func == "controls") {
                ctx.fillText("Controls", 330, 300);

            } else if(func == "credits") {
                ctx.fillText("Credits", 340, 400);

            } else if(func == "credits back") {
                ctx.fillText("Return to Main Menu", 480, 480);

            } else if(func == "dead") {
                ctx.fillText("Replay", 346, 250);

            } else if(func == "leaderboard") {
                ctx.fillText("Leaderboard", 300, 350);

            } else if(func == "end game main menu") {
                ctx.fillText("Return to Main Menu", 250, 300);
            }
        }
}

ReturnToMainMenu = function(ctx, game) {
    ctx.font = "25pt Impact";
    ctx.fillText("Return to Main Menu", 480, 480);
    HandleClicks(game, 480, 760, 455, 485, "credits back");
    HighlightSelection(ctx, game, 480, 760, 455, 485, "credits back");
} 



function HandleMainMenuClicks(ctx, game) {
    HandleClicks(game, 300, 519, 115, 151, "single");
    HandleClicks(game, 310, 196, 170, 204, "multi");
    HandleClicks(game, 350, 454, 220, 251, "naked");
    HandleClicks(game, 330, 471, 273, 304, "controls");
    HandleClicks(game, 340, 461, 371, 405, "credits");
    HandleClicks(game, 302, 508, 321, 351, "leaderboard");
    HighlightSelection(ctx, game, 300, 519, 115, 151, "single");
    HighlightSelection(ctx, game, 310, 530, 170, 204, "multi");
    HighlightSelection(ctx, game, 350, 454, 220, 251, "naked");
    HighlightSelection(ctx, game, 330, 471, 273, 304, "controls");
    HighlightSelection(ctx, game, 340, 461, 371, 405, "credits");
    HighlightSelection(ctx, game, 302, 508, 321, 351, "leaderboard");
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
    
}

PlayGame.prototype.draw = function (ctx) {
    if (!this.game.running) {
        ctx.font = "30pt Impact";
        ctx.fillStyle = "yellow";
        
        
        if(!this.game.alive) {
            this.game.canbepaused = false;
            ctx.fillText("Game Over", 315, 200);
            ctx.fillText("Replay", 346, 250);
            ctx.fillText("Return to Main Menu", 250, 300);
            HandleClicks(this.game, 346, 480, 220, 255, "single");
            HighlightSelection(ctx, this.game, 346, 480, 220, 255, "dead");
            HandleClicks(this.game, 253, 587, 270, 302, "end game main menu");
            HighlightSelection(ctx, this.game, 253, 587, 270, 302, "end game main menu");
            
        } else if (this.game.credits) {
            ReturnToMainMenu(ctx, this.game);
        } else if(this.game.mainmenu){
            ctx.font = "50pt Impact";
            ctx.fillText("Space Death Race", 150, 70);
            ctx.font = "30pt Impact";
            ctx.fillText("Single Player", 300, 150);
            ctx.fillText("Multi Player", 310, 200);
            ctx.fillText("Naked", 350, 250);
            ctx.fillText("Controls", 330, 300);
            ctx.fillText("Leaderboard", 300, 350);
            ctx.fillText("Credits", 340, 400);
            HandleMainMenuClicks(ctx, this.game);
            
        } else if (this.game.controls) {
            ReturnToMainMenu(ctx, this.game);
        } else if(this.game.naked) {
            ReturnToMainMenu(ctx, this.game);
        } else if(this.game.leaderboard) {
            ctx.fillText("Dominick       20.001", 250, 100);
            ctx.fillText("Allen                 18.345", 250, 150);
            ctx.fillText("Giovanni         15.790", 250, 200);
            ctx.fillText("Andrew             2.999", 250, 250);
            ReturnToMainMenu(ctx, this.game);
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

        

            
            // for (let i =0; i < this.game.blocks.length; i++){
            //     let currentPlatform = this.game.blocks[i];

            //     if(this.boundingbox.collide(currentPlatform.boundingbox) && this.lastBottom < currentPlatform.boundingbox.top
            //     && currentPlatform instanceof Block){
            //         console.log("shouldve jumped onto platform");
            //         this.jumping = false;
            //         this.y = currentPlatform.boundingbox.top - this.animation.frameHeight - 65;
            //         this.block = currentPlatform;
            //         this.jumpAnimation.elapsedTime = 0;

            //     }  

            // }


            for (let i =0; i < this.game.platforms.length; i++){

                let currentPlatform = this.game.platforms[i];

                if(this.boundingbox.collide((currentPlatform.boundingbox) && this.lastBottom < currentPlatform.boundingbox.top
                && currentPlatform instanceof Block)){
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
                if((this.boundingbox.collide(currentPlatform.boundingbox) && this.lastBottom < currentPlatform.boundingbox.top)){
                    console.log("landed on another platform");
                    this.falling = false;
                    this.y = currentPlatform.boundingbox.top - this.animation.frameWidth - 65;
                    this.platform = currentPlatform;

                }

            }

            
        }

        

        
        if (!this.jumping && !this.falling) {


            this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);




        }
        this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
      
        for (let i = 0; i < this.game.platforms.length; i++) {
            var pf = this.game.platforms[i];
            if (this.boundingbox.collide(pf.boundingbox)) {
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
            this.jumping = false;
            this.falling = true;
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

function Credits(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/credits.png"), 0, 0, 800, 500, .2, 0, true, false);
    this.ground = 400;
    Entity.call(this, game, 100, 100);
}

Credits.prototype = new Entity();
Credits.prototype.constructor = Credits;

Credits.prototype.update = function() {
    Entity.prototype.update.call(this);
}

Credits.prototype.draw = function(ctx) {
    if(this.game.credits && !this.game.runnning) {
        this.animation.drawFrame(this.game.clockTick, ctx, 0, 0, 0);
    }
    Entity.prototype.draw.call(this);
}


/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/


/*function SloMo(game, x, y, gnd) {
    this.ground = gnd;
    this.x = x;
    this.y = y;
    this.boundingbox = new BoundingBox(this.x);
    Entity.call(this, game, 200, 100);
}

SloMo.prototype = new Entity();
SloMo.prototype.constructor = SlowMo;

SloMo.prototype.update = function() {

}

SloMo.prototype.draw = function() {

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
    this.x -= 500 * this.game.clockTick;
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
    // if (this.x < -250) {
    //     this.x = 800; 
    // } 

    if (!this.game.running) {
        return;
    }
    this.x -= 500 * this.game.clockTick;
    // if (this.x + this.width < 0) {
    //     this.x += 3200;
    // }
    this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
    Entity.prototype.update.call(this);
}

Spike.prototype.draw = function (ctx) {
    if (this.game.running) {

        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);

    }
    Entity.prototype.draw.call(this);
}

function Block(game, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/block.png"), 0, 0, 64, 64, 0.5, 2,true);
    this.ground = 350;
    this.startX = x;
    this.startY = y;
    this.width = this.animation.frameWidth;
    this.height = this.animation.frameHeight;
    console.log("W: " + this.animation.frameWidth);
    console.log("H: " + this.animation.frameHeight);
    this.boundingbox = new BoundingBox(x, y, 64, 64);
    Entity.call(this, game, x , y);
}

Block.prototype = new Entity();

Block.prototype.constructor = Spike;


Block.prototype.reset = function() {
    this.x = this.startX;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
}

Block.prototype.update = function () {
    // if (this.x < -250) {
    //     this.x = 800; 
    // } 

    if (!this.game.running) {
        return;
    }
    this.x -= 500 * this.game.clockTick;
    // if (this.x + this.width < 0) {
    //     this.x += 3200;
    // }
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
    Entity.prototype.update.call(this);
}

Block.prototype.draw = function (ctx) {
    if (this.game.running) {
        // if (this.x < -64) {
        //     this.x = 800; 
        // }

        //ctx.fillRect(this.x,this.y,this.width,this.height);
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y,3);
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + 64, this.y + 64, 64, 64);
    }
    Entity.prototype.draw.call(this);
}




function Big_platform(game, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/big_platform.png"), 0, 0, 313, 65, 2.5, 2, true, false);
    this.ground = 350;
    this.startX = x;
    this.startY = y;
    this.width = this.animation.frameWidth;
    this.height = this.animation.frameHeight;
    console.log("W: " + this.animation.frameWidth);
    console.log("H: " + this.animation.frameHeight);
    this.boundingbox = new BoundingBox(x, y, 313, 65);
    Entity.call(this, game, x , y);
}

Big_platform.prototype = new Entity();

Big_platform.prototype.constructor = Spike;


Big_platform.prototype.reset = function() {
    this.x = this.startX;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
}

Big_platform.prototype.update = function () {
    // if (this.x < -250) {
    //     this.x = 800; 
    // } 

    if (!this.game.running) {
        return;
    }
    this.x -= 500 * this.game.clockTick;
    // if (this.x + this.width < 0) {
    //     this.x += 3200;
    // }
    this.boundingbox = new BoundingBox(this.x + 148, this.y + 65, 700, 65);
    Entity.prototype.update.call(this);
}

Big_platform.prototype.draw = function (ctx) {
    if (this.game.running) {
        // if (this.x < -64) {
        //     this.x = 800; 
        // }

        //ctx.fillRect(this.x + 148, this.y + 65, 700, 65);
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y,3);
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + 64, this.y + 64, 64, 64);
    }
    Entity.prototype.draw.call(this);
}
/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/




function createMap(platforms,gameEngine){


    let currentPlatform;


    currentPlatform = new Block(gameEngine, 500, 275);
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);
    currentPlatform = new Block(gameEngine, 560, 275);
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);
    currentPlatform = new Block(gameEngine, 620, 275);
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);
    currentPlatform = new Block(gameEngine, 680, 275);
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);

    currentPlatform = new Big_platform(gameEngine, 750, 225);
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);


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
ASSET_MANAGER.queueDownload("./img/credits.png");
ASSET_MANAGER.queueDownload("./img/block.png");
ASSET_MANAGER.queueDownload("./img/big_platform.png");


ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    document.getElementById('gameWorld').focus();
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();

    var platforms = [];
    gameEngine.platforms = platforms;

    gameEngine.init(ctx);
    gameEngine.start();
    let timer = new VisibleTimer(gameEngine);
    let pg = new PlayGame(gameEngine, 320, 350);
    gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/bg.png")));
    //gameEngine.addEntity(new Foreground(gameEngine, ASSET_MANAGER.getAsset("./img/transparent_bg.png")));
    

    createMap(platforms,gameEngine);


    gameEngine.addEntity(new Character(gameEngine)); 
    gameEngine.addEntity(new Credits(gameEngine));
 //   gameEngine.addEntity(new HandleClicks(gameEngine));
 //   gameEngine.addEntity(new HighlightSelection(gameEngine));
 //   gameEngine.mainmenu = true;
    gameEngine.addEntity(timer);
    gameEngine.addEntity(pg);
});

