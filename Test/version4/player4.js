var socket = io.connect("http://localhost:4000");

//game board attributes
var WIDTH  = 768;                                           //width of game window
var HEIGHT = 768;                                           //height of game window
var WALL_WIDTH_HEIGHT   = 32;                               //width and height of wall block
var PLAYER_WIDTH_HEIGHT = 32;                               //width and height of player
var BOARD_WIDTH  = WIDTH - WALL_WIDTH_HEIGHT;               //width of window player can use
var BOARD_HEIGHT = HEIGHT - WALL_WIDTH_HEIGHT;              //height of window player can use

//arrays of the items placed
var blocksPlaced = [];                                      //array of all the blocks currently dropped on the screen
var portals1 = [];                                          //array of portals
var portals2 = [];                                          //array of portals that match to a portal in array 1 (portals with the same index match)

//attributes receieved from the server
var channelNumber;                                          //channel number the player is playing on
var playerNumber;                                           //player 1 or player 2
var color;                                                  //color of the player's block 
var nick;

//player attributes
var speed = 4;                                              //speed the player can move at
var level = 2;                                              //level the player is on
var startXPos1 = WALL_WIDTH_HEIGHT; 
var startYPos1 = WALL_WIDTH_HEIGHT;
var startXPos2 = BOARD_HEIGHT/2 - PLAYER_WIDTH_HEIGHT/2;
var startYPos2 = BOARD_HEIGHT/2 - PLAYER_WIDTH_HEIGHT/2;

//log attributes
var time;                                                   //time of last log (only player 1's log is written to the server)
var log = "\n";                                             //the log of events


window.onload = function() {

    Crafty.init(WIDTH, HEIGHT);

    //load wall/block image
    Crafty.sprite(WALL_WIDTH_HEIGHT, "images/crate.png", {
        wall : [0,0]
    });
    
    //loads everything needed before switching to main scene
    //waits for two players
    Crafty.scene('loading', function(){
        
        //when crate is loaded do the function
        Crafty.load(["images/crate.png"], function() {
            
            //emit ready when socket io is running
            socket.emit("ready", "ready");
            
            //wait for setup info from server
            socket.on("setup", function(username, playerColor, number, channel){
                
		nick           = username;
                color          = playerColor;
                playerNumber   = number;
                channelNumber  = channel;
                
                //wait for start signal to run main game
                socket.on('start', function(){
                    
                    //log that game has started
                    time = new Date();
                    logTime();
                    log += " level " + level + " started";
                    
                    Crafty.scene("main");
                });
            });
                    
            //displays a waiting for other player message
            message.text("WAITING FOR ANOTHER PLAYER");   
        });
        
        //displays a loading message
        Crafty.background('#000');
        message = Crafty.e("2D, DOM, Text").attr({w:400, x: 200, y: 300})
                                           .text("LOADING")
                                           .css({"text-align": "center", "color":"#fff"});

    });
    
    //the main scene
    Crafty.scene("main", function() {
        Crafty.background("blue");
        makeBorders();
        setupPlayer();
        placeGoal(level);
        
        
        //drops a block at given position
        //NOTE: server will only ever send this to player 1
        socket.on('dropBlock', function(xpos, ypos){
            //place the block at the received location
            placeBox(xpos, ypos);
            
            //make sure their are 3 or less blocks currently placed
            //remove the block that was placed the longest ago
            if (blocksPlaced.length > 3){
                blocksPlaced[0].destroy();
                blocksPlaced = blocksPlaced.slice(1);
            }
            
            //log that a block was placed
            logTime();
            log += " block placed at (" + xpos + "," + ypos + ")"
        });
        
        //logs the position of player 2
        //NOTE: server will only ever send this to player 1
        socket.on("logPosition", function(x, y){
            logTime();
            log += " player2: position = (" + x + "," + y + ")";
        });
        
        //triggers when the ball is teleported to your side of the screen
        socket.on("teleported", function(x, y, direction){
            box = drawPushBox(x, y);
            if (direction == "left"){
                box.move.left = true;
            }
            else if(direction == "right"){
                box.move.right = true;
            }
            else if(direction == "up"){
                box.move.up = true;
            }
            else if(direction == "down"){
                box.move.down = true;
            }    
            
        });
        
        //tells the player that the other player left the game
        socket.on("playerLeft", function(message){
            alert(message); 
        });
        
        //sends message in input box to server when you hit enter
        //resets the input box
        $('#msg').keyup(function(key){
            if(key.which == 13){
                var message = $('#msg').val();
                socket.emit('sendMessage', message, channelNumber);
                $('#msg').val("");
            }
        });
        
        //print out any messages received from other player
        socket.on('newMessage', function(sender, message){
	    if (sender == nick) { 
		$("#data_received").append("<br/><i>" + message +"</i>");
            }
	    else {
		$("#data_received").append("<br /><b>" + message +"</b>");
	    }
            //log the message that was received
            logTime();
            log += " " + message;
            
            //scroll down to the last thing in box of receieved messages
            var objDiv = document.getElementById("data_received");
            objDiv.scrollTop = objDiv.scrollHeight;
        });
                
    });
    
    //Scene used for other levels
    Crafty.scene("level", function(){
        
        Crafty.background("blue");
        makeBorders();
        setupPlayer();
        placeGoal(level);
        
        //sends message in input box to server when you hit enter
        //resets the input box
        $('#msg').keyup(function(key){
            if(key.which == 13){
		
                var message = $('#msg').val();
                socket.emit('sendMessage', message, channelNumber);
                $('#msg').val("blah");
            }
        });
    });
    
    //scene that shows if you reach the goal on the last level
    Crafty.scene("end", function(){
        //logs that you won
        logTime();
        log += " Winner";
        
        //Displays the end message to the player
        Crafty.background('#000');
        message = Crafty.e("2D, DOM, Text").attr({w: 400, h: 20, x: 200, y: 390})
                                           .text("!!!!   YOU WIN   !!!!")
                                           .css({"text-align": "center"});
    });                                
    
    //starts the loading scene (starts the game)
    Crafty.scene('loading');
};

