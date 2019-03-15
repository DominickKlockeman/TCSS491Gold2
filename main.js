//
//  ADD FIELD TO EVERY ENTITY TO ONLY DISPLAY WHEN GAME.LEVEL1 IS CALLED. ADD FIELD IN GAME ENGINE
//  THAT HANDLES WHICH ONE. SO WHEN THAT MENU ITEM IS CLICKED. SEND GAMEENGINE.MAP TO 1, 2, OR 3.
//  THEN IN EACH ENTITY'S DRAW, DO, (GAME.RUNNING && THIS.MAPNUM == GAME.MAPNUM). IN EACH CREATE MAP
//  FUNCTION ADD EACH NUMBER THAT CORRESPONDS TO EACH MAP. SO WHENEVER A NEW ENTITY CALLED, SET THAT 
//  ENTITY'S MAP FIELD. SHOULD WORK. GOOD JOB DOMI.
//
/////////////////////////////////////////

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


HandleClicks = function(ctx, game, startX, endX, startY, endY, func) {
    if(game.click != null && game.click.x >= startX &&
        game.click.x <= endX && game.click.y >= startY &&
        game.click.y <= endY) {
            playSound();
            game.song.play();
            game.inmenus = true;
            if(func == "single"){
                game.levelselection = true;
                game.mainmenu = false;
            } else if(func == "multi") {
                // game.inmenus = false;
                // game.actualTime.gameTime = 0;
                // game.multi = true;
                // game.mainmenu = false;
            } else if(func == "naked") {
                game.naked = true; 
                game.levelselection = true;
                game.mainmenu = false;
            } else if(func == "controls") {
                game.controls = true;
                game.mainmenu = false;
            } else if(func == "credits") {
                game.credits = true; 
                game.mainmenu = false;
            } else if(func == "credits back") {
                game.song.pause();
                game.song = menuBackgroundSound;
                game.credits = false;
                game.controls = false;
                game.leaderboard = false;
                game.naked = false;
                game.inmenus = true;
                game.mainmenu = true; 
                game.running = false;
                game.alive = true;
                game.reset(0);
                game.character.y = 270;
                game.character.cpY = 270;
                game.character.cpX = 0;
                game.firstCp = false;
            } else if(func == "leaderboard") {
                game.leaderboard = true; 
                game.mainmenu = false;
            } else if(func == "end game main menu") {
                game.song.pause();
                game.alive = true;
                game.song = menuBackgroundSound;
                game.credits = false;
                game.controls = false;
                game.leaderboard = false;
                game.naked = false;
                game.inmenus = true;
                game.mainmenu = true; 
                game.finishLevel = false;
                game.reset(0);
                game.character.y = 270;
                game.character.cpY = 270;
                game.character.cpX = 0;
                game.firstCp = false;
            } else if(func == "map 1") {
                SelectMap(game, 1);
            } else if(func == "map 2") {
                SelectMap(game, 2);
            } else if(func == "map 3") {
                SelectMap(game, 3);
            } 
        }
}

/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

SelectMap = function(game, map) {
    if(map == 1) {
        game.blocks = game.blocks1;
        game.spikes = game.spikes1;
        game.walls = game.walls1;
        game.newPlatforms = game.newPlatforms1;
        game.platforms = game.platforms1;
        if(game.naked) {
            var blank1 = [];
            var blank2 = [];
            var blank3 = [];
            game.sloMoPowerups = blank1;
            game.speedPowerups = blank2; 
            game.godModePowerups = blank3;
        } else {
            game.speedPowerups = game.speedPowerups1;
            game.sloMoPowerups = game.sloMoPowerups1;
            game.godModePowerups = game.godModePowerups1;
        }
        game.finishLines = game.finishLines1;
        game.checkpoints = game.checkpoints1;
        game.character.platform = game.platforms1[0];
        game.map = 1;

    } else if(map == 2) {
        game.blocks = game.blocks2;
        game.spikes = game.spikes2;
        game.walls = game.walls2;
        game.newPlatforms = game.newPlatforms2;
        game.platforms = game.platforms2;
        if(game.naked) {
            var blank1 = [];
            var blank2 = [];
            var blank3 = [];
            game.sloMoPowerups = blank1;
            game.speedPowerups = blank2; 
            game.godModePowerups = blank3;
        } else {
            game.speedPowerups = game.speedPowerups2;
            game.sloMoPowerups = game.sloMoPowerups2;
            game.godModePowerups = game.godModePowerups2;
        }
        
        game.finishLines = game.finishLines2;
        game.checkpoints = game.checkpoints2;
        game.character.platform = game.platforms2[0];
        game.map = 2;

    } else if(map == 3) {
        game.blocks = game.blocks3;
        game.spikes = game.spikes3;
        game.walls = game.walls3;
        game.newPlatforms = game.newPlatforms3;
        game.platforms = game.platforms3;
        if(game.naked) {
            var blank1 = [];
            var blank2 = [];
            var blank3 = [];
            game.sloMoPowerups = blank1;
            game.speedPowerups = blank2; 
            game.godModePowerups = blank3;
        } else {
            game.speedPowerups = game.speedPowerups3;
            game.sloMoPowerups = game.sloMoPowerups3;
            game.godModePowerups = game.godModePowerups3;
        }
        
        game.finishLines = game.finishLines3;
        game.checkpoints = game.checkpoints3;
        game.character.platform = game.platforms3[0];
        game.map = 3;

    }
    game.canbepaused = true;
    game.song.pause();
    game.inmenus = false;
    game.running = true;
    game.song = gameBackgroundSound;
    game.actualTime.gameTime = 0;
    game.finishLevel = false;
    game.levelselection = false;

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

            } else if(func == "map 1") {
                ctx.fillText("Level 1", 350, 200);

            } else if(func == "map 2") {
                ctx.fillText("Level 2", 350, 250);

            } else if(func == "map 3") {
                ctx.fillText("Level 3", 350, 300);
            }
        }
}

