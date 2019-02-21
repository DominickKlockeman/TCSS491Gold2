soundPlayer = new Audio("MiddleChild.mp3");
soundPlayer.play();

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

/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

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

BoundingBox.prototype.climb = function (other) {
    if (other instanceof Block) {
        if (Math.abs(other.boundingbox.right - this.right) < 64) {
            if (Math.abs(this.bottom - other.boundingbox.top) <= 5) {
                return true;
            }
        }
    }
    return false;
}
BoundingBox.prototype.collide = function (other) {
    if (Math.abs(other.boundingbox.right - this.right) < 64) {
        if (this.bottom > other.boundingbox.top) {
            return true;
        }
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
    console.log('CUBE: ' + this.animation.frameWidth, this.animation.frameHeight);
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
    Entity.call(this, game, -64, 350);
}

Character.prototype = new Entity();
Character.prototype.constructor = Character;

Character.prototype.update = function () {
    if (this.game.running) {
        if (this.dead) {
            this.game.alive = false;
            this.game.reset();
            return;
        }
        if (this.y < 350 && !this.boundingbox.bottom >= this.game.entities[4].boundingbox.top) {
            this.falling = true;
        } else {
            this.falling = false;
        }
        if (this.game.space && !this.falling) {
            this.jumping = true;
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
            this.y = this.ground - height;
           
        }
        if (this.falling) {
           
        }
        this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
      
        if (this.boundingbox.climb(this.game.entities[4])) {
            this.ground -= 64; 
        } else if (this.boundingbox.collide(this.game.entities[3]) || this.boundingbox.collide(this.game.entities[4])) {
            this.dead = true;  
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
        } else {
            this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
        } 
        ctx.lineWidth = 3;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x + 64, this.y + 64, 64, 64);
        Entity.prototype.draw.call(this);
    }
}
Character.prototype.reset = function() {
    this.dead = false;
    this.x = -64;
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


function Block(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/block.png"), 0, 0, 64, 64, 0.50, 2, true, false);
    this.ground = 350;
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
    Entity.call(this, game, 1000, 350);
}

Block.prototype = new Entity();
Block.prototype.constructor = Block;

Block.prototype.reset = function() {
    this.x = 1000;
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
}
Block.prototype.update = function () {
    if (this.game.running) {
        this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
    }  
    Entity.prototype.update.call(this);
}

Block.prototype.draw = function (ctx) {
    if (this.game.running) {
        if(this.x < -64) {
            this.x = 800; 
        }  
        this.animation.drawFrame(this.game.clockTick, ctx, this.x -= 7, this.y, 3);     
        ctx.lineWidth = 5;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x + 64, this.y + 64, 64, 64);
    }
    Entity.prototype.draw.call(this);
}

/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

function Spike(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/spike.png"), 0, 0, 64, 64, 0.5, 2, true, false);
    this.ground = 350;
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
    Entity.call(this, game, 400, 350);
}

Spike.prototype = new Entity();
Spike.prototype.constructor = Spike;


Spike.prototype.reset = function() {
    this.x = 400;
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
}

Spike.prototype.update = function () {
    if (this.game.running) {
        this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
    }
    Entity.prototype.update.call(this);
}

Spike.prototype.draw = function (ctx) {
    if (this.game.running) {
        if (this.x < -64) {
            this.x = 800; 
        }
        this.animation.drawFrame(this.game.clockTick, ctx, this.x -= 7, this.y, 3);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x + 64, this.y + 64, 64, 64);
    }
    Entity.prototype.draw.call(this);
}


/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/cube_slide.png");
ASSET_MANAGER.queueDownload("./img/cube_jump.png");
ASSET_MANAGER.queueDownload("./img/block.png");
ASSET_MANAGER.queueDownload("./img/spike.png");
ASSET_MANAGER.queueDownload("./img/bg.png");
ASSET_MANAGER.queueDownload("./img/transparent_bg.png");
ASSET_MANAGER.queueDownload("./img/credits.png");


ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    document.getElementById('gameWorld').focus();
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();
 
    gameEngine.init(ctx);
    gameEngine.start();
    let timer = new VisibleTimer(gameEngine);
    let pg = new PlayGame(gameEngine, 320, 350);
    gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/bg.png")));
    gameEngine.addEntity(new Foreground(gameEngine, ASSET_MANAGER.getAsset("./img/transparent_bg.png")));
    gameEngine.addEntity(new Character(gameEngine)); 
    gameEngine.addEntity(new Spike(gameEngine));
    gameEngine.addEntity(new Block(gameEngine));
    gameEngine.addEntity(new Credits(gameEngine));
 //   gameEngine.addEntity(new HandleClicks(gameEngine));
 //   gameEngine.addEntity(new HighlightSelection(gameEngine));
 //   gameEngine.mainmenu = true;
    gameEngine.addEntity(timer);
    gameEngine.addEntity(pg);
});