window.onbeforeunload = function(){
    if(playerNumber == 1){
        socket.emit("log", log);
    }
    
    socket.emit("partnerDisconnected", channelNumber);  
};

//puts the current time in the log
function logTime(){
    currentTime = new Date();
    currentTime = currentTime.getMinutes() + ":" + currentTime.getSeconds();
    log  = log + "\n" + currentTime; 
}

//makes the border walls of the screen
function makeBorders() {
    repetitions = WIDTH/WALL_WIDTH_HEIGHT;
    
    for(var i = 0; i < repetitions; i++) {
        Crafty.e("2D, DOM, wall_top, wall").attr({
            x : i * WALL_WIDTH_HEIGHT,
            y : 0,
            w : WALL_WIDTH_HEIGHT,
            h : WALL_WIDTH_HEIGHT
        });
        Crafty.e("2D, DOM, wall_bottom, wall").attr({
            x : i * WALL_WIDTH_HEIGHT,
            y : HEIGHT - WALL_WIDTH_HEIGHT,
            w : WALL_WIDTH_HEIGHT,
            h : WALL_WIDTH_HEIGHT
        });
    }

    for(var i = 1; i < repetitions - 1; i++) {
        Crafty.e("2D, DOM, wall_left, wall").attr({
            x : 0,
            y : i * WALL_WIDTH_HEIGHT,
            w : WALL_WIDTH_HEIGHT,
            h : WALL_WIDTH_HEIGHT
        });
        Crafty.e("2D, DOM, wall_right, wall").attr({
            x : WIDTH - WALL_WIDTH_HEIGHT,
            y : i * WALL_WIDTH_HEIGHT,
            w : WALL_WIDTH_HEIGHT,
            h : WALL_WIDTH_HEIGHT
        });
    }
}

//makes a horizontal wall of xlength boxes from the x and y position and
//a vertical wall of ylength boxes from the x and y position
function makeWall(xpos, ypos, xlength, ylength){
    for(var i = 0; i < xlength; i++){
        drawBox(xpos + i*WALL_WIDTH_HEIGHT, ypos);
    }
    
    for(var i = 0; i < ylength; i++){
        drawBox(xpos, ypos + i*WALL_WIDTH_HEIGHT);
    }
}

