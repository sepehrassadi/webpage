class Graph{
    constructor(){
        this.adjList = new Map();
        this.weightAdjList = new Map();
        this.outputArray = [];
        this.coloringInstructions = [];
    }


     addNode(x){
        this.adjList.set(x, new Set());
        this.weightAdjList.set(x, []);
        
    }
    
     addEdge(src, des, weight){
        // add destination node if it doesn't exist
        if(!this.adjList.has(des)){
            this.addNode(des);
        }// 
        //add source and weight
        if(!this.adjList.has(src)){
            const mySet = new Set(); 
            this.adjList.set(src, mySet.add(des));
            this.weightAdjList.set(src, [weight]);
            
        }else{
            this.adjList.get(src).add(des); 
            this.weightAdjList.get(src).push(weight);
        }
    
    }
    
    printGraph(){
        let str = "\n";
        for (let [key, value] of this.adjList) {
            
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
        let display =  document.getElementById("textAreaDisplay");
        display.value += "Inside BFS:\n";

        this.outputArray = [];
        this.coloringInstructions = [];
      let str2 = "";
      let visited = new Set();
      let q = [];

      visited.add(startNode);
      q.push(startNode);

      this.outputArray.push("\nAdd start Node '" + startNode + "' to visited list and push to queue. \nVisited: " 
      + startNode + "\nQ: " + q.toString() + "\n") ; 
      this.coloringInstructions.push("X"); // or simply start startNode as green

      /**Possible states
        Grey -> violet -> Red -> green //Or
        Grey-> red -> green // for start node   
       */
      while(q.length > 0){
          let currNode = q.shift();
          str2 += currNode + " ";

         this.outputArray.push("Dequeue " +currNode +"\n");
         this.coloringInstructions.push("R" + currNode); // make it Red first, then Green 

          let neighbors = this.adjList.get(currNode); // values, how to iterate through set?!
          for(let neighbor of neighbors){

            if( !visited.has(neighbor) ){
                  visited.add(neighbor);
                  q.push(neighbor);
                 this.outputArray.push(  "Add neighbor " + neighbor + " to visited List and push to Q\nVisited: "+ new Array(...visited).join(',')
                   +"\nQ:" + q.toString() +"\n");

                   this.coloringInstructions.push("V" + neighbor);

              }else{
                this.outputArray.push("Neighbor " + neighbor + " has already been visited. Do nothing.\n" );
                this.coloringInstructions.push("X");
                // here should only color link, not link + node
              }
          }
        this.outputArray.push( currNode +" is done \nOutput so far = " +str2 +"\n" );
        this.coloringInstructions.push("G" + currNode);
      }
    this.outputArray.push(  "\nBFS final output in order:" + str2 + "\n");
    this.coloringInstructions.push("X");
    
    }

//new dfs

dfs(startNode){
    let display =  document.getElementById("textAreaDisplay");
    display.value += "Inside DFS:\n";

            var prevNode = [];
            this.outputArray = [];
            this.coloringInstructions = [];
    
            let str2 = "";
            let visited = new Set();
            let stack = []; // .push .pop pops last! .shift shifts first
    
            stack.push(startNode);
        
            this.outputArray.push("\nAdd start Node " + startNode + " to visited and push to stack. \nVisit: " + startNode + "\nStack: " + stack.toString() + "\n");    
            this.coloringInstructions.push("X"); 
    
            while(stack.length > 0){
                let currNode = stack.pop();
                
               // color previous edge-- as long as it's not start node        
               if(! (currNode == startNode) ){                 
                this.outputArray.push( "Color an edge\n" );
                this.coloringInstructions.push("ER" + prevNode[currNode] + "edge" + currNode ); 
           }

                this.outputArray.push( "Pop a node from Stack. Current node: " + currNode + " \n");
                this.coloringInstructions.push("R" + currNode); // make it Red first, then Green 
                str2 += currNode + " ";
    
    
                if(!visited.has(currNode)){
                    visited.add(currNode);
                    //SLOWS DOWNS VISUALIZATION BY 1 SEC EACH TIME!
                    this.outputArray.push(  "Add current Node " + currNode + " to visited List\nVisited: "+ new Array(...visited).join(',') +"\n");
                    this.coloringInstructions.push("X" );
                }
    
                let neighbors = this.adjList.get(currNode); 
                for(let neighbor of neighbors){
                    if( !visited.has(neighbor) && !stack.includes(neighbor)  ){ // if not visited and not already in stack!! in case of cycle... how about you change priority if it exists in stach
                        stack.push(neighbor);
                        let fn = neighbor; 
                        prevNode[fn] = currNode; 
  
                    }
                }

               
                this.outputArray.push( currNode +" is done \nOutput so far = " +str2 +"\n" );
                this.coloringInstructions.push("G" + currNode);
             
            }
        this.outputArray.push(  "\nDFS final output in order:" + str2 + "\n");
        this.coloringInstructions.push("X");
        }
    
/**
 1 0
1 2
2 0
0 3
3 4
 */


bellmanFord(startNode, links){ //The Bellman-Ford algorithm works on directed graphs. To make it work with undirected graphs we must make each undirected edge into two directed edges        
    let display = document.getElementById("textAreaDisplay"); 
    display.value += "Inside Bellman-Ford: \n";
 
    let nodes = Array.from( this.adjList.keys() );
    let E = links.length; 
    let V = nodes.length;
    let distances = new Map();
    let prev = new Map();
    let visited = new Set(); 
    let greenEdges = new Set(); 
      
    this.outputArray.push(  "\nInitialize distances to ∞. \n"  );
     this.coloringInstructions.push("I");  // I = make everything infinity
    for (let [key, value] of this.adjList) {
        if(key != startNode){
            distances.set(key, Infinity);
            prev.set(key, null);         
        }
    }
    distances.set(startNode, 0); 


    let updated;
    for(let i = 1; i < V; ++i){
        this.outputArray.push(  "\nIteration number " + i +":\n" ); this.coloringInstructions.push("X"); /****/
        updated = false;
        for(let j = 0; j < E; ++j){
            let dest = Object.values( Object.values(links[j])[0] )[0] + "";
            let src = Object.values( Object.values(links[j])[1] )[0] + "";
            let weight = Object.values(links[j])[2];
            // color edge red         
            this.outputArray.push( "Color current edge: " + src + "-" + dest + "\n" );/****/
            this.coloringInstructions.push("EPR" + src + "edge" + dest ); /****/

          if(weight.charAt(0) == "-"){   weight = -1*Number(weight.substring(1) )  ;   }
            
            let alt =  Number(distances.get(src)) + Number(weight ) // why are all negative numbers made positive???
            let dummy = ""

            if( !(distances.get(src) == Infinity) && (alt < distances.get(dest) )){ // distances.get(dest) is either infinity or a number
                this.outputArray.push( "EPG  1 " + src + "edge" + dest + "\n" );/****/
                this.coloringInstructions.push("EPG" + src + "edge" + dest ); /****/

                 // uncolor previous edge!!!!!!!!
                 if(!(distances.get(dest) == Infinity) ){
                   greenEdges.delete( prev.get(dest) + " " + dest )
                    this.outputArray.push("EPX   " +  prev.get(dest) + "edge" + dest + "\ngreenEdges: "+ new Array(...greenEdges).join(' ') )
                    this.coloringInstructions.push("EPX" + prev.get(dest) + "edge" + dest ); // color edge grey /****/
                 }

                // color edge green  
                    if (startNode + "" == src + ""){
                        dummy = startNode 
                    }else{
                        dummy = startNode + "->" + src 
                    }
                    
                   this.outputArray.push(  "\nD[" + dummy +"->"+ dest + "] < old D[" + startNode + "->" + dest + "]"
                                + "\n" + distances.get(src) + " + " + weight+ " = " + alt + "   <    " + distances.get(dest) 
                                + "\nUpdate distance to " + alt + "\n" );
                    this.coloringInstructions.push("D " + dest + " " + alt );
    
                    distances.set(dest, alt)
                    prev.set(dest, src)                
                    updated = true;  
                    greenEdges.add(src + " " + dest);
            
            
            }else{//dont update, color edge back to grey or....set to previous color??? 
                    if(greenEdges.has(src + " " + dest)){

                      this.outputArray.push(  "\nD["+ dummy +"->"+ dest + "] >= old D[" + startNode + "->" + dest+ "]"
                                    + "\n" + distances.get(src) + " + " + weight+ " = " + alt + "   >=     " + distances.get(dest) + "\nNo update.\n");
                      this.coloringInstructions.push("EPG" + src + "edge" + dest ); // color edge green /****/

                    }else{// make it grey again
                        this.outputArray.push(  "\nD["+ dummy +"->"+ dest + "] >= old D[" + startNode + "->" + dest+ "]"
                             + "\n" + distances.get(src) + " + " + weight+ " = " + alt + "   >=     " + distances.get(dest) + "\nNo update.\n");
                       
                        this.coloringInstructions.push("EPX" + src + "edge" + dest ); // color edge green /****/

                    }              
                }
        }
        if(updated == false){   
            this.outputArray.push( "\nSince iteration number " + i + " did not change anything, we can stop here.\n"); 
            this.coloringInstructions.push("X" );
             break;  }
  }
     
        if(updated == true){
            for(let j = 0; j < E; j++){

                let src = Object.values( Object.values(links[j])[0] )[0] + "";
                let dest = Object.values( Object.values(links[j])[1] )[0] + "";
                let weight = Object.values(links[j])[2];
         
                if( !(distances.get(src) == Infinity) && (distances.get(src) + weight < distances.get(dest) )){
                    alert("Graph has a negative cycle.")
                    return;
                }
            }
        }
        //print shortest path
    let finalOutput= ""
    let path = ""
    for (let [key, value] of this.adjList) {
        finalOutput += startNode + "-->" + key + ", shortest distance = " + distances.get(key) + ", path: "
        path = key + " " 
        if(  !(key+ "" == startNode+"")   ){
            let p  = prev.get(key) + "";
            while(! (p  == startNode+"") && !(p  == null)){
                path = p + " " + path
                p = prev.get(p)
            }
            path = startNode + " " + path
        }
        finalOutput += path + "\n";
    }
    this.outputArray.push( "\nFinal Bellman-Ford distances from startNode: \n" +finalOutput+ "\n" ); this.coloringInstructions.push("X" );
}






     dijkstra(startNode){  
         if(this.areWeightsPositive() == false){
             alert("Dijksta only accepts positive weights.")
             return;
         }
        let display = document.getElementById("textAreaDisplay"); // link to element
        display.value += "Inside Dijkstra: \n";

        let minPQ = new minPriorityQueue();
        let distances = new Map();
        let prev = new Map();
        distances.set(startNode, 0); 
        let visited = new Set();        

        minPQ.enqueue([startNode, 0]); // weight has to be extracted later
        visited.add(startNode);

        // Initialize the rest to Infinity and zero
        for (let [key, value] of this.adjList) {
            if(key != startNode){
                distances.set(key, Infinity);
                prev.set(key, null);         
            }
        }
        this.outputArray.push(  "\nInitialize distances to ∞. \n"  );
        this.coloringInstructions.push("I");  // I = make everything infinity

        while(!minPQ.isEmpty()){
            let minNode = minPQ.dequeue();         
            let currNode = minNode[0];
            let weight = parseInt(minNode[1], 10);
           
            this.outputArray.push( "\nDequeue Node: " + currNode + " with priority: "+ weight + "\nCurrent Q: "+ minPQ.printQueue() + "\n"  );
           this.coloringInstructions.push("G" + currNode);

            let neighbors = this.adjList.get(currNode); 
            let neighborsArr = Array.from(neighbors); 
            let weightsArr = (Array.from(this.weightAdjList.get(currNode))).map(Number); // MAKE IT NUMBER var arrayOfNumbers = arrayOfStrings.map(Number);
            
            this.outputArray.push("\nIterate through neighbors: " + neighborsArr + "\n"  );
            this.coloringInstructions.push("X" );

            for (let i = 0; i < neighborsArr.length; i++){
                this.outputArray.push( "Color current edge: " + currNode + "-" + neighborsArr[i] + "\n" );
                this.coloringInstructions.push("EPV" + currNode + "edge" + neighborsArr[i] ); 

                let alt = distances.get(currNode) + weightsArr[i]; 
                if(alt < distances.get(neighborsArr[i] ) ){ 

                    this.outputArray.push( "\nD["+startNode +"->" + currNode +"->"+ neighborsArr[i] + "] < old D[" + startNode + "->" + neighborsArr[i]+ "]"
                            + "\n" + distances.get(currNode) + " + " + weightsArr[i] + " = " + alt + "   <    " + distances.get(neighborsArr[i]) 
                            + "\nUpdate distance to " + alt + "\n"  );
                    this.coloringInstructions.push("D " + neighborsArr[i] + " " + alt );

                    distances.set(neighborsArr[i], alt);
                    prev.set(neighborsArr[i], currNode);
                    

                    if(! visited.has(neighborsArr[i] )){ // ONLY ENQUEUE if it has not been enqueued previously!
                        minPQ.enqueue( [neighborsArr[i], alt ] );  
                        visited.add(neighborsArr[i])
                    }
                }else{
                   
                    this.outputArray.push( "\nD["+startNode +"->" + currNode +"->"+ neighborsArr[i] +   "] > old D[" + startNode + "->" + neighborsArr[i] + "]"
                                        + "\n" + distances.get(currNode) + " + " + weightsArr[i] + " = " + alt + "   >    " + distances.get(neighborsArr[i]) + "\nNo update.\n");
                    this.coloringInstructions.push("X" );
                }
            }
        }
     
        // final output 
        let finalOutput= ""
        let path = ""
        for (let [key, value] of this.adjList) {
            finalOutput += startNode + "-->" + key + ", shortest distance = " + distances.get(key) + ", path: "
            path = key + " " 
            if(  !(key+ "" == startNode+"")   ){
                let p  = prev.get(key) + "";
                while(! (p  == startNode+"") && !(p  == null)){
                    path = p + " " + path
                    p = prev.get(p)
                }
                path = startNode + " " + path
            }

            finalOutput += path + "\n";
        }

        
        this.outputArray.push( "\nFinal Dijkstra distances from startNode: \n" +finalOutput+ "\n"  );
        this.coloringInstructions.push("X" );
    }
    // re do example: https://medium.com/basecs/finding-the-shortest-path-with-a-little-help-from-dijkstra-613149fbdc8e
    /*
    * - print final answer with ie: E: A-> …-> E, D = #
DIJKSTRA
a b 7
a c 3
b c 1
b e 6
b d 2
d e 4
d c 2

start a 
     */


    longestPath(startNode){ // O(V+E) ON DAG, NP-HARD ON NON-DAG!!

        let display = document.getElementById("textAreaDisplay"); // link to element  
        display.value += "Inside Longest Path: \n";
        
        let minPQ = new minPriorityQueue();
        let distances = new Map();
        let prev = new Map();
        distances.set(startNode, 0);  
        let visited = new Set();               

        minPQ.enqueue([startNode, 0]); // weight has to be extracted later
        visited.add(startNode);

        // Initialize the rest to Infinity and zero
        for (let [key, value] of this.adjList) {
            if(key != startNode){
                distances.set(key, Infinity);
                prev.set(key, null);         
            }
        }
       // display.value += "\nInitialize distances to ∞. \n"  ;
        this.outputArray.push(  "\nInitialize distances to ∞. \n"  );
        this.coloringInstructions.push("I");  // I = make everything infinity

        while(!minPQ.isEmpty()){
            let minNode = minPQ.dequeue();
            //make minNode permanent red

            let currNode = minNode[0];
            let weight = parseInt(minNode[1], 10);
          
            this.outputArray.push( "\nDequeue Node: " + currNode + " with priority: "+ -1*weight + "\nCurrent Q: "+ minPQ.printPositiveQueue() + "\n"  );
           this.coloringInstructions.push("G" + currNode);
            // CHANGE WEIGHTS HERE~~~~~
            let neighbors = this.adjList.get(currNode); 
            let neighborsArr = Array.from(neighbors); 
            let weightsArr = (Array.from(this.weightAdjList.get(currNode))).map(Number); 
                // CHANGE WEIGHTS HERE~~~~~
                let negWeightsArr = []
                for(let j = 0; j < weightsArr.length; j++){
                    negWeightsArr[j] = weightsArr[j]* -1;
                }

                this.outputArray.push("\nIterate through neighbors: " + neighborsArr + "\n"  );
                this.coloringInstructions.push("X" );
                
            for (let i = 0; i < neighborsArr.length; i++){
                this.outputArray.push( "Color current edge: " + currNode + "-" + neighborsArr[i] + "\n" );
               this.coloringInstructions.push("EPV" + currNode + "edge" + neighborsArr[i] );  

                let alt = distances.get(currNode) + negWeightsArr[i];
                
                if(alt < distances.get(neighborsArr[i]) ){ 
                    let dummy = ""
                    if (startNode + "" == currNode + ""){
                        dummy = startNode 
                    }else{
                        dummy = startNode +"->" + currNode 
                    }
                    
                    this.outputArray.push( "\nD["+ dummy +"->"+ neighborsArr[i] + "] > old D[" + startNode + "->" + neighborsArr[i]+ "]"
                            + "\n" + -1*distances.get(currNode) + " + " + weightsArr[i] + " = " + -1*alt + "   >    " + -1*distances.get(neighborsArr[i]) 
                            + "\nUpdate distance to " + -1*alt + "\n" );                  
                    this.coloringInstructions.push("D " + neighborsArr[i] + " " + -1*alt );

                            
                    distances.set(neighborsArr[i], alt);
                    prev.set(neighborsArr[i], currNode);
                //    minPQ.enqueue( [neighborsArr[i],  negWeightsArr[i] ] );

                    if(! visited.has(neighborsArr[i] )){ // ONLY ENQUEUE if it has not been enqueued previously!
                        minPQ.enqueue( [neighborsArr[i], negWeightsArr[i] ] );  
                        visited.add(neighborsArr[i])
                    }
                }else{
                    this.outputArray.push("\nD["+startNode +"->" + currNode +"->"+ neighborsArr[i] +   "] < old D[" + startNode + "->" + neighborsArr[i] + "]"
                                        + "\n" + -1*distances.get(currNode) + " + " + weightsArr[i] + " = " + -1*alt + "   =<    " + -1*distances.get(neighborsArr[i])  + "\nNo update.\n"  );                  
                    this.coloringInstructions.push("X" );
                }
            }
        }
 
       for (let [key, value] of distances) {
       distances.set(key, -1*distances.get(key));   
        }
                // final output 
                let finalOutput= ""
                let path = ""
                for (let [key, value] of this.adjList) {
                    finalOutput += startNode + "-->" + key + ", longest distance = " + distances.get(key) + ", path: "
                    path = key + " " 
                    if(  !(key+ "" == startNode+"")   ){
                        let p  = prev.get(key) + "";
                        while(! (p  == startNode+"") && !(p  == null)){
                            path = p + " " + path
                            p = prev.get(p)
                        }
                        path = startNode + " " + path
                    }
        
                    finalOutput += path + "\n";
                }
        this.outputArray.push( "\nFinal Longest Path distances from startNode: \n" + finalOutput ); //startNode+ ": " + this.printMap(distances);
        this.coloringInstructions.push("X" );
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





    prims(links){
        let display = document.getElementById("textAreaDisplay");  
        display.value += "Inside Prim's:\n";

        let nodes = Array.from( this.adjList.keys() );
        let minPQ = new minPriorityQueue();  
        let s = nodes[0];
        let explored = new Set();
        let exploredEdge = new Set(); // edge that has been colored violet or green!
        let startNode, endNode, str , weight
        explored.add(s);
        this.outputArray.push( "Randomly picked start node: " + s + "\nAdd its edges to the queue.\n" );
        this.coloringInstructions.push("G" + s);

        //start enqueuing edges of s
        for (let i = 0; i < links.length; i+=2){
             startNode = Object.values( Object.values(links[i])[0] )[0];
             endNode = Object.values( Object.values(links[i])[1] )[0];

            if( startNode   == s  || endNode == s){                
                 str = startNode + " " + endNode
                 weight = Object.values(links[i])[2]
                minPQ.enqueue([str, Number(weight)])
                exploredEdge.add(str)
                
               this.outputArray.push( "Enqueue Edge:" + str +", weight= "+ weight + "\n" );
                this.coloringInstructions.push("EPV" + startNode + "edge" + endNode ); 
            }
        }
        let currentMinEdge = minPQ.dequeue();
        let currentNodes = currentMinEdge[0].split(" ");       
        this.outputArray.push( "Dequeue Edge:" +currentMinEdge + "\n" );
        this.coloringInstructions.push("EPT" + currentNodes[0]+ "edge" + currentNodes[1] + " " + currentNodes[0] + " " + currentNodes[1]); 

        while(!minPQ.isEmpty()){
                //note, start can be end and end can be start. check both
            // COntinue removing edges till we get an edge with an unexplored node
            while (!minPQ.isEmpty() &&   explored.has( currentMinEdge[0].split(" ")[0])  &&   explored.has( currentMinEdge[0].split(" ")[1] )    ) {
                currentMinEdge = minPQ.dequeue();
            }
            let nextNode = "";
            if(explored.has( currentMinEdge[0].split(" ")[0]  )){
                nextNode = currentMinEdge[0].split(" ")[1];
            }else{
                nextNode = currentMinEdge[0].split(" ")[0];
            }
 
        // Check again as queue might get empty without giving back unexplored element
        if (!explored.has(nextNode)) {
            currentNodes = currentMinEdge[0].split(" ");       

            this.outputArray.push("\nColor node " + nextNode + " and edge " +currentMinEdge +   "\n" );
            this.coloringInstructions.push("EPT" + currentNodes[0]+ "edge" + currentNodes[1] + " " + currentNodes[0] + " " + currentNodes[1]); 
   
            //start enqueuing edges of s         
            s = nextNode;

            for (let i = 0; i < links.length; i+=2){
                startNode = Object.values( Object.values(links[i])[0] )[0];
                endNode = Object.values( Object.values(links[i])[1] )[0];
                str = startNode + " " + endNode //edge i.e "A C"

                if(!exploredEdge.has(str)){
                    if( startNode   == s  || endNode == s){                
                        weight = Object.values(links[i])[2]
                        minPQ.enqueue([str, Number(weight)])
                        exploredEdge.add(str)
                        
                    this.outputArray.push( "Enqueue Edge:" + str +", weight= "+ weight + "\n" );
                        this.coloringInstructions.push("EPV" + startNode + "edge" + endNode ); 
                    }
                }
            }
           explored.add(nextNode);
        }
     }       
    }


    topologicalSort(){ // DAG, have to verify if Acyclic? //Algo from Lecture 16, CS344
        let display = document.getElementById("textAreaDisplay"); // link to element
        display.value += "Inside Topological Sort:\n";
        //if acyclic : return;
        let D = new Map();
        let O = [];//output
        let Q = [] // Queue , push, shift
        // initialize D to zero
        for(let [key, value] of  this.adjList){
            D.set(key, 0);
        }
       // Initialize in-degrees array D to zero:
        for(let [key, value] of  this.adjList){
            let neighbors = value;
            for(let neighbor of neighbors){
               D.set(neighbor, D.get(neighbor) + 1);
            }
        }
        this.outputArray.push("\nInsert every vertex v with D[v] = 0 into a queue Q\n");
        this.coloringInstructions.push("X"); 

        // 3- Insert every vertex v with D[v] = 0 into a queue Q
        for(let [key, value] of  this.adjList){
            if(D.get(key) == 0){
                Q.push(key);
                this.outputArray.push("\nPush " + key +" to Q.\nQ: "+Q.toString() + "\n" );
                this.coloringInstructions.push("V" + key); 
            }
        }
               
        while(Q.length > 0){
            
            let v = Q.shift();
            O.push(v);// push just key, not value (neighbors)
            this.outputArray.push(  "\nDequeue "+ v+ "\nQ : " + Q.toString() + "\nCurrent output: "+ O.toString()  + "\n");
            this.coloringInstructions.push("R" + v); 

            for(let neighbor of this.adjList.get(v) ){
               let oldVal = D.get(neighbor);
               D.set(neighbor, oldVal - 1); 

                if(D.get(neighbor) == 0){
                    Q.push(neighbor); //make neighbor violet
                   // this.outputArray.push( "Color current edge: " + v + "-" + neighbor + "\n" );
                   // this.coloringInstructions.push("EPV" + v + "edge" + neighbor ); 
    
                    this.outputArray.push("\nPush " + neighbor +" to Q.\nQ: "+ Q.toString() + "\n");
                    this.coloringInstructions.push("V" + neighbor); 
                }
            }
            //make v green
            this.outputArray.push(  "\nDone with: " + v + "\n" );
            this.coloringInstructions.push("G" + v); 
        }
        this.outputArray.push("\nTopological Ordering: " + O.toString());
        this.coloringInstructions.push("X"); 
    }


    reverseArray(arr) {
        var newArray = [];
        for (var i = arr.length - 1; i >= 0; i--) {
          newArray.push(arr[i]);
        }
        return newArray;
      }
      
      isCyclic(){
          
      }

      areWeightsPositive(){

        for (let [key, value] of this.weightAdjList) {
            for(let v of value){
                if(v.charAt(0) == "-" ){    return false;   }
            }
        }
        return true;
    }

   
} 


  
