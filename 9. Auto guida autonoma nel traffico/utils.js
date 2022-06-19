// LINEAR INTERPOLATION : funzione che ci restituisce un valore compreso tra A e B, a seconda del parametro t inserito
function lerp(A,B,t) {
    return A+(B-A)*t;
    // con t=0 --> il valore returnato è A
    // con t=1 --> A e -A si annulleranno a vicenda e il valore returnato sarà B
    // con 0<t<1 --> 
}


function getIntersection(A,B,C,D){
    const tTop = (D.x - C.x)*(A.y - C.y) - (D.y - C.y)*(A.x - C.x);
    const uTop = (C.y - A.y)*(A.x - B.x) - (C.x - A.x)*(A.y - B.y);
    const bottom = (D.y - C.y)*(B.x - A.x) - (D.x - C.x)*(B.y - A.y);

    if(bottom!=0){
        const t = tTop / bottom;
        const u = uTop / bottom;
        if(t >= 0 && t <= 1 && u >= 0 && u <= 1) {
            return {
                x : lerp(A.x, B.x, t),
                y : lerp(A.y, B.y, t),
                offset : t
            }
        } 
    }

    return null;
}

function polysIntersect(poly1, poly2) {
    for(let i = 0; i < poly1.length; i++){
        for(let j = 0; j < poly2.length; j++){
            const touch = getIntersection( // con questa funzione prendiamo tutti i segmenti che compongono il primo poligono e li compariamo con tutti i segmenti del secondo poligono 
                                           // (nel caso dei bordi della strada, il "poligono" è composto da un solo segmento)
                // prendiamo il primo punto del primo poligono
                poly1[i], 
                // prendiamo il punto successivo del primo poligono, ma i+1 darebbe errore in quanto andrebbe a superare la condizione i<poly1.length,
                // andando oltre i limiti dell'array poly1. Aggiungendo l'operatore modulo, indichiamo che quando il valore di i raggiungerà il numero
                // di punti da cui è costituito il poligono, cioè poly1.length, quel valore diventerà 0, cioè l'ultimo punto si unirà al primo punto del poligono, completandolo.
                poly1[(i+1) % poly1.length],
                // prendiamo il primo punto del secondo poligono
                poly2[j],
                // prendiamo l'ultimo punto del del secondo poligono
                poly2[(j+1) % poly2.length],
            )
            if(touch){
                return true;
            }
        }
    }
    return false;
}

function getRGBA(value){
    const alpha=Math.abs(value);
    const R=value<0?0:255;
    const G=R;
    const B=value>0?0:255;
    return "rgba("+R+","+G+","+B+","+alpha+")";
}
    