//makes a box at the specified point
function drawBox(xpos, ypos){
    box = Crafty.e("2D, DOM, wall, box").attr({
            x : xpos,
            y : ypos,
            w : WALL_WIDTH_HEIGHT,
            h : WALL_WIDTH_HEIGHT
        });
    
    return box;
}

//makes a bouncy box at the specified point
function drawBouncyBox(xpos, ypos){
    box = Crafty.e("2D, DOM, Color, bouncybox").attr({
            x : xpos,
            y : ypos,
            w : WALL_WIDTH_HEIGHT,
            h : WALL_WIDTH_HEIGHT
        })
        .color("pink");
}

//makes a portal at the first point and a connecting portal at the second point
function drawPortal(xpos1, ypos1, xpos2, ypos2){
    portal = Crafty.e("2D, DOM, Color, portal").attr({
            x : xpos1,
            y : ypos1,
            w : WALL_WIDTH_HEIGHT,
            h : WALL_WIDTH_HEIGHT
        })
        .color("white");
        
   portals1.push(portal);
   
   portal = Crafty.e("2D, DOM, Color, portal").attr({
            x : xpos2,
            y : ypos2,
            w : WALL_WIDTH_HEIGHT,
            h : WALL_WIDTH_HEIGHT
        })
        .color("white");
        
   portals2.push(portal);
}

//draws a teleporter block that transports the block to the position of the teleporter on
//the other players screen
function drawTeleporter(xpos, ypos){
    teleporter = Crafty.e("2D, DOM, Color, teleporter").attr({
        x:xpos,
        y:ypos,
        w:WALL_WIDTH_HEIGHT,
        h:WALL_WIDTH_HEIGHT
    })
    .color('gray');
}

