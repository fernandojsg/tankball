KTB.Tank=function(width,height)
{
	this.width=20;
	this.height=50;
	this.angle=0;
	this.speed=50;
	this.position=new Vector2(width/2,height);
	this.minAngle=30;
	this.shottingDif=0;

	this.lineDistance=110;

	this.paintRadius=this.width*1.5;
}

KTB.Tank.prototype = {
	tick: function(delta)
	{
//		this.shottingDif=Math.sin(this.angle/2);
		this.angle+=this.speed*delta;
		
		if (this.angle<this.minAngle)
		{
			this.speed=-this.speed;
			this.angle=this.minAngle;
		}
		else if (this.angle>180-this.minAngle)
		{
			this.speed=-this.speed;
			this.angle=180-this.minAngle;
		}
	}
}
