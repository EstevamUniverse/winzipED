//arvore de huffman
function Node(key) {
    this.key = key;
    this.letra = undefined;
    this.dir = null;
    this.esq = null;
}

function BinarySearchTree() {
    let vetorNode = [];
    let root = null;
    let table = [];

    this.ordenarVetor = function () {
        for (i = 0; i < vetorNode.length; i++) {
            for (j = i + 1; j < vetorNode.length; j++) {
                if (vetorNode[i].key < vetorNode[j].key) {
                    //troca vetor de números
                    aux = vetorNode[i];
                    vetorNode[i] = vetorNode[j];
                    vetorNode[j] = aux;
                }
            }
        }
    }

    this.retornaMenor = function () {
        this.ordenarVetor();
        let menor = vetorNode[vetorNode.length - 1].key;
        return menor;

    }

    this.retornamenor2 = function () {
        let menor2 = vetorNode[vetorNode.length - 2].key;

        return menor2;
    }

    //esta função realiza a implementação da arvore de huffman
    this.inserir = function (vetorNumber, vetorCaracter) {
        let newNode;
        //criando todos os nós no vetorNode
        for (i = 0; i < vetorNumber.length; i++) {
            newNode = new Node(vetorNumber[i]); // inserindo key 
            newNode.letra = vetorCaracter[i]; // inserindo letra
            vetorNode[i] = newNode;
        }

        while (vetorNode.length > 1) {
            menor = this.retornaMenor(); //pegar menor elemento do vetor
            menor2 = this.retornamenor2(); //pegar segundo menor elemento do vetor

            newNode = new Node(menor2 + menor); // o novo nó será a soma dos dois menores

            this.ordenarVetor(); // ordena o vetor (do maior para o menor)

            newNode.esq = vetorNode[vetorNode.length - 1]; //retornar o menor elemento
            newNode.dir = vetorNode[vetorNode.length - 2]; //retornar segundo menor

            vetorNode.pop(); //dois pop para remover do vetor os dois menores 
            vetorNode.pop(); //já utilizados

            vetorNode[vetorNode.length] = newNode; //o novo no será inserido no vetor
        }

        root = newNode;  //colocando este nó no root
        //console.log(root.dir.dir.key);
        this.criarTabela();
        //console.log(root.esq.esq.letra);
        for (i = 0; i < vetorCaracter.length; i++) {
            console.log("letra = " + vetorCaracter[i] + " valor = " + table[vetorCaracter[i]]);
        }
    }

    this.criarTabela = function () {
        this.preencherTabela(root, '');
        //console.log(table);
    }

    this.preencherTabela = function (node, code) {

        if (node.letra != undefined) {
            //console.log(node.letra);
            table[node.letra] = code; // aquele caractere na minha tabela vai receber esse code
        } else {
            this.preencherTabela(node.esq, code + '0'); // é feita uma concatenação entre as strings  para que possa identificar o caractere
            this.preencherTabela(node.dir, code + '1');
        }
    }

    this.preOrdem = function () {
        this.preOrdemNode(root);
    }

    this.preOrdemNode = function (node) {
        if (node !== null) {
            console.log(node.letra + '|' + node.key);
            this.preOrdemNode(node.esq);
            this.preOrdemNode(node.dir);
        }
    }


    this.leitura = function (filename, palavra) {
        var ofs = require('fs'); // pra ler o arquivo
        var file = ofs.createWriteStream(filename, "utf-8");
        this.leituraNode(root, file)
        file.write(this.codificar(palavra));
        file.end();
    }

    this.leituraNode = function (node, file) { // para que seja possivel saber quantas vezes aquele nó e letra se repetem para montar o arquivo dps

        if (node == null) {
            file.write('#;');
        } else {
            file.write((node.letra === undefined ? '*|' : node.letra + '|') + node.frequencia + ';');  
            this.leituraNode(node.esq, file);
            this.leituraNode(node.dir, file);
        }
    }

    this.carregarArquivo = function (filename) {
        var fs = require("fs");
        var file = fs.readFileSync("./" + filename, "utf-8");
        numbers = file.split(";");
        /*
            split() O método split() divide uma String em uma lista ordenada de substrings, 
            coloca essas substrings em um array e retorna o array.
            A divisão é feita procurando um padrão, onde o padrão é fornecido como o primeiro parâmetro na chamada do método
        */
        numbers.pop(); //removendo a parte dos dados.

        root = this.colocarPreOrdem(null);
    }

    this.colocarPreOrdem = function (node) {


        if (numbers[0] === "#" || numbers[0] === "") {
            numbers.splice(0, 1);
            return null;
        } else {
            separado = numbers[0].split("|");
            l = separado[0] === '*' ? undefined : separado[0];
            f = parseInt(separado[1]);
            node = new Node(f);
            node.letra = l;
            numbers.splice(0, 1);
            node.esq = this.colocarPreOrdem(node.esq);
            node.dir = this.colocarPreOrdem(node.dir);
        }

        return node;  
    }

    this.codificar = function (palavra) {

        var saida = '';
    
        for (var i = 0; i < palavra.length; i++) {
            saida += table[palavra.charAt(i)];
        }
    
        //console.log(saida);
        return saida;
    
    }
    
    this.decodificar = function (palavra) {
    
        let saida = '';
        let current = root;
    
        for (var i = 0; i < palavra.length; i++) {
    
            if (palavra.charAt(i) == '0') {
                current = current.esq;
            } else if (palavra.charAt(i) == '1') {
                current = current.dir;
            }
    
            if (current.esq == null && current.dir == null) {
                saida += current.letra;
                current = root;
            }
        }
        return saida;
    }
}



