class Graph{
    constructor(){
        this.adjList = new Map();
        this.weightAdjList = new Map();
    }


     addNode(x){
        this.adjList.set(x, new Set());
        this.weightAdjList.set(x, []);
    }
    
     addEdge(src, des, weight){
        // add destination node if it doesn't exist
        if(!this.adjList.has(des)){
            this.addNode(des);
        }
        //add source and weight
        if(!this.adjList.has(src)){
            this.adjList.set(src, new Set(des));
            this.weightAdjList.set(src, [weight]);
            
        }else{
            this.adjList.get(src).add(des); 
            this.weightAdjList.get(src).push(weight);
        }
    
    }

    printGraph(){
        let str = "\n";
        for (let [key, value] of this.adjList) {
           //str += key + " : " + value;  
           str += key + " : " + new Array(...value).join('  ') + "\n";  
         
        }
        str+="\nCorresponding weights:\n";
        for (let [key, value] of this.weightAdjList) {
            str += key + " : " + value.join(' , ') + "\n";          
         }
        document.getElementById("textAreaDisplay").value += str + "" ;
    }

    printMap(myMap){
        let str = "";
        for (let entry of myMap) {
            str += entry + "  "; 
          }
        return str;
    }




    bfs(startNode){
        let str1 = "";
        let str2 = "";
        let visited = new Set();
        let q = [];//var q = new Queue();
        let display =  document.getElementById("textAreaDisplay");
       
        visited.add(startNode);
        q.push(startNode);
        str1 += "\nStart: add " + startNode + " to visited and push to queue. \nVisit: " 
                        + startNode + "\nQ: " + q.toString() + "\n";
                     // printing visited?   

        while(q.length > 0){
            let currNode = q.shift();
            str1 += "Remove a node from Q. Current node: " + currNode + " \n";
            str2 += currNode + " ";


            let neighbors = this.adjList.get(currNode); // values, how to iterate through set?!
            for(let neighbor of neighbors){
                if( !visited.has(neighbor) ){
                    visited.add(neighbor);
                    q.push(neighbor);
                    str1+= "Visit: " + neighbor + " and push to Q\nQ:" + q.toString()+ "\n";
                }else{
                    str1+= "Neighbor: " + neighbor + " has already been visited.\n";
                }
            }
        }

        display.value +=  str1 + "\nBFS visited nodes in order:" + str2 + "\n" ;
    }

    
    dfs(startNode){

        let str1 = "";
        let str2 = "";
        let visited = new Set();
        let stack = []; // .push .pop pops last! .shift shifts first
        let display =  document.getElementById("textAreaDisplay");

        stack.push(startNode);

           display.value += "Inside DFS, startNode= " + startNode;

        str1 += "\nStart: add " + startNode + " to visited and push to stack. \nVisit: " 
        + startNode + "\nStack: " + stack.toString() + "\n";
        
        while(stack.length > 0){
            let currNode = stack.pop();
            str1 += "Pop a node from Stack. Current node: " + currNode + " \n";
            str2 += currNode + " ";

            if(!visited.has(currNode)){
                visited.add(currNode);
            }

            let neighbors = this.adjList.get(currNode); 
            for(let neighbor of neighbors){
                if( !visited.has(neighbor) && !stack.includes(neighbor)  ){ // if not visited and not already in stack!! in case of cycle
                   // visited.add(neighbor);
                    stack.push(neighbor);
                    str1+= "Visit: " + neighbor + " and push to stack \nStack:" + stack.toString()+ "\n";
                }else{
                    str1+= "Neighbor: " + neighbor + " has already been visited.\n";
                }
            }

        }
        
        display.value +=  str1 + "\nDFS visited nodes in order:" + str2 + "\n" ;
    }
/**
 1 0
1 2
2 0
0 3
3 4
 */



