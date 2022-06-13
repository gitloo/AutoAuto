class Road{
    constructor(x,width,laneCount=3){
        // definizione degli attributi per la strada
        this.x=x;
        this.width=width;
        this.laneCount=laneCount;
        // ulteriori attributi utili ai calcoli
        this.left=x-width/2;
        this.right=x+width/2;
        // impostiamo una strada che sia molto lunga. Renderla infinita potrebbe dare dei problemi durante l'esecuzione dello script
        const infinity=100000000;
        this.top=-infinity;
        this.bottom=+infinity; // la Y nel browser cresce verso il basso e non verso l'alto!
       
       const topLeft = {x:this.left, y:this.top};
       const topRight = {x:this.right, y:this.top};
       const bottomLeft = {x:this.left, y:this.bottom};
       const bottomRight = {x:this.right, y:this.bottom};
        this.borders=[
            [topLeft,bottomLeft],
            [topRight,bottomRight]
        ];
   
    }


    getLaneCenter(laneIndex){
        const laneWidth = this.width/this.laneCount;
        return this.left + laneWidth/2 + Math.min(laneIndex,this.laneCount-1)*laneWidth;
    }

    draw(ctx){
        ctx.lineWidth=5;
        ctx.strokeStyle="white";

        for(let i=1; i <= this.laneCount-1; i++) { // ciclo for per disegnare tante corsie quante ne desideriamo
            // con questa funzione non sarà più necessario definire le corsie una per una (possiamo eliminare il secondo beginpath())
            const x = lerp(
                this.left,
                this.right,
                i/this.laneCount // questo valore sarà compreso tra 0(quando comincerà il ciclo) e 1(quando i pareggerà il valore i this.laneCount)
            );
            
            ctx.setLineDash([20,20]); 
            // in questo momento ctx.setLineDash([20, 20]) non setta le linee tratteggiate perchè il valore infinity,
            // contenuto in this.top e this.bottom come riferimento di altezza delle linee delle corsie centrali 
            // è un valore troppo alto, e non viene riconosciuto dai metodi ctx.moveTo e ctx.lineTo.
            // SOLUZIONE: Per ottenere l'output corretto occorre abbassare il valore di infinity.
        
            
            // disegniamo una linea che vada da cima a fondo della pagina browser
            ctx.beginPath();
            ctx.moveTo(x,this.top); // sostituiamo this.left con la costante x
            ctx.lineTo(x,this.bottom); // sostituiamo this.left con la costante x 
            ctx.stroke();      
        }
        
        ctx.setLineDash([]);
        this.borders.forEach(border=>{
            ctx.beginPath();
            ctx.moveTo(border[0].x, border[0].y);
            ctx.lineTo(border[1].x, border[1].y);
            ctx.stroke();
        });
/*         // disegniamo una linea a destra dello schermo
        ctx.beginPath();
        ctx.moveTo(this.right,this.top);
        ctx.lineTo(this.right,this.bottom);
        ctx.stroke(); */
    }
}