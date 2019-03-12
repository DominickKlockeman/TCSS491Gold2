var menuSelectSound = new Audio("MeleeMenuSelect Sound.mp3");
var gameBackgroundSound = new Audio("gameMusic.mp3");

menuSelectSound.volume = .6;
playSound = function() {
    menuSelectSound.play();

}

volumeSelect = function(selectedVolume) {

    if(selectedVolume == "0.0") {
        menuSelectSound.volume = 0;
        menuBackgroundSound.volume = 0;
        gameBackgroundSound.volume = 0;
    } else if(selectedVolume == "0.2") {
        menuSelectSound.volume = 0.2;
        menuBackgroundSound.volume = 0.2;
        gameBackgroundSound.volume = 0.2;
    } else if(selectedVolume == "0.4") {
        menuSelectSound.volume = 0.4;
        menuBackgroundSound.volume = 0.4;
        gameBackgroundSound.volume = 0.4;
    } else if(selectedVolume == "0.6") {
        menuSelectSound.volume = 0.6;
        menuBackgroundSound.volume = 0.6;
        gameBackgroundSound.volume = 0.6;
    } else if(selectedVolume == "0.8") {
        menuSelectSound.volume = 0.8;
        menuBackgroundSound.volume = 0.8;
        gameBackgroundSound.volume = 0.8;
    } else if(selectedVolume == "1.0") {
        menuSelectSound.volume = 1.0;
        menuBackgroundSound.volume = 1.0;
        gameBackgroundSound.volume = 1.0;
    }

}

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
    this.x = 0;
    this.y = 1;
    this.spritesheet = spritesheet;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
    this.x, this.y);
};

