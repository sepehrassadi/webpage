   var input;
   var algoSelected;
   var startNode;
   var graphType;
   var weightType;

   var links = [];
    var nodeSet = new Set();
    var nodes = [];
    var width,
        height
    var svg;
    var linkElements,
    nodeElements,
      textNodes,
      linkGroup,
      nodeGroup,
      textNodesGroup,
      linkForce,
      simulation,
      dragDrop

   function f(){
        var g = new Graph();

         input  = document.getElementById("textAreaNeighborsList").value;
         algoSelected = document.getElementById("selectAlgorithm").value;
         startNode = document.getElementById("textAreaStart").value;
         graphType = document.getElementById("selectGraphType").value;
         weightType = document.getElementById("selectGraphWeight").value;
        let textArea = document.getElementById("textAreaDisplay");
        textArea.value = ""; // empty first
     
       //Add Edges here:
        if (input != '' ){
            var lines = input.split('\n');
            var strOne = "" + 1;
            for(var i = 0;i < lines.length;i++){
                var numbers = lines[i].split(" ");
                
                if(graphType == 'Undirected' && weightType== 'Weighted'){
                    //alert("entered 1st If");
                    g.addEdge(numbers[0], numbers[1] , numbers[2] );
                    g.addEdge(numbers[1], numbers[0] , numbers[2] );
                }
                if(graphType == 'Undirected' && weightType== 'Unweighted'){                    
                    g.addEdge(numbers[0], numbers[1] , strOne);
                    g.addEdge(numbers[1], numbers[0] , strOne);
                    
                }
                if(graphType == 'Directed' && weightType == 'Weighted'){
                    g.addEdge(numbers[0], numbers[1]  , numbers[2]) ;
                }
                if(graphType == 'Directed' && weightType== 'Unweighted'){
                    g.addEdge(numbers[0], numbers[1] ,strOne) ;
                }
            }

        }

        g.printGraph();

        // RUN ALGO
        switch(algoSelected) {
            case "BFS":
               g.bfs(startNode);
                break;
            case "DFS":
                g.dfs(startNode);
                break;
            case "DIJKSTRA":
                g.dijkstra(startNode);
                break;
            case "TOPOLOGICAL": // to fix
                g.topologicalSort();
                break;
            case "LONGESTPATH":
                g.longestPath(startNode);
                break;
            default:
              // code block
              alert("Select an ALG");

          }
    
    }
    // function to create simu
    function stopSimu(){
   //     simulation.stop();
   d3.selectAll("svg > *").remove();
    }
    function simu(){
        d3.selectAll("svg > *").remove();
        // first clear it!!
        //IN CASE WANT TO ONLY SHOW GRAPH
        input  = document.getElementById("textAreaNeighborsList").value;
        algoSelected = document.getElementById("selectAlgorithm").value;
        startNode = document.getElementById("textAreaStart").value;
        graphType = document.getElementById("selectGraphType").value;
        weightType = document.getElementById("selectGraphWeight").value;


        //PARSE:
        // not working when UNDIRECTED!!
        if (input != '' ){
            var lines = input.split('\n');
            var strOne = "" + 1;
            // LINKS
            //  { target: "cat"   , source: "elk"    ,weight: "w"    },

            for(var i = 0;i < lines.length;i++){
                var numbers = lines[i].split(" ");

                var start = numbers[0] + "";
                var finish = numbers[1] + "";

                if(graphType == 'Directed' && weightType == 'Weighted'){
                    links.push(  {target: finish ,  source:  start , weight: numbers[2]   }   ); 
                }

                if(graphType == 'Undirected' && weightType== 'Unweighted'){
                    links.push(  {target: finish ,  source:  start , weight: strOne  }   ); 
                    links.push(  {target: start ,  source:  finish , weight: strOne  }   ); 
                }
                if(graphType == 'Directed' && weightType== 'Unweighted'){
                    links.push(  {target: finish ,  source:  start , weight: strOne  }   ); 
                }
                if(graphType == 'Undirected' && weightType== 'Weighted'){
                    links.push(  {target: finish ,  source:  start , weight: numbers[2]   }   ); 
                    links.push(  {target: start ,  source:  finish , weight: numbers[2]   }   ); 
                }


                // NODE SET , ie:   //{ id: "cat"   ,   label: "Cats"     }
                if(! nodeSet.has(start) ){
                    nodeSet.add(start);
                    nodes.push({id: start ,  label:  start});
                }  
                 if(! nodeSet.has(finish) ){
                    nodeSet.add(finish);
                    nodes.push({id: finish ,  label:  finish});
                }
            }
        }

        // Populate links, then nodes
 width = 600;
 height = 600;

 //d3.select("svg").remove(); // deletes whole thing

 //d3.select('svg').selectAll("*").remove();// gives corner answer
svg = d3.select('svg') 
// svg.selectAll("*").remove(); // deletes current elements deletes everything but new nodes are put in the corner!

svg.attr('width', width).attr('height', height)



svg.append('defs').append('marker')
        .attrs({'id':'arrowhead',
            'viewBox':'-0 -5 10 10',
            'refX':13,
            'refY':0,
            'orient':'auto',
            'markerWidth':13,
            'markerHeight':13,
            'xoverflow':'visible'})
        .append('svg:path')
        .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
        .attr('fill', 'rgba(50, 50, 50, 0.2)')
        .style('stroke','none');

// we use svg groups to logically group the elements together
 linkGroup = svg.append('g').attr('class', 'links')
 nodeGroup = svg.append('g').attr('class', 'nodes')
 textNodesGroup = svg.append('g').attr('class', 'texts')

// simulation setup with all forces
 linkForce = d3
  .forceLink()
  .id(function (link) { return link.id })
  .strength(function (link) { return 0.1 }) // change was .1 or .7

 simulation = d3
  .forceSimulation()
  .force('link', linkForce)
  .force('charge', d3.forceManyBody().strength(-100)) // -120
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


// last but not least, we call updateSimulation
// to trigger the initial render
        updateSimulation()
    }

    // ici


    //HELPER METHODS

