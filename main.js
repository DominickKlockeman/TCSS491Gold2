
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
};

Foreground.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
        this.x, this.y);
};

Foreground.prototype.update = function () {
    this.x -= 1;
    if (this.x < -800) this.x = 0;
};

Foreground.prototype.reset = function () {};

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


HandleClicks = function (game, startX, endX, startY, endY, func) {
    if (game.click != null && game.click.x >= startX &&
        game.click.x <= endX && game.click.y >= startY &&
        game.click.y <= endY) {
        game.inmenus = true;
        if (func === "single") {
            game.inmenus = false;
            game.running = true;
            game.finishLevel = false;
            game.actualTime.gameTime = 0;
        } else if (func === "multi") {
            game.inmenus = false;
            game.actualTime.gameTime = 0;
            game.multi = true;
            game.mainmenu = false;
        } else if (func === "naked") {
            game.naked = true;
            game.mainmenu = false;
        } else if (func === "controls") {
            game.controls = true;
            game.mainmenu = false;
        } else if (func === "credits") {
            game.credits = true;
            game.mainmenu = false;
        } else if (func === "credits back") {
            game.credits = false;
            game.mainmenu = true;
        } else if (func === "dead") {
            game.endscreen = true;
        } else if (func === "leaderboard") {
            game.leaderboard = true;
            game.mainmenu = false;
        } else if (func === "end game main menu") {
            game.alive = true;
            game.mainmenu = true;
        }
    }
}

/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/


HighlightSelection = function (ctx, game, startX, endX, startY, endY, func) {
    if (game.mouse != null && game.mouse.x >= startX && game.mouse.x <= endX &&
        game.mouse.y >= startY && game.mouse.y <= endY) {
        ctx.fillStyle = "white";
        if (func === "single") {
            ctx.fillText("Single Player", 300, 150);
        } else if (func === "multi") {
            ctx.fillText("Multi Player", 310, 200);
        } else if (func === "naked") {
            ctx.fillText("Naked", 350, 250);
        } else if (func === "controls") {
            ctx.fillText("Controls", 330, 300);
        } else if (func === "credits") {
            ctx.fillText("Credits", 340, 400);
        } else if (func === "credits back") {
            ctx.fillText("Return to Main Menu", 480, 480);
        } else if (func === "dead") {
            ctx.fillText("Replay", 346, 250);
        } else if (func === "leaderboard") {
            ctx.fillText("Leaderboard", 300, 350);
        } else if (func === "end game main menu") {
            ctx.fillText("Return to Main Menu", 250, 300);
        }
    }
}

ReturnToMainMenu = function (ctx, game) {
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
    if (this.game.finishLevel) {
        this.game.running = false;
    }   
}
PlayGame.prototype.update = function () {};

