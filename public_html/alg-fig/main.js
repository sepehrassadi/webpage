//Current main

var input;
   var algoSelected, startNode, graphType, weightType;
   var links = []; var nodeSet = new Set(); var nodes = [];
    var width,  height, svg;
    var linkElements, nodeElements, textNodes,  linkGroup, nodeGroup, textNodesGroup,
      edgePathsGroup, edgeLabelsGroup, edgepaths, edgelabels, //NEW
      linkForce, simulation , dragDrop
      var g;

      // Colors Set
      var greySet  = new Set(), greenSet  = new Set(), violetSet  = new Set(),redSet  = new Set(); // indicating current node  
      var violetEdgeSet = new Set(), greenEdgeSet = new Set(), redEdgeSet = new Set();
      var green, violet;
      var distances = [];
      

      function clearGlobalVariables(){

         input = undefined,algoSelected = undefined,startNode = undefined;
         graphType = undefined,weightType = undefined;    
         links = []; nodeSet = new Set(); nodes = [];
          width = undefined;height= undefined; svg = undefined;
          linkElements = undefined; nodeElements = undefined;textNodes = undefined;
           linkGroup = undefined; nodeGroup = undefined;
           textNodesGroup = undefined; edgePathsGroup = undefined; //NEW
           edgeLabelsGroup = undefined;  edgepaths = undefined; edgelabels = undefined; //NEW
           linkForce = undefined; simulation = undefined; dragDrop = undefined;        
      }     
    // function to create simu
    function stopSimu(){ 
      document.getElementById("textAreaDisplay").value = "";
      d3.selectAll("svg > *").remove();
     }
   
    function simu(){
      clearGlobalVariables();
      stopSimu();

      g = new Graph();

      green = 'rgb(34,153,16)';
      violet = 'rgb(153,16,102)';
      input  = document.getElementById("textAreaNeighborsList").value;
       // input = "0 1\n0 2\n2 3\n1 3\n3 4";  //startNode = "1"
      // input = "8 0\n8 4\n0 3\n4 3\n3 2\n0 1";//startNode = "8"
     // input = "25 36\n36 30\n36 40\n30 28\n40 38\n40 48" //startNode = "25"
     // input= "a b 4\na c 2\nb c 5\nc e 3\nb d 10\ne d 4\nd f 11" 
    // input = "A C 100\nA B 3\nA D 4\nC D 3\nD E 8\nE F 50\nB G 9\nE G 10" ; // KRUSKAL EXAMPLE, 
    //  input = "A B -1\nA C 4\nB C 3\nB E 2\nB D 2\nE D -3\nD C 5\nD B 1" // Bellman directed 
     
     algoSelected = document.getElementById("selectAlgorithm").value;
        startNode = document.getElementById("textAreaStart").value + "";
      // startNode = "A"; 
        graphType = document.getElementById("selectGraphType").value;
        weightType = document.getElementById("selectGraphWeight").value;
        //PARSE:
      parseInput(input);
        // Populate links, then nodes
      width = 600; height = 600;
svg = d3.select('svg') 
svg.attr('width', width).attr('height', height)
svg.append('defs').append('marker')
        .attrs({'id':'arrowhead',
            'viewBox':'-0 -5 10 10',
            'refX':13,
            'refY':0,
            'orient':'auto',
            'markerWidth':9,
            'markerHeight':9,
            'xoverflow':'visible'})
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', 'rgba(50, 50, 50, 0.2)')
        .style('stroke','none');

// we use svg groups to logically group the elements together
 linkGroup = svg.append('g').attr('class', 'links')
 nodeGroup = svg.append('g').attr('class', 'nodes')
 textNodesGroup = svg.append('g').attr('class', 'texts')
 edgePathsGroup = svg.append('g').attr('class', 'edgepaths');
 edgeLabelsGroup = svg.append('g').attr('class', 'edgelabels');
 
 // simulation setup with all forces
 linkForce = d3
  .forceLink()
  .id(function (link) { return link.id })
  .strength(function (link) { return .02 }) // change was .1 or .7

 simulation = d3
  .forceSimulation()
  .force('link', linkForce)
  .force('charge', d3.forceManyBody().strength(-120)) // -120
  .force('center', d3.forceCenter(width / 2, height / 2))

 dragDrop = d3.drag().on('start', function (node) {
  node.fx = node.x
  node.fy = node.y
}).on('drag', function (node) {
  simulation.alphaTarget(0.7).restart()
  node.fx = d3.event.x
  node.fy = d3.event.y
}).on('end', function (node) {
  if (!d3.event.active) {
    simulation.alphaTarget(0)
  }
  node.fx = null
  node.fy = null
})
// we call updateSimulation to trigger the initial render
        updateSimulation()
    }

