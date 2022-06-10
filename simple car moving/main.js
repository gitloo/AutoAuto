const canvas=document.getElementById("myCanvas");
 // lasciando l'altezza definita fuori dalla funzione animate tutte le posizioni della macchina, utilizzando le frecce,
 // rimangono sullo schermo, allungando la macchina
 // canvas.height=window.innerHeight;

canvas.width=200;

var ctx = canvas.getContext("2d");
var car = new Car(100,100,30,50);
//const road=new Road(canvas.width/2,canvas.width*0.9);
//const car=new Car(road.getLaneCenter(1),100,30,50);

animate();

function animate(){
    car.update();
    canvas.height=window.innerHeight; // posizionando l'altezza qui la pagina risulterà formattata correttamente e la macchina rimarrà a dimensione fissa

    //road.draw(ctx);
    car.draw(ctx);

    ctx.restore();
    requestAnimationFrame(animate); // request... chiama il metodo animate in loop molte volte al secondo dando l'illusione di movimento
}