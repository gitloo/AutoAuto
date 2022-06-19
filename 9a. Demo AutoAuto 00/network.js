// Struttura di una rete neurale composta da molti livelli
class NeuralNetwork{
    constructor(neuronCounts){ // neuronCounts = numero di neuroni in ogni livello
        this.levels=[]; // la rete neurale sarà composta da un array di livelli
        // x ogni livello specifichiamo gli inputCount e gli outputCount 
        for(let i = 0; i < neuronCounts.length-1; i++){
            this.levels.push(new Level(
                neuronCounts[i], neuronCounts[i+1]
            ));
        }
    }

    static feedForward(givenInputs,network){
        // otteniamo gli outputs richiamando il metodo feedForward del livello...
        let outputs = Level.feedForward(
            givenInputs, network.levels[0] // ...con gli input dati e il primo livello della rete neurale
        );
        // scorriamo i livelli successivi al primo (il secondo è i = 1)
        for(let i = 1; i < network.levels.length; i++){
            // aggiorniamo gli outputs sempre con il metodo feedForward: ciò che stiamo facendo è prendere gli output del livello precedente 
            // e metterli negli input del livello successivo
            outputs = Level.feedForward(
                outputs, network.levels[i] 
            );
        }
        return outputs; // l'output finale ci dirà se l'auto dovrà andare avanti indietro dx o sx.
    }

    // il metodo mutate prende una rete neurale come parametro e una quantità(settata inizialmente a 1 0 100%)
    static mutate(network, amount = 1){
        network.levels.forEach(level => { // per ogni livello... cicliamo tra tutti i bias e successivamente tra tutti i weights
            for(let i = 0; i < level.biases.length; i++){
                level.biases[i] = lerp( // ""andiamo dal valore attuale del bias in direzione del valore random a seconda del amount""
                    level.biases[i], // valore corrente del bias, qualunque esso sia
                    Math.random()*2-1, // valore random tra -1 e 1
                    amount // se amount è 1, otteniamo il valore random | se amount è 0 i bias e weights rimangono gli stessi
                )
            }
            for(let i = 0; i < level.weights.length; i++){
                for(let j = 0; j < level.weights[i].length; j++){
                    level.weights[i][j] = lerp(
                        level.weights[i][j], // valore corrente dei weights, qualunque essi siano
                        Math.random()*2-1, // valore random tra -1 e 1
                        amount // se amount è 1, otteniamo il valore random | se amount è 0 i bias e weights rimangono gli stessi
                    )
                }
            }
        });
    }
}


// Struttura base di un livello della rete neurale
class Level{
    // ogni livello ha uno strato di neuroni di input e uno strato di neuroni di output, e non devono necessariamente combaciare di numero
    constructor(inputCount, outputCount) {
        this.inputs = new Array(inputCount); // valori che otterremo dai sensori della macchina
        this.outputs = new Array(outputCount);
        this.biases = new Array(outputCount); // ogni neurone di output ha un bias, un valore oltre al quale si accenderà
        
        this.weights = [];
        // per ogni nodo di input avremo un numero di connessioni pari al numero di outputCount 
        for(let i = 0; i < inputCount; i++){
            this.weights[i] = new Array(outputCount); // inizializziamo un array costituito da un numero di elementi pari al numero di neuroni di output
        }
        Level.#randomize(this); // diamo un valore random a tutti gli attributi della classe Level.
    }

    static #randomize(level) {
        // dato un livello, per ogni coppia neurone input e neurone output... 
        for(let i = 0; i < level.inputs.length; i++){
            for(let j = 0; j < level.outputs.length; j++){
                // ...settiamo un peso di un valore random compreso tra -1 e 1
                level.weights[i][j] = Math.random()*2-1; // Math.random restituisce un valore random compreso tra 0 e 1.
            }
        }

        for(let i = 0; i < level.biases.length; i++){
            level.biases[i] = Math.random()*2-1; // Math.random restituisce un valore random compreso tra 0 e 1.
        }
    }

    static feedForward(givenInputs, level){
        // metodo per calcolare i valori di output: dati degli input derivati dai sensori, scorriamo tutti gli input del livello e li associamo agli input derivati
        for(let i = 0; i < level.inputs.length; i++){
            level.inputs[i] = givenInputs[i];
        }
        // per ottenere gli output scorriamo tutti gli output del livello e calcoliamo una somma tra i valori di input e i weights
        for(let i = 0; i < level.outputs.length; i++){
            let sum = 0;
            for(let j = 0; j < level.inputs.length; j++){ // scorriamo gli input del livello --> ERRORE!!!!!!!!!!!!!!!! Nella condizione del ciclo veniva utilizzata la variabile i invece di j
                // per ogni neurone input di livello, andremo ad aggiungere a sum il prodotto degli elementi di inputs X il weight ottenuto dall'input j e l'output i
                sum += level.inputs[j] * level.weights[j][i]; 
            }

            if(sum > level.biases[i]){ // se la somma ottenuta è maggiore del bias relativo al neurone output calcolato... 
                level.outputs[i] = 1; // ...allora il neurone output è acceso
            } else { // ...altrimenti
                level.outputs[i] = 0; // ...il neurone output è spento
            }
        }

        return level.outputs;
    }
}