PlayGame.prototype.draw = function (ctx) {
    if (!this.game.running) {
        ctx.font = "30pt Impact";
        ctx.fillStyle = "yellow";
        if (!this.game.alive) {
            this.game.canbepaused = false;
            ctx.fillText("You Win!", 330, 200);
            ctx.fillText("Replay", 346, 250);
            ctx.fillText("Return to Main Menu", 250, 300);
            HandleClicks(this.game, 346, 480, 220, 255, "single");
            HighlightSelection(ctx, this.game, 346, 480, 220, 255, "dead");
            HandleClicks(this.game, 253, 587, 270, 302, "end game main menu");
            HighlightSelection(ctx, this.game, 253, 587, 270, 302, "end game main menu");
        } else if (this.game.credits) {
            ReturnToMainMenu(ctx, this.game);
        } else if (this.game.mainmenu) {
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
        } else if (this.game.naked) {
            ReturnToMainMenu(ctx, this.game);
        } else if (this.game.leaderboard) {
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
    cubeSlideBeginning = new Animation(ASSET_MANAGER.getAsset("./img/cube_slide.png"), 0, 0, 64, 64, 0.10, 14, true, false);
    cubeLaser = new Animation(ASSET_MANAGER.getAsset("./img/cube_right_laser.png"), 0, 0, 64, 64, 0.08, 8, true, false);
    this.l = new Laser(this.game);
    this.animation = cubeSlideBeginning;
    this.jumpAnimation = new Animation(ASSET_MANAGER.getAsset("./img/cube_jump.png"), 0, 0, 64, 64, 0.08, 8, false, false);
    this.jumping = false;
    this.falling = false;
    this.dead = false;
    this.height = 0;
    this.cpY = 316;
    game.alive = !this.dead;
    this.ground = 350;
    this.platform = game.platforms[0];
    console.log('CUBE: ' + this.animation.frameWidth, this.animation.frameHeight);
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
    // this.boundingbox = new BoundingBox(this.x + 66, this.y + 66, 60, 60);
    Entity.call(this, game, 32, 270);
}

Character.prototype = new Entity();
Character.prototype.constructor = Character;

Character.prototype.update = function () {
    if (this.game.running) {
        if (this.dead) {
            this.game.alive = false;
            this.game.reset(this.cpX);
            console.log("reset");
            return;
        }
        if (this.game.w && !this.falling && !this.jumping) {
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
            for (let i = 0; i < this.game.platforms.length; i++) {
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
            for (let i = 0; i < this.game.blocks.length; i++) {
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
            for (let i = 0; i < this.game.newPlatforms.length; i++) {
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
            // this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
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
            // this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
            this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
            if (this.boundingbox.left > this.platform.boundingbox.right) {
                this.falling = true;
                console.log("should fall");
            }
        }
        // this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
        this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);

        for (let i = 0; i < this.game.platforms.length; i++) {
            var pf = this.game.platforms[i];
            if (this.boundingbox.collide(pf.boundingbox)) {
                console.log("hit platform")
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
                this.cpX = null;
                this.cpY = 310;
                this.game.finishLevel = true;
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
        } else {
            if (this.jumping) {
                this.jumpAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
            } else {
                if (this.game.space) {
                    // this.animation = cubeLaser;
                    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
                    // this.l.animation.drawFrame(this.game.clockTick, ctx, 136, this.y - 20, 4);
                } else {
                    this.animation = cubeSlideBeginning;
                    this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
                }
            }
        }

        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + 68, this.y + 68, 56, 56);
        // ctx.lineWidth = 1;
    
        ctx.strokeRect(this.l.x + 400, this.l.y - 20, this.l.width, this.l.height);
        // this.boundingbox = new BoundingBox(x, y + 64, this.width, this.height);
        Entity.prototype.draw.call(this);
    }
}
Character.prototype.reset = function () {
    this.dead = false;
    this.ground = 350;
    this.jumping = false;
    this.falling = true;
    this.jumpAnimation.elapsedTime = 0;
    this.x = 32;
    if (this.cpY) {
        this.y = this.cpY + 46;
    } else {
        this.y = 270;
    }
}

function Laser(game, cube) {
    laser = new Animation(ASSET_MANAGER.getAsset("./img/laser.png"), 0, 0, 64, 64, .2, 4, true, true);
    this.animation = laser;
    this.boundingbox = new BoundingBox(this.x, this.y + 64, this.width, this.height);
    Entity.call(this, game, 0, 0);
}

Laser.prototype = new Entity();
Laser.prototype.constructor = Laser;

Laser.prototype.update = function () {
    Entity.prototype.update.call(this);
}

Laser.prototype.draw = function (ctx) {};

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

Credits.prototype.update = function () {
    Entity.prototype.update.call(this);
}

Credits.prototype.draw = function (ctx) {
    if (this.game.credits && !this.game.runnning) {
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
    this.boundingbox = new BoundingBox(x + 64, y + 64, this.width, this.height);
    this.color = color;
    Entity.call(this, game, x, y);
}

Platform.prototype = new Entity();

Platform.prototype.constructor = Platform;

Platform.prototype.reset = function (cpX) {
    this.x = this.startX;
    this.y = this.startY;
}

Platform.prototype.update = function () {
    if (!this.game.running || this.boundingbox.right < 0) {
        return;
    }
    this.x -= 200 * this.game.clockTick;
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
    // this.boundingbox = new BoundingBox(this.x, this.y, 64, 64);
    this.boundingbox = new BoundingBox(this.x + 66, this.y + 66, 60, 60);
    Entity.call(this, game, x, y);
}

Spike.prototype = new Entity();
Spike.prototype.constructor = Spike;


Spike.prototype.reset = function (cpX) {
    this.x = this.startX - cpX + 32;
    this.y = this.startY;
    // this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
    this.boundingbox = new BoundingBox(this.x + 66, this.y + 66, 60, 60);
}

Spike.prototype.update = function () {
    if (!this.game.running || this.boundingbox.right < 0) {
        return;
    }
    // this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
    this.boundingbox = new BoundingBox(this.x + 66, this.y + 66, 60, 60);
    this.x -= 200 * this.game.clockTick;
    Entity.prototype.update.call(this);
}

Spike.prototype.draw = function (ctx) {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + 66, this.y + 66, 60, 60);
        // ctx.lineWidth = 1;
    }
    Entity.prototype.draw.call(this);
}

function Block(game, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/block.png"), 0, 0, 64, 64, 0.5, 2, true, false);
    this.startX = x;
    this.startY = y;
    this.boundingbox = new BoundingBox(this.x, this.y, 64, 64);
    Entity.call(this, game, x, y);
}

Block.prototype = new Entity();
Block.prototype.constructor = Block;


Block.prototype.reset = function (cpX) {
    this.x = this.startX - cpX + 32;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
}

Block.prototype.update = function () {
    if (!this.game.running || this.boundingbox.right < 0) {
        return;
    }
    this.boundingbox = new BoundingBox(this.x + 64, this.y + 64, 64, 64);
    this.x -= 200 * this.game.clockTick;
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
    Entity.call(this, game, x, y);
}

NewPlatform.prototype = new Entity();
NewPlatform.prototype.constructor = NewPlatform;


NewPlatform.prototype.reset = function (cpX) {
    this.x = this.startX - cpX + 32;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x + 314, this.y + 64, 330, 64);
}

NewPlatform.prototype.update = function () {
    if (!this.game.running || this.boundingbox.right < 0) {
        return;
    }
    this.boundingbox = new BoundingBox(this.x + 314, this.y + 64, 330, 64);
    this.x -= 200 * this.game.clockTick;
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

function Wall(game, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/wall.png"), 0, 0, 64, 64, 0.5, 2, true, false);
    this.startX = x;
    this.startY = y;
    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 192);
    Entity.call(this, game, x, y);
}

Wall.prototype = new Entity();
Wall.prototype.constructor = Wall;

Wall.prototype.reset = function (cpX) {
    this.x = this.startX - cpX + 32;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 192);
}

Wall.prototype.update = function () {
    if (!this.game.running || this.boundingbox.right < 0) {
        return;
    }
    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 192);
    this.x -= 200 * this.game.clockTick;
    Entity.prototype.update.call(this);
}