//makes a pushable box at the specified point
function drawPushBox(xpos, ypos){
    box = Crafty.e("2D, DOM, Color, Collision, pushable").attr({
            x : xpos,
            y : ypos,
            w : WALL_WIDTH_HEIGHT,
            h : WALL_WIDTH_HEIGHT,
            move : {left:false,right:false,down:false,up:false},
            startedMoving : false,
            framesSinceFirstMove : 0
        })
        .color("purple")
        .bind("EnterFrame", function(){
            if     (this.move.left) {this.x = this.x - speed;}
            else if(this.move.right){this.x = this.x + speed;}
            else if(this.move.up)   {this.y = this.y - speed;}
            else if(this.move.down) {this.y = this.y + speed;}
            
            if(this.startedMoving){
                this.framesSinceFirstMove++;
            
                if (this.framesSinceFirstMove >= 2){
                    this.framesSinceFirstMove = 0;
                    this.startedMoving = false;  
                }
            }
            
        })
        .onHit("teleporter", function(e){
            if     (this.move.left) {direction = "left";}
            else if(this.move.right){direction = "right";}
            else if(this.move.up)   {direction = "up";}
            else if(this.move.down) {direction = "down";}
            
            
            socket.emit("teleport", e[0].obj.x, e[0].obj.y, direction, channelNumber);
            this.destroy();
        })
        .onHit("box", function(e){
            if(this.startedMoving){
                if(this.move.left) {
                    this.x = e[0].obj.x + e[0].obj.w;
                    this.move.left = false;
                    if(Crafty.math.randomInt(0,1) == 0){
                        this.move.up = true;
                    } 
                    else{
                        this.move.down = true;
                    }
                }
                else if(this.move.right){
                    this.x = e[0].obj.x - this.w;
                    this.move.right = false;
                    if(Crafty.math.randomInt(0,1) == 0){
                        this.move.up = true;
                    } 
                    else{
                        this.move.down = true;
                    }
                }
                else if(this.move.up){
                    this.y = e[0].obj.y + e[0].obj.h;
                    this.move.up = false;
                    if(Crafty.math.randomInt(0,1) == 0){
                        this.move.right = true;
                    } 
                    else{
                        this.move.left = true;
                    }
                }
                else if(this.move.down){
                    this.y = e[0].obj.y - this.h;
                    this.move.down = false;
                    if(Crafty.math.randomInt(0,1) == 0){
                        this.move.right = true;
                    } 
                    else{
                        this.move.left = true;
                    }
                }
            }
            else{
                if(this.move.left) {
                    this.x = e[0].obj.x + e[0].obj.w;
                    this.move.left = false; 
                }
                else if(this.move.right){
                    this.x = e[0].obj.x - this.w;
                    this.move.right = false;
                }
                else if(this.move.up){
                    this.y = e[0].obj.y + e[0].obj.h;
                    this.move.up = false;
                }
                else if(this.move.down){
                    this.y = e[0].obj.y - this.h;
                    this.move.down = false;
                }
            }               
       })
        .onHit("bouncybox", function(e){
            if(this.move.left){
                this.x = e[0].obj.x + e[0].obj.w;
                this.move.left = false;
                this.move.down = true;
            }
            else if(this.move.right){
                this.x = e[0].obj.x - this.w;
                this.move.right = false;
                this.move.up = true;
            }
            else if(this.move.down){
                this.y = e[0].obj.y - this.h;
                this.move.down = false;
                this.move.right = true;
            }
            else if(this.move.up){
                this.y = e[0].obj.y + e[0].obj.h;
                this.move.up = false;
                this.move.left = true;
            }
        })  
        .onHit("portal",function(e){
            connectingPortal = portals1.indexOf(e[0].obj);
            
            if (connectingPortal == -1){
                connectingPortal = portals2.indexOf(e[0].obj);
                connectingPortal = portals1[connectingPortal];  
            }
            else{
                connectingPortal = portals2[connectingPortal];
            }
            
            if(this.move.left){
                this.x = connectingPortal.x - connectingPortal.w;
                this.y = connectingPortal.y;
            }
            else if(this.move.right){
                this.x = connectingPortal.x + connectingPortal.w;
                this.y = connectingPortal.y;
            }
            else if(this.move.down){
                this.x = connectingPortal.x;
                this.y = connectingPortal.y + connectingPortal.h;
            }
            else if(this.move.up){
                this.x = connectingPortal.x;
                this.y = connectingPortal.y - connectingPortal.h;
            }
            
        })
        .onHit('wall_left',  function(e) {
            this.x = WALL_WIDTH_HEIGHT;     
            this.move.left  = false;
            if(this.startedMoving){
                
                randNum = Crafty.math.randomInt(0,1);
                if(randNum == 0){
                    this.move.up = true;
                }
                else{
                    this.move.down = true;
                }
            }
        })
        .onHit('wall_right', function(e) {
            this.x = BOARD_WIDTH - this.w;  
            this.move.right = false;
            if(this.startedMoving){
                randNum = Crafty.math.randomInt(0,1);
                if(randNum == 0){
                    this.move.up = true;
                }
                else{
                    this.move.down = true;
                }
            }
        })
        .onHit('wall_top',   function(e) {
            this.y = WALL_WIDTH_HEIGHT;     
            this.move.up = false;
            if(this.startedMoving){
                randNum = Crafty.math.randomInt(0,1);
                if(randNum == 0){
                    this.move.right = true;
                }
                else{
                    this.move.left = true;
                }
            }
        })
        .onHit('wall_bottom',function(e) {
            this.y = BOARD_HEIGHT - this.h; 
            this.move.down  = false;
            if(this.startedMoving){
                randNum = Crafty.math.randomInt(0,1);
                if(randNum == 0){
                    this.move.right = true;
                }
                else{
                    this.move.left = true;
                }
            }
        })
        .onHit('goal', function(){
            Crafty.scene("end");
        })
        
    return box;
}

//draws the box placed by player2
//places that box in the blockes placed array
function placeBox(xpos, ypos){
    drawnBox = drawBox(xpos,ypos);
    blocksPlaced.push(drawnBox);
}

