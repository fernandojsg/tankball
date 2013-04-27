var KTB = KTB || {};

var clock=new Clock();

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


function toRadians (angle) {
  return angle * (Math.PI / 180);
}