Background.prototype.update = function () {
    this.x -= 1;
    if (this.x < -800) this.x = 0;
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
    if (this.x < -800) this.x = 0;
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

function RocketShip(game, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/rocketship.png"), 0, 0, 100, 105, 0.2, 0, true, false);
    this.startX = x;
    this.startY = y;
    this.boundingbox = new BoundingBox(this.x, this.y, 64, 10000);
    Entity.call(this, game, x , y);
}

RocketShip.prototype = new Entity();
RocketShip.prototype.constructor = RocketShip;

RocketShip.prototype.update = function() {
    if(!this.game.running) {
        return;
    }
    Entity.prototype.update.call(this);
}

RocketShip.prototype.draw = function() {
    if(this.game.running) {
        //this.animation.drawFrame(this.game.clockTick, ctx, this,x, this.y, 0);
    }
    Entity.prototype.draw.call(this);
}


/*

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
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + 64, this.y + 64, 64, 64);
    }
    Entity.prototype.draw.call(this);
}




*/


/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/


HandleClicks = function(game, startX, endX, startY, endY, func) {
    if(game.click != null && game.click.x >= startX &&
        game.click.x <= endX && game.click.y >= startY &&
        game.click.y <= endY) {
            playSound();
            game.song.play();
            game.inmenus = true;
            if(func == "single"){
                console.log("here");
                game.canbepaused = true;
                game.song.pause();
                game.inmenus = false;
                game.running = true;
                game.song = gameBackgroundSound;
                game.actualTime.gameTime = 0;
            } else if(func == "multi") {
                //game.inmenus = false;
                game.actualTime.gameTime = 0;
                game.multi = true;
                //game.mainmenu = false;
            } else if(func == "naked") {
                game.naked = true; 
                //game.mainmenu = false;
            } else if(func == "controls") {
                game.controls = true;
                game.mainmenu = false;
            } else if(func == "credits") {
                game.credits = true; 
                game.mainmenu = false;
            } else if(func == "credits back") {
                game.credits = false;
                game.controls = false;
                game.leaderboard = false;
                game.mainmenu = true; 
            } else if(func == "leaderboard") {
                game.leaderboard = true; 
                game.mainmenu = false;
            } else if(func == "end game main menu") {
                game.song.pause();
                game.alive = true;
                game.mainmenu = true;
                game.song = menuBackgroundSound;
            } else if(func == "player finished") {
                game.playerFinished = true;
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
    HandleClicks(game, 310, 508, 170, 204, "multi");
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

function FillVolume(num, vol, ctx) {
    if(vol == "true") {
        ctx.fillText("Volume", 10, 480);
    }
    if(num == 1) {
        ctx.fillText("l", 145, 480); 
    }
    if(num == 2) {
        ctx.fillText("l", 145, 480); 
        ctx.fillText("l", 155, 480);
    }
    if(num == 3) {
        ctx.fillText("l", 145, 480); 
        ctx.fillText("l", 155, 480);
        ctx.fillText("l", 165, 480);
    }
    if(num == 4) {
        ctx.fillText("l", 145, 480); 
        ctx.fillText("l", 155, 480);
        ctx.fillText("l", 165, 480);
        ctx.fillText("l", 175, 480);
    }
    if(num == 5) {
        ctx.fillText("l", 145, 480); 
        ctx.fillText("l", 155, 480);
        ctx.fillText("l", 165, 480);
        ctx.fillText("l", 175, 480);
        ctx.fillText("l", 185, 480);
    }

}

function DisplayVolume(ctx, game, ctx) {
    ctx.fillStyle = "yellow"; 
    FillVolume(5, "true", ctx);
    if(game.volume == 0) {
        ctx.fillStyle = "yellow"; 
        FillVolume(5, "", ctx);
    } else if(game.volume == 1) {
        ctx.fillStyle = "white";
        FillVolume(1, "", ctx);
    } else if(game.volume == 2) {
        ctx.fillStyle = "white";
        FillVolume(2, "", ctx);
    } else if(game.volume == 3) {
        ctx.fillStyle = "white";
        FillVolume(3, "", ctx);
    } else if(game.volume == 4) {
        ctx.fillStyle = "white";
        FillVolume(4, "", ctx);
    } else if(game.volume == 5) {
        ctx.fillStyle = "white";
        FillVolume(5, "", ctx);
    } 


    HandleVolumeSelection(ctx, game, 11, 136, 453, 483, "0.0");
    HandleVolumeSelection(ctx, game, 148, 158, 453, 483, "0.2");
    HandleVolumeSelection(ctx, game, 158, 168, 453, 483, "0.4");
    HandleVolumeSelection(ctx, game, 168, 178, 453, 483, "0.6");
    HandleVolumeSelection(ctx, game, 178, 188, 453, 483, "0.8");
    HandleVolumeSelection(ctx, game, 188, 198, 453, 483, "1.0");
    HighlightVolumeSelection(ctx, game, 11, 136, 453, 483, "0.0");
    HighlightVolumeSelection(ctx, game, 148, 158, 453, 483, "0.2");
    HighlightVolumeSelection(ctx, game, 158, 168, 453, 483, "0.4");
    HighlightVolumeSelection(ctx, game, 168, 178, 453, 483, "0.6");
    HighlightVolumeSelection(ctx, game, 178, 188, 453, 483, "0.8");
    HighlightVolumeSelection(ctx, game, 188, 198, 453, 483, "1.0");
}

function HandleVolumeSelection(ctx, game, startX, endX, startY, endY, func) {
    if (game.click != null && game.click.x >= startX &&
        game.click.x <= endX && game.click.y >= startY &&
        game.click.y <= endY) {
            volumeSelect(func);
            if(func == "0.0") {
                ctx.fillStyle = "yellow"; 
                game.volume = 0;
            } else if(func == "0.2") {
                game.volume = 1;
            } else if(func == "0.4") {
                game.volume = 2;
            } else if(func == "0.6") {
                game.volume = 3;
            } else if(func == "0.8") {
                game.volume = 4;
            } else if(func == "1.0") {
                game.volume = 5;
            }
            menuSelectSound.play();
        }
}

function HighlightVolumeSelection(ctx, game, startX, endX, startY, endY, func) {
    if(game.mouse != null && game.mouse.x >= startX && game.mouse.x <= endX && 
        game.mouse.y >= startY && game.mouse.y <= endY) {
            ctx.fillStyle = "white";
            ctx.fillStyle = "yellow";
            FillVolume(5, "", ctx);
            if(func == "0.0") {
                //ctx.fillStyle = "yellow";
                //FillVolume(5, "", ctx);
            } else if(func == "0.2") {
                ctx.fillStyle = "white";
                FillVolume(1, "", ctx);

            } else if(func == "0.4") {
                ctx.fillStyle = "white";
                FillVolume(2, "", ctx);
                
            } else if(func == "0.6") {
                ctx.fillStyle = "white";
                FillVolume(3, "", ctx);
                
            } else if(func == "0.8") {
                ctx.fillStyle = "white";
                FillVolume(4, "", ctx);
                
            } else if(func == "1.0") {
                ctx.fillStyle = "white";
                FillVolume(5, "", ctx);
                
            }
        }
}

function displayControls(ctx) {
    ctx.fillText("W:  Jump", 300, 100);
    ctx.fillText("P : pause", 300, 150);
    ctx.fillText("Select bars to adjust Volume", 150, 200);
    ctx.fillText("Select Volume to mute", 200, 250);
    ctx.fillText("Avoid Spikes", 280, 300);
    ctx.fillText("Get to your spaceship", 200, 350);
}

function endGame(ctx, game) {

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
    this.game.song.pause();
    ctx.font = "30pt Impact";
    ctx.fillStyle = "yellow";
    DisplayVolume(ctx, this.game, ctx, this.game.volume);
    this.game.song.play();
    if (!this.game.running) {
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
        } else if(this.game.mainmenu && !this.game.playerFinished){
            console.log("menu here");
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
            displayControls(ctx);
            ReturnToMainMenu(ctx, this.game);
        } else if(this.game.naked) {
            ReturnToMainMenu(ctx, this.game);
        } else if(this.game.leaderboard) {
            ctx.fillText("Dominick       20.001", 250, 100);
            ctx.fillText("Allen                 18.345", 250, 150);
            ctx.fillText("Giovanni         15.790", 250, 200);
            ctx.fillText("Andrew             2.999", 250, 250);
            ReturnToMainMenu(ctx, this.game);
        } else if(this.game.playerFinished) {
            ctx.fillText("Congratulations!", 260, 200);
            ctx.fillText("You made it to the spaceship in time!", 110, 250);
            ReturnToMainMenu(ctx, this.game);
        }
    }
}

/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

function Character(game) {
    cubeSlideBeginning = new Animation(ASSET_MANAGER.getAsset("./img/cube_slide.png"), 0, 0, 64, 64, 0.10, 15, true, false);
    cubeLaser = new Animation(ASSET_MANAGER.getAsset("./img/cube_right_laser.png"), 0, 0, 64, 64, 0.08, 8, true, false);
    this.laser = new Laser(game, this);
    game.addEntity(this.laser);
    this.animation = cubeSlideBeginning;
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/cube_jump.png"), 0, 0, 64, 64, 0.08, 8, false, false);
    this.jumping = false;
    this.falling = false;
    this.dead = false;
    this.height = 0;
    game.alive = !this.dead;
    this.ground = 350;
    this.platform = game.platforms[0];
    this.levelX = 10200;
    console.log('CUBE: ' + this.animation.frameWidth, this.animation.frameHeight);
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
    Entity.call(this, game, 32,270);
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
        if (this.game.w && !this.falling && !this.jumping) {
            this.jumping = true;
            this.ground = this.y;            
        }
        if (this.game.space) {
            for (let i = 0; i < this.game.walls.length; i++) {
                let wl = this.game.walls[i];
                if (this.laser.boundingbox.collide(wl.boundingbox)) {
                    console.log("shot the wall");
                    wl.shot = true;
                 
                }
            } 
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


            for (let i = 0; i < this.game.platforms.length; i++){
                let currentPlatform = this.game.platforms[i];
                if (this.boundingbox.collide(currentPlatform.boundingbox) 
                && this.lastBottom <= currentPlatform.boundingbox.top
                && currentPlatform instanceof Platform) {
                    console.log("shouldve jumped onto platform");
                    this.jumping = false;
                    this.y = currentPlatform.boundingbox.top - this.animation.frameHeight - 65;
                    this.platform = currentPlatform;
                    this.jumpAnimation.elapsedTime = 0;
                }  
            }       
            for (let i = 0; i < this.game.blocks.length; i++){
                let currentBlock = this.game.blocks[i];
                if (this.boundingbox.collide(currentBlock.boundingbox) 
                && this.lastBottom <= currentBlock.boundingbox.top
                && currentBlock instanceof Block) {
                    console.log("shouldve jumped onto block");
                    this.jumping = false;
                    this.y = currentBlock.boundingbox.top - this.animation.frameHeight - 65;
                    this.platform = currentBlock;
                    this.jumpAnimation.elapsedTime = 0;
                }  
            }     
            for (let i = 0; i < this.game.newPlatforms.length; i++){
                let currentNewPlatform = this.game.newPlatforms[i];
                if (this.boundingbox.collide(currentNewPlatform.boundingbox) 
                && this.lastBottom <= currentNewPlatform.boundingbox.top
                && currentNewPlatform instanceof NewPlatform) {
                    console.log("shouldve jumped onto new platform");
                    this.jumping = false;
                    this.y = currentNewPlatform.boundingbox.top - this.animation.frameHeight - 65;
                    this.platform = currentNewPlatform;
                    this.jumpAnimation.elapsedTime = 0;
                }  
            }               
        }
        if (this.falling) {
            console.log("falling");
            this.lastBottom = this.boundingbox.bottom;
            this.y += 15;
            this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
        
            for (let i = 0; i < this.game.platforms.length; i++) {
                let pf = this.game.platforms[i];
                if (this.boundingbox.collide(pf.boundingbox) 
                && this.lastBottom <= pf.boundingbox.top) {
                    console.log("landed on another platform");
                    this.falling = false;
                    this.y = pf.boundingbox.top - this.animation.frameHeight - 65;
                    this.platform = pf;
                }
            }
            for (let i = 0; i < this.game.blocks.length; i++) {
                let blk = this.game.blocks[i];
                if (this.boundingbox.collide(blk.boundingbox) 
                && this.lastBottom <= blk.boundingbox.top) {
                    console.log("landed on another platform");
                    this.falling = false;
                    this.y = blk.boundingbox.top - this.animation.frameHeight - 65;
                    this.platform = blk;
                }
            }
            for (let i = 0; i < this.game.newPlatforms.length; i++) {
                let npf = this.game.newPlatforms[i];
                if (this.boundingbox.collide(npf.boundingbox) 
                && this.lastBottom <= npf.boundingbox.top) {
                    console.log("landed on another platform");
                    this.falling = false;
                    this.y = npf.boundingbox.top - this.animation.frameHeight - 65;
                    this.platform = npf;
                }
            }

        }

        if (!this.jumping && !this.falling) {
            this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
            if (this.boundingbox.left > this.platform.boundingbox.right) {
                this.falling = true;
                console.log("should fall");
            }
        }
        this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);

        if(!this.game.godMode) {
        
            for (let i = 0; i < this.game.platforms.length; i++) {
                var pf = this.game.platforms[i];
                if (this.boundingbox.collide(pf.boundingbox)) {
                    this.dead = true;
                }
            }

            for (let i = 0; i < this.game.spikes.length; i++) {
                let spk = this.game.spikes[i];
                if (this.boundingbox.collide(spk.boundingbox)) {
                    console.log("hit spike")
                    this.dead = true;
                }
            }

            for (let i = 0; i < this.game.blocks.length; i++) {
                let blk = this.game.blocks[i];
                if (this.boundingbox.collide(blk.boundingbox)) {
                    console.log("hit block")
                    this.dead = true;
                }
            }

            for (let i = 0; i < this.game.newPlatforms.length; i++) {
                let npf = this.game.newPlatforms[i];
                if (this.boundingbox.collide(npf.boundingbox)) {
                    console.log("hit new pf")
                    this.dead = true;
                }
            }

            for (let i = 0; i < this.game.walls.length; i++) {
                let wl = this.game.walls[i];
                if (this.boundingbox.collide(wl.boundingbox)) {
                    console.log("hit wall")
                    this.dead = true;
                }
            }
        }      
        
        for (let i = 0; i < this.game.speedPowerups.length; i++) {
            let pu = this.game.speedPowerups[i];
            if (this.boundingbox.collide(pu.boundingbox)) {
                
                this.game.speedUp = true;
                
            }
        } 

        for (let i = 0; i < this.game.sloMoPowerups.length; i++) {
            let pu = this.game.sloMoPowerups[i];
            if (this.boundingbox.collide(pu.boundingbox)) {
                
                this.game.sloMo = true;
                
            }
        } 

        for (let i = 0; i < this.game.godModePowerups.length; i++) {
            let pu = this.game.godModePowerups[i];
            if (this.boundingbox.collide(pu.boundingbox)) {
                
                this.game.godMode = true;
                
            }
        }

        this.levelX -= this.game.gameSpeed * this.game.clockTick;
        console.log(this.levelX);

        if(this.levelX < 0){
        
            console.log("YOU WIN");
            
            this.game.running = false;
            this.game.playerFinished = true;

            return;
        
        }
                

    
    }
    Entity.prototype.update.call(this);
}

Character.prototype.draw = function (ctx) {
    if (this.game.running) {
        if (this.dead) {
            return;
        } else {
            if (this.jumping) {
                this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
            } else {
                if (this.game.space) {
                    this.animation = cubeLaser;
                    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
                    this.laser.animation.drawFrame(this.game.clockTick, ctx, 136, this.y - 20, 4);
                    
                } else {
                    this.animation = cubeSlideBeginning;
                    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
                }
            }
        }
        
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + 64, this.y + 64, 64, 64);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "blue";
        //ctx.strokeRect(this.laser.x + 400, this.laser.y - 20, this.laser.width, this.laser.height);
        // this.boundingbox = new BoundingBox(x, y + 64, this.width, this.height);
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
    this.levelX = 10200;
    this.jumpAnimation.elapsedTime = 0;
}

function Laser(game, cube) {
    laser = new Animation(ASSET_MANAGER.getAsset("./img/laser.png"), 0, 0, 64, 64, .2, 4, true, true);
    this.animation = laser;
    this.cube = cube;
    this.game = game;
    //ctx.strokeRect(136, this.y + 90, 64 * 4 , 32);
    this.boundingbox = new BoundingBox(136, this.cube.y + 90, 64 * 4, 32);
    Entity.call(this, game, 0, 0);
}

Laser.prototype = new Entity();
Laser.prototype.constructor = Laser;

Laser.prototype.update = function () {
    //function BoundingBox(x, y, width, height) {
    this.boundingbox = new BoundingBox(136, this.cube.y + 90, 64 * 4, 32);
    Entity.prototype.update.call(this);
}

Laser.prototype.draw = function (ctx) {
    if (this.game.running) {
        if (this.cube.dead) {
            return
        }
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(136, this.cube.y + 90, 64 * 4 , 32);
    }
    
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
    if (!this.game.running) {
        return;
    }
    this.x -= this.game.gameSpeed * this.game.clockTick;
    this.boundingbox = new BoundingBox(this.x, this.y, this.width, this.height);
    Entity.prototype.update.call(this);
}

Platform.prototype.draw = function (ctx) {
    // this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
}
/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

function Spike(game, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/spike.png"), 0, 0, 64, 64, 0.5, 2, true, false);
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
    this.x -= this.game.gameSpeed * this.game.clockTick;
    Entity.prototype.update.call(this);
}

Spike.prototype.draw = function (ctx) {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + 64, this.y + 64, 64, 64);
    }
    Entity.prototype.draw.call(this);
}

