var c = document.getElementById("canvas");
var ctx = c.getContext("2d");
var points, cell, table, pointsm, gradient, mouse, rotation;

function resize() {
	var box = c.getBoundingClientRect();
	c.width = 500;
	c.height = 500;
	points  = [];
	rotation = 0;
	cell = {
		width: c.width/20,
		height: c.height/20
	};
	table = {
		x: cell.width*2,
		y: cell.height*2,
		mx: (c.width / 2) -  (cell.width * cell.width),
		my: (c.height / 2) - (cell.height * cell.height)
	};
}

var pointer = {
	x:  0, y:  0,
	ex: 0, ey: 0,
	move: function (e) {
		var pointer = e.targetTouches ? e.targetTouches[0] : e;
		this.x = pointer.clientX;
		this.y = pointer.clientY;
	},
	ease: function (steps) {
		this.ex += (this.x - this.ex) / steps;
		this.ey += (this.y - this.ey) / steps;
		this.ex = Math.round(this.ex * 100) / 100;
		this.ey = Math.round(this.ey * 100) / 100;
	}
};

function Point (x, y) {
	this.x = 0;
	this.y = 0;
	this.x0 = x;
	this.y0 = y;
	this.dist = 0;
	this.dx = 0;
	this.dy = 0;
	this.s = randomLetter();
}

function drawBackground(){
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, c.width, c.height);
}

Point.prototype.drawCenterLetters = function () {
	this.dx = (pointer.ex - table.mx) - this.x0 * cell.width;
	this.dy = (pointer.ey - table.my) - this.y0 * cell.height;
	this.dist = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
	if (this.dist < 200) {
		var scale = Math.cos(0.5 * Math.PI * this.dist / 200);
		this.x = (this.x0 * cell.width) - (this.dx * scale) - (cell.width * cell.width) - pointer.ex + c.width;
		this.y = (this.y0 * cell.height) - (this.dy * scale) - (cell.height * cell.height) - pointer.ey + c.height;
		var size = 80*scale;
		var half_size = size/2;
		ctx.save();
		ctx.fillStyle = "#fff";
		ctx.globalAlpha = 0.9;
		ctx.font = scale*20+"px Arial";
		ctx.fillText(this.s, this.x-half_size, this.y-half_size);
		ctx.restore();
	}
};


function drawAnimation(){
	pointer.ease(20);
	drawBackground();
	for (var i = 0; i < points.length; i++) {
		points[i].drawCenterLetters();
	}
}

function draw() {
	ctx.clearRect(0, 0, c.width, c.height);
	drawAnimation();
	requestAnimationFrame(draw);
}

function start() {
	resize();
	for (var y = 0; y < table.y; y++) {
		for (var x = 0; x < table.x; x++) {
			points.push(
				new Point(x, y)
			);
		}
	}
	draw();
}

function randomLetter() {
    var letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters[Math.floor(Math.random() * letters.length)];
}

c.addEventListener("mousemove", pointer.move.bind(pointer), false);
window.onresize = start;
start();
