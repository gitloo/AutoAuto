const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=500;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9); // definiamo la strada, larga il 90% del canvas

const N = 100;
const cars = generateCars(N);
let bestCar=cars[0]; // inizialmente sarà la prima auto dell'array ma poi si aggiornerà ad ogni frame
if(localStorage.getItem("bestBrain")){ // se in localStorage è stato immagazzinato un bestBrain (cioè la rete neurale dell'auto che è riuscita ad andare più avanti)...
    for(let i = 0; i < cars.length; i++){ 
        cars[i].brain = JSON.parse( // ... al brain di ogni auto andremo ad assegnare il brain della bestCar
        localStorage.getItem("bestBrain"));
        if(i!=0){ // per tutte le auto "non migliori" 
            NeuralNetwork.mutate(cars[i].brain,0.1) // amount è un valore che determina quanta differenza di comportamento c'è tra un'auto e l'altra:
            // più è vicino allo 0 più le auto seguiranno la stessa traiettoria
        }
    }

}


const traffic=[
    new Car(road.getLaneCenter(2),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-200,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-400,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-370,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-600,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-500,30,50,"DUMMY",2)
];

animate();

function save(){
    localStorage.setItem("bestBrain",
    JSON.stringify(bestCar.brain));
}

function discars(){
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars=[];
    for(let i = 1; i <= N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"),new Car(road.getLaneCenter(0), 100, 30, 50, "AI"),new Car(road.getLaneCenter(2), 100, 30, 50, "AI"))
    }
    return cars;
}

function animate(time){
    for(let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders, []); // non passiamo nulla alle macchine del traffico perchè non vogliamo che si danneggino tra di loro.
    }
    for(let i = 0; i < cars.length; i++){
        cars[i].update(road.borders, traffic);
    }
    // FITNESS FUNCTION: funzione che contiene la condizione che determina quando la nostra rete neurale sta rispettando il proposito che le abbiamo dato
    bestCar = cars.find( // seleziona fra tutte le cars quella la cui altezza minima (y) è maggiore 
        c => c.y == Math.min(
            ...cars.map( c => c.y)
        )
    );

    carCanvas.height=window.innerHeight; // il canvas della strada sarà della stessa altezza dello schermo
    networkCanvas.height=window.innerHeight; // il canvas della rete neurale sarà della stessa altezza dello schermo
   
    carCtx.save();
     // TRASLIAMO IL CANVAS ALLA Y DELLA MACCHINA CHE RIESCE A PROSEGUIRE PER PIU' TEMPO
     // Se un'auto dovesse toccare un oggetto o un bordo, la funzione animate si aggancia all'auto che invece riesce a proseguire, cioè quella la cui y risulta maggiore
    carCtx.translate(0,-bestCar.y + carCanvas.height*0.7);
    
    road.draw(carCtx);
    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(carCtx, "red");
    }

    carCtx.globalAlpha = 0.2;
    for(let i = 0; i < cars.length; i++){
        cars[i].draw(carCtx, "blue");
    }
    carCtx.globalAlpha = 1;
    bestCar.draw(carCtx, "blue",true); // modifichiamo il metodo draw in car.js
    carCtx.restore();

    networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain); // il cervello visibile sarà sempre quello dell'auto migliore
    requestAnimationFrame(animate); // request... chiama il metodo animate in loop molte volte al secondo dando l'illusione di movimento
}
