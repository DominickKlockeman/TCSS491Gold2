// This game shell was happily copied from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

var menuBackgroundSound = new Audio("backgroundMusic.mp3");

window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (/* function */ callback, /* DOMElement */ element) {
                window.setTimeout(callback, 1000 / 60);
            };
})();


function Timer() {
    this.gameTime = 0;
    this.maxStep = 0.05;
    this.wallLastTimestamp = 0;
}

Timer.prototype.tick = function () {
    var wallCurrent = Date.now();
    var wallDelta = (wallCurrent - this.wallLastTimestamp) / 1000;
    this.wallLastTimestamp = wallCurrent;

    var gameDelta = Math.min(wallDelta, this.maxStep);
    this.gameTime += gameDelta;
    return gameDelta;
}

function VisibleTimer(game) {
    this.game = game;
    this.runTime = null;
    Entity.call(this, game, 695, 100);
}

VisibleTimer.prototype = new Entity();
VisibleTimer.prototype.constructor = VisibleTimer;

VisibleTimer.prototype.draw = function(ctx) {
    if (this.game.running) {
        ctx.font = "24pt Impact";
        if (this.game.sloMo) {
            ctx.fillStyle = "green";
        } else {
            ctx.fillStyle = "yellow";
        }

        ctx.fillText(this.game.actualTime.gameTime.toFixed(3), 695, 100);
        this.runTime = this.game.actualTime.gameTime.toFixed(3);
    } else if(this.game.inmenus) {

    } else if(!this.game.running) {
        if (this.runTime != null) {
            ctx.font = "24pt Impact";
            ctx.fillStyle = "red";
            ctx.fillText(this.runTime, 695, 100);
        }
    } 

}

function GameEngine() {
    this.entities = [];
    this.showOutlines = false;
    this.ctx = null;
    this.click = null;
    this.mouse = null;
    this.wheel = null;
    this.surfaceWidth = null;
    this.surfaceHeight = null;
    this.credits = false;
    this.mainmenu = true;
    this.controls = false;
    this.multi = false;
    this.leaderboard = false;
    this.naked = false;
    this.endscreen = false;
    this.running = false;
    this.inmenus = true;
    this.ispaused = false;
    this.levelselection = false;
    this.volume = 3;
    this.song = menuBackgroundSound;
    this.playerFinished;
    this.firstCp = false;
    this.character;
    this.powerUpTimer = 300;
    this.sloMo = false;
    this.speedUp = false;
    this.godMode = false;
    this.gameSpeed = 200;
    this.powerupClockSpeed = 0; 
    this.map;

}

GameEngine.prototype.init = function (ctx) {
    this.ctx = ctx;
    this.surfaceWidth = this.ctx.canvas.width;
    this.surfaceHeight = this.ctx.canvas.height;
    this.startInput();
    this.timer = new Timer();
    this.actualTime = new Timer();
    console.log('game initialized');
}

GameEngine.prototype.start = function () {
    console.log("starting game");
    var that = this;
    (function gameLoop() {
        that.loop();
        requestAnimFrame(gameLoop, that.ctx.canvas);
    })();
}

GameEngine.prototype.startInput = function () {
    console.log('Starting input');

    var getXandY = function (e) {
        var x = e.clientX - that.ctx.canvas.getBoundingClientRect().left;
        var y = e.clientY - that.ctx.canvas.getBoundingClientRect().top;

        // if (x < 1024) {
        //     x = Math.floor(x / 32);
        //     y = Math.floor(y / 32);
        // }

        return { x: x, y: y };
    }

    var that = this;

    this.ctx.canvas.addEventListener("click", function (e) {
        that.click = getXandY(e);
        console.log(that.click.x + " " + that.click.y);
    }, false);

    this.ctx.canvas.addEventListener("mousemove", function (e) {
        that.mouse = getXandY(e);
    }, false);

    this.ctx.canvas.addEventListener("mouseleave", function (e) {
        that.mouse = null;
    }, false);

    this.ctx.canvas.addEventListener("mousewheel", function (e) {
        that.wheel = e;
        e.preventDefault();
    }, false);
    this.ctx.canvas.addEventListener("keydown", function (e) {
        if (String.fromCharCode(e.which) === ' ') that.space = true;
        if (String.fromCharCode(e.which) === 'P' && that.canbepaused) {
            that.ispaused = !that.ispaused;
            that.song.pause();
        }
        if (String.fromCharCode(e.which) === 'W') that.w = true;
        e.preventDefault();
    }, false);

    this.ctx.canvas.addEventListener("keyup", function (e) {
        if (String.fromCharCode(e.which) === ' ') that.space = false;
        e.preventDefault();
    }, false);

    console.log('Input started');
}