Wall.prototype.draw = function (ctx) {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + 64, this.y, 64, 192);
    }
    Entity.prototype.draw.call(this);
}

function Checkpoint(game, x, y) {
    this.unactivatedCp = new Animation(ASSET_MANAGER.getAsset("./img/checkpoint.png"), 0, 0, 64, 64, 0.5, 2, true, false);
    this.activatedCp = new Animation(ASSET_MANAGER.getAsset("./img/checkpoint_activated.png"), 0, 0, 64, 64, 0.5, 2, true, false); 
    this.animation = this.unactivatedCp;
    this.startX = x;
    this.startY = y;
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
    this.boundingbox = new BoundingBox(this.x + 64, this.y, 64, 192); 
    this.x -= 200 * this.game.clockTick;
    Entity.prototype.update.call(this);
}

Checkpoint.prototype.draw = function (ctx) {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 3);
        // ctx.lineWidth = 3;
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + 64, this.y, 64, 192);
    }
    Entity.prototype.draw.call(this);
}

function FinishLine(game, x, y) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/finish_line.png"), 0, 0, 64, 64, 0.5, 2, true, false); 
    this.startX = x;
    this.startY = y;
    this.boundingbox = new BoundingBox(this.x + 400, this.y, 64, 500);
    Entity.call(this, game, x, y);
}

FinishLine.prototype = new Entity();
FinishLine.prototype.constructor = FinishLine;

FinishLine.prototype.reset = function (cpX) {
    this.x = this.startX - cpX + 32;
    this.y = this.startY;
    this.boundingbox = new BoundingBox(this.x + 400, this.y, 64, 500);
}

FinishLine.prototype.update = function () {
    if (!this.game.running || this.boundingbox.right < 0) {
        return;
    }
    this.boundingbox = new BoundingBox(this.x + 400, this.y, 64, 500); 
    this.x -= 200 * this.game.clockTick;
    Entity.prototype.update.call(this);
}

FinishLine.prototype.draw = function (ctx) {
    if (this.game.running) {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y, 10);
        // ctx.lineWidth = 1;
        // ctx.strokeStyle = "blue";
        // ctx.strokeRect(this.x + 400, this.y, 64, 500);
    }
    Entity.prototype.draw.call(this);
}
/******************************************************************************************/
/******************************************************************************************/
/******************************************************************************************/