ReturnToMainMenu = function(ctx, game) {
    ctx.font = "25pt Impact";
    ctx.fillText("Return to Main Menu", 480, 480);
    HandleClicks(ctx, game, 480, 760, 455, 485, "credits back");
    HighlightSelection(ctx, game, 480, 760, 455, 485, "credits back");
} 

function HandleMainMenuClicks(ctx, game) {
    HandleClicks(ctx, game, 300, 519, 115, 151, "single");
    HandleClicks(ctx, game, 310, 508, 170, 204, "multi");
    HandleClicks(ctx, game, 350, 454, 220, 251, "naked");
    HandleClicks(ctx, game, 330, 471, 273, 304, "controls");
    HandleClicks(ctx, game, 340, 461, 371, 405, "credits");
    HandleClicks(ctx, game, 302, 508, 321, 351, "leaderboard");
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

function DisplayVolume(ctx, game) {
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
    ctx.fillText("W:  Jump", 325, 70);
    ctx.fillText("P : Pause", 325, 120);
    ctx.fillText("Space: Laser", 295, 170);
    ctx.fillText("Select bars to adjust volume", 180, 220);
    ctx.fillText("Select volume to mute", 225, 270);
    ctx.fillText("Avoid spikes", 295, 320);
    ctx.fillText("Shoot down walls with laser", 175, 370);
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
    if(this.game.finishLevel) {
        this.game.running = false;

    }
}
PlayGame.prototype.update = function () {
    
}

PlayGame.prototype.draw = function (ctx) {
    this.game.song.pause();
    ctx.font = "30pt Impact";
    ctx.fillStyle = "yellow";
    DisplayVolume(ctx, this.game);
    this.game.song.play();
    if (!this.game.running) {
        ctx.fillStyle = "yellow";
        if(this.game.finishLevel) {
            this.game.canbepaused = false;
            ctx.fillText("You Win!", 330, 200);
            ctx.fillText("Return to Main Menu", 250, 300);
            HandleClicks(ctx, this.game, 253, 587, 270, 302, "end game main menu");
            HighlightSelection(ctx, this.game, 253, 587, 270, 302, "end game main menu");
            
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
            displayControls(ctx);
            ReturnToMainMenu(ctx, this.game);
        }  else if(this.game.leaderboard) {
            ctx.fillText("Dominick       20.001", 250, 100);
            ctx.fillText("Allen                 18.345", 250, 150);
            ctx.fillText("Giovanni         15.790", 250, 200);
            ctx.fillText("Andrew             2.999", 250, 250);
            ReturnToMainMenu(ctx, this.game);
        } else if(this.game.levelselection) {
            ctx.fillText("Level 1", 350, 200);
            ctx.fillText("Level 2", 350, 250);
            ctx.fillText("Level 3", 350, 300);
            HandleClicks(ctx, this.game, 353, 459, 172, 205, "map 1");
            HandleClicks(ctx, this.game, 353, 459, 222, 255, "map 2");
            HandleClicks(ctx, this.game, 353, 459, 272, 305, "map 3");
            HighlightSelection(ctx, this.game, 353, 459, 172, 205, "map 1");
            HighlightSelection(ctx, this.game, 353, 459, 222, 255, "map 2");
            HighlightSelection(ctx, this.game, 353, 459, 272, 305, "map 3");
            ctx.fillStyle = "yellow";
            ReturnToMainMenu(ctx, this.game);
        }
    } else {
        ctx.fillStyle = "yellow";
        ReturnToMainMenu(ctx, this.game);
    }
}

/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

function Character(game) {
    cubeSlideBeginning = new Animation(ASSET_MANAGER.getAsset("./img/cube_slide.png"), 0, 0, 64, 64, 0.10, 15, true, false);
    cubeSlideBeginningUD = new Animation(ASSET_MANAGER.getAsset("./img/cube_slideUD.png"), 0, 0, 64, 64, 0.10, 14, true, false);


    cubeLaser = new Animation(ASSET_MANAGER.getAsset("./img/cube_right_laser.png"), 0, 0, 64, 64, 0.08, 8, true, false);
    this.laser = new Laser(game, this);
    game.addEntity(this.laser);

    this.animation = cubeSlideBeginning;
    this.animation2 = cubeSlideBeginningUD;

    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/cube_jump.png"), 0, 0, 64, 64, 0.08, 8, false, false);
    this.fallUpsideDownAnimation = new Animation(ASSET_MANAGER.getAsset("./img/cube_fall.png"), 0, 0, 64, 64, 0.06, 5, false, false);
    this.jumping = false;
    this.falling = false;
    this.upsideDown = false;
    this.upsideDownCheckPoint = 0;
    this.dead = false;
    this.height = 0;
    this.cpY = 270;
    this.cpX = 0;
    game.alive = !this.dead;
    this.ground = 350;
    this.platform = game.platforms[0];
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
    Entity.call(this, game, 32,270);
}

Character.prototype = new Entity();
Character.prototype.constructor = Character;

Character.prototype.update = function () {
    if (this.game.running) {
        if (this.dead) {
            this.game.alive = false; 
            this.game.reset(this.cpX);
            return;
        }
        if (this.game.w && !this.falling && !this.jumping) {
            this.jumping = true;
            this.ground = this.y;            
        }
        if (this.game.space && !this.jumping && !this.falling) {
            for (let i = 0; i < this.game.walls.length; i++) {
                let wl = this.game.walls[i];
                if (this.laser.boundingbox.collide(wl.boundingbox)) {
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
                    this.jumping = false;
                    this.y = currentNewPlatform.boundingbox.top - this.animation.frameHeight - 65;
                    this.platform = currentNewPlatform;
                    this.jumpAnimation.elapsedTime = 0;
                }  
            }               
        }
        if (this.falling) {
            this.lastBottom = this.boundingbox.bottom;
            this.y += 15;
            this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
        
            for (let i = 0; i < this.game.platforms.length; i++) {
                let pf = this.game.platforms[i];
                if (this.boundingbox.collide(pf.boundingbox) 
                && this.lastBottom <= pf.boundingbox.top) {
                    this.falling = false;
                    this.y = pf.boundingbox.top - this.animation.frameHeight - 65;
                    this.platform = pf;
                }
            }
            for (let i = 0; i < this.game.blocks.length; i++) {
                let blk = this.game.blocks[i];
                if (this.boundingbox.collide(blk.boundingbox) 
                && this.lastBottom <= blk.boundingbox.top) {
                    this.falling = false;
                    this.y = blk.boundingbox.top - this.animation.frameHeight - 65;
                    this.platform = blk;
                }
            }
            for (let i = 0; i < this.game.newPlatforms.length; i++) {
                let npf = this.game.newPlatforms[i];
                if (this.boundingbox.collide(npf.boundingbox) 
                && this.lastBottom <= npf.boundingbox.top) {
                    this.falling = false;
                    this.y = npf.boundingbox.top - this.animation.frameHeight - 65;
                    this.platform = npf;
                }
            }

        }

        if (!this.jumping && !this.falling) {
            this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
            if (this.boundingbox.left > this.platform.boundingbox.right) {
                this.falling = true;            }
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
                    this.dead = true;
                }
            }

            for (let i = 0; i < this.game.blocks.length; i++) {
                let blk = this.game.blocks[i];
                if (this.boundingbox.collide(blk.boundingbox)) {
                    this.dead = true;
                }
            }

            for (let i = 0; i < this.game.newPlatforms.length; i++) {
                let npf = this.game.newPlatforms[i];
                if (this.boundingbox.collide(npf.boundingbox)) {
                    this.dead = true;
                }
            }

            for (let i = 0; i < this.game.walls.length; i++) {
                let wl = this.game.walls[i];
                if (this.boundingbox.collide(wl.boundingbox)) {
                    this.dead = true;
                }
            }

            for (let i = 0; i < this.game.bosss.length; i++) {
                let wl = this.game.bosss[i];
                if (this.boundingbox.collide(wl.boundingbox)) {
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

        for (let i = 0; i < this.game.checkpoints.length; i++) {
            let cp = this.game.checkpoints[i];
            if (this.boundingbox.collide(cp.boundingbox)) {
                cp.animation = cp.activatedCp;
                this.cpX = cp.startX;
                this.cpY = cp.startY;
            }
        }

        for (let i = 0; i < this.game.finishLines.length; i++) {
            let fl = this.game.finishLines[i];
            if (this.boundingbox.collide(fl.boundingbox)) {
                for (let j = 0; j < this.game.checkpoints.length; j++) {
                    let cp = this.game.checkpoints[j]
                    cp.animation = cp.unactivatedCp;
                }
                this.cpX = 0;
                this.cpY = 310;
                this.game.finishLevel = true;
                this.dead = true;
            }
        }

        this.upsideDownCheckPoint += 1;
        console.log(this.upsideDownCheckPoint);

        if(this.upsideDownCheckPoint >= 190){

            this.upsideDown = true;

            if(this.y >= -50){

                this.y -= 15;
            }
            
        }

        


    }
    Entity.prototype.update.call(this);
}

Character.prototype.draw = function (ctx) {
    if (this.game.running) {
        if (this.dead) {
            return;

        } else {

            if (this.upsideDown){

                if (this.jumping) {
                    // this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
                } else {
                    if (this.game.space) {
                        // this.animation = cubeLaser;
                        // this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
                        // this.laser.animation.drawFrame(this.game.clockTick, ctx, 136, this.y - 20, 4);
                        
                    } else {
                        this.animation2 = cubeSlideBeginningUD;
                        this.animation2.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
                    }

                }

            
                }else{


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
        }

        Entity.prototype.draw.call(this);
    }
}
Character.prototype.reset = function() {
    this.dead = false;
    this.ground = 350;
    this.jumping = false;
    this.falling = true;
    this.upsideDown = false;
    this.upsideDownCheckPoint = 0;
    this.animation = cubeSlideBeginning;
    this.jumpAnimation.elapsedTime = 0;
    this.x = 32;
    if (this.cpX) {
        this.y = this.cpY + 50;
    } else {
        this.y = 270;
    }
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
}

function Laser(game, cube) {
    laser = new Animation(ASSET_MANAGER.getAsset("./img/laser.png"), 0, 0, 64, 64, .2, 4, true, true);
    this.animation = laser;
    this.cube = cube;
    this.game = game;
    this.boundingbox = new BoundingBox(136, this.cube.y + 90, 64 * 4, 32);
    Entity.call(this, game, 0, 0);
}

Laser.prototype = new Entity();
Laser.prototype.constructor = Laser;

Laser.prototype.update = function () {
    this.boundingbox = new BoundingBox(136, this.cube.y + 90, 64 * 4, 32);
    Entity.prototype.update.call(this);
}

Laser.prototype.draw = function (ctx) {
    if (this.game.running) {
        if (this.cube.dead) {
            return
        }

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
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
}
/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

function Spike(game, x, y, map) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/spike.png"), 0, 0, 64, 64, 0.5, 2, true, false);
    this.startX = x;
    this.startY = y;
    this.map = map;
    this.boundingbox = new BoundingBox(this.x, this.y, 64, 64);
    Entity.call(this, game, x , y);
}

Spike.prototype = new Entity();
Spike.prototype.constructor = Spike;


Spike.prototype.reset = function(cpX) {
    this.x = this.startX - cpX + 32;
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
    if (this.game.running && (this.map == this.game.map)) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
    }
    Entity.prototype.draw.call(this);
}

function Block(game, x, y, map) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/block.png"), 0, 0, 64, 64, 0.5, 2, true, false);
    this.startX = x;
    this.startY = y;
    this.map = map;
    this.boundingbox = new BoundingBox(this.x, this.y, 64, 64);
    Entity.call(this, game, x , y);
}

Block.prototype = new Entity();
Block.prototype.constructor = Block;


Block.prototype.reset = function(cpX) {
    this.x = this.startX - cpX + 32;
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
    if (this.game.running && (this.map == this.game.map)) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
    }
    Entity.prototype.draw.call(this);
}

