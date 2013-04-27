KTB.Renderer=function(game)
{
	this.game=game;
	this.ctx = game.canvas.getContext("2d");
	this.width = game.canvas.width;
	this.cx=this.width/2;
	this.height = game.canvas.height;
}

KTB.Renderer.prototype = {

	drawTank: function()
	{
		this.ctx.fillStyle="#333";
		this.ctx.save();
		
		this.game.tank.position.y=this.game.canvas.height-this.game.tank.height/2;
		
		var r=this.game.tank.paintRadius;
		var cx=this.game.tank.position.x;
		var cy=this.game.tank.position.y+this.game.tank.height/2-r*1.5;

		//this.game.tank.angle=30;
		
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
		var x=ball.position.x;
		var y=ball.position.y;
		this.ctx.lineWidth=w*0.4;

		if (ball.number==1)
		{
			this.ctx.beginPath();
			this.ctx.moveTo(x,y+w);
			this.ctx.lineTo(x,y-w);
			this.ctx.lineTo(x-w/2,y-w);
			this.ctx.stroke();		
		}
		if (ball.number==2)
		{
			// 2
			this.ctx.beginPath();
			this.ctx.moveTo(x+w,y+w);
			this.ctx.lineTo(x-w,y+w);
			this.ctx.lineTo(x-w,y);
			this.ctx.lineTo(x+w,y);
			this.ctx.lineTo(x+w,y-w);
			this.ctx.lineTo(x-w,y-w);
			this.ctx.stroke();		
		}
		else if (ball.number==3)
		{
			this.ctx.beginPath();
			this.ctx.moveTo(x-w,y+w);
			this.ctx.lineTo(x+w,y+w);
			this.ctx.lineTo(x+w,y-w);
			this.ctx.lineTo(x-w,y-w);
			this.ctx.moveTo(x+w,y);
			this.ctx.lineTo(x-w,y);
			this.ctx.stroke();		
		}
	},

	drawStar: function(x,y,r,p,m)
	{
		this.ctx.translate(x,y);
	    this.ctx.moveTo(0,0-r);
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
		this.drawCircle(x, y, radius); 
		switch (type)
		{
			case KTB.BallType.NORMAL:
				break;

			case KTB.BallType.PLUS:
				this.ctx.fillStyle="#f00";
				var w=radius*0.2;
				var h=radius*0.6;
				this.drawRect(x-w,y-h,2*w,2*h);
				this.drawRect(x-h,y-w,2*h,2*w);
				break;					
			case KTB.BallType.STAR:
				this.ctx.fillStyle="#f00";
				this.drawStar(x,y,radius*0.8,5,0.5);
				break;
			case KTB.BallType.BOMB:
				this.ctx.fillStyle="#f00";
				this.drawStar(x,y,radius*0.8,10,0.3);
				break;
			case KTB.BallType.DIVIDE:
				this.ctx.fillStyle="#f00";
				this.drawCircle(x-radius/4, y, radius/4); 
				this.drawCircle(x+radius/4, y, radius/4); 
				break;
			case KTB.BallType.STICKY:
				this.ctx.fillStyle="#f0f";
				var w=radius*0.4;
				this.drawRect(x-w,y-w,2*w,2*w);
				break;
			case KTB.BallType.MINUS:
				var w=radius*0.2;
				var h=radius*0.6;
				this.ctx.fillStyle="#f00";
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


	drawline: function(p,q,A,B)
	{
		this.ctx.beginPath();
		this.ctx.moveTo(A+(p%3)*10,B+Math.floor(p/3)*10);
		this.ctx.lineTo(A+(q%3)*10,B+Math.floor(q/3)*10);
		this.ctx.stroke();
	},

	drawText: function(text,cy)
	{
		this.ctx.save();
        this.ctx.lineCap = 'round';

		var cx=(this.width-(text.length-1)*30)/2; // coord. texto

//		this.ctx.fillStyle='white';
//		this.ctx.fillRect(0,0,600,220);
		this.ctx.strokeStyle='#000';
		this.ctx.lineWidth=4;
		f='GIOMJL0AMOIG0IGMO0COMGI0OMGILJ0CBN0OMGIUS0AMGIO0GHN0GHTS0AMIKO0BN0MGHNHIO0MGIO0GIOMG0SGIOM0UIGMO0MGI0IGJLOM0BNO0GMOI0GJNLI0GMNHNOI0GOKMI0GMOIUS0GIMO'.split(0);
		text=text.toUpperCase();
		for (var i=0;i<text.length;i++)
		{
			var P=f[text.charCodeAt(i)-65];
			if (P) {
				for (j=1;j<P.length;j++) 
					this.drawline(P.charCodeAt(j-1)-65,P.charCodeAt(j)-65,cx,cy);
				if (text[i]==='I'||text[i]==='J') this.drawline(3,4,cx,cy);
				if (text[i]==='F'||text[i]==='T') this.drawline(3,5,cx,cy);
				cx+=30;
			}
		}
		this.ctx.restore();
	},

	render: function()
	{
		this.ctx.clearRect(0, 0, this.width,this.height);

		if (game.over)
		{
			this.ctx.fillStyle="#f33";
			this.drawRect(0,0,this.width,this.height);
			this.drawText("Game Over",this.height/3);
		}

		//this.position.y=window.innerHeight-game.tank.width*2.2;//600;

		this.ctx.fillStyle="#333";
		this.ctx.save();
		for (var i=0;i<this.game.balls.length;i++)
			this.drawBall(this.game.balls[i]);
		this.ctx.restore();

		//this.ctx.setLineDash([9]);
		this.ctx.beginPath();
			this.ctx.moveTo(0,this.height-this.game.tank.lineDistance);
			this.ctx.lineTo(this.game.canvas.width,this.height-this.game.tank.lineDistance);
		this.ctx.closePath();
		this.ctx.stroke();

		this.drawTank();

		// Next Circle
		var nx=game.tank.position.x;
		var ny=window.innerHeight-game.tank.width*2.2;
		this.ctx.save();
		//this.drawRect(0,0,300,300);
		
		this.ctx.fillStyle="#fff";
		this.drawCircle(nx,ny,game.tank.paintRadius*0.9);
		this.ctx.fillStyle="#333";
		this.drawCircle(nx,ny,game.tank.paintRadius*0.8);
		this.drawBallType(game.nextBallType,nx,ny,game.tank.paintRadius*0.8);
	}
}