//places the goal box
//creates the specific level
function placeGoal(level){
    if(playerNumber == 1){
        var goal = Crafty.e("2D, DOM, Color, goal")
            .color('orange');
    
        //level 1
        if (level == 1){
            goal.attr({x:288,y:288,w:PLAYER_WIDTH_HEIGHT,h:PLAYER_WIDTH_HEIGHT});
            makeWall(256, 224, 3, 5);
            makeWall(256, 352, 15, 0);
            makeWall(352, 256, 12, 0);
            makeWall(132, 168, 0, 3);
            makeWall(WALL_WIDTH_HEIGHT, BOARD_HEIGHT-64, 3, 0);
        
        
       
            drawPortal(BOARD_WIDTH-3*WALL_WIDTH_HEIGHT, 320,BOARD_WIDTH-9*WALL_WIDTH_HEIGHT,288);
            drawPortal(BOARD_WIDTH-WALL_WIDTH_HEIGHT, 288, WALL_WIDTH_HEIGHT, BOARD_HEIGHT-32);
            drawPortal(BOARD_WIDTH-6*WALL_WIDTH_HEIGHT, 288, 100, 200);
        
            drawBox(BOARD_WIDTH-WALL_WIDTH_HEIGHT, 320);
            drawBox(BOARD_WIDTH-6*WALL_WIDTH_HEIGHT, 320);
            drawBox(BOARD_WIDTH-7*WALL_WIDTH_HEIGHT, 288);
            drawBox(100, 168);
            drawBox(100, 232);
        
            drawBouncyBox(WALL_WIDTH_HEIGHT, 200);
        }
    
        //level 2
        else if (level == 2){
    
            goal.attr({x:BOARD_WIDTH - 5*WALL_WIDTH_HEIGHT,y:BOARD_HEIGHT-4*WALL_WIDTH_HEIGHT,w:PLAYER_WIDTH_HEIGHT,h:PLAYER_WIDTH_HEIGHT});
            
            drawPushBox(WALL_WIDTH_HEIGHT, 2*WALL_WIDTH_HEIGHT);
            makeWall(4*WALL_WIDTH_HEIGHT, WALL_WIDTH_HEIGHT, 0, BOARD_HEIGHT/WALL_WIDTH_HEIGHT);
            drawBox(3*WALL_WIDTH_HEIGHT, BOARD_HEIGHT-WALL_WIDTH_HEIGHT);
            drawBox(3*WALL_WIDTH_HEIGHT, BOARD_HEIGHT-3*WALL_WIDTH_HEIGHT);
            drawPortal(3*WALL_WIDTH_HEIGHT, BOARD_HEIGHT-2*WALL_WIDTH_HEIGHT, 300, 200);
            makeWall(268, 168, 3, 3);
            drawBox(300, 232);
            drawTeleporter(375, 200);
            makeWall(BOARD_WIDTH - 4*WALL_WIDTH_HEIGHT, WALL_WIDTH_HEIGHT, 0, BOARD_HEIGHT/WALL_WIDTH_HEIGHT);
            makeWall(5*WALL_WIDTH_HEIGHT, BOARD_HEIGHT-3*WALL_WIDTH_HEIGHT, BOARD_WIDTH/WALL_WIDTH_HEIGHT - 9, 0);
            makeWall(5*WALL_WIDTH_HEIGHT, BOARD_HEIGHT-5*WALL_WIDTH_HEIGHT, BOARD_WIDTH/WALL_WIDTH_HEIGHT - 9, 0);
            drawPortal(400, 400, 12*WALL_WIDTH_HEIGHT, BOARD_HEIGHT - 2* WALL_WIDTH_HEIGHT);
            drawBox(400, 432);
        }   
    
        //level 3
        else if(level == 3){
            goal.attr({x:288,y:288,w:PLAYER_WIDTH_HEIGHT,h:PLAYER_WIDTH_HEIGHT});
        
            drawPortal(400, 200, 200, 400);
            drawPortal(500, 100, 100, 500);
        
            drawMovingBox(300, 100, "right");
            drawMovingBox(400, 500, "right");
            drawMovingBox(100, 400, "up");
            drawMovingBox(500, 300, "up");
            drawMovingBox(300, 200, "right");
            drawMovingBox(300, 400, "right");
            drawMovingBox(200, 300, "up");
            drawMovingBox(400, 300, "up");
        
            drawBouncyBox(532, 500);
            drawBouncyBox(100, 68);
            drawBouncyBox(68, 100);
            drawBouncyBox(500, 532);
            drawBouncyBox(432, 400);
            drawBouncyBox(200, 168);
            drawBouncyBox(168, 200);
            drawBouncyBox(400, 432);
        
            drawPushBox(600,500);
        }
    }
    else{
        
        if(level == 1){
            
        }
        else if(level == 2){
            drawTeleporter(7*WALL_WIDTH_HEIGHT, BOARD_HEIGHT - 4*WALL_WIDTH_HEIGHT);
            makeWall(6*WALL_WIDTH_HEIGHT, BOARD_HEIGHT - 5*WALL_WIDTH_HEIGHT, 3, 0);
            makeWall(7*WALL_WIDTH_HEIGHT, BOARD_HEIGHT - 3*WALL_WIDTH_HEIGHT, 2, 0);
            drawBox(8*WALL_WIDTH_HEIGHT, BOARD_HEIGHT - 4*WALL_WIDTH_HEIGHT);
        }
        else if(level ==3){
            
        }
        
    }
}

