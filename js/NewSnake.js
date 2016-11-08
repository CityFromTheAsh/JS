/**
 * Created by macko_a on 07.11.16.
 */
//const----------------------------------
const W_KEY = 119;
const S_KEY = 115;
const A_KEY = 97;
const D_KEY = 100;
const _W_KEY = 1094;
const _S_KEY = 1099;
const _A_KEY = 1092;
const _D_KEY = 1074;

//---------------------------------------
var canvasDrowLine;
canvasDrowLine = function (context, MoveToX, MoveToY, LineToX, LineToY) {
    context.moveTo(MoveToX, MoveToY);
    context.lineTo(LineToX, LineToY);
};

var newPoint = function (point, x, y) {
    point.x = x;
    point.y = y;
};
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

var movePoint = function (oldPoint, _newPoint) {
    newPoint(_newPoint, oldPoint.x, oldPoint.y);
};
//global---------------------------------
var gameField= new GameField();
var snake = new Snake(5);
var globalX;
var globalY;
var interval=false;

//---------------------------------------
function GameField() {
    this.minX=0;
    this.minY=0;
    this.maxX=0;
    this.maxY=0;
    this.fieldSet = function (x,y) {
        this.maxX=x;
        this.maxY=y;
    }
}

//---------------------------------------
function Area(strokeStyle)
{
    this.canvas = document.getElementById("snake_canvas");
    this.context = this.canvas.getContext("2d");
    for (var x = 0; x <= this.canvas.width; x += 10)
        canvasDrowLine(this.context, x, 0, x, this.canvas.height)
    for (var y = 0; y <= this.canvas.height; y += 10)
        canvasDrowLine(this.context, 0, y, this.canvas.width, y)
    this.context.strokeStyle = strokeStyle;
    this.context.stroke();
    this.field = function (field) {
        globalX = this.canvas.width/10-1;
        globalY = this.canvas.height/10-1;
    };
}

//---------------------------------------
function Snake(snakeLength) {
    this.field = new GameField();
    this.loose = false;
    this.block = A_KEY;
    this.lastMove = D_KEY;
    this.snakeLength = snakeLength;
    this.body = new Array();
    this.block = A_KEY;
    for (var i = 0; i < this.snakeLength; i++) {
        this.body[i] = {
            x: 0,
            y: 0
        };
    }
    this.apple ={
        x: 0,
        y: 0
    };
    this.createNewSnake = function (x,y) {
        this.body[0].x = x;
        this.body[0].y = y;
        for(var i=1;i<this.snakeLength;i++)
        {
            newPoint(this.body[i], x - i, y);
        }
        this.snakeDraw("#000000");
    };
    this.move = function (newX,newY) {
        this.snakeDraw("#FFFFFF");
        x = newX;
        y = newY;
        if (x>this.field.maxX)
            x=this.field.minX;
        if (x<this.field.minX)
            x=this.field.maxX;
        if (y>this.field.maxY)
            y=this.field.minY;
        if (y<this.field.minY)
            y=this.field.maxY;
        loose=false;
        for (var elem in this.body)
            if((x===this.body[elem].x)&&(y===this.body[elem].y))
                loose=true;
        if((this.apple.x===x)&&(this.apple.y===y)) {
            this.snakeLength++;
            do {
                this.newApple(getRandomInt(this.field.minX, this.field.maxX),
                              getRandomInt(this.field.minY, this.field.maxY));
                createdOnSnake=false;
                for(var el in this.body)
                {
                    if ((this.body[el].x===this.apple.x)&&(this.body[el].y===this.apple.y))
                        createdOnSnake = true;
                }
            } while (createdOnSnake);
            console.log(this.apple);
            this.body[this.body.length]=({
                x: -1,
                y: -1
            });

        }
        if (!loose){
            for (var i = this.body.length - 1; i > 0; i--) {
                this.body[i].x = this.body[i - 1].x;
                this.body[i].y = this.body[i - 1].y;
            }
            this.body[0].x = x;
            this.body[0].y = y;
        }
        this.snakeDraw("#000000");
        if (loose){
            confirm("you loose.");
            this.loose=true;
        }
    };
    this.checkBlock = function (currentKey,blockKey,x,y) {
        open = true;
        if (blockKey===currentKey)
            open = false;
        else
        {
            this.move(x,y);
        }
        return open;
    };
    this.headMove = function (keyWhich, x, y) {
        switch (keyWhich)
        {
            case D_KEY:
            case _D_KEY:
                if (this.checkBlock(D_KEY,this.block,x + 1, y)) {
                    this.block = A_KEY;
                    this.lastMove = D_KEY;
                }
                break;
            case A_KEY:
            case _A_KEY:
                if (this.checkBlock(A_KEY,this.block,x - 1, y)) {
                    this.block = D_KEY;
                    this.lastMove = A_KEY;
                }
                break;
            case S_KEY:
            case _S_KEY:
                if (this.checkBlock(S_KEY,this.block,x, y + 1)) {
                    this.block = W_KEY;
                    this.lastMove = S_KEY;
                }
                break;
            case W_KEY:
            case _W_KEY:
                if (this.checkBlock(W_KEY,this.block,x, y - 1)) {
                    this.block = S_KEY;
                    this.lastMove = W_KEY;
                }
                break;
        }
    };
    this.moveToward = function (event) {
        this.headMove(event.which, this.body[0].x, this.body[0].y);
    };
    this.snakeDraw = function (style) {
        var canvas = document.getElementById("snake_canvas");
        var context = canvas.getContext("2d");
        context.fillStyle = style;//"#000000";
        for(elem in this.body)
        {
            context.fillRect(this.body[elem].x*10,this.body[elem].y*10, 10,10);
        }
    };
    this.appleDraw = function (x, y) {
        var canvas = document.getElementById("snake_canvas");
        var context = canvas.getContext("2d");
        context.fillStyle = "#FF0000";
        context.fillRect(x*10,y*10,10,10);
    };
    this.newApple = function (x,y) {
        this.apple.x=x;
        this.apple.y=y;
        this.appleDraw(x,y);
    };
    this.repeatLastMove = function (snake) {
        snake.headMove(snake.lastMove, snake.body[0].x, snake.body[0].y);
    }
}

//---------------------------------------
function NewGame() {
    snake.createNewSnake(10,10);
    snake.field.fieldSet(globalX,globalY);
    snake.newApple(5,6);
    interval=false;
}


//---------------------------------------
function GameStart()
{
    var area = new Area("#eee");
    area.field(gameField);
    var newGame = new NewGame();
}

//---------------------------------------
function Game(event) {
    snake.moveToward(event);
    if (!interval) {
        var t = setInterval(snake.repeatLastMove, 80, snake);
        interval=true;
    }
}