     dijkstra(startNode){
         
        let display = document.getElementById("textAreaDisplay"); // link to element

        let minPQ = new minPriorityQueue();
        display.value += "\nCreating Q:" + minPQ.printQueue();

        let distances = new Map();
        let prev = new Map();
        distances.set(startNode, 0);         

        minPQ.enqueue([startNode, 0]); // weight has to be extracted later
        display.value += "\nAdding startNode to Q:" + minPQ.printQueue() +
                         "\nprev map: "+ this.printMap(prev) +"\ndistances:" + this.printMap(distances);

        // Initialize the rest to Infinity and zero
        for (let [key, value] of this.adjList) {
            if(key != startNode){
                distances.set(key, Infinity);
                prev.set(key, null);         
            }
        }
        display.value += "\nInitializing prev to null: "+ this.printMap(prev) +"\nAnd distances to infinity: " + this.printMap(distances);

        while(!minPQ.isEmpty()){
            display.value += "\n\nBefore dequeuing: " + minPQ.printQueue();
            let minNode = minPQ.dequeue(); 
 
            display.value += "\nAfter dequeuing: " +  minPQ.printQueue();
            let currNode = minNode[0];
            let weight = parseInt(minNode[1], 10);
            display.value += "\nCurrent Node: " + currNode + " with priority: "+ weight;
            // for each neighbor of currnode,


            let neighbors = this.adjList.get(currNode); 
            let neighborsArr = Array.from(neighbors); 
            let weightsArr = (Array.from(this.weightAdjList.get(currNode))).map(Number); // MAKE IT NUMBER var arrayOfNumbers = arrayOfStrings.map(Number);
            
            display.value += "\nIterate through neighbors: " + neighborsArr + " with corresponding weights: "+ weightsArr ;

            for (let i = 0; i < neighborsArr.length; i++){

                let alt = distances.get(currNode) + weightsArr[i];
                if(alt < distances.get(neighborsArr[i]) ){ 
                    display.value += "\nDistance from startNode->" + currNode +"->"+ neighborsArr[i] + " is smaller than old distance from startNode->" + neighborsArr[i] 
                            + "\n" + distances.get(currNode) + " + " + weightsArr[i] + " = " + alt + "   <    " + distances.get(neighborsArr[i]) ;
                    
                    distances.set(neighborsArr[i], alt);
                    prev.set(neighborsArr[i], currNode);
                    minPQ.enqueue( [neighborsArr[i], alt ] ); 

                }else{
                    display.value += "\nDon't updates because distance from startNode->" + currNode +"->"+ neighborsArr[i] + " is NOT smaller than old distance from startNode->" + neighborsArr[i] 
                    + "\n" + distances.get(currNode) + " + " + weightsArr[i] + " = " + alt + "   >    " + distances.get(neighborsArr[i]) ;
                   
                }
            }
        }
        display.value += "\nFinal Dijkstra distances from startNode: " +startNode+ ": " + this.printMap(distances);

    }
    // re do example: https://medium.com/basecs/finding-the-shortest-path-with-a-little-help-from-dijkstra-613149fbdc8e
    /**
DIJKSTRA
a b 7
a c 3
b c 1
b e 6
b d 2
d e 4
d c 2

     */


