$(function () {

	/** Summed up data. **/
    var dataBox = borrowingPotential;
    
    /** List of keys for stacked bar chart **/
    var keyBox = keyData;
    var keys = [];

    /** Turns keyData-JSON into an array. Is used by the stack-function. **/
    function keyFunction(item) {
    	keys.push(item.name);
    }
    
    keyBox.forEach(keyFunction);

    /** Contains potentials and effect-values. **/
    var stackedData = stackedBarData;
    
    var potential = [];
    potential.push(dataBox[2]);
    
    var debt = [];
    debt.push(dataBox[1]);
    
    var opt = [];
    opt.push(dataBox[0]);
    
    /** Calculates max. combined bar value. Used by maxY to calculate the scope of the chart**/
    potential[0].value = potential[0].value + opt[0].value;
    
	axisType.defaultType = {
    		caption: "€ Mio.", 
    		axisFormatter: function(d) { return  d3.format(",.0f")(d / 1000) },
    		diffFormatter: function(d) { return  d3.format(",.2f")(d / 1000) + " Mio. €"}
	}

    var colors = d3.scaleOrdinal(d3.schemeCategory20c);

    var margin = {top: 20, right: 80, bottom: 40, left: 120},
        width = 500 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x = d3.scaleBand()
        .range([0, width])
        .padding(0.1);

    var y = d3.scaleLinear()
        .range([height, 0]);

    var maxY = d3.max(dataBox, function (d) {
        return potential[0].value + 5000;
    });

    x.domain(["Potenzial"]);
    y.domain([0,maxY]);

    var svg = d3.select("#d3_graph_main")
        .append("div")
        .classed("svg-container", true)
        .append("svg")
        .attr("viewBox", "0 0 " + (width + margin.left + margin.right) + " " + (height + margin.top + margin.bottom))
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("id","stackedChart")
        .classed("svg-content-responsive", true);

    var g = svg.append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");
    
    g.append("text")
	.attr("x", 10)
	.attr("y", 15)
	.style("font-size", "24px")
	.text(function(d) {return "Mio. €"; });

    var barContainer = g.append("g").attr("class", "barContainer");

    var lastY = 0;
    var counter = 0;

    var stack = d3.stack().keys(keys);
    var series = stack(stackedData);
    
    barContainer.selectAll(".bar")
        .data(series)
        .enter().append("g")
        .attr("fill", function (d, index) {
        	return colors(index);
        })
        .attr("class", "bar")
        .selectAll("rect")
        .data(function(d) {
        	return d;
        })
        .enter().append("rect")
        .attr("x", function (d) {
        	return x('Potenzial')  + 20;
        })
        .attr("width", x.bandwidth() - 30)
        .attr("y", function(d) {
        	return y(d[1]);
        })
        .attr("height", function(d) {
        	return y(d[0]) - y(d[1]);
        });
    
    var markerContainer = g.append("g").attr("class", "markerContainer");
    
    markerContainer.selectAll(".marker")
    .data(debt)
    .enter()
    .append("line")
    .attr("class", "marker")
    .style("stroke-dasharray", ("10, 10"))
    .style("stroke", "black")
    .style("stroke-width", "2px")
    .attr('opacity', 0)
    .attr("x1", 0)
    .attr("y1", function (d) {
    	return y(d.value)
    })
    .attr("x2", width)
    .attr("y2", function (d) {
    	return y(d.value)
    })
    .transition()
    .delay(0)
    .duration(0)
    .attr('opacity', 1);
    
    markerContainer.append("text")
    .attr("fill", "black")
    .style("text-anchor", "middle")
    .attr("font-size", "1em")
    .attr('opacity', 0)
    .attr("y", y(d3.max(debt, function (d) {
        return d.value;
    })) - 10)
    .attr("x", width + 10)
    .text(function(d) {return "Verschuldung"; })
    .transition()
    .delay(0)
    .duration(0)
    .attr('opacity', 1);
    
    var axisContainer = g.append("g").attr("class", "axisContainer");

    axisContainer.append("g")
        .style("font-size", "1em")
        .attr("transform", "translate(0," + height + ")")
        .call(createBottomTicks());

    axisContainer.append("g")
        .style("font-size", "1em")
        .call(d3.axisLeft(y).tickFormat(axisType.defaultType.axisFormatter));
 
    updateClone();
    
    function createBottomTicks() {
    	return d3.axisBottom(x);
    }
    
    function updateClone(){
    	var cloneContainer = document.getElementById("stackBarChartCloneContainer");
    	cloneContainer.innerHTML ="<svg height='100%' width='100%' preserveAspectRatio='xMinYMin meet' viewBox='0 0 500 500' ><use xlink:href='#stackedChart'/></svg>";
    }

});


