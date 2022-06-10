class Car{
    constructor(x,y,width,height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=3;
        this.friction=0.05;
        this.angle=0;

        this.controls=new Controls();
    }

    update(){
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }
        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }
        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){ // se il valore assoluto (sia in avanzamento che retromarcia) è minore della frizione (cioè meno di 0.05), allora la velocità diventa 0
            this.speed=0;
        }
        if(this.controls.left){
            this.angle+=0.03;
        }
        if(this.controls.right){
            this.angle-=0.03;
        }
        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx) { 
        ctx.save(); // salviamo il canvas context
        ctx.translate(this.x, this.y); // trasliamo il rettangolo alla coordinata(x,y) in cui vogliamo centrare la rotazione
        ctx.rotate(-this.angle); // ruotiamo il rettangolo
        ctx.beginPath(); 
        // rimuoviamo this.x e this.y perchè abbiamo già traslato il rettangolo alla coordinata che ci interessa
        ctx.rect(-this.width/2, -this.height/2, this.width, this.height);

        ctx.fill(); 
        ctx.restore(); // chiamiamo il metodo restore() perchè altrimenti si entrerebbe in un loop 
        // di traslazione e rotazione ad ogni frame dell'animazione
    }
}