function updateGraph() { 
    // links
    linkElements = linkGroup.selectAll('line') 
      .data(links, function (link) { return link}) //implementation of links
      // .data(nodes, function (node) { return node.id })
  
    linkElements.exit().remove() 
  
    var linkEnter;
    if(graphType == 'Undirected'){

      linkEnter = linkElements
      .enter().append('line')
      .attr("class", "link")
      .attr('stroke-width', 3)
      .attr('stroke', 'rgba(50, 50, 50, 0.2)')

    }else{

     linkEnter = linkElements
      .enter().append('line')
      .attr("class", "link")
      .attr('marker-end','url(#arrowhead)')
      .attr('stroke-width', 3)
      .attr('stroke', 'rgba(50, 50, 50, 0.2)') // change this for dfs
    }
    linkElements = linkEnter.merge(linkElements)
  
  //For weight labels****************************************************
 
  edgepaths = edgePathsGroup.selectAll('edgepath')
    .data(links)
    .enter()
    .append('path') 
    .attrs({
      'class': 'edgepath',
      'fill-opacity': 0,
      'stroke-opacity': 0,
      'id': (d, i) => 'edgepath' + i 
    })
    .style("pointer-events", "none");

  edgelabels = edgeLabelsGroup.selectAll("edgelabel")
    .data(links)
    .enter()
    .append('text')
    .style("pointer-events", "none")
    .attrs({
      'class': 'edgelabel',
      'id': (d, i) => 'edgelabel' + i,
      'font-size': 14,
      'fill': '#000'
    });

    //ALTERNATE IF EDGE IS UNDIRECTED
if(weightType== 'Weighted' ){
  edgelabels.append('textPath')
    .attr('xlink:href', (d, i) =>{return '#edgepath' + i}) // change
    .style("text-anchor", "middle")
    .style("pointer-events", "none")
    .attr("startOffset", "50%")
    .text((d) => {if(d.showWeight) {return d.weight} }); // w = ...
}
  //****************************************************

    // nodes
    nodeElements = nodeGroup.selectAll('circle')
      .data(nodes, function (node) { return node.id }) // implementation of nodes
  
    nodeElements.exit().remove() 
  
    var nodeEnter = nodeElements
      .enter()
      .append('circle')
      .attr('r', 15)
      .attr('fill', function (node) { return node.id == startNode ? 'red':'gray' }) 
      .call(dragDrop)
  
  
    nodeElements = nodeEnter.merge(nodeElements)
    

      textNodes =   textNodesGroup.selectAll('text') 
      .data(nodes, function (node) { return node.id }) 
  
      textNodes.exit().remove() 

    var textEnter =   textNodes
      .enter()
      .append('text')
      .text(function (node) { return node.label }) // LABEL NODE // here for SSSP // + "∞"
      .attr('font-size', 15)
      .attr('dx', 15)
      .attr('dy', 4)
  
      textNodes = textEnter.merge(  textNodes)
      //textElements
  
  }
  
  function updateSimulation() {
    updateGraph()

    simulation.nodes(nodes).on('tick', () => {
      nodeElements
      // make them constrained to the box
        .attr('cx', function (node) { return node.x = Math.max(10, Math.min(width - 10, node.x)); })
        .attr('cy', function (node) { return node.y = Math.max(10, Math.min(height - 10, node.y)); })
        textNodes
        .attr('x', function (node) { return node.x })
        .attr('y', function (node) { return node.y })
      linkElements // change according to graph type 
        .attr('x1', function (link) { return link.source.x })
        .attr('y1', function (link) { return link.source.y })
        .attr('x2', function (link) { return link.target.x })
        .attr('y2', function (link) { return link.target.y })

      edgepaths
      .attr('d', (d) => (`M ${d.source.x} ${d.source.y} L ${d.target.x} ${d.target.y}`));
    edgelabels 
    .attr('x1', function (d) { return d.source.x})
    .attr('y1', function (d) { return d.source.y })
    .attr('x2', function (d) { return d.target.x })
    .attr('y2', function (d) { return d.target.y })
      })
  
    simulation.force('link').links(links)
    simulation.alphaTarget(0.7).restart()
  }

  function populateDistance(){
    let arr = Array.from( nodeSet );
    for(let i = 0;i < arr.length;i++){
      if (arr[i] == startNode){
        distances[arr[i] + "" ] = "0";
      }else{
        distances[arr[i] + "" ] = "∞";
      }
    }
  }

  function animateGraphandText(){ 

    simu()
    // RUN ALGO
        switch(algoSelected) {
          case "BFS":
              hasStartNode(startNode);
              g.bfs(startNode);
               break;
          case "DFS":
              hasStartNode(startNode);
              g.dfs(startNode);
              break;
          case "DIJKSTRA":
              hasStartNode(startNode);
              populateDistance()
              g.dijkstra(startNode);
              break;
          case "TOPOLOGICAL": 
            if(graphType == 'Directed'){
              g.topologicalSort();                           
            }else{
              alert("Topological Sort requires DAG")
            }
              break;
          case "LONGESTPATH":
            if(graphType == 'Directed' && weightType == 'Weighted'){ // must be undirected and weighted?
              hasStartNode(startNode);
              populateDistance()
              g.longestPath(startNode);
            }else{
              alert("Longest Path requires a directed weighted graph.")
              }
              break;
          case "KRUSKAL": 
            if(graphType == 'Undirected' && weightType == 'Weighted'){ // must be undirected and weighted?
                g.kruskal(links); 
            }else{
                 alert("Kruskal requires an undirected weighted graph.")
                }
            break;
          case "PRIM'S": 
            if(graphType == 'Undirected' && weightType == 'Weighted'){ // must be undirected and weighted?
                g.prims(links); 
            }else{
                 alert("Prim's requires an undirected weighted graph.")
                }
            break; 
            case "BELLMANFORD": 
            if(graphType == 'Directed' && weightType == 'Weighted'){ // must be directed and weighted?
              hasStartNode(startNode);
              populateDistance()
              g.bellmanFord(startNode, links); 
            }else{
                 alert("Bellman Ford requires a directed weighted graph.") //TOFIX?
                }
            break; 
          default:
            alert("Select an ALG");
        }

        var b = document.getElementById("button5");
        b.disabled = true;

            var clearButton = document.getElementById("clearButton");
            clearButton.disabled = true;
            var button = document.getElementById("button4");
            button.disabled = false;
            var running = false;
            var copyArray = g.outputArray;
            var number =  g.outputArray.length;
            var instructionArray = g.coloringInstructions;
            var instruction = "";
            var parsedNode = "";
             greySet = new Set(nodeSet); 

            var timer = new DeltaTimer(function () {
            let disp =  document.getElementById("textAreaDisplay");
                if(number > 0){
                  number--;
                  disp.value += copyArray.shift() + "- - - - - - - - - \n";   
                  
                  parsedNode = instructionArray.shift();
                  let tmp = parsedNode
                  instruction = parsedNode.charAt(0);
                  let p = parsedNode;
                  parsedNode = parsedNode.substring(1);    

                      if(instruction == 'I'){ // INFINITY
                        textNodes.text(function (node) {  return node.label + " " + distances[node.label] }) // LABEL NODE // here for SSSP // + "∞"
                      
                      }else if(instruction == 'D'){ // change specific distance
                        tmp = tmp.split(" ") // [0] is instruction, [1] is node, [2] is newDistance
                       
                        distances[tmp[1]] = tmp[2];
                        textNodes.text(function (node) { return node.label + " " + distances[node.label] })//.style('fill', 'red') //wrong! its gonna reset it to old value!!!!

                      }else if(instruction == 'E'){ // EDGE COLORING
                        parsedNode = parsedNode.substring(1);    
                        if(p.charAt(1) == 'R'){
                          linkElements.attr('stroke', function(link){
                            if(link.id+ "" == parsedNode){
                            return 'rgb(250, 0, 0)'; //red
                            }else{
                              return 'rgba(50, 50, 50, 0.2)'; //grey
                            }
                          }) }
                          if(p.charAt(1) == 'V'){
                            linkElements.attr('stroke', function(link){
                              if(link.id+ "" == parsedNode){
                              return violet; // make it Violet
                              }else{
                                return 'rgba(50, 50, 50, 0.2)'; //grey
                              }
                            })
                          }
                          if(p.charAt(1) == 'P'){ //permanent edge // CHANGE
                            parsedNode = parsedNode.substring(1);    
                            if(p.charAt(2) == 'V'){ // EPV violet
                                violetEdgeSet.add(parsedNode)
                            }
                            if(p.charAt(2) == 'R'){// EPR red
                              if(greenEdgeSet.has(parsedNode)){ greenEdgeSet.delete(parsedNode)  }
                              redEdgeSet.add(parsedNode)
                            }
                            if(p.charAt(2) == 'G'){// EPG green
                              if(redEdgeSet.has(parsedNode)){ redEdgeSet.delete(parsedNode)  }
                              greenEdgeSet.add(parsedNode)
                            }
                            if(p.charAt(2) == 'X'){// EPX grey
                              if(redEdgeSet.has(parsedNode)){ redEdgeSet.delete(parsedNode)  }
                              if(greenEdgeSet.has(parsedNode)){ greenEdgeSet.delete(parsedNode)  }
                            }
                            if(p.charAt(2) == 'T'){// EPT // Only used in Prim's
                              parsedNode = parsedNode.split(" "); // first word  , 0 is edge, 1 is startNode, 2 is targetNode
                                if(violetEdgeSet.has(parsedNode[0])){ violetEdgeSet.delete(parsedNode[0])  }
                              greenEdgeSet.add(parsedNode[0])
                                //Color nodes too
                                greenSet.add(parsedNode[1]); 
                                greenSet.add(parsedNode[2]);
                              
                            }
                            
                              // change node color
                            nodeElements.attr('fill', function (node) {
                              if(greenSet.has(node.id + "")){
                                return green;
                              }else{
                                return 'grey';
                              }
                            })
                            // change link color

                            linkElements.attr('stroke', function(link){
                              if(violetEdgeSet.has(link.id + "") ){
                              return violet; // make it Violet
                              }else if( greenEdgeSet.has(link.id + "") ){
                                  return green;
                              }else if(redEdgeSet.has(link.id + "") ){
                                  redEdgeSet.delete(link.id + "")
                                  return 'rgb(250, 0, 0)'; //red
                              }else{
                               // alert("color edge grey" + link.id)
                                return 'rgba(50, 50, 50, 0.2)'; //grey
                              }
                            })


                          }
                      }else{
                          if(!(instruction == 'X') ){
                            //temporary coloring of node
                            if(instruction == 'W'){

                              nodeElements.attr('fill', function (node) {
                                 if(node.id  == parsedNode){
                                  return 'red';
                                }else{
                                  return 'grey';
                                }
                              })
                       
                            }else{ // permanent coloring of node
                              if(instruction == 'V'){ 
                                if(greySet.has(parsedNode)){
                                  greySet.delete(parsedNode);
                                }
                                violetSet.add(parsedNode);

                              }else if(instruction == 'G'){ 
                                if(redSet.has(parsedNode)){
                                  redSet.delete(parsedNode);
                                }
                                greenSet.add(parsedNode);
                              
                              }else{ // if Red
                                if(greySet.has(parsedNode)){
                                  greySet.delete(parsedNode);
                                }
                                if(violetSet.has(parsedNode)){
                                  violetSet.delete(parsedNode);
                                }
                                redSet.add(parsedNode);
                              }

                              nodeElements.attr('fill', function (node) {
                                if(greenSet.has(node.id + "")){
                                  return green;
                                }else if(violetSet.has(node.id + "")){
                                  return violet;
                                }else if(redSet.has(node.id + "")){
                                  return 'red';
                                }else{
                                  return 'grey';
                                }
                              })

                          } // 
                        }

                        }
                }else{
                  clearButton.disabled = false;
                  violetSet.clear(); greenSet.clear();
                  greySet = new Set(nodeSet); 
                  //Start Animation change name
                  button.innerHTML = "Done"; button.disabled = true;
                }
                
            }, 500); // speed = .5 seconds

        

        button.addEventListener("click", function () {
          if (running) {
            timer.stop();
            button.innerHTML = "Resume";
            running = false;
          } else {
            timer.start();
            button.innerHTML = "Pause";
            running = true;
          }
        });
        
        function DeltaTimer(render, interval) {
            var timeout;
            var lastTime;
        
            this.start = start;
            this.stop = stop;
        
            function start() {
                timeout = setTimeout(loop, 0);
                lastTime = Date.now();
                return lastTime;
            }
        
            function stop() {
                clearTimeout(timeout);
                return lastTime;
            }
        
            function loop() {
                var thisTime = Date.now();
                var deltaTime = thisTime - lastTime;
                var delay = Math.max(interval - deltaTime, 0);
                timeout = setTimeout(loop, delay);
                lastTime = thisTime + delay;
                render(thisTime);
            }
        }
  }



  function isNumeric(str) {
    if (typeof str != "string") return false // we only process strings!  
    return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
           !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
  }