function NewPlatform(game, x, y, map) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/platform.png"), 0, 0, 320, 64, 0.5, 2, true, false);
    this.startX = x;
    this.startY = y;
    this.map = map;
    this.boundingbox = new BoundingBox(this.x + 314, this.y, 330, 64);
    Entity.call(this, game, x , y);
}

NewPlatform.prototype = new Entity();
NewPlatform.prototype.constructor = NewPlatform;


NewPlatform.prototype.reset = function(cpX) {
    this.x = this.startX - cpX + 32;
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
    if (this.game.running && (this.map == this.game.map)) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);

    }
    Entity.prototype.draw.call(this);
}

function SpeedPowerup(game, x, y, map) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/powerup_boost.png"), 0, 0, 64, 64, 0.2, 8, true, false);
    this.startX = x;
    this.startY = y;
    this.map = map;
    this.isHit = false;
    this.boundingbox = new BoundingBox(this.x, this.y, 64, 64);
    Entity.call(this, game, x , y);
}

SpeedPowerup.prototype = new Entity();
SpeedPowerup.prototype.constructor = SpeedPowerup;


SpeedPowerup.prototype.reset = function(cpX) {
    this.x = this.startX - cpX + 32;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
}

SpeedPowerup.prototype.update = function () {
    if (!this.game.running) {
        return;    
    }

    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 64);
    this.x -= this.game.gameSpeed  * this.game.clockTick;
    Entity.prototype.update.call(this);
}

