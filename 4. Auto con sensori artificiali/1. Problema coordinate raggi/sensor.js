class Sensor{
    constructor(car){
        this.car=car;
        this.rayCount=5; // se mettessimo 1 produrrebbe un errore a rigo 18, perchè avremmo i/0
        this.rayLength=150;
        this.raySpread=Math.PI/2; // PI/4 = 45°

        this.rays=[]; // questo array conterrà i singoli raggi, una volta creati.
    }

    update(){
        this.rays=[];
        for(let i = 0; i < this.rayCount; i++){
            //per definire l'angolo di ogni singolo raggio utilizziamo la funzione lerp
            const rayAngle = lerp(
                this.raySpread/2, // A: 45° / 2
                -this.raySpread/2, // B: 45° / 2
               // i/(this.rayCount-1) // t: i non può essere uguale al valore di this.rayCount, ma solo a this.rayCount-1, come specificato anche nella condizione del ciclo abbiamo detto 
                this.rayCount==1?0.5:i/(this.rayCount-1)
               ) + this.car.angle;
            
            // settiamo il punto di inizio dei raggi
            const start = {x:this.car.x, y:this.car.y}; // i raggi partiranno dal punto centrale interno alla macchina
            // settiamo il punto di fine dei raggi
            const end = {
                x : this.car.x - Math.sin(rayAngle)*this.rayLength, 
                y : this.car.x - Math.cos(rayAngle)*this.rayLength // ERRORE!!!!!!!!! Assegnare this.car.x a y fa in modo che la coordinata y dei raggi punti sempre alla coordinata x !!!!!
            };
            this.rays.push([start,end]); // pushamo inizio e fine dei raggi dentro l'array rays per creare un segmento che costituirà il raggio
        }
    }

    draw(ctx){
        for(let i=0; i < this.rayCount; i++){
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo(
                this.rays[i][0].x, // start location x
                this.rays[i][0].y // start location y
            );
            ctx.lineTo(
                this.rays[i][1].x,
                this.rays[i][1].y 
            );
            ctx.stroke();
        }
    }
}