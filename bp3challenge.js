var fs = require ("fs");

// Read in the diagram from the file
var fileContent = fs.readFileSync("diagram.json")
// Parse the file's contents and save the object to a variable
var input = JSON.parse(fileContent.toString());

// Remove the non human steps from the diagram
var output = process(input);

// Write the modified diagram to an output file
fs.writeFileSync("output.json", JSON.stringify(output, null, 2));

// Function to remove the non human steps from a process diagram
function process(diagram) {
	var nodes = diagram.nodes;
	var edges = diagram.edges;
	
	// Figure out which tasks are service tasks, remove them from the list of nodes
	var serviceTasks = [];
	var i = 0;
	while(i < nodes.length) {
		if(nodes[i].type == "ServiceTask") {
			serviceTasks.push(nodes[i].id);
			nodes.splice(i, 1);
		} else {
			i++;
		}
	}
	
	//Figure out which edges correspond to service tasks, modify them
	// In the outer loop, iterate over the eedges
	for(var j = 0; j < edges.length; j++) {
		if(contains(serviceTasks, edges[j].to)) {
			// Find the task that this service task is going to
			for(var k = 0; k < edges.length; k++) {
				if(edges[k].from == edges[j].to) {
					// Found it! Add the modified edge to the array
					edges[j].to = edges[k].to;
					break;
				}
			}
		}
	}
	
	// Finally, remove all edges involving service tasks
	i = 0;
	// Iterate over the edges
	while(i < edges.length) {
		// Remove edges that came from a service task
		if(contains(serviceTasks, edges[i].from)) {
			edges.splice(i, 1);
		} else {
			i++;
		}
	}
	
	var newDiagram = {nodes, edges};
	return newDiagram;
}

// Returns true if the given array contains the given value
function contains(arr, value) {
	for(var i = 0; i < arr.length; i++) {
		if(arr[i] == value) {
			return true;
		}
	}
	return false;
}