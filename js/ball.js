KTB.BallStatus={"MOVING":0,"GROWING":1,"STOPPED":2,"EXPLODING":3,"DEAD":4};
KTB.BallType={"NORMAL":0,"PLUS":1,"STAR":2,"BOMB":3,"STICKY":4,"DIVIDE":5,"MINUS":6};

MAX_BALL_NUMBER=9;
BALL_INITIAL_RADIUS=20;

KTB.Ball=function(id,type,angle,speed,cannonPos)
{
	this.id=id;
	this.status=KTB.BallStatus.MOVING;
	this.position=cannonPos.clone();
	this.position.y=game.canvas.height-game.tank.width*2.2;//600;

	this.lastPosition=this.position;
		
	this.color=KTB.Colors.ball_normal;

	this.friction=0.97;
	this.alpha=1.0;

	angle=toRadians(angle);
	this.velocity=new Vector2(Math.cos(angle)*speed,-Math.sin(angle)*speed);
	this.number=3;
	this.type=type;
	this.radius=BALL_INITIAL_RADIUS;
	this.hit=false;
}

KTB.Ball.prototype={

	explode: function()
	{
		this.status=KTB.BallStatus.EXPLODING;
	},

	moving: function()
	{
		return this.status==KTB.BallStatus.MOVING;
	},

	stopBall: function()
	{
		this.status=KTB.BallStatus.STOPPED;
		this.color=	KTB.Colors.ball_stopped;
	},

	tick: function()
	{
		_fieldLeft=0;
		_fieldRight=game.canvas.width;
		_fieldTop=0;
		_fieldBottom=game.canvas.height;
		
		Constants={"restitution":1};
		
		this.lastPosition=this.position;
		switch (this.status)
		{
			case KTB.BallStatus.MOVING:
			{
				this.position.x=this.position.x+this.velocity.x;
				this.position.y=this.position.y+this.velocity.y;
				
				if(this.position.x-this.radius < _fieldLeft )
				{
					this.position.x=this.radius;
					this.velocity.x=-this.velocity.x*Constants.restitution;
					this.velocity.y=this.velocity.y*Constants.restitution;
					this.hit=true;
				}

				if(this.position.x+this.radius > _fieldRight)
				{
					this.position.x=_fieldRight-this.radius;
					this.velocity.x=-this.velocity.x*Constants.restitution;
					this.velocity.y=this.velocity.y*Constants.restitution;
	//				this.hit=true;
				}
				
				if(this.position.y-this.radius < _fieldTop)
				{
					this.position.y=this.radius;
					this.velocity.x=this.velocity.x*Constants.restitution;
					this.velocity.y=-this.velocity.y*Constants.restitution;
	//				this.hit=true;
				}

				if(this.position.y+this.radius > _fieldBottom)
				{
					this.position.y=_fieldBottom-this.radius;
					this.velocity.x=this.velocity.x*Constants.restitution;
					this.velocity.y=-this.velocity.y*Constants.restitution;
	//				this.hit=true;
				}
				
				this.velocity=this.velocity.multiplyScalar(this.friction);

				//_throwingBall=false;
				var BALL_SPEED_STOPPED=0.9;
				if (this.velocity.length()<BALL_SPEED_STOPPED)
				{
					this.status=KTB.BallStatus.GROWING;
					this.color=KTB.Colors.ball_growing;
				}
			} break;
			
			case KTB.BallStatus.GROWING:
			{
				BALL_GROWING_SPEED=2;
				if (this.position.x-this.radius>_fieldLeft &&
					this.position.x+this.radius<_fieldRight &&	
					this.position.y-this.radius>_fieldTop &&
					this.position.y+this.radius<_fieldBottom-game.tank.lineDistance && !this.collideWithBalls()
					)
				{
					this.radius+=BALL_GROWING_SPEED;
				} 
				else
				{
					//@todo clamp inc
					this.status=KTB.BallStatus.STOPPED;
					game.throwingBall=false;
					this.color=	KTB.Colors.ball_stopped;
				}
	//				status=BALL_STATUS_STOPPED;
			} break;

			case KTB.BallStatus.EXPLODING:
			{
				this.radius*=1.2;
				this.alpha-=0.1;
				if (this.alpha<=0.0)
				{
					this.alpha=0;
					this.status=KTB.BallStatus.DEAD;
					if (!game.over)
						game.score++;
					//game.balls.splice(this.id,1);
					//!!!!!!!!! game.removeBallFromList(this.id);
				}
				//KTB.BallStatus
			}
		}			
	},

	gameOver: function()
	{
		if (this.position.y+this.radius>game.canvas.height-game.tank.lineDistance)
		{
			this.color="#f00";
			return true;
		}
		return false;
		//return game.tank.lineDistance
		//return false;
	},

	collideWithBalls: function()
	{
		for (var i=0;i<game.balls.length;i++)
		{
			var ball=game.balls[i];
			if (ball==this)
				continue;
			else if (this.colliding(ball))
				return true;
		}
		return false;
	},

	processCollision: function(ball)
	{
		this.hit=true;
		var updatePosition=true;
		var refresh=false;

		var speed = Math.sqrt(this.velocity.x*this.velocity.x+this.velocity.y*this.velocity.y);
		var angle = Math.atan2(this.position.y - ball.position.y, this.position.x - ball.position.x);

		switch (this.type)
		{
			case KTB.BallType.PLUS:
				ball.number++;
				if (ball.number>MAX_BALL_NUMBER)
					ball.number=MAX_BALL_NUMBER
				break;
			case KTB.BallType.MINUS:
				ball.radius/=2;
				ball.number--;
				if (ball.radius<BALL_INITIAL_RADIUS)
					ball.radius=BALL_INITIAL_RADIUS;
				break;
			case KTB.BallType.STAR:
				ball.number=0;
				break;
			case KTB.BallType.DIVIDE:
				if (ball.number>0)
				{
					ball.number--;
					if (ball.radius>BALL_INITIAL_RADIUS)
					{
						var prop0=Math.random();
						if (prop0<0.2)
							prop0=0.2;

						var angle=Math.random()*Math.PI*2;
						prop1=1-prop0;
						prop0=prop1=0.5;

						var rad0=prop0*ball.radius;
						var rad1=prop1*ball.radius;
						var pos=ball.position.clone();

						ball.radius=rad0;
						ball.position.set(	pos.x+Math.cos(angle)*rad0,
											pos.y+Math.sin(angle)*rad0);
						var ball1=new KTB.Ball(game.balls.length,KTB.BallType.NORMAL,0,0,new Vector2(0,0));
						ball1.position.set(
									pos.x+Math.cos(angle+Math.PI)*rad1,
									pos.y+Math.sin(angle+Math.PI)*rad1);

						ball1.radius=rad1;
						ball1.number=ball.number;
						//game.balls.splice(0,0,ball1);
						game.appendBallToList(0,ball1);
						refresh=true;
					}
				}
				break;
			case KTB.BallType.BOMB:
				ball.number=0;
				updatePosition=0;
				break;
			case KTB.BallType.STICKY:
				this.stopBall();
				game.throwingBall=false;
				updatePosition=false;
				ball.number--;
				break;
			default:
				ball.number--;
				break;
		}

		if (ball.number<=0)
			ball.explode();

		if (updatePosition)
			this.velocity.set(speed * Math.cos(angle),speed * Math.sin(angle));

		return refresh;
	},

	colliding: function(ball)
	{
		if (ball.status>=KTB.BallStatus.EXPLODING)
			return;

//if (ball==this)
//				return false;
	    var xd = this.position.x - ball.position.x;
	    var yd = this.position.y - ball.position.y;

	    var sumRadius = this.radius + ball.radius;
	    var sqrRadius = sumRadius * sumRadius;

	    var distSqr = (xd * xd) + (yd * yd);

	    if (distSqr <= sqrRadius)
	        return true;
	 	   
	    return false;
	}

}