SpeedPowerup.prototype.draw = function (ctx) {
    if (this.game.running && !this.game.naked && (this.map == this.game.map) && !this.game.speedUp) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
    }
    Entity.prototype.draw.call(this);
}

function SloMoPowerup(game, x, y, map) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/slow.png"), 0, 0, 64, 64, 0.2, 8, true, false);
    this.startX = x;
    this.startY = y;
    this.map = map;
    this.isHit = false;
    this.boundingbox = new BoundingBox(this.x, this.y, 64, 64);
    Entity.call(this, game, x , y);
}

SloMoPowerup.prototype = new Entity();
SloMoPowerup.prototype.constructor = SloMoPowerup;


SloMoPowerup.prototype.reset = function(cpX) {
    this.x = this.startX - cpX + 32;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
}

SloMoPowerup.prototype.update = function () {
    if (!this.game.running) {
        return;    
    }

    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
    this.x -= this.game.gameSpeed  * this.game.clockTick;
    Entity.prototype.update.call(this);
}

SloMoPowerup.prototype.draw = function (ctx) {
    if (this.game.running && !this.game.naked && (this.map == this.game.map) && !this.game.sloMo) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
    }
    Entity.prototype.draw.call(this);
}

function GodModePowerup(game, x, y, map) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/god.png"), 0, 0, 64, 64, 0.2, 8, true, false);
    this.startX = x;
    this.startY = y;
    this.map = map;
    this.isHit = false;
    this.boundingbox = new BoundingBox(this.x, this.y, 64, 64);
    Entity.call(this, game, x , y);
}

GodModePowerup.prototype = new Entity();
GodModePowerup.prototype.constructor = GodModePowerup;


GodModePowerup.prototype.reset = function(cpX) {
    this.x = this.startX - cpX + 32;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
}

GodModePowerup.prototype.update = function () {
    if (!this.game.running) {
        return;    
    }

    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
    this.x -= this.game.gameSpeed  * this.game.clockTick;
    Entity.prototype.update.call(this);
}

GodModePowerup.prototype.draw = function (ctx) {
    if (this.game.running && !this.game.naked && (this.map == this.game.map) && !this.game.godMode) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
    }
    Entity.prototype.draw.call(this);
}


function Wall(game, x, y, map) {
    defaultAnimation = new Animation(ASSET_MANAGER.getAsset("./img/wall.png"), 0, 0, 64, 64, 0.5, 2, true, false);
    fallingAnimation = new Animation(ASSET_MANAGER.getAsset("./img/wall_lowered.png"), 0, 0, 64, 64, 0.025, 12, false, false);
    
    this.animation = defaultAnimation;
    this.shot = false;
    this.startX = x;
    this.startY = y;
    this.map = map;
    this.dead = false;
    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 192);
    Entity.call(this, game, x , y);
}

Wall.prototype = new Entity();
Wall.prototype.constructor = Wall;


Wall.prototype.reset = function(cpX) {
    this.x = this.startX - cpX + 32;
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
    if (this.game.running && (this.map == this.game.map)) {
       if (!this.dead) {
            if (this.shot) {
                if (fallingAnimation.isDone()) {
                    fallingAnimation.elapsedTime = 0;
                    this.dead = true;
                    return;
                }
                this.animation = fallingAnimation;

            }
            this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
        
        }
    }
    Entity.prototype.draw.call(this);
}

