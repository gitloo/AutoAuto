class Car{
    constructor(x,y,width,height,controlType,maxSpeed=3) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        this.angle=0;
        this.damaged=false

        if(controlType!="DUMMY"){
            this.sensor = new Sensor(this);
        }
        // come parametro per la classe Sensor dovremmo passare un oggetto Car e con this riusciamo a richiamare tutte le proprietà di questa classe 
        this.controls = new Controls(controlType);
    }

    update(roadBorders, traffic){
        if(!this.damaged){ // se la macchina si danneggia non deve potersi muovere
            this.#move(); // # davanti a un metodo lo rende privato, accessibile soltanto dalla classe che lo implementa
            this.polygon = this.#createPolygon();
            this.damaged=this.#assesDamage(roadBorders, traffic);
        }
        if(this.sensor){
            this.sensor.update(roadBorders, traffic);
        }

    }

    #assesDamage(roadBorders, traffic){
        for(let i = 0; i < roadBorders.length; i++) { // cicliamo lungo tutti i bordi
            if(polysIntersect(this.polygon,roadBorders[i])){ // se l'auto poligono interseca i bordi (segmento) della strada restituisci true a this.damaged
                return true;
            }
        }
        for(let i = 0; i < traffic.length; i++) { // cicliamo lungo tutte le auto del traffico
            if(polysIntersect(this.polygon,traffic[i].polygon)){ // se l'auto poligono interseca altre auto (cioè segmenti che compongono poligoni) restituisci true a this.damaged
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points=[];
        const rad = Math.hypot(this.width,this.height)/2; // otteniamo la metà dell'ipotenusa derivata da larghezza e altezza del rettangolo della macchina
        const alpha = Math.atan2(this.width, this.height); // otteniamo l'angolo compreso tra ipotenusa e altezza
        // top-right point del rettangolo 
        points.push({
            x : this.x - Math.sin(this.angle - alpha)*rad, // x del centro della macchina - (seno di (0 - arcotangente dell'ipotenusa)) * ipotenusa/2
            y : this.y - Math.cos(this.angle - alpha)*rad, // y del centro della macchina - (coseno di (0 - arcotangente dell'ipotenusa)) * ipotenusa/2
        });         
        // top-left point del rettangolo 
        points.push({
            x : this.x - Math.sin(this.angle + alpha)*rad, // x del centro della macchina - (seno di (0 + arcotangente dell'ipotenusa)) * ipotenusa/2
            y : this.y - Math.cos(this.angle + alpha)*rad, // y del centro della macchina - (coseno di (0 + arcotangente dell'ipotenusa)) * ipotenusa/2
        });         
        // bottom-right point del rettangolo 
        points.push({
            x : this.x - Math.sin(Math.PI + this.angle - alpha)*rad, // x del centro della macchina - (seno di (180° + this.angle - arcotangente dell'ipotenusa)) * ipotenusa/2
            y : this.y - Math.cos(Math.PI + this.angle - alpha)*rad, // y del centro della macchina - (coseno di (180° + this.angle - arcotangente dell'ipotenusa)) * ipotenusa/2
        });         
        //bottom-left point del rettangolo 
        points.push({
            x : this.x - Math.sin(Math.PI + this.angle + alpha)*rad, // x del centro della macchina - (seno di (180° + this.angle + arcotangente dell'ipotenusa)) * ipotenusa/2
            y : this.y - Math.cos(Math.PI + this.angle + alpha)*rad, // y del centro della macchina - (coseno di (180° + this.angle + arcotangente dell'ipotenusa)) * ipotenusa/2
        });

        return points;
    }

    #move(){
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
        if(this.speed!=0){
            const flip = this.speed>0?1:-1 
            if(this.controls.left){
                this.angle+=0.03*flip; // quando la macchina ha una velocità positiva l'aggiunta di flip non cambierà nulla in quanto il suo valore è 1.
            }
            if(this.controls.right){
                this.angle-=0.03*flip;  // quando la macchina procederà all'indietro l'aggiunta di flip (con valore -1) invertirà il segno della sottrazione (-0.03 diventerà 0.03).
            }
            // il valore di flip dipenderà dalla velocità: se speed è maggiore di 0 flip sarà 1 | se speed è 0 flip sarà -1. In questo modo sarà possibile invertire la rotazione nel momento in cui si procede in retromarcia
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    draw(ctx, color) { 
/*      ctx.save(); // salviamo il canvas context
        ctx.translate(this.x, this.y); // trasliamo il rettangolo alla coordinata(x,y) in cui vogliamo centrare la rotazione
        ctx.rotate(-this.angle); // ruotiamo il rettangolo
        ctx.beginPath(); 
        // rimuoviamo this.x e this.y perchè abbiamo già traslato il rettangolo alla coordinata che ci interessa
        ctx.rect(-this.width/2, -this.height/2, this.width, this.height);

        ctx.fill(); 
        ctx.restore(); // chiamiamo il metodo restore() perchè altrimenti si entrerebbe in un loop 
        // di traslazione e rotazione ad ogni frame dell'animazione 
*/
//      INVECE DI DISEGNARE IL RETTANGOLO ORA DISEGNIAMO IL POLIGONO CON I PUNTI CHE ABBIAMO CREATO 
        if(this.damaged){
            ctx.fillStyle="gray";
        } else {
            ctx.fillStyle=color;
        }
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i = 0; i < this.polygon.length; i++){
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();
        if(this.sensor){ // se esiste un sensore allora disegniamolo
            this.sensor.draw(ctx);
        }

    }
}