function Block(game, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/block.png"), 0, 0, 64, 64, 0.5, 2, true, false);
    this.startX = x;
    this.startY = y;
    this.boundingbox = new BoundingBox(this.x, this.y, 64, 64);
    Entity.call(this, game, x , y);
}

Block.prototype = new Entity();
Block.prototype.constructor = Block;


Block.prototype.reset = function() {
    this.x = this.startX;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
}

Block.prototype.update = function () {
    if (!this.game.running) {
        return;    
    }
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
    this.x -= this.game.gameSpeed  * this.game.clockTick;
    Entity.prototype.update.call(this);
}

Block.prototype.draw = function (ctx) {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + 64, this.y + 64, 64, 64);
    }
    Entity.prototype.draw.call(this);
}

function NewPlatform(game, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/platform.png"), 0, 0, 320, 64, 0.5, 2, true, false);
    this.startX = x;
    this.startY = y;
    this.boundingbox = new BoundingBox(this.x + 314, this.y, 330, 64);
    Entity.call(this, game, x , y);
}

NewPlatform.prototype = new Entity();
NewPlatform.prototype.constructor = NewPlatform;


NewPlatform.prototype.reset = function() {
    this.x = this.startX;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x + 314, this.y + 64, 330, 64);
}

NewPlatform.prototype.update = function () {
    if (!this.game.running) {
        return;    
    }
    this.boundingbox = new BoundingBox(this.x + 314, this.y + 64, 330, 64);
    this.x -= this.game.gameSpeed * this.game.clockTick;
    Entity.prototype.update.call(this);
}