//termina a arovre



//parte do winzio

function Winzip() {
    let vetorCaracter = [];
    let vetorNumber = [];
    let arvore = new BinarySearchTree();

    this.compactar = function (filename) {
        console.log("Tabela");
        var fs = require("fs");
        var palavra = fs.readFileSync("./" + filename, "utf-8");
        this.explorar(palavra);
        this.order();
        this.inserirTudo();
        purename = filename.split(".");

        arvore.leitura(purename[0] + ".zip", palavra);
        console.log("\n\nARQUIVO COMPACTADO\n\n")
    }

    this.descompactar = function (filename) {
        arvore.carregarArquivo(filename);

        var fs = require("fs");
        var file = fs.readFileSync("./" + filename, "utf-8");
        data = file.split(";");
        palavra = data.pop(); //optendo apenas a parte final dos dados.

        purename = filename.split(".");

        var ofs = require('fs');
        var file = ofs.createWriteStream(purename[0] + "[1].txt", "utf-8");
        file.write(arvore.decodificar(palavra));
        file.end();

        console.log("\n\nARQUIVO DESCOMPACTADO\n\n");
    }

    //descobrir quantas vezes cada letra se repete
    this.explorar = function (texto) {
        let aux = 0, aux2 = 0; //auxs que ligam os dois vetores

        for (i = 0; i < texto.length; i++) {
            for (j = 0; j < vetorCaracter.length; j++) { //percorrer todo o vetor de caracter
                if (vetorCaracter[j] == texto[i]) { // para descobrir se a já tem a letra no vetor
                    vetorNumber[j]++; //incrementa esta letra já existente no vetor de números
                    aux = 1; //auxiliar diz que já tem a letra
                    aux2 = vetorCaracter.length; //auxiliar indicadora de posição 
                    break;
                }
            }
            if (aux == 0) {          // se aux = 0                                
                vetorCaracter[vetorCaracter.length] = texto[i];
                vetorNumber[aux2] = 1;// adiciona a nova letra para o vetor
                aux2++;
            } else if (aux == 1) {
                aux = 0; //devolve a aux para estado original
            }
        }
    }

    //ordena o vetorNumber e também o vetor de caracters para melhor manipulação
    //Do maior para o menor
    this.order = function () {
        for (i = 0; i < vetorNumber.length; i++) {
            for (j = i + 1; j < vetorNumber.length; j++) {
                if (vetorNumber[i] < vetorNumber[j]) {
                    //troca vetor de números
                    aux = vetorNumber[i];
                    vetorNumber[i] = vetorNumber[j];
                    vetorNumber[j] = aux;

                    //troca vetor de caracter
                    aux = vetorCaracter[i];
                    vetorCaracter[i] = vetorCaracter[j];
                    vetorCaracter[j] = aux;
                }
            }
        }
    }

    //inserir na arvore de acordo com a maior frequência
    this.inserirTudo = function () {
        arvore.inserir(vetorNumber, vetorCaracter);
    }

}



let zipador = new Winzip();


//zipador.compactar("file.txt");
zipador.descompactar("file.zip");