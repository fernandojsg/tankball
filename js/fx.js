KTB.Fx=function()
{
	this.allowVibration=typeof navigator.vibrate !='undefined';

	this.initSounds();
}

//KTX.Fx=

KTB.Fx.prototype={
	
	initSounds: function() {
		var sounds={
			tick:'tick',
			score:'score',
			gameover:'gameover',
			wallstick:'wallstick',
			shoot:'d.wav'
		};

		this.sounds={};
		for (var sound in sounds)
			this.sounds[sound]=new Audio("audio/"+sounds[sound]+".ogg");
	},

	playSound: function(soundId)
	{
		this.sounds[soundId].play();
	},

	vibrate: function(duration)
	{
		if (this.allowVibration)
			navigator.vibrate(duration);
	},
}