NewPlatform.prototype.draw = function (ctx) {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
        // ctx.lineWidth = 1;
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + 314, this.y + 64, 330, 64);
    }
    Entity.prototype.draw.call(this);
}

function SpeedPowerup(game, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/powerup_boost.png"), 0, 0, 64, 64, 0.2, 8, true, false);
    this.startX = x;
    this.startY = y;
    this.isHit = false;
    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 64);
    Entity.call(this, game, x , y);
}

SpeedPowerup.prototype = new Entity();
SpeedPowerup.prototype.constructor = SpeedPowerup;


SpeedPowerup.prototype.reset = function() {
    this.x = this.startX;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 64);
}

SpeedPowerup.prototype.update = function () {
    if (!this.game.running) {
        return;    
    }

   // console.log("Coin is : " + this.isHit);

    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 64);
    this.x -= this.game.gameSpeed  * this.game.clockTick;
    Entity.prototype.update.call(this);
}

SpeedPowerup.prototype.draw = function (ctx) {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + 64, this.y, 64, 192);
    }
    Entity.prototype.draw.call(this);
}

function SloMoPowerup(game, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/powerup_boost.png"), 0, 0, 64, 64, 0.2, 8, true, false);
    this.startX = x;
    this.startY = y;
    this.isHit = false;
    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 64);
    Entity.call(this, game, x , y);
}