//makes player controlled by this user
function setupPlayer(){
    
    player = Crafty.e("2D, DOM, Color, CollisionDetection, player")
        .color(color)
        .bind("EnterFrame", function(e){
            if     (this.move.left) {this.x = this.x - speed;}
            else if(this.move.right){this.x = this.x + speed;}
            else if(this.move.up)   {this.y = this.y - speed;}
            else if(this.move.down) {this.y = this.y + speed;}
            
            
            //Logging
            //get the current time
            currentTime = new Date();
            
            //compare that time (currentTime) with the last recorded time (time)
            //If the difference is more than 5 seconds (5 seconds has elapsed)
            //Then player logs its current position (player 2 sends its position to player 1 to be logged)
            if (currentTime.getTime() - time.getTime() >= 5000){
                time = currentTime;
                if (playerNumber == 1){
                    logTime();
                    log += " player1: position = (" + player.x + "," + player.y + ")";
                }
                else{
                    socket.emit("logPos", player.x, player.y, channelNumber);
                }
            }
        });
    
    //defines the player start position
    if(playerNumber == 1){
        player.attr({
                x : startXPos1, 
                y : startYPos1, 
                w : PLAYER_WIDTH_HEIGHT, 
                h : PLAYER_WIDTH_HEIGHT,
                move:{left:false,right:false,up:false,down:false}
            });
    }
    else{
        player.attr({
                x : startXPos2, 
                y : startYPos2, 
                w : PLAYER_WIDTH_HEIGHT, 
                h : PLAYER_WIDTH_HEIGHT,
                move:{left:false,right:false,up:false,down:false}
            });
    }
    
    player.addComponent("Controls").controls();
}


//defines movement for players
//players can move freely and can drop blocks on other screen with spacebar.
Crafty.c("Controls", {
    
    init: function(){
        this.requires("Keyboard");
    },
    
    controls: function(){
        this.bind("KeyUp", function(e){ 
            if(e.key == Crafty.keys.LEFT_ARROW){
                this.move.left = false;
            }
            if(e.key == Crafty.keys.RIGHT_ARROW){
                this.move.right = false;
            }
            if(e.key == Crafty.keys.UP_ARROW){
                this.move.up = false;
            }
            if(e.key == Crafty.keys.DOWN_ARROW){
                this.move.down = false;
            }
            if(e.key == Crafty.keys.CTRL){
                socket.emit('sendPos', this.x, this.y, channelNumber);
            }
        })
        .bind("KeyDown", function(e){
            if(this.move.left == false && this.move.right == false && this.move.up == false && this.move.down == false){
                if(e.key == Crafty.keys.LEFT_ARROW){
                    this.move.left = true;
                }
                else if(e.key == Crafty.keys.RIGHT_ARROW){
                    this.move.right = true;
                }
                else if(e.key == Crafty.keys.UP_ARROW){
                    this.move.up = true;
                }
                else if(e.key == Crafty.keys.DOWN_ARROW){
                    this.move.down = true;
                }
            }
            else if(this.move.left){
                if(e.key == Crafty.keys.LEFT_ARROW){
                    this.move.left = true;
                }
            }
            else if (this.move.right == true){
                if(e.key == Crafty.keys.RIGHT_ARROW){
                    this.move.right = true;
                }
            }
            else if (this.move.up == true){
                if(e.key == Crafty.keys.UP_ARROW){
                    this.move.up = true;
                }
            }
            else if (this.move.down == true){
                if(e.key == Crafty.keys.DOWN_ARROW){
                    this.move.down = true;
                }
            }
              
        });
    }
});

