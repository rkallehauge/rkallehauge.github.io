/**
 *   Author  : Rasmus Wissing Kallehauge
 *   Email   : rkallehauge@gmail.com
 *   Created : Nov 5, 2018, 12:25:35 PM 
 */

var canvas = document.getElementById('canvas');

var h = window.innerHeight;
var w = window.innerWidth;


canvas.width = w;
canvas.height = h;

var c = canvas.getContext('2d');


//c.fillRect(100, 100, 50, 50);
//
//
//c.beginPath();
//
//c.moveTo(200, 200);
//c.lineTo(300, 200);
//c.lineTo(200, 100);
//c.lineTo(200, 200);
//
//c.strokeStyle = 'rgba(0,0,255,0.5)';
//c.stroke();
//
//
//for(var i = 0; i < 100; i++){
// 
//    var x , y;
//    var r, g, b;
//    
//    x = Math.random() * window.innerWidth;
//    y = Math.random() * window.innerHeight;
//
//    r = Math.floor(Math.random() * 255);
//    g = Math.floor(Math.random() * 255);
//    b = Math.floor(Math.random() * 255);
//    
//    
//c.beginPath();
//c.arc(x, y, 35, 0, Math.PI * 2, false);
//c.stroke();
//c.strokeStyle = "rgb(" + r + "," + g + "," + b + ")";
//
//}


window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
});

var mouse = {   
    x : undefined,
    y : undefined
};
    var minRadius = 5;
    var maxRadius = 50;
    
function randomColor(){
    var r,g,b;
    r = Math.floor(Math.random()*256);
    g = Math.floor(Math.random()*256);
    b = Math.floor(Math.random()*256);
    
    return "rgb(" + r + "," + g + "," + b + ")";
}

function Circle(x, y, xVel, yVel, radius, number){
    this.x = x;
    this.y = y;
    this.xVel = xVel;
    this.yVel = yVel;
    this.radius = radius;
    this.minRadius = radius;
    this.maxRadius = minRadius * 10;
    
    this.number = number;
    
    this.color = randomColor();
    
    this.speed = 1;
    
    this.draw = () => {
        
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        
        
        c.fillStyle = this.color;
        c.fill();
        
        
    
    }
    
    this.update = () => {
    
        if((this.x + this.radius) > window.innerWidth || (this.x - this.radius) < 0){
            this.xVel = (-this.xVel);
        }

        if((this.y + this.radius) > window.innerHeight || (this.y - this.radius) < 0){
            this.yVel = (-this.yVel);
        }
        
        if(mouse.x - this.x < 50 && mouse.x - this.x > -50 && mouse.y - this.y < 50 && mouse.y - this.y > -50){
            if(this.radius < this.maxRadius){   
            this.radius++;
            this.speed = 0.5;
            }
        } else if(this.radius > this.minRadius){
            this.radius--;
            this.speed = 1;
        }
        
        
        this.x += (this.xVel * this.speed);
        this.y += (this.yVel * this.speed);
        
        this.draw();
    }
    
}





var circles = [];


for(var i = 0; i < 100; i++){

    var radius = Math.random() * 5 + 2;
    
    var x = ((Math.random() * (w - radius * 2)) + radius);
    var y = ((Math.random() * (h - radius *2 )) + radius);
 

    // 2 to 10
    var xVel = (Math.random() * 4) - 2;
    var yVel = (Math.random() * 4) - 2;


    var myCircle = new Circle(x, y, xVel, yVel, radius, i);
    
    circles.push(myCircle);
}
 
function animate(){
    
    
    c.clearRect(0,0,innerWidth,innerHeight);
    
    for(var i = 0; i < circles.length; i++){
        circles[i].update();
    }
    
//    c.beginPath();
//    c.arc(x,y, radius, 0, Math.PI * 2, false);
//    c.strokeStyle = "blue";
//    c.stroke();
    
    requestAnimationFrame(animate);
}

animate();