SloMoPowerup.prototype = new Entity();
SloMoPowerup.prototype.constructor = SloMoPowerup;


SloMoPowerup.prototype.reset = function() {
    this.x = this.startX;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 64);
}

SloMoPowerup.prototype.update = function () {
    if (!this.game.running) {
        return;    
    }

   // console.log("Coin is : " + this.isHit);

    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 64);
    this.x -= this.game.gameSpeed  * this.game.clockTick;
    Entity.prototype.update.call(this);
}

SloMoPowerup.prototype.draw = function (ctx) {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + 64, this.y, 64, 192);
    }
    Entity.prototype.draw.call(this);
}

function GodModePowerup(game, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/powerup_boost.png"), 0, 0, 64, 64, 0.2, 8, true, false);
    this.startX = x;
    this.startY = y;
    this.isHit = false;
    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 64);
    Entity.call(this, game, x , y);
}

GodModePowerup.prototype = new Entity();
GodModePowerup.prototype.constructor = GodModePowerup;


GodModePowerup.prototype.reset = function() {
    this.x = this.startX;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 64);
}

GodModePowerup.prototype.update = function () {
    if (!this.game.running) {
        return;    
    }

   // console.log("Coin is : " + this.isHit);

    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 64);
    this.x -= this.game.gameSpeed  * this.game.clockTick;
    Entity.prototype.update.call(this);
}

