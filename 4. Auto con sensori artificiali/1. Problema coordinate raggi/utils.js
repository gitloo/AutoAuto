// funzione che ci restituisce un valore compreso tra A e B, a seconda del parametro t inserito
function lerp(A,B,t) {
    return A+(B-A)*t;
    // con t=0 --> il valore returnato è A
    // con t=1 --> A e -A si annulleranno a vicenda e il valore returnato sarà B
    // con 0<t<1 --> 
}

/*
function getIntersection(A,B,C,D){
    const tTop = (D.x - C.x)*(A.y - C.y)-(D.y )
}

*/