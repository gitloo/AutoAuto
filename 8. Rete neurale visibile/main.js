const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=500;

const carCtx = carCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const road = new Road(carCanvas.width/2, carCanvas.width*0.9); // definiamo la strada, larga il 90% del canvas
const car = new Car(road.getLaneCenter(1),100,30,50, "AI"); // specifichiamo che la prima macchina sarà quella controlla dall'AI
const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2)
];

animate();

function animate(time){
    for(let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders, []); // non passiamo nulla alle macchine del traffico perchè non vogliamo che si danneggino tra di loro.
    }
    // come rilevare i bordi della strada
    car.update(road.borders, traffic);

    carCanvas.height=window.innerHeight; // il canvas della strada sarà della stessa altezza dello schermo
    networkCanvas.height=window.innerHeight; // il canvas della rete neurale sarà della stessa altezza dello schermo
   
    carCtx.save();
    carCtx.translate(0,-car.y+carCanvas.height*0.7);
    
    road.draw(carCtx);
    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(carCtx, "red");
    }
    car.draw(carCtx, "blue");

    carCtx.restore();

    networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx, car.brain);
    requestAnimationFrame(animate); // request... chiama il metodo animate in loop molte volte al secondo dando l'illusione di movimento
}