GameEngine.prototype.addEntity = function (entity) {
    console.log('added entity');
    this.entities.push(entity);
}

GameEngine.prototype.draw = function () {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.save();
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].draw(this.ctx);
    }
    this.ctx.restore();
}

GameEngine.prototype.update = function () {
    var entitiesCount = this.entities.length;

    if(this.powerUpTimer > 0){
        this.powerUpTimer -= 1;
    }

    if(this.speedUp && this.powerUpTimer > 0) {
        this.gameSpeed = 275;

    } else if(this.sloMo && this.powerUpTimer > 0){
        

    } else if(this.godMode && this.powerUpTimer > 0) {

    
    }else {
        this.gameSpeed = 200;
        this.powerUpTimer = 300;
        this.speedUp = false;
        this.sloMo = false;
        this.godMode = false;

    }

    if(this.running) {
        this.canbepaused = true;
    }

    for (var i = 0; i < entitiesCount; i++) {
        var entity = this.entities[i];

        if (!entity.removeFromWorld) {
            entity.update();
            if (entity instanceof PlayGame) {
                if(entity.game.running != null && entity.game.running && this.sloMo) {
                    if(this.powerupClockSpeed % 10 == 0) {
                        this.actualTime.tick();
                    }
                } else if (entity.game.running != null && entity.game.running ) {
                    this.actualTime.tick();
                }
            }
        }
    }

    for (var i = this.entities.length - 1; i >= 0; --i) {
        if (this.entities[i].removeFromWorld) {
            this.entities.splice(i, 1);
        }
    }

    this.powerupClockSpeed += 1;
}

GameEngine.prototype.reset = function (cpX) {
    for (var i = cpX; i < this.checkpoints.length; i++) {
        let cp = this.checkpoints[i];
        cp.animation = cp.unactivatedCp;
    }
    for (var i = 0; i < this.entities.length; i++) {
        this.entities[i].reset(cpX);

    }

    
    this.gameSpeed = 200;
    this.godMode = false;
    this.speedUp = false;
    this.sloMo = false;

}

GameEngine.prototype.loop = function () {
    if(!this.ispaused) {
        this.update();
        this.clockTick = this.timer.tick();
        this.draw();
    }
    this.w = null;
    this.click = null;
    this.wheel = null;
    //this.space = null;
    // this.draw();
    // this.space = null;
    // this.click = null;
    // this.wheel = null;
}

function Entity(game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.removeFromWorld = false;
}

Entity.prototype.update = function () {

}

Entity.prototype.reset = function () {

}

Entity.prototype.draw = function (ctx) {
    if (this.game.showOutlines && this.radius) {
        this.game.ctx.beginPath();
        this.game.ctx.strokeStyle = "green";
        this.game.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.game.ctx.stroke();
        this.game.ctx.closePath();
    }
}

Entity.prototype.rotateAndCache = function (image, angle) {
    var offscreenCanvas = document.createElement('canvas');
    var size = Math.max(image.width, image.height);
    offscreenCanvas.width = size;
    offscreenCanvas.height = size;
    var offscreenCtx = offscreenCanvas.getContext('2d');
    offscreenCtx.save();
    offscreenCtx.translate(size / 2, size / 2);
    offscreenCtx.rotate(angle);
    offscreenCtx.translate(0, 0);
    offscreenCtx.drawImage(image, -(image.width / 2), -(image.height / 2));
    offscreenCtx.restore();
    //offscreenCtx.strokeStyle = "red";
    //offscreenCtx.strokeRect(0,0,size,size);
    return offscreenCanvas;
}
