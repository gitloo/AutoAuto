const canvas=document.getElementById("myCanvas");
 // lasciando l'altezza definita fuori dalla funzione animate tutte le posizioni della macchina, utilizzando le frecce,
 // rimangono sullo schermo, allungando la macchina
 // canvas.height=window.innerHeight;
canvas.width=200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width/2, canvas.width*0.9); // definiamo la strada, larga il 90% del canvas
const car = new Car(road.getLaneCenter(1),100,30,50, "AI"); // specifichiamo che la prima macchina sarà l'unica ad avere i controlli
const traffic=[
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2)
];

animate();

function animate(){
    for(let i = 0; i < traffic.length; i++){
        traffic[i].update(road.borders, []); // non passiamo nulla alle macchine del traffico perchè non vogliamo che si danneggino tra di loro.
    }
    // come rilevare i bordi della strada
    car.update(road.borders, traffic);

    canvas.height=window.innerHeight; // posizionando l'altezza qui la pagina risulterà formattata correttamente e la macchina rimarrà a dimensione fissa
   
    ctx.save();
    ctx.translate(0,-car.y+canvas.height*0.7);
    
    road.draw(ctx);
    for(let i = 0; i < traffic.length; i++){
        traffic[i].draw(ctx, "red");
    }
    car.draw(ctx, "blue");

    ctx.restore();
    requestAnimationFrame(animate); // request... chiama il metodo animate in loop molte volte al secondo dando l'illusione di movimento
}