/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

function Checkpoint(game, x, y, map) {
    this.unactivatedCp = new Animation(ASSET_MANAGER.getAsset("./img/checkpoint.png"), 0, 0, 64, 64, 0.5, 2, true, false);
    this.activatedCp = new Animation(ASSET_MANAGER.getAsset("./img/checkpoint_activated.png"), 0, 0, 64, 64, 0.5, 2, true, false); 
    this.animation = this.unactivatedCp;
    this.startX = x;
    this.startY = y;
    this.map = map;
    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 192);
    Entity.call(this, game, x, y);
}

Checkpoint.prototype = new Entity();
Checkpoint.prototype.constructor = Checkpoint;

Checkpoint.prototype.reset = function (cpX) {
    this.x = this.startX - cpX + 32;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 192);
}

Checkpoint.prototype.update = function () {
    if (!this.game.running || this.boundingbox.right < 0) {
        return;
    }
    if (this.game.checkpoints[0] == this) {
        this.game.firstCp = true;
    }
    this.boundingbox = new BoundingBox(this.x + 64, -1000, 64, 2000); 
    this.x -= this.game.gameSpeed * this.game.clockTick;
    Entity.prototype.update.call(this);
}

Checkpoint.prototype.draw = function (ctx) {
    if (this.game.running && (this.map == this.game.map)) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
    }
    Entity.prototype.draw.call(this);
}

function FinishLine(game, x, y, map) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/finish_line.png"), 0, 0, 64, 64, 0.5, 2, true, false); 
    this.startX = x;
    this.startY = y;
    this.map = map;
    this.boundingbox = new BoundingBox(this.x + 400, this.y, 64, 500);
    Entity.call(this, game, x, y);
}

FinishLine.prototype = new Entity();
FinishLine.prototype.constructor = FinishLine;

FinishLine.prototype.reset = function (cpX) {
    this.x = this.startX - cpX + 32;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x + 400, -1000, 64, 2000);
}

FinishLine.prototype.update = function () {
    if (!this.game.running || this.boundingbox.right < 0) {
        return;
    }
    this.boundingbox = new BoundingBox(this.x + 400, this.y, 64, 500); 
    this.x -= this.game.gameSpeed * this.game.clockTick;
    Entity.prototype.update.call(this);
}

FinishLine.prototype.draw = function (ctx) {
    if (this.game.running && (this.map == this.game.map)) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 10);
    }
    Entity.prototype.draw.call(this);
}

function Boss(game, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/bossUD.png"), 0, 0, 60, 89, .20, 2, true, false);
    this.startX = x;
    this.startY = y;
    this.boundingbox = new BoundingBox(this.x + 60, this.y + 89, 60, 89);
    Entity.call(this, game, x, y);
}

Boss.prototype = new Entity();
Boss.prototype.constructor = Boss;


Boss.prototype.reset = function() {
    this.x = this.startX;
    this.y = this.startY;
}

Boss.prototype.update = function () {
    if (!this.game.running) {
        return;    
    }
    this.boundingbox = new BoundingBox(this.x + 60, this.y + 89, 60, 89);
    this.x += 200 * this.game.clockTick;
    Entity.prototype.update.call(this);
}

Boss.prototype.draw = function (ctx) {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
        ctx.lineWidth = 3;
        ctx.strokeStyle = "blue";
        ctx.strokeRect(this.x + 60, this.y + 89, 60,89);
    }
    Entity.prototype.draw.call(this);
}

/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