    longestPath(startNode){ // O(V+E) ON DAG, NP-HARD ON NON-DAG!!

        let display = document.getElementById("textAreaDisplay"); // link to element  
        let minPQ = new minPriorityQueue();
        display.value += "\nCreating Q:" + minPQ.printQueue();

        let distances = new Map();
        let prev = new Map();
        distances.set(startNode, 0);         

        minPQ.enqueue([startNode, 0]); // weight has to be extracted later
        display.value += "\nAdding startNode to Q:" + minPQ.printQueue() +
                         "\nprev map: "+ this.printMap(prev) +"\ndistances:" + this.printMap(distances);

        // Initialize the rest to Infinity and zero
        for (let [key, value] of this.adjList) {
            if(key != startNode){
                distances.set(key, Infinity);
                prev.set(key, null);         
            }
        }
        display.value += "\nInitializing prev to null: "+ this.printMap(prev) +"\nAnd distances to -infinity ";// + this.printMap(distances);

        while(!minPQ.isEmpty()){
            display.value += "\n\nBefore dequeuing: " +  minPQ.printPositiveQueue();// minPQ.printQueue();
            let minNode = minPQ.dequeue(); // [node, priority]>??

            
            display.value += "\nAfter dequeuing: " +  minPQ.printPositiveQueue();//minPQ.printQueue();
            let currNode = minNode[0];
            let weight = parseInt(minNode[1], 10);//minNode[1]; NOW A NUMBER!
            display.value += "\nCurrent Node: " + currNode + " with priority: "+ weight;
            // for each neighbor of currnode,

            // CHANGE WEIGHTS HERE~~~~~
            let neighbors = this.adjList.get(currNode); 
            let neighborsArr = Array.from(neighbors); 
            let weightsArr = (Array.from(this.weightAdjList.get(currNode))).map(Number); 
                // CHANGE WEIGHTS HERE~~~~~
                let negWeightsArr = []
                for(let j = 0; j < weightsArr.length; j++){
                    negWeightsArr[j] = weightsArr[j]* -1;
                }

                display.value += "\nIterate through neighbors: " + neighborsArr + " with corresponding weights: "+ weightsArr ;

            for (let i = 0; i < neighborsArr.length; i++){
                let alt = distances.get(currNode) + negWeightsArr[i];
                if(alt < distances.get(neighborsArr[i]) ){ 
                    display.value += "\nDistance from startNode->" + currNode +"->"+ neighborsArr[i] + " is bigger than old distance from startNode->" + neighborsArr[i] 
                            + "\n" + -1*distances.get(currNode) + " + " + weightsArr[i] + " = " + -1*alt + "   >    " + -1*distances.get(neighborsArr[i]) ;
                    
                    distances.set(neighborsArr[i], alt);
                    prev.set(neighborsArr[i], currNode);
                    minPQ.enqueue( [neighborsArr[i],  negWeightsArr[i] ] );

                }else{
                    display.value += "\nDon't updates because distance from startNode->" + currNode +"->"+ neighborsArr[i] + " is NOT bigger than old distance from startNode->" + neighborsArr[i] 
                    + "\n" + -1*distances.get(currNode) + " + " + weightsArr[i] + " = " + -1*alt + "   =<    " + -1*distances.get(neighborsArr[i]) ;
                }
            }
        }

       for (let [key, value] of distances) {
       distances.set(key, -1*distances.get(key));   
        }
        display.value += "\nFinal Longest Path distances from startNode: " +startNode+ ": " + this.printMap(distances);

      }


/** LONGEST PATH example
a b 4
a c 2
b c 5
c e 3
b d 10
e d 4
d f 11

Distances A: b 4, c 9, d 16, e 12, f 27
 */


    topologicalSort(){
        //Algo from Lecture 16, CS344
        let display = document.getElementById("textAreaDisplay"); // link to element
  
        //let D =[]; // change to map??
        let D = new Map();
        let O = [];//output
        let Q = [] // Queue , push, shift
        // initialize D to zero
        for(let [key, value] of  this.adjList){
            //D[key]= 0;
            D.set(key, 0);
        }
        display.value += "\nInitialize array D to zero: "+ this.printMap(D);
        // in-degrees
        for(let [key, value] of  this.adjList){
            let neighbors = value;
            for(let neighbor of neighbors){
               D.set(neighbor, D.get(neighbor) + 1);
            }
        }
        display.value += "\nArray D after adding in-degrees: "+ this.printMap(D);;
        // 3- Insert every vertex v with D[v] = 0 into a queue Q
        for(let [key, value] of  this.adjList){
            if(D.get(key) == 0){
                Q.push(key);
            }
        }
        display.value += "\nInsert every vertex v with D[v] = 0 into a queue Q: " + Q.toString();
        //4- 
       // alert("Q.isEmpty(): " + Q.length); // isEmpty doesn't work with arrays!
        while(Q.length > 0){
            
            let v = Q.shift();
            display.value += "\nQ after dequeuing: " + Q.toString();
            O.push(v[0]);// push just key, not value (neighbors)
            display.value += "\nCurrent output: "+ O.toString();
            //STOPS HERE!!!
            for(let neighbor of this.adjList.get(v) ){
               let oldVal = D.get(neighbor);
               D.set(neighbor, oldVal - 1); 
               display.value += "\nDegrees of neighbor " + neighbor + " is " + D.get(neighbor);
                if(D.get(neighbor) == 0){
                    Q.push(neighbor);
                    display.value += "\nPush " +neighbor +" to the Q-> "+ Q.toString();
                }
            }

        }
        display.value += "\nTopological Ordering: " + O.toString();
    }



    reverseArray(arr) {
        var newArray = [];
        for (var i = arr.length - 1; i >= 0; i--) {
          newArray.push(arr[i]);
        }
        return newArray;
      }



}