function updateGraph() { // here?
    // links
    linkElements = linkGroup.selectAll('line') // CHANGER
      .data(links, function (link) {
        return link.target.id + link.source.id
      }) 
  
    linkElements.exit().remove()
  
    var linkEnter = linkElements
      .enter().append('line')
      .attr("class", "link")
      .attr('marker-end','url(#arrowhead)')
      .attr('stroke-width', 1)
      .attr('stroke', 'rgba(50, 50, 50, 0.2)')
  
  //---------------------------------- DOESN'T WORK
  svg.selectAll(".link")
              .data(links)
              .enter()
              .append("title").text(function (d) {return "edge"}); 
  
  edgelabels = svg.selectAll(".edgelabel")
              .data(links)
              .enter()
              .append('text')
              .style("pointer-events", "none")
              .attrs({
                  'class': 'edgelabel',
                  'id': function (d, i) {return 'edgelabel' + i},
                  'font-size': 10,
                  'fill': '#aaa'
              });
  
          edgelabels.append('textPath')
              .attr('xlink:href', function (d, i) {return '#edgepath' + i})
              .style("text-anchor", "middle")
              .style("pointer-events", "none")
              .attr("startOffset", "50%")
              .text(function (d) {return d.type});
  //textEdgesGroup
    linkElements = linkEnter.merge(linkElements)
  
    // nodes
    nodeElements = nodeGroup.selectAll('circle')
      .data(nodes, function (node) { return node.id })
  
    nodeElements.exit().remove()
  
    var nodeEnter = nodeElements
      .enter()
      .append('circle')
      .attr('r', 10)
      .attr('fill', function (node) { return 'gray' }) //la
      .call(dragDrop)
  
  
    nodeElements = nodeEnter.merge(nodeElements)
  
    // texts
      textNodes =   textNodesGroup.selectAll('text') 
      .data(nodes, function (node) { return node.id })
  
      textNodes.exit().remove()
  
    var textEnter =   textNodes
      .enter()
      .append('text')
      .text(function (node) { return node.label }) // LABEL NODE
      .attr('font-size', 15)
      .attr('dx', 15)
      .attr('dy', 4)
  
      textNodes = textEnter.merge(  textNodes)
  
  }
  
  function updateSimulation() {
    updateGraph()
  
    simulation.nodes(nodes).on('tick', () => {
      nodeElements
      // make them constrained to the box
        .attr('cx', function (node) { return node.x = Math.max(10, Math.min(width - 10, node.x)); })//{ return node.x })
        .attr('cy', function (node) { return node.y = Math.max(10, Math.min(height - 10, node.y)); })//{ return node.y })
        textNodes
        .attr('x', function (node) { return node.x })
        .attr('y', function (node) { return node.y })
      linkElements // change according to graph type 
        .attr('x1', function (link) { return link.source.x })
        .attr('y1', function (link) { return link.source.y })
        .attr('x2', function (link) { return link.target.x })
        .attr('y2', function (link) { return link.target.y })
  //----------------------------------
        //EDGE LABELS NOT WORKING!!
        edgelabels.attr('transform', function (d) {
              if (d.target.x < d.source.x) {
                  var bbox = this.getBBox();
  
                  rx = bbox.x + bbox.width / 2;
                  ry = bbox.y + bbox.height / 2;
                  return 'rotate(180 ' + rx + ' ' + ry + ')';
              }
              else {
                  return 'rotate(0)';
              }
          });
  //----------------------------------
  
      
      })
  
    simulation.force('link').links(links)
    simulation.alphaTarget(0.7).restart()
  }
  