GodModePowerup.prototype.draw = function (ctx) {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + 64, this.y, 64, 192);
    }
    Entity.prototype.draw.call(this);
}


function Wall(game, x, y) {
    //function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    defaultAnimation = new Animation(ASSET_MANAGER.getAsset("./img/wall.png"), 0, 0, 64, 64, 0.5, 2, true, false);
    fallingAnimation = new Animation(ASSET_MANAGER.getAsset("./img/wall_lowered.png"), 0, 0, 64, 64, 0.025, 12, false, false);
    
    this.animation = defaultAnimation;
    this.shot = false;
    this.startX = x;
    this.startY = y;
    this.dead = false;
    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 192);
    Entity.call(this, game, x , y);
}

Wall.prototype = new Entity();
Wall.prototype.constructor = Wall;


Wall.prototype.reset = function() {
    this.x = this.startX;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 192);
    this.shot = false;
    this.dead = false;
    this.animation = defaultAnimation;
    fallingAnimation.elapsedTime = 0;
}

Wall.prototype.update = function () {
    if (this.game.running) { 
        if (this.shot) {
            this.boundingbox = new BoundingBox(0, 0, 0, 0);
        } else {
            this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 192);
        }
        this.x -= this.game.gameSpeed * this.game.clockTick;
        
        
    }
    Entity.prototype.update.call(this);
}

Wall.prototype.draw = function (ctx) {
    if (this.game.running) {
       if (!this.dead) {
            if (this.shot) {
                if (fallingAnimation.isDone()) {
                    fallingAnimation.elapsedTime = 0;
                    this.dead = true;
                    return;
                }
                this.animation = fallingAnimation;
                console.log("falling");
            }
            this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
            //console.log("drawing");
            // ctx.lineWidth = 3;
            // ctx.strokeStyle = "blue";
            // ctx.strokeRect(this.x + 64, this.y, 64, 192);
        
        }
    }
    Entity.prototype.draw.call(this);
}
/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

