KTB.Renderer=function(game)
{
	this.game=game;
	this.ctx = game.canvas.getContext("2d");
}

KTB.Renderer.prototype = {

	onCanvasResized: function(width,height)
	{
		this.width = width;
		this.cx=width/2;
		this.height = height;
	},

	drawTank: function()
	{
		this.ctx.fillStyle=KTB.Colors.tank;
		this.ctx.save();
		
		this.game.tank.position.y=this.game.canvas.height-this.game.tank.height/2;
		
		var r=this.game.tank.paintRadius;
		var cx=this.game.tank.position.x;
		var cy=this.game.tank.position.y+this.game.tank.height/2-r*1.5;

		this.ctx.translate(cx,cy);
		this.ctx.rotate(toRadians(90+this.game.tank.angle));
		this.ctx.translate(-cx,-cy);
		
		this.ctx.fillRect(	this.game.tank.position.x-this.game.tank.width/2,
							cy,
							this.game.tank.width,
							this.game.tank.height+this.game.tank.shottingDif);
		
		this.ctx.restore();
		
		//this.drawCircle(cx,this.game.canvas.height,this.game.tank.width*1.5);
		this.drawCircle(cx,this.game.canvas.height-r*1.5,r);
		this.drawRect(cx-r,cy,r*2,r*2);
	},

	drawCircle: function(x,y,radius)
	{
		this.ctx.beginPath();
		this.ctx.arc(x,y,radius, 0, Math.PI*2, true);
		this.ctx.closePath();
		this.ctx.fill();
	},
	
	drawRect: function(x,y,w,h)
	{
		this.ctx.beginPath();
		this.ctx.rect(x,y,w,h);
		this.ctx.closePath();
		this.ctx.fill();		
	},

	drawBallNumber:function(ball)
	{
		var w=ball.radius*0.4;
		this.ctx.fillStyle="#f00";
		this.ctx.strokeStyle=KTB.Colors.ball_number;
		var x=ball.position.x;
		var y=ball.position.y;
		this.ctx.lineWidth=w*0.4;

		this.drawText(ball.number.toString(),x-ball.radius*0.32,y-ball.radius*0.55,ball.radius*0.3);
	},

	drawStar: function(x,y,r,p,m)
	{
		this.ctx.translate(x,y);
	    this.ctx.moveTo(0,0-r);
	    this.ctx.beginPath();
	    for (var i = 0; i < p; i++)
		{
			this.ctx.rotate(Math.PI / p);
			this.ctx.lineTo(0, 0 - (r*m));
			this.ctx.rotate(Math.PI / p);
			this.ctx.lineTo(0, 0 - r);
		}
		this.ctx.fill();
		this.ctx.restore();
	},

	drawBallType: function(type,x,y,radius)
	{
		this.ctx.fillStyle=KTB.Colors.ball_normal;
		this.drawCircle(x, y, radius); 
		this.ctx.fillStyle=KTB.Colors.item;

		switch (type)
		{
			case KTB.BallType.NORMAL:
				break;

			case KTB.BallType.PLUS:
				var w=radius*0.2;
				var h=radius*0.6;
				this.drawRect(x-w,y-h,2*w,2*h);
				this.drawRect(x-h,y-w,2*h,2*w);
				break;					
			case KTB.BallType.STAR:
				this.drawStar(x,y,radius*0.8,5,0.5);
				break;
			case KTB.BallType.BOMB:
				this.drawStar(x,y,radius*0.8,10,0.3);
				break;
			case KTB.BallType.DIVIDE:
				this.drawCircle(x-radius/4, y, radius/4); 
				this.drawCircle(x+radius/4, y, radius/4); 
				break;
			case KTB.BallType.STICKY:
				var w=radius*0.4;
				this.drawRect(x-w,y-w,2*w,2*w);
				break;
			case KTB.BallType.MINUS:
				var w=radius*0.2;
				var h=radius*0.6;
				this.drawRect(x-h,y-w,2*h,2*w);
				break;
		}
	},

	drawBall: function(ball)
	{
		this.ctx.fillStyle=ball.color;
		
		//this.drawCircle(ball.position.x, ball.position.y, ball.radius);

		this.ctx.globalAlpha=ball.alpha;
		
/*		
		_paint.setStrokeWidth(0.2f*_metricsScale*radius);
		_canvas.drawCircle(position.x,position.y,radius*0.8f,_paint);
		_paint.setStyle(Style.FILL);
		_canvas.drawRect(position.x-radius*0.4f,position.y-radius*0.7f,position.x-radius*0.3f,position.y+radius*0.7f,_paint);
		_canvas.drawRect(position.x+radius*0.4f,position.y-radius*0.7f,position.x+radius*0.3f,position.y+radius*0.7f,_paint);
		_paint.setStyle(Style.FILL);
*/
		
		// SIMPLE

		var x=ball.position.x;
		var y=ball.position.y;
		
		if (ball.moving())
		{
			this.drawBallType(ball.type,ball.position.x,ball.position.y,ball.radius);
		}
		else
		{
			this.drawCircle(ball.position.x, ball.position.y, ball.radius);
			this.drawBallNumber(ball);
		}
/*
		// CROSS
*/
		


/*		
		this.ctx.fillStyle="#fff";
		this.ctx.font="20pt Arial";
		this.ctx.fillText(ball.number,ball.position.x,ball.position.y);
*/		
		this.ctx.globalAlpha=1.0;
	},


	drawline: function(p,q,x,y,size)
	{
		this.ctx.beginPath();
		this.ctx.moveTo(x+(p%3)*size,y+Math.floor(p/3)*size);
		this.ctx.lineTo(x+(q%3)*size,y+Math.floor(q/3)*size);
		this.ctx.stroke();
	},

	drawText: function(text,cx,cy,size)
	{
		this.ctx.save();
		
        this.ctx.lineCap = 'square';
     	this.ctx.lineWidth=size*0.45;
		
		// first numerics
		var alpha='GIOMJL0AMOIG0IGMO0COMGI0OMGILJ0CBN0OMGIUS0AMGIO0GHN0GHTS0AMIKO0BN0MGHNHIO0MGIO0GIOMG0SGIOM0UIGMO0MGI0IGJLOM0BNO0GMOI0GJNLI0GMNHNOI0GOKMI0GMOIUS0GIMO';
		var numeric='MOCAM0NBA0OMGICA0MOIGICA0OCIGA0MOIGAC0CAMOIG0OCA0MOCAMGI0OCAGI';
		f=(alpha+"0"+numeric).split(0);

		text=text.toUpperCase();
		for (var i=0;i<text.length;i++)
		{
			code=text.charCodeAt(i);
			if (code<58)
				code=code-48+alpha.split(0).length;
			else
				code-=65;

			var P=f[code];
			
			if (P) {
				for (j=1;j<P.length;j++) 
					this.drawline(P.charCodeAt(j-1)-65,P.charCodeAt(j)-65,cx,cy,size);
				if (text[i]==='I'||text[i]==='J') this.drawline(3,4,cx,cy,size);
				if (text[i]==='F'||text[i]==='T') this.drawline(3,5,cx,cy,size);
				cx+=3*size;
			}
		}
		this.ctx.restore();
	},

	render: function()
	{
		this.ctx.clearRect(0, 0, this.width,this.height);
		
		this.ctx.save();
		this.ctx.fillStyle=KTB.Colors.gameboard;
		this.drawRect(0, 0, this.width,this.height);
		this.ctx.strokeStyle=KTB.Colors.gameboard_border;
		this.ctx.lineWidth=8;
		this.ctx.stroke();
		this.ctx.restore();
		
		if (game.over)
		{
			this.ctx.fillStyle="#f33";
			this.drawRect(0,0,this.width,this.height);
			var text="gameover";
			this.drawText(text,(this.width-(text.length-1)*30)/2,this.height/3,10);
		}

		this.ctx.strokeStyle=KTB.Colors.score;
		this.drawText(game.score.toString(),this.width/8,this.height-game.tank.lineDistance/1.5,10);

		this.ctx.strokeStyle=KTB.Colors.hiscore;
		this.drawText("hiscore",this.width/1.4,this.height-game.tank.lineDistance/1.5,4);
		this.drawText(game.hiscore.toString(),this.width/1.4,this.height-game.tank.lineDistance/2.4,4);
		
		this.ctx.save();
		for (var i=0;i<this.game.balls.length;i++)
			this.drawBall(this.game.balls[i]);
		this.ctx.restore();

		//this.ctx.setLineDash([9]);
		this.ctx.strokeStyle=KTB.Colors.tank_line;
		this.ctx.beginPath();
			this.ctx.moveTo(0,this.height-this.game.tank.lineDistance);
			this.ctx.lineTo(this.game.canvas.width,this.height-this.game.tank.lineDistance);
		this.ctx.closePath();
		this.ctx.stroke();

		this.drawTank();

		// Next Circle
		var nx=game.tank.position.x;
		var ny=game.canvas.height-game.tank.width*2.2;
		this.ctx.save();
		
		//this.ctx.fillStyle=KTB.Colors.preview_border;
		//this.drawCircle(nx,ny,game.tank.paintRadius*0.9);
		this.ctx.fillStyle=KTB.Colors.ball_normal;
		this.drawCircle(nx,ny,game.tank.paintRadius*0.8);
		this.drawBallType(game.nextBallType,nx,ny,game.tank.paintRadius*0.8);
	}
}