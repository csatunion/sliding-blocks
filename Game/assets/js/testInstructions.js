Crafty.c("Bubble", {

	bubble : function(xpos, ypos, width, height, radius) {

		this.attr({
			x : xpos,
			y : ypos,
			w : width,
			h : height,
			r : radius
		});

		return this;
	},

	draw : function() {
		var x = this.x;
		var y = this.y;
		var w = this.w;
		var h = this.h;
		var radius = this.r;

		var ctx = Crafty.canvas.context;
		ctx.save();
		var r = x + w;
		var b = y + h - 10;
		ctx.strokeStyle = "cyan";
		ctx.beginPath();
		ctx.moveTo(x + radius * 2, b);
		ctx.lineTo(x + radius / 2, b + 10);
		ctx.lineTo(x + radius, b);
		ctx.quadraticCurveTo(x, b, x, b - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.lineTo(r - radius, y);
		ctx.quadraticCurveTo(r, y, r, y + radius);
		ctx.lineTo(r, y + h - radius);
		ctx.quadraticCurveTo(r, b, r - radius, b);
		ctx.lineTo(x + radius * 2, b);
		ctx.closePath();
		ctx.stroke();
		
		
	}
});
