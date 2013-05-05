KTB.Game=function()
{
	this.canvas=document.getElementById("gamecanvas");
	this.canvas.height = 600;	
  	this.canvas.width  = 400;
  	
	this.renderer=new KTB.Renderer(this);
	
	this.tank=new KTB.Tank(this.canvas.width,this.canvas.height);
	this.reset();
}

KTB.Game.prototype = {

	reset: function ()
	{
		this.score=0;
		this.hiscore=localStorage.getItem("hiscore");
		if (!this.hiscore)
			this.hiscore=0;

		this.over=false;
		this.balls=[];
		this.throwingBall=false;
		this.nextBallType=KTB.BallType.NORMAL;
	},

	incScore: function()
	{
		this.score++;
		if (this.score>this.hiscore)
		{
			localStorage.setItem("hiscore",this.score);
			this.hiscore=this.score;
		}
	},

	update: function()
	{
		clock.tick();
			
		for (var i=0;i<this.balls.length;i++)
			this.balls[i].tick();

		if (this.balls.length>0 && !this.over)
		{
			var ballA=this.balls[this.balls.length-1];

			if (ballA.status==KTB.BallStatus.MOVING)
			{
				// Ball to Ball collision
				for (var i=0;i<this.balls.length-1;i++)
				{
					var ballB=this.balls[i];
					if (ballA.colliding(ballB))
					{
						if (ballA.processCollision(ballB))
						{
							this.checkGameOver(ballA);
							return;
						}
					}
				}
				this.checkGameOver(ballA);
			}
		}
			
		this.tank.tick(clock.delta);
		this.renderer.render();
	},

	touchDown:function ()
	{
		if (this.over)
		{
			this.reset();
		}
		else
			this.addBall();
	},

	checkGameOver: function(ball)
	{
		if (ball.hit && (this.over=ball.gameOver()))
		{
			for (var i=0;i<this.balls.length;i++)
				this.balls[i].explode();
		}
	},

	reorderIds: function()
	{
		for (var i=0;i<this.balls;i++)
			this.balls[i].id=i;
	},

	removeBallFromList: function(pos)
	{
		this.balls.splice(pos,1);
		this.reorderIds();
	},

	appendBallToList: function(pos,ball)
	{
		this.balls.splice(pos,0,ball);
		this.reorderIds();
	},

	addBall: function()
	{
		if (this.throwingBall)
			return;

		this.throwingBall=true;

		var ball=new KTB.Ball(this.balls.length,this.nextBallType,180-this.tank.angle,20,this.tank.position);
		this.nextBallType=Math.random()>0.5?parseInt(Math.random()*7):0;
		
		//this.balls.push(ball);
		this.appendBallToList(this.balls.length,ball);
	}
}