Crafty.c("CollisionDetection", {
   
   init: function(){
       this.requires("Collision");
       this.onHit("box", function(e){
            if(this.move.left) {
                this.x = e[0].obj.x + e[0].obj.w;
                this.move.left = false; 
            }
            else if(this.move.right){
                this.x = e[0].obj.x - this.w;
                this.move.right = false;
            }
            else if(this.move.up){
                this.y = e[0].obj.y + e[0].obj.h;
                this.move.up = false;
            }
            else if(this.move.down){
                this.y = e[0].obj.y - this.h;
                this.move.down = false;
            }               
       })
        .onHit("bouncybox", function(e){
            if(this.move.left){
                this.x = e[0].obj.x + e[0].obj.w;
                this.move.left = false;
            }
            else if(this.move.right){
                this.x = e[0].obj.x - this.w;
                this.move.right = false;
            }
            else if(this.move.down){
                this.y = e[0].obj.y - this.h;
                this.move.down = false;
            }
            else if(this.move.up){
                this.y = e[0].obj.y + e[0].obj.h;
                this.move.up = false;
            }
        })  
        .onHit("portal",function(e){
            connectingPortal = portals1.indexOf(e[0].obj);
            
            if (connectingPortal == -1){
                connectingPortal = portals2.indexOf(e[0].obj);
                connectingPortal = portals1[connectingPortal];  
            }
            else{
                connectingPortal = portals2[connectingPortal];
            }
            
            if(this.move.left){
                this.x = connectingPortal.x - connectingPortal.w;
                this.y = connectingPortal.y;
            }
            else if(this.move.right){
                this.x = connectingPortal.x + connectingPortal.w;
                this.y = connectingPortal.y;
            }
            else if(this.move.down){
                this.x = connectingPortal.x;
                this.y = connectingPortal.y + connectingPortal.h;
            }
            else if(this.move.up){
                this.x = connectingPortal.x;
                this.y = connectingPortal.y - connectingPortal.h;
            }
            
        })
        .onHit("pushable", function(e){
            if(this.move.left) {
                this.x = e[0].obj.x + e[0].obj.w;
                this.move.left = false;
                e[0].obj.move.left = true;
            }
            else if(this.move.right){
                this.x = e[0].obj.x - this.w;
                this.move.right = false;
                e[0].obj.move.right = true;
            }
            else if(this.move.up){
                this.y = e[0].obj.y + e[0].obj.h;
                this.move.up = false;
                e[0].obj.move.up = true;
            }
            else if(this.move.down){
                this.y = e[0].obj.y - this.h;
                this.move.down = false;
                e[0].obj.move.down = true;
            }
            e[0].obj.startedMoving = true;
        })
        .onHit('wall_left',  function() {
            this.x = WALL_WIDTH_HEIGHT;     
            this.move.left  = false;
        })
        .onHit('wall_right', function() {
            this.x = BOARD_WIDTH - this.w;  
            this.move.right = false;
        })
        .onHit('wall_top',   function() {
            this.y = WALL_WIDTH_HEIGHT;     
            this.move.up = false;
        })
        .onHit('wall_bottom',function() {
            this.y = BOARD_HEIGHT - this.h; 
            this.move.down  = false;
        });
   }
});
