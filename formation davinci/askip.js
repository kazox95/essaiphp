// Width of paths
var SIZE = 2.5;

// Max length of path before direction change
var LENGTH = 20;

// Max number of particles
var MAX = 100;

// Max particle life (seconds)
var LIFE = 8;


var canvas = document.getElementsByTagName("canvas")[0];
var ctx = canvas.getContext("2d");
var w = canvas.width = window.innerWidth;
var h = canvas.height = window.innerHeight;


var particles = [];

function getRandomInt() {
  min = LIFE * 0.75;
  return Math.floor(Math.random() * (LIFE - min)) + min;
}

// Vector class
class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  get() {
    return new Vector(this.x, this.y);
  }
  add(v) {
    this.x += v.x, this.y += v.y;
  }
  sub(v) {
    this.x -= v.x, this.y -= v.y;
  }
  multi(v) {
    this.x *= v, this.y *= v;
  }
  divide(v) {
    this.x /= v, this.y /= v;
  }
  mag() {
      return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2));
  }
  normalize() {
    this.divide(this.mag());
  }
  rotate(cx, cy, angle) {
    const radians = (Math.PI / 180) * angle;
    const cos = Math.cos(radians);
    const sin = Math.sin(radians);

    this.x = (cos * (this.x - cx)) + (sin * (this.y - cy)) + cx;
    this.y = (cos * (this.y - cy)) - (sin * (this.x - cx)) + cy;
  }
}


var values = [-60, 60];

var t = new Vector(w / 2, h / 2);
var p = new Vector(w / 2, h / 2);


var rotateVector = function(v, ang)
{
    ang = -ang * (Math.PI/180);
    var cos = Math.cos(ang);
    var sin = Math.sin(ang);
    return new Vector(Math.round(10*(v.x * cos - v.y * sin))/10, Math.round(10*(v.x * sin + v.y * cos))/10);
};

function Particle() {
  return {
      t: new Vector(w / 2, h / 2),
      p: new Vector(w / 2, h / 2),
      v: new Vector(Math.cos( Math.PI * 2 / 6 ), Math.sin( Math.PI * 2 / 6 )),
      life: getRandomInt(),
    };
}

var tick = 0;
function draw() {
  
  requestAnimationFrame(draw);
  
  tick += 0.1;
  
  if ( particles.length < MAX ) {
    particles.push(new Particle);
  }
  
  // Background
  ctx.shadowBlur = 0;
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = 'rgba(0,0,0,.04)';
  ctx.fillRect( 0, 0, w, h );
  
  ctx.shadowBlur = 3;
  ctx.globalCompositeOperation = 'lighter'; 
  
  // Particles
  for ( var i = 0; i < particles.length; i++ ) {
    var particle = particles[i];
    
    particle.p.add(particle.v);

    ctx.shadowColor = ctx.fillStyle = `hsla(${tick},80%,50%,.8)`;
    ctx.fillRect( particle.p.x, particle.p.y, SIZE, SIZE );   

    var t = particle.t.get();
    t.sub(particle.p);    

    if ( t.mag() >= LENGTH ) {
      var a = values[Math.floor(Math.random() * values.length)]
      particle.v = rotateVector(particle.v, a);
      particle.t = particle.p.get();
    }

    particle.life -= 1 / 60;
    
    if ( particle.life <= 0 ) {
      particles[i] = new Particle;
    }   
  }
}

draw();