function createMap(platforms, spikes, blocks, newPlatforms, walls, gameEngine) {

    // let spike;
    // let block;
    // let wall;
    // let newPlatform;

    let spike;
    let start;
    let currentPlatform
    let w;

    w = new Wall(gameEngine, 545, 210);
    gameEngine.addEntity(w);
    walls.push(w);



    //UP STAIRS
    // pf = new Platform(gameEngine, 800, 325, 50, 50, "grey");
    // gameEngine.addEntity(pf);
    // platforms.push(pf);
    // pf = new Platform(gameEngine, 1000, 300, 50, 50, "grey");
    // gameEngine.addEntity(pf);
    // platforms.push(pf);
    // pf = new Platform(gameEngine, 1200, 275, 50, 50, "grey");
    // gameEngine.addEntity(pf);
    // platforms.push(pf);
    // pf = new Platform(gameEngine, 1400, 250, 50, 50, "grey");
    // gameEngine.addEntity(pf);
    // platforms.push(pf);

    blk = new Block(gameEngine, 800, 275);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    blk = new Block(gameEngine, 1000, 250);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    blk = new Block(gameEngine, 1200, 225);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    blk = new Block(gameEngine, 1400, 200);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    /*
    *Spikes in tunnel
    */
   for (var i = 0; i < 4; i++) { 
       spike = new Spike(gameEngine, 1564 + 64 * i, 0);
       gameEngine.addEntity(spike);
       spikes.push(spike);
   }

   blk = new Block(gameEngine, 1938, 72);
   gameEngine.addEntity(blk);
   blocks.push(blk);
   blk = new Block(gameEngine, 2138, 0);
   gameEngine.addEntity(blk);
   blocks.push(blk);

   spk = new Spike(gameEngine, 1938, 136);
   gameEngine.addEntity(spk);
   spikes.push(spk);

   wl = new Wall(gameEngine, 2138, 128);
   gameEngine.addEntity(wl);
   walls.push(wl);
   wl = new Wall(gameEngine, 2138, 308);
   gameEngine.addEntity(wl);
   walls.push(wl);

   
    //Tunnel
    npf = new NewPlatform(gameEngine, 1300, 200);
    gameEngine.addEntity(npf);
    platforms.push(npf);
    npf = new NewPlatform(gameEngine, 1630, 200);
    gameEngine.addEntity(npf);
    platforms.push(npf);
    platforms.push(npf);
    npf = new NewPlatform(gameEngine, 1960, 200);
    gameEngine.addEntity(npf);
    platforms.push(npf);
    // currentPlatform = new Platform(gameEngine, 1600, 0, 900, 50, "grey");
    // gameEngine.addEntity(currentPlatform);
    // platforms.push(currentPlatform);



    /* //UP STAIRS
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

   /*start = 1590;

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
    platforms.push(currentPlatform); */

    /*
    *Spike under stairs
    */

   for (var i = 0; i < 24; i++) {   
       spike = new Spike(gameEngine, 2636 + 64 * i, 300);
       gameEngine.addEntity(spike);
       spikes.push(spike);
   }
    //DOWNSTAIRS
    // currentBlock = new Block(gameEngine, 2450, 200);
    // gameEngine.addEntity(currentBlock);
    // blocks.push(currentBlock);
    currentBlock = new Block(gameEngine, 2650, 200);
    gameEngine.addEntity(currentBlock);
    blocks.push(currentBlock);
    currentBlock = new Block(gameEngine, 2800, 120);
    gameEngine.addEntity(currentBlock);
    blocks.push(currentBlock);
    currentBlock = new Block(gameEngine, 3000, 195);
    gameEngine.addEntity(currentBlock);
    blocks.push(currentBlock);
    currentBlock = new Block(gameEngine, 3200, 180);
    gameEngine.addEntity(currentBlock);
    blocks.push(currentBlock);
    currentBlock = new Block(gameEngine, 3400, 255);
    gameEngine.addEntity(currentBlock);
    blocks.push(currentBlock);

    // spike = new Spike(gameEngine, 2700 , -200 , true);
    // gameEngine.addEntity(spike);
    // spikes.push(spike);
    // spike = new Spike(gameEngine, 2900 , -200 , true);
    // gameEngine.addEntity(spike);
    // spikes.push(spike);
    // spike = new Spike(gameEngine, 3100 , -200 , true);
    // gameEngine.addEntity(spike);
    // spikes.push(spike);

    //UPSTAIRS

    blk = new Block(gameEngine, 3600, 190);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    blk = new Block(gameEngine, 3800, 165);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    blk = new Block(gameEngine, 4000, 140);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    blk = new Block(gameEngine, 4200, 165);
    gameEngine.addEntity(blk);
    blocks.push(blk);

    /*
    for (let i = 0; i < 4; i++) {
        spike = new Spike(gameEngine, 4300, 215 + 50 * i);
        gameEngine.addEntity(spike);
        spikes.push(spike);
    } */

    //TUNNEL
    npf = new NewPlatform(gameEngine, 4150, 190);
    gameEngine.addEntity(npf);
    platforms.push(npf);


    npf = new NewPlatform(gameEngine, 4600, 190);
    gameEngine.addEntity(npf);
    platforms.push(npf);

    npf = new NewPlatform(gameEngine, 5100, 90);
    gameEngine.addEntity(npf);
    platforms.push(npf);

    for(let i = 0; i < 5; i++){


    spike = new Spike(gameEngine, 5620, 30 - 65 * i);
    gameEngine.addEntity(spike);
    spikes.push(spike);



    }


    npf = new NewPlatform(gameEngine, 4900, 250);
    gameEngine.addEntity(npf);
    platforms.push(npf);
    npf = new NewPlatform(gameEngine, 5225, 250);
    gameEngine.addEntity(npf);
    platforms.push(npf);


    for(let i = 0; i < 5; i++){


        spike = new Spike(gameEngine, 5810  + 195 * i, 250);
        gameEngine.addEntity(spike);
        spikes.push(spike);
        spike = new Spike(gameEngine, 5810  + 195 * i, -100);
        gameEngine.addEntity(spike);
        spikes.push(spike);   
        blk = new Block(gameEngine, 5875 + 195 * i, 250);
        gameEngine.addEntity(blk);
        blocks.push(blk);
        blk = new Block(gameEngine, 5940 + 195 * i, 250);
        gameEngine.addEntity(blk);
        blocks.push(blk);

    
    
    
        } 

        for(let i = 0; i < 5; i++){


            spike = new Spike(gameEngine, 6800  + 135 * i, 250);
            gameEngine.addEntity(spike);
            spikes.push(spike);
            spike = new Spike(gameEngine, 6800  + 135 * i, -100);
            gameEngine.addEntity(spike);
            spikes.push(spike);   
            blk = new Block(gameEngine, 6865 + 135 * i, 250);
            gameEngine.addEntity(blk);
            blocks.push(blk);

            
        
        
        
            } 


            blk = new Block(gameEngine, 7470, 250);
            gameEngine.addEntity(blk);
            blocks.push(blk);
            blk = new Block(gameEngine, 7535, 250);
            gameEngine.addEntity(blk);
            blocks.push(blk);


            for(let i = 0; i < 10; i++){

                spike = new Spike(gameEngine, 7600  + 65 * i, 300);
                gameEngine.addEntity(spike);
                spikes.push(spike);
            
                } 



    // blk = new Block(gameEngine, 4500, 40);
    // gameEngine.addEntity(blk);
    // blocks.push(blk);


  
  /*
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
    platforms.push(currentPlatform); */

    // w = new Wall(gameEngine, 5000,-100);
    // gameEngine.addEntity(w);
    // walls.push(w);


    // w = new Wall(gameEngine, 5000,300);
    // gameEngine.addEntity(w);
    // walls.push(w);

    

    //GROUND
    currentPlatform = new Platform(gameEngine, 0, 400, 1000000000000000, 100, "black");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);    


}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/cube_slide.png");
ASSET_MANAGER.queueDownload("./img/cube_jump.png");
ASSET_MANAGER.queueDownload("./img/cube_right_laser.png");
ASSET_MANAGER.queueDownload("./img/laser.png");
ASSET_MANAGER.queueDownload("./img/bg.png");
ASSET_MANAGER.queueDownload("./img/transparent_bg.png");
ASSET_MANAGER.queueDownload("./img/block.png");
ASSET_MANAGER.queueDownload("./img/platform.png");
ASSET_MANAGER.queueDownload("./img/wall.png");
ASSET_MANAGER.queueDownload("./img/wall_lowered.png");
ASSET_MANAGER.queueDownload("./img/spike.png");
ASSET_MANAGER.queueDownload("./img/credits.png");
ASSET_MANAGER.queueDownload("./img/powerup_boost.png");
ASSET_MANAGER.queueDownload("./img/rocketship.png");


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
 
    var blocks = [];
    gameEngine.blocks = blocks;

    var newPlatforms = [];
    gameEngine.newPlatforms = newPlatforms;

    var walls = [];
    gameEngine.walls = walls;

    var speedPowerups = [];
    gameEngine.speedPowerups = speedPowerups;

    var sloMoPowerups = [];
    gameEngine.sloMoPowerups = sloMoPowerups;

    var godModePowerups = [];
    gameEngine.godModePowerups = godModePowerups;


    gameEngine.addEntity(new RocketShip(gameEngine, 8500, -100));

    gameEngine.init(ctx);
    gameEngine.start();
    let timer = new VisibleTimer(gameEngine);
    let pg = new PlayGame(gameEngine, 320, 350);
    gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/bg.png")));
    //gameEngine.addEntity(new Foreground(gameEngine, ASSET_MANAGER.getAsset("./img/transparent_bg.png")));
    


    let speedPowerup = new SpeedPowerup(gameEngine, 7500, 190);
    gameEngine.addEntity(speedPowerup);
    speedPowerups.push(speedPowerup);

    let sloMoPowerup = new SloMoPowerup(gameEngine, 750, 190);
    gameEngine.addEntity(sloMoPowerup);
    sloMoPowerups.push(sloMoPowerup);

    let godModePowerup = new GodModePowerup(gameEngine, 7500, 190);
    gameEngine.addEntity(godModePowerup);
    godModePowerups.push(godModePowerup);

    createMap(platforms, spikes, blocks, newPlatforms, walls, gameEngine);


    gameEngine.addEntity(new Character(gameEngine)); 
    // gameEngine.addEntity(new Laser(gameEngine)); 
    /*createMap(platforms, spikes, gameEngine);


    gameEngine.addEntity(new Character(gameEngine)); 
    gameEngine.addEntity(new Spike(gameEngine)); */

    gameEngine.addEntity(new Credits(gameEngine));
 //   gameEngine.addEntity(new HandleClicks(gameEngine));
 //   gameEngine.addEntity(new HighlightSelection(gameEngine));
 //   gameEngine.mainmenu = true;
    gameEngine.addEntity(timer);
    gameEngine.addEntity(pg);
});