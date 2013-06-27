
Crafty.c("Arrow", {
	
	_CHANGETIME : 1000,
	_STARTTIME : new Date(),
	_LINEWIDTH : 3,
	
	arrow:function(xpos, ypos, angle, xscale, yscale){
		this.attr({
			x:xpos,
			y:ypos,
			w:10,
			h:30,
			z:2,
			a:-angle,
			sx:xscale || 1.75,
			sy:yscale || 1.75,
			color:"red"
		});
		
		this.bind("EnterFrame", function(){
			var currentTime = new Date();
		
			if(currentTime.getTime() - this._STARTTIME.getTime() >= this._CHANGETIME) {
				this._STARTTIME = currentTime;
				if(this.color == "cyan")
					this.color = "red";
				else
					this.color = "cyan";
				
				this.draw();
			}
			
		});
		
		return this;
	},
	
	draw:function(){
		var context = Crafty.canvas.context;
		context.save();
		context.translate(this.x, this.y);
		context.scale(this.sx, this.sy);
		context.rotate(this.a*Math.PI/180);
 		context.beginPath();
 	 	context.lineWidth = this._LINEWIDTH;
  		context.strokeStyle = this.color;
  		context.moveTo(0,0);
  		context.lineTo(-this.w,-this.w/2);
  		context.moveTo(0,0);
  		context.lineTo(-this.w,this.w/2);
  		context.moveTo(0,0);
  		context.lineTo(-this.h,0);
  		context.closePath();  
  		context.stroke();
  		context.restore();
	},
	
	destroyObject: function(){
		this.destroy();
		var ctx = Crafty.canvas.context;
		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.scale(this.sx, this.sy);
		ctx.rotate(this.a*Math.PI/180);
		ctx.clearRect(-this.w - 2 * this._LINEWIDTH, -2 * this._LINEWIDTH, 2 * this.w + 2 * this._LINEWIDTH, this.h + 2 * this._LINEWIDTH);
		ctx.restore();
	}
	
});

Crafty.c("Rectangle", {
	
	_COLOR : "blue",
	_LINE_WIDTH : "4",
	
	rect: function(xpos, ypos){
		this.attr({
			x:xpos,
			y:ypos,
			w:CELL_SIZE,
			h:CELL_SIZE
		});
		
		return this;
	},
	
	draw: function(){
		var ctx = Crafty.canvas.context;
		ctx.save();
		ctx.beginPath();
		ctx.strokeStyle = this._COLOR;
		ctx.lineWidth = this._LINE_WIDTH;
		ctx.rect(this.x, this.y, this.w, this.h);
		ctx.stroke();
	},
	
	destroyObject: function(){
		this.destroy();
	}
});

Crafty.c("TextBubble", {
	
	_LINEWIDTH:3,
	
	//direction: 0 = right, 90 = down, 180 = left, 270 = up
    textbubble: function(xpos, ypos, message, angle, width, height) {
    	this.attr({
    		w:width || 175, 
    		h:height || 75, 
    		r:20,
    		x:xpos,
    		y:ypos,
    		m:message,
    		a:angle
    	});
    	
    	
    	if(angle == 90 || angle == 270){
    		var temp = this.w;
    		this.w = this.h;
    		this.h = temp;
    	}
    	
        return this;
    },
    
    draw: function() {
		var r = this.w;
		var t = -this.h;
		var x = -this.r/2;
		var y = -10;
		var w = this.w;
		var h = this.h;
		var radius = this.r;
		
		var ctx = Crafty.canvas.context;
		ctx.save();
		ctx.translate(this.x,this.y);
		ctx.rotate(this.a*Math.PI/180);
		ctx.beginPath();
		ctx.fillStyle="yellow";
		ctx.strokeStyle = "black";
		ctx.lineWidth = this._LINEWIDTH;
		ctx.moveTo(x+radius, y);
  		ctx.lineTo(x+radius/2, y+10);
  		ctx.lineTo(x+radius * 2, y);
  		ctx.lineTo(r-radius, y);
  		ctx.quadraticCurveTo(r, y, r, y-radius);
  		ctx.lineTo(r, t+radius);
  		ctx.quadraticCurveTo(r, t, r-radius, t);
  		ctx.lineTo(x+radius, t);
  		ctx.quadraticCurveTo(x, t, x, t+radius);
  		ctx.lineTo(x, y-radius);
 		ctx.quadraticCurveTo(x, y, x+radius, y);
		ctx.fill();
		ctx.stroke();
		
		
		if(this.a == 90){
			ctx.restore();
			ctx.save();
			ctx.translate(100, 200);
		}
		
		ctx.fillStyle="purple";
		ctx.font = "15px Arial"
		ctx.textAlign = "left";
		
		var message = this.m.split(" ");
		var i = 0;
		var stringToPrint = '';
		var maxWidth = w - 10;
		var currentHeight = t + 20;
		while(i < message.length){
			textWidth = ctx.measureText(stringToPrint + ' ' +  message[i]).width;
			if(textWidth > maxWidth){
				ctx.fillText(stringToPrint, r - w, currentHeight);
				currentHeight += 15;
				stringToPrint = message[i]; 
			}else{
				stringToPrint = stringToPrint + ' ' + message[i];
			}
			i++;
		}
		ctx.fillText(stringToPrint, r - w, currentHeight);
		ctx.restore();
    },
	
	destroyObject: function(){
		this.destroy();
		var ctx = Crafty.canvas.context;
		ctx.clearRect(this.x - this.r , this.y + this._LINEWIDTH, this.w + this.r + this._LINEWIDTH, -this.h - this._LINEWIDTH - 10);
	}
});


Crafty.c("Hints", {
	
	hints:function(number){
		this.attr({
			list:[]
		});
		
		for(var i = 0; i < number; i++){
			this.list.push([]);
		}
		
		return this;
	},
	
	addHint:function(index, hint){
		this.list[index].push(hint);
	},
	
	destroyHints:function(index){
		var items = this.list[index];
		
		for(var i = 0; i < items.length; i++){
			items[i].destroyObject();
		}
		
		this.list[index] = [];
	}
	
});



/*
Crafty.c("HintsManager", {
	
	init:function(){
		this.attr({
			hints : [],
			events : {}
		});
	},
	
	_createEventCallback : function(manager, trigger){
		return function(){
			var list = manager.events[trigger];
			
			for(var i = 0; i < list.length; i++){
				list[i]();
			}
			
			for(var i = 0; i < list.length; i++){
				
			}			
		};
	},
	
	_createDestructionCallback : function(manager, trigger, callback, hintIndex, eventIndex){
		return function(){
			manager.destroyHint(hintIndex);
			callback();
		};
	},
	
	destroyHint : function(hintIndex, eventIndex, trigger){
		this.hints[index].destroyObject();
		this.events[trigger].splice(eventIndex, 1);
		//this.hints = this.hints.splice(index, 1);
		console.log("Destroy Hint");
	},
	
	addHint : function(hint, destructionTrigger, destructionCallback){
		var hintIndex = this.hints.length;
		
		if(!this.events[destructionTrigger]){
			this.events[destructionTrigger] = [];
			
			Crafty.bind(destructionTrigger, this._createEventCallback(this, destructionTrigger)); 
		}
		
		this.hints.push(hint);
		
		var eventIndex = this.events[destructionTrigger].length;
		this.events[destructionTrigger].push(this._createDestructionCallback(this, destructionTrigger, destructionCallback, hintIndex, eventIndex));
	}
	
});
*/