function parseInput(input){
  if (input != '' ){
    var lines = input.split('\n');
    var strOne = "" + 1;


    for(var i = 0;i < lines.length;i++){
        var numbers = lines[i].split(" ");
        if((numbers.length > 3 ) || (numbers.length == 0  )){
          alert("improper input.")
          return;
        }
       var start = numbers[0];
       var finish = numbers[1];

       if(!(finish == undefined) && !(finish == "") && !(start == undefined) && !(start == "")  ){ // ici
         start += "";
         finish += "";
        let idEdge = "";


        if(graphType == 'Directed' && weightType == 'Weighted'){
          let tmpWeight;
          if(numbers[2] == undefined){
            tmpWeight = strOne;
          }else{
            // check it's a number
            if(numbers[2].charAt(0) == "-"){
              if( !isNumeric(numbers[2].substring(1))  ){
                alert("Inputed weight is unvalid.")
                return;
              }
            }else{
              if(!isNumeric(numbers[2])) {
                alert("Inputed weight is unvalid.")
                return ;
              }
            }
            tmpWeight = numbers[2] ;
          }
          //start here
          // CHANGE HERES
           idEdge = start + "edge" + finish;
            links.push(  {target: finish ,  source:  start , weight: tmpWeight, showWeight: true, id: idEdge }   );         
            g.addEdge(numbers[0], numbers[1]  , tmpWeight) ; 
        }
        if(graphType == 'Undirected' && weightType== 'Weighted'){         
          let tmpWeight;
          if(numbers[2] == undefined){
            tmpWeight = strOne;
          }else{
              // check it's a number
              if(numbers[2].charAt(0) == "-"){
                if( !isNumeric(numbers[2].substring(1))  ){
                  alert("Inputed weight is unvalid.")
                  return;
                }
              }else{
                if(!isNumeric(numbers[2])) {
                  alert("Inputed weight is unvalid.")
                  return ;
                }
              }
              tmpWeight = numbers[2] ;          
          }
            idEdge = start + "edge" + finish;
            links.push(  {target: finish ,  source:  start , weight: tmpWeight, showWeight: true, id: idEdge    }   ); 
            idEdge = finish + "edge" + start;
            links.push(  {target: start ,  source:  finish , weight: tmpWeight, showWeight: false, id: idEdge    }   ); 

            g.addEdge(numbers[0], numbers[1] , tmpWeight );
            g.addEdge(numbers[1], numbers[0] , tmpWeight );         
        }

        if(graphType == 'Undirected' && weightType== 'Unweighted'){
          idEdge = start + "edge" + finish;
            links.push(  {target: finish ,  source:  start , weight: strOne, showWeight: true, id: idEdge  }   ); 
            idEdge = finish + "edge" + start;
            links.push(  {target: start ,  source:  finish , weight: strOne, showWeight: false, id: idEdge  }   ); 

            g.addEdge(numbers[0], numbers[1] , strOne);
            g.addEdge(numbers[1], numbers[0] , strOne);
        }

        if(graphType == 'Directed' && weightType== 'Unweighted'){
          idEdge = start + "edge" + finish;
            links.push(  {target: finish ,  source:  start , weight: strOne, showWeight: true, id: idEdge   }   ); 
            g.addEdge(numbers[0], numbers[1] ,strOne) ;
        }

      }

        if(! nodeSet.has(start) && !(start == undefined) && !(start == "") ){
            nodeSet.add(start);
            nodes.push({id: start ,  label:  start});
        }  
       if(! nodeSet.has(finish) && !(finish == undefined) && !(finish == "")){
            nodeSet.add(finish);
            nodes.push({id: finish ,  label:  finish});
        }
    }
}else{
  alert("There are no edges/nodes.");
  return;
  }


}
function hasStartNode(startNode){
    if(!  (nodeSet.has(startNode + "")   )){
      alert("Please input a correct starting node.");
      return;
  }
}