function createMap1(platforms, spikes, blocks, newPlatforms, walls, checkpoints, finishLines, speedPowerups, sloMoPowerups, godModePowerups, gameEngine) {
    let platform, spike, block, newPlatform, wall, checkPoint, finishLine, speedPowerup, sloMoPowerup, godModePowerup;
    
    //GROUND
    platform = new Platform(gameEngine, 0, 400, 1000000000, 100, "black");
    gameEngine.addEntity(platform);
    platforms.push(platform);    

    block = new Block(gameEngine, 450, 275, 1);
    gameEngine.addEntity(block);
    blocks.push(block);

    block = new Block(gameEngine, 750, 275, 1);
    gameEngine.addEntity(block);
    blocks.push(block);
    block = new Block(gameEngine, 814, 275, 1);
    gameEngine.addEntity(block);
    blocks.push(block);

    checkPoint = new Checkpoint(gameEngine, 930, 210, 1);
    gameEngine.addEntity(checkPoint);
    checkpoints.push(checkPoint);

    speedPowerup = new SpeedPowerup(gameEngine, 1100, 275, 1);
    gameEngine.addEntity(speedPowerup);
    speedPowerups.push(speedPowerup);

    spike = new Spike(gameEngine, 1700, 275, 1);
    gameEngine.addEntity(spike);
    spikes.push(spike);

    //UPSTAIRS
    block = new Block(gameEngine, 2500, 275, 1);
    gameEngine.addEntity(block);
    blocks.push(block);
    block = new Block(gameEngine, 2650, 190, 1);
    gameEngine.addEntity(block);
    blocks.push(block);
    block = new Block(gameEngine, 2850, 165, 1);
    gameEngine.addEntity(block);
    blocks.push(block);
    block = new Block(gameEngine, 3050, 140, 1);
    gameEngine.addEntity(block);
    blocks.push(block);
    block = new Block(gameEngine, 3250, 165, 1);
    gameEngine.addEntity(block);
    blocks.push(block);

    //Sky bridge
    newPlatform = new NewPlatform(gameEngine, 3200, 190, 1);
    gameEngine.addEntity(newPlatform);
    newPlatforms.push(newPlatform);
    newPlatform = new NewPlatform(gameEngine, 3650, 190, 1);
    gameEngine.addEntity(newPlatform);
    newPlatforms.push(newPlatform);

    godModePowerup = new GodModePowerup(gameEngine, 4800, 275, 1);
    gameEngine.addEntity(godModePowerup);
    godModePowerups.push(godModePowerup);

    spike = new Spike(gameEngine, 5000, 275, 1);
    gameEngine.addEntity(spike);
    spikes.push(spike);
    spike = new Spike(gameEngine, 5064, 275, 1);
    gameEngine.addEntity(spike);
    spikes.push(spike);
    spike = new Spike(gameEngine, 5128, 275), 1;
    gameEngine.addEntity(spike);
    spikes.push(spike);
    spike = new Spike(gameEngine, 5192, 275, 1);
    gameEngine.addEntity(spike);
    spikes.push(spike);
    spike = new Spike(gameEngine, 5256, 275, 1);
    gameEngine.addEntity(spike);
    spikes.push(spike);
    spike = new Spike(gameEngine, 5320, 275), 1;
    gameEngine.addEntity(spike);
    spikes.push(spike);
    spike = new Spike(gameEngine, 5384, 275, 1);
    gameEngine.addEntity(spike);
    spikes.push(spike);
    spike = new Spike(gameEngine, 5448, 275, 1);
    gameEngine.addEntity(spike);
    spikes.push(spike);
    spike = new Spike(gameEngine, 5512, 275, 1);
    gameEngine.addEntity(spike);
    spikes.push(spike);
    spike = new Spike(gameEngine, 5576, 275, 1);
    gameEngine.addEntity(spike);
    spikes.push(spike);
    spike = new Spike(gameEngine, 5640, 275, 1);
    gameEngine.addEntity(spike);
    spikes.push(spike);

    block = new Block(gameEngine, 6200, 275, 1);
    gameEngine.addEntity(block);
    blocks.push(block);

    checkPoint = new Checkpoint(gameEngine, 6500, 210, 1);
    gameEngine.addEntity(checkPoint);
    checkpoints.push(checkPoint);

    wall = new Wall(gameEngine, 6900, 210, 1);
    gameEngine.addEntity(wall);
    walls.push(wall);

    sloMoPowerup = new SloMoPowerup(gameEngine, 7200, 275, 1);
    gameEngine.addEntity(sloMoPowerup);
    sloMoPowerups.push(sloMoPowerup);

    wall = new Wall(gameEngine, 7400, 210, 1);
    gameEngine.addEntity(wall);
    walls.push(wall);

    wall = new Wall(gameEngine, 7800, 210, 1);
    gameEngine.addEntity(wall);
    walls.push(wall);

    finishLine = new FinishLine(gameEngine, 8300, 100, 1);
    gameEngine.addEntity(finishLine);
    finishLines.push(finishLine);
}




/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/