function createMap(platforms, spikes, blocks, newPlatforms, walls, checkpoints, finishLines, gameEngine) {
    // Ground
    mainPlatform = new Platform(gameEngine, 0, 400, 1000000000000000, 100, "black");
    gameEngine.addEntity(mainPlatform);
    platforms.push(mainPlatform);

    // Stairs
    cp = new Checkpoint(gameEngine, 600, 210);
    gameEngine.addEntity(cp);
    checkpoints.push(cp);

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
    // Spikes in tunnel
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

    cp = new Checkpoint(gameEngine, 2138, -128);
    gameEngine.addEntity(cp);
    checkpoints.push(cp);

    //Tunnel
    npf = new NewPlatform(gameEngine, 1300, 200);
    gameEngine.addEntity(npf);
    platforms.push(npf);
    npf = new NewPlatform(gameEngine, 1630, 200);
    gameEngine.addEntity(npf);
    platforms.push(npf);
    npf = new NewPlatform(gameEngine, 1960, 200);
    gameEngine.addEntity(npf);
    platforms.push(npf);
    // currentPlatform = new Platform(gameEngine, 1600, 0, 900, 50, "grey");
    // gameEngine.addEntity(currentPlatform);
    // platforms.push(currentPlatform);

    /*
    *Spike under stairs
    */

    for (var i = 0; i < 24; i++) {
        spike = new Spike(gameEngine, 2636 + 64 * i, 300);
        gameEngine.addEntity(spike);
        spikes.push(spike);
    }

    //DOWNSTAIRS
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


    for (let i = 0; i < 3; i++) {
        spike = new Spike(gameEngine, 4300, 200 + 64 * i);
        gameEngine.addEntity(spike);
        spikes.push(spike);
    }

    fl = new FinishLine(gameEngine, 4700, 0);
    gameEngine.addEntity(fl);
    finishLines.push(fl);

    blk = new Block(gameEngine, 4400, 190);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    blk = new Block(gameEngine, 4500, 40);
    gameEngine.addEntity(blk);
    blocks.push(blk);
    spike = new Spike(gameEngine, 4500, 102);
    gameEngine.addEntity(spike);
    spikes.push(spike);
    wl = new Wall(gameEngine, 4500, 232); 
    gameEngine.addEntity(wl);
    blocks.push(wl); 
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
ASSET_MANAGER.queueDownload("./img/spike.png");
ASSET_MANAGER.queueDownload("./img/checkpoint.png");
ASSET_MANAGER.queueDownload("./img/checkpoint_activated.png");
ASSET_MANAGER.queueDownload("./img/finish_line.png");
ASSET_MANAGER.queueDownload("./img/credits.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    document.getElementById('gameWorld').focus();
    var ctx = canvas.getContext('2d');
    var gameEngine = new GameEngine();
    var timer = new VisibleTimer(gameEngine);
    var pg = new PlayGame(gameEngine, 320, 350);

    var platforms = [];
    var spikes = [];
    var blocks = [];
    var newPlatforms = [];
    var walls = [];
    var checkpoints = [];
    var finishLines = [];
    gameEngine.platforms = platforms;  
    gameEngine.spikes = spikes;  
    gameEngine.blocks = blocks;
    gameEngine.newPlatforms = newPlatforms;  
    gameEngine.walls = walls;
    gameEngine.checkpoints = checkpoints;
    gameEngine.finishLines = finishLines;

    gameEngine.init(ctx);
    gameEngine.start();
    gameEngine.addEntity(new Background(gameEngine, ASSET_MANAGER.getAsset("./img/bg.png")));
    createMap(platforms, spikes, blocks, newPlatforms, walls, checkpoints, finishLines, gameEngine);
    gameEngine.addEntity(new Character(gameEngine));
    gameEngine.addEntity(new Credits(gameEngine));
    gameEngine.addEntity(timer);
    gameEngine.addEntity(pg);

    //   gameEngine.addEntity(new Foreground(gameEngine, ASSET_MANAGER.getAsset("./img/transparent_bg.png")));
    //   gameEngine.addEntity(new Laser(gameEngine)); 
    //   gameEngine.addEntity(new HandleClicks(gameEngine));
    //   gameEngine.addEntity(new HighlightSelection(gameEngine));
    //   gameEngine.mainmenu = true;
   
});

