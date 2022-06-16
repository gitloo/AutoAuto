class Sensor{
    constructor(car){
        this.car=car;
        this.rayCount=5; // se mettessimo 1 produrrebbe un errore a rigo 63, perchè avremmo i/0
        this.rayLength=150;
        this.raySpread=Math.PI/4; // PI/4 = 45°

        this.rays=[]; // array che conterrà i singoli raggi, una volta creati.
        this.readings=[]; // istanziamo un array di valori per ogni raggio, che diranno se è presente un bordo e quanto è distante
    }

    update(){
        this.#castRays(); 
        this.readings=[]; // inizializziamo l'array
        for(let i = 0; i < this.rays.length; i++) {
            this.readings.push(
                this.#getReading(this.rays[i], roadBorders) // metodo che prende i raggi e i bordi come parametri
            );
        }
    }

    #getReading(ray,roadBorders){
        // verifichiamo dove i raggi toccano i bordi della strada
        let touches=[];

        for(let i = 0; i < roadBorders.length; i++){
            const touch = getIntersection(
                ray[0], // x
                ray[1], // y
                roadBorders[i][0], // offset startpoint
                roadBorders[i][1]  // offset endpoint
            );
            if(touch){
                touches.push(touch);
            }
            // se non tocchiamo i bordi, non accade nulla, quindi non serve aggiungere nulla all'array
        }

        if(touches.length == 0){
            return null;
        } else {
            // vogliamo tutti gli offset (la lunghezza del segmento) di tutti gli elementi di touches[]
            const offsets = touches.map(e => e.offset); //: il metodo array.map scorre tutti gli elementi dell'array e per ogni elemento prende il suo offset
            // touches.map(e => e.offsets)  restituisce un nuovo array chiamato offsets

            // vogliamo sapere quale è l'offset più piccolo, poichè indicherà qual è il bordo di strada o oggetto più vicino
            const minOffset = Math.min(...offsets); // Math.min non accetta array come parametro MA l'operatore ... espande gli elementi contenuti nell'array offsets rendendoli elementi individuali diversi, permettendo così il metodo Math.min
            return touches.find(e => e.offset == minOffset) // se l'offset dell'elemento touch è uguale all'offset minimo, il metodo find restituirà quell'elemento touch dall'array touches.
            // scorri l'array touches, trova l'elemento touch il cui offset è uguale al'offset minimo e returnalo.
        }   
    }

    #castRays(){
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
                y : this.car.y - Math.cos(rayAngle)*this.rayLength // ERRORE!!!!!!!!! Assegnare this.car.x a y fa in modo che la coordinata y dei raggi punti sempre alla coordinata x !!!!!
            };
            this.rays.push([start,end]); // pushamo inizio e fine dei raggi dentro l'array rays per creare un segmento che costituirà il raggio
        }
    }

    draw(ctx){
        for(let i=0; i < this.rayCount; i++){
            let end = this.rays[i][1];
            if(this.readings[i]){  // se troviamo un'intersezione end diventa un punto con una x e una y, cioè un inizio e una fine, sostituendo nel metodo ctx.lineTo this.rays[i][1].x e this.rays[i][1].y con end.x e end.y
                end = this.readings[i];
            }
            
            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo(
                this.rays[i][0].x, // start location x
                this.rays[i][0].y // start location y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="black";
            ctx.moveTo(
                this.rays[i][1].x, // start location x
                this.rays[i][1].y // start location y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }
}