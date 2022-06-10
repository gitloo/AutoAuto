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
            this.x-=2;
        }
        if(this.controls.right){
            this.x+=2;
        }

        this.y-=this.speed;
    }

    draw(ctx) { // disegniamo la macchina come semplice rettangolo
        ctx.beginPath(); // il rettangolo comincerà in una posizione x e y della finestra
        ctx.rect(this.x-this.width/2, this.y-this.height/2, this.width, this.height); // CONTROLLARE SEMPRE CORRETTEZZA WIDTH E HEIGHT
            // la x della macchina si troverà al centro della larghezza (larghezza/2)
            // la y della macchina si troverà al centro dell'altezza (altezza/2)
            // definiamo larghezza
            // definiamo altezza
        ctx.fill(); // con fill chiediamo al context di riempire il rettangolo
    }
}