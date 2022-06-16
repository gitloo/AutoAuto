class Controls{
    constructor() {
        this.forward=false
        this.left=false;
        this.right=false;
        this.reverse=false;

        this.#addKeyboardListeners();
    }

    // # indica che il metodo è privato, inaccessibile all'esterno di questa classe (Controls)
    #addKeyboardListeners(){
        // (event)=> come dire function(event),
        // ma se scrivessimo function.. i this contenuti all'interno andrebbero a riferirsi alla function e non al constructor!
        document.onkeydown=(event)=>{ 
            switch(event.key){
                case "ArrowLeft":
                    this.left=true;
                    break;
                case "ArrowRight":
                    this.right=true;
                    break;
                case "ArrowUp":
                    this.forward=true;
                    break;
                case "ArrowDown":
                    this.reverse=true;
                    break;       
            }
            // console.table(this); debugger per il controllo funzionamento tasti frecce
        }
        document.onkeyup=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left=false;
                    break;
                case "ArrowRight":
                    this.right=false;
                    break;
                case "ArrowUp":
                    this.forward=false;
                    break;
                case "ArrowDown":
                    this.reverse=false;
                    break;       
            }
            // console.table(this); debugger per il controllo funzionamento tasti frecce
        }
    } 
}