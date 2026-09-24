const margin = {top: 10, right: 30, bottom: 30, left: 40},
  width = 400 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

const svg = d3.select("#my_dataviz")
.append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
.append("g")
  .attr("transform",
        `translate(${margin.left}, ${margin.top})`);

const selected_path = {
    nodes: [
        {
            id: 4,
            name: "E"
        },
        {
            id: 7,
            name: "H"
        }
    ],
    links: [
        {
            source: 4,
            target: 7
        }
    ]
}

checkIfPathNode = ({id, name}) => {
    const t = selected_path.nodes.filter((n) => n.id === id);
    
    return t.length > 0
}

checkIfPathLink = ({source, target}) => {
    const t = selected_path.links.filter((l) => l.source === source && l.target === target);
    
    return t.length > 0
}

d3.json("/build-graph").then( function( data) {

  const link = svg
    .selectAll("line")
    .data(data.links)
    .join("line")
      .style("stroke", d => checkIfPathLink(d) ? "#0026ff" : "#aaa")
      .style("stroke-width", d => checkIfPathLink(d) ? "2" : "1");
  
  const node = svg
    .selectAll("g.node")
    .data(data.nodes)
    .join("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x},${d.y})`);

  node.append("circle")
      .attr("r", 15)
      .on("mouseover", function(d,i) {
        d3.select(this).style("stroke", "#007434").style("stroke-width", "2").style("cursor", "pointer");
      })
      .on("mouseout", function(d,i) {
        d3.select(this).style("stroke", checkIfPathNode(i) ? "#0026ff" : "").style("stroke-width", checkIfPathNode(i) ? "2" : "0");
      })
      .on("click", (e, i) => console.log(i))
      .style("fill", "#69b3a2")
      .style("stroke", d => checkIfPathNode(d) ? "#0026ff" : "")
      .style("stroke-width", d => checkIfPathNode(d) ? "2" : "0");

  node.append("text")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "middle")
      .text(function(d) { return d.name; })
      .attr("x", 0)
      .attr("y", 5)
      .style("fill", "black")
      .style("font-family", "sans-serif")
      .style("font-size", "12px")
      .style("pointer-events", "none");

  const simulation = d3.forceSimulation(data.nodes)
      .force("link", d3.forceLink()
            .id(function(d) { return d.id; })
            .links(data.links)
      )
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .on("tick", ticked);

  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
         .attr("transform", d => `translate(${d.x}, ${d.y})`);
  }
});