function createMap2(platforms, spikes, blocks, newPlatforms, walls, checkpoints, finishLines, speedPowerups, sloMoPowerups, godModePowerups, gameEngine) {


    w = new Wall(gameEngine, 530, 210, 2);
    gameEngine.addEntity(w);
    walls.push(w);


    // STAIRS 
    blk = new Block(gameEngine, 800, 275, 2);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    blk = new Block(gameEngine, 1000, 250, 2);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    blk = new Block(gameEngine, 1200, 225, 2);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    blk = new Block(gameEngine, 1400, 200, 2);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    /*
    *Spikes in tunnel
    */
    for (var i = 0; i < 4; i++) { 
        spike = new Spike(gameEngine, 1564 + 64 * i, 0, 2);
        gameEngine.addEntity(spike);
        spikes.push(spike);
    }

    blk = new Block(gameEngine, 1938, 72, 2);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    blk = new Block(gameEngine, 2138, 0, 2);
    gameEngine.addEntity(blk);
    blocks.push(blk);

    spk = new Spike(gameEngine, 1938, 136, 2);
    gameEngine.addEntity(spk);
    spikes.push(spk);

    wl = new Wall(gameEngine, 2138, 128, 2);
    gameEngine.addEntity(wl);
    walls.push(wl);
    wl = new Wall(gameEngine, 2138, 308, 2);
    gameEngine.addEntity(wl);
    walls.push(wl);

    cp = new Checkpoint(gameEngine, 2138, -128, 2);
    gameEngine.addEntity(cp);
    checkpoints.push(cp);

   
    //Tunnel
    npf = new NewPlatform(gameEngine, 1300, 200, 2);
    gameEngine.addEntity(npf);
    newPlatforms.push(npf);
    npf = new NewPlatform(gameEngine, 1630, 200, 2);
    gameEngine.addEntity(npf);
    newPlatforms.push(npf);
    // platforms.push(npf);
    npf = new NewPlatform(gameEngine, 1960, 200, 2);
    gameEngine.addEntity(npf);
    newPlatforms.push(npf);

    /*
    *Spike under stairs
    */

    for (var i = 0; i < 24; i++) {   
        spike = new Spike(gameEngine, 2636 + 64 * i, 300, 2);
        gameEngine.addEntity(spike);
        spikes.push(spike);
    }

    currentBlock = new Block(gameEngine, 2650, 200, 2);
    gameEngine.addEntity(currentBlock);
    blocks.push(currentBlock);
    currentBlock = new Block(gameEngine, 2800, 120, 2);
    gameEngine.addEntity(currentBlock);
    blocks.push(currentBlock);
    currentBlock = new Block(gameEngine, 3000, 195, 2);
    gameEngine.addEntity(currentBlock);
    blocks.push(currentBlock);
    currentBlock = new Block(gameEngine, 3200, 180, 2);
    gameEngine.addEntity(currentBlock);
    blocks.push(currentBlock);
    currentBlock = new Block(gameEngine, 3400, 255, 2);
    gameEngine.addEntity(currentBlock);
    blocks.push(currentBlock);

    //UPSTAIRS
    blk = new Block(gameEngine, 3600, 190, 2);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    blk = new Block(gameEngine, 3800, 165, 2);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    blk = new Block(gameEngine, 4000, 140, 2);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    blk = new Block(gameEngine, 4200, 165, 2);
    gameEngine.addEntity(blk);
    blocks.push(blk);

    //TUNNEL
    npf = new NewPlatform(gameEngine, 4150, 190, 2);
    gameEngine.addEntity(npf);
    newPlatforms.push(npf);


    npf = new NewPlatform(gameEngine, 4600, 190, 2);
    gameEngine.addEntity(npf);
    newPlatforms.push(npf);

    npf = new NewPlatform(gameEngine, 5100, 90, 2);
    gameEngine.addEntity(npf);
    newPlatforms.push(npf);

    for(let i = 0; i < 5; i++){

        spike = new Spike(gameEngine, 5620, 30 - 65 * i, 2);
        gameEngine.addEntity(spike);
        spikes.push(spike);

    }

    npf = new NewPlatform(gameEngine, 4900, 250, 2);
    gameEngine.addEntity(npf);
    newPlatforms.push(npf);
    npf = new NewPlatform(gameEngine, 5225, 250, 2);
    gameEngine.addEntity(npf);
    newPlatforms.push(npf);


    blk = new Block(gameEngine, 5805, 250, 2);
    gameEngine.addEntity(blk);
    blocks.push(blk);

    for(let i = 0; i < 5; i++){

        spike = new Spike(gameEngine, 5875  + 195 * i, 250, 2);
        gameEngine.addEntity(spike);
        spikes.push(spike);
        spike = new Spike(gameEngine, 5875  + 195 * i, -100, 2);
        gameEngine.addEntity(spike);
        spikes.push(spike);   
        blk = new Block(gameEngine, 5940 + 195 * i, 250, 2);
        gameEngine.addEntity(blk);
        blocks.push(blk);
        blk = new Block(gameEngine, 6000 + 195 * i, 250, 2);
        gameEngine.addEntity(blk);
        blocks.push(blk);

    } 

    for(let i = 0; i < 5; i++){

        spike = new Spike(gameEngine, 6850  + 135 * i, 250, 2);
        gameEngine.addEntity(spike);
        spikes.push(spike);
        spike = new Spike(gameEngine, 6850  + 135 * i, -100, 2);
        gameEngine.addEntity(spike);
        spikes.push(spike);   
        blk = new Block(gameEngine, 6920 + 135 * i, 250, 2);
        gameEngine.addEntity(blk);
        blocks.push(blk);
    
    } 


    blk = new Block(gameEngine, 7525, 250, 2);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    blk = new Block(gameEngine, 7590, 250, 2);
    gameEngine.addEntity(blk);
    blocks.push(blk);


    fl = new FinishLine(gameEngine, 7600, 100, 2);
    gameEngine.addEntity(fl);
    finishLines.push(fl);

    // POWER-UPS 
    // let speedPowerup = new SpeedPowerup(gameEngine, 7500, 190);
    // gameEngine.addEntity(speedPowerup);
    // speedPowerups.push(speedPowerup);

    let sloMoPowerup = new SloMoPowerup(gameEngine, 2200, 270, 2);
    gameEngine.addEntity(sloMoPowerup);
    sloMoPowerups.push(sloMoPowerup);

    let godModePowerup = new GodModePowerup(gameEngine, 5760, 190, 2);
    gameEngine.addEntity(godModePowerup);
    godModePowerups.push(godModePowerup);

    

    //GROUND
    currentPlatform = new Platform(gameEngine, 0, 400, 1000000000, 100, "black");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);    

}


function createMap3(platforms, spikes, blocks, newPlatforms, walls, checkpoints, finishLines, speedPowerups, sloMoPowerups, godModePowerups, bosss, gameEngine) {



    boss = new Boss(gameEngine, 0,-40);
    gameEngine.addEntity(boss);
    bosss.push(boss);

    boss = new Boss(gameEngine, -100,-40);
    gameEngine.addEntity(boss);
    bosss.push(boss);

    boss = new Boss(gameEngine, -200,-40);
    gameEngine.addEntity(boss);
    bosss.push(boss);

    boss = new Boss(gameEngine, -300,-40);
    gameEngine.addEntity(boss);
    bosss.push(boss);

    boss = new Boss(gameEngine, -400,-40);
    gameEngine.addEntity(boss);
    bosss.push(boss);

    boss = new Boss(gameEngine, -500,-40);
    gameEngine.addEntity(boss);
    bosss.push(boss);

    //GROUND
    currentPlatform = new Platform(gameEngine, 0, 400, 1000000000, 100, "black");
    gameEngine.addEntity(currentPlatform);
    platforms.push(currentPlatform);  


}

// the "main" code begins here

var ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./img/cube_slide.png");
ASSET_MANAGER.queueDownload("./img/cube_slideUD.png");
ASSET_MANAGER.queueDownload("./img/cube_jump.png");
ASSET_MANAGER.queueDownload("./img/cube_right_laser.png");
ASSET_MANAGER.queueDownload("./img/cube_fall.png");
ASSET_MANAGER.queueDownload("./img/laser.png");
ASSET_MANAGER.queueDownload("./img/bg.png");
ASSET_MANAGER.queueDownload("./img/transparent_bg.png");
ASSET_MANAGER.queueDownload("./img/block.png");
ASSET_MANAGER.queueDownload("./img/platform.png");
ASSET_MANAGER.queueDownload("./img/wall.png");
ASSET_MANAGER.queueDownload("./img/wall_lowered.png");
ASSET_MANAGER.queueDownload("./img/spike.png");
ASSET_MANAGER.queueDownload("./img/checkpoint.png");
ASSET_MANAGER.queueDownload("./img/checkpoint_activated.png");
ASSET_MANAGER.queueDownload("./img/credits.png");
ASSET_MANAGER.queueDownload("./img/powerup_boost.png");
ASSET_MANAGER.queueDownload("./img/finish_line.png");
ASSET_MANAGER.queueDownload("./img/rocketship.png");
ASSET_MANAGER.queueDownload("./img/slow.png");
ASSET_MANAGER.queueDownload("./img/god.png");
ASSET_MANAGER.queueDownload("./img/bossUD.png");


ASSET_MANAGER.downloadAll(function () {
    var canvas = document.getElementById('gameWorld');
    document.getElementById('gameWorld').focus();
    var ctx = canvas.getContext('2d');

    var gameEngine = new GameEngine();

    gameEngine.init(ctx);
    gameEngine.start();
    let timer = new VisibleTimer(gameEngine);
    let pg = new PlayGame(gameEngine, 320, 350);
    gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/bg.png")));  
    
    
    // Level 1
    var checkpoints1 = [];
    gameEngine.checkpoints1 = checkpoints1;

    var finishLines1 = [];
    gameEngine.finishLines1 = finishLines1;

    var platforms1 = [];
    gameEngine.platforms1 = platforms1;

    var spikes1 = [];
    gameEngine.spikes1 = spikes1;
 
    var blocks1 = [];
    gameEngine.blocks1 = blocks1;

    var newPlatforms1 = [];
    gameEngine.newPlatforms1 = newPlatforms1;

    var walls1 = [];
    gameEngine.walls1 = walls1;

    var speedPowerups1 = [];
    gameEngine.speedPowerups1 = speedPowerups1;

    var sloMoPowerups1 = [];
    gameEngine.sloMoPowerups1 = sloMoPowerups1;

    var godModePowerups1 = [];
    gameEngine.godModePowerups1 = godModePowerups1;

    //createMap1(platforms1, spikes1, blocks1, newPlatforms1, walls1, checkpoints1, finishLines1, gameEngine);

    // Level 2
    var checkpoints2 = [];
    gameEngine.checkpoints2 = checkpoints2;

    var finishLines2 = [];
    gameEngine.finishLines2 = finishLines2;

    var platforms2 = [];
    gameEngine.platforms2 = platforms2;

    var spikes2 = [];
    gameEngine.spikes2 = spikes2;
 
    var blocks2 = [];
    gameEngine.blocks2 = blocks2;

    var newPlatforms2 = [];
    gameEngine.newPlatforms2 = newPlatforms2;

    var walls2 = [];
    gameEngine.walls2 = walls2;

    var speedPowerups2 = [];
    gameEngine.speedPowerups2 = speedPowerups2;

    var sloMoPowerups2 = [];
    gameEngine.sloMoPowerups2 = sloMoPowerups2;

    var godModePowerups2 = [];
    gameEngine.godModePowerups2 = godModePowerups2;

    // Level 3
    var checkpoints3 = [];
    gameEngine.checkpoints3 = checkpoints3;

    var finishLines3 = [];
    gameEngine.finishLines3 = finishLines3;

    var platforms3 = [];
    gameEngine.platforms3 = platforms3;

    var spikes3 = [];
    gameEngine.spikes3 = spikes3;
 
    var blocks3 = [];
    gameEngine.blocks3 = blocks3;

    var newPlatforms3 = [];
    gameEngine.newPlatforms3 = newPlatforms3;

    var walls3 = [];
    gameEngine.walls3 = walls3;

    var speedPowerups3 = [];
    gameEngine.speedPowerups3 = speedPowerups3;

    var sloMoPowerups3 = [];
    gameEngine.sloMoPowerups3 = sloMoPowerups3;

    var godModePowerups3 = [];
    gameEngine.godModePowerups3 = godModePowerups3;

    var boss3 = [];
    gameEngine.boss3 = boss3;

    createMap3(platforms3, spikes3, blocks3, newPlatforms3, walls3, checkpoints3, finishLines3, speedPowerups3, sloMoPowerups3, godModePowerups3, boss3, gameEngine);
    createMap2(platforms2, spikes2, blocks2, newPlatforms2, walls2, checkpoints2, finishLines2, speedPowerups2, sloMoPowerups2, godModePowerups2, gameEngine);
    createMap1(platforms1, spikes1, blocks1, newPlatforms1, walls1, checkpoints1, finishLines1, speedPowerups1, sloMoPowerups1, godModePowerups1, gameEngine);

    gameEngine.blocks = blocks1;
    gameEngine.spikes = spikes1;
    gameEngine.walls = walls1;
    gameEngine.newPlatforms = newPlatforms1;
    gameEngine.platforms = platforms1;
    gameEngine.speedPowerups = speedPowerups1;
    gameEngine.sloMoPowerups = sloMoPowerups1;
    gameEngine.godModePowerups = godModePowerups1;
    gameEngine.finishLines = finishLines1;
    gameEngine.checkpoints = checkpoints1;
    gameEngine.bosss = boss3;

    var char = new Character(gameEngine)

    gameEngine.addEntity(char);
    gameEngine.character = char;
    gameEngine.addEntity(new Credits(gameEngine));
    gameEngine.addEntity(timer);
    gameEngine.addEntity(pg);
});