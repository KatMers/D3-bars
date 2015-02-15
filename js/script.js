
// 1. This sets the margins of the chart, within the chart areaa on the page, so the margins on the first line are set so the next two lines set where the outside of the chart should start. It's the width/height of the chart area, minus the margins. 
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// 2. These two vars set the X and Y scales. X is the dependent variable, the years when the data comes from. Y is the independent variable, the number of hits during each year. The 0 in each pair set the place on the other axis where the axis starts, so the Y axis is set at the 0 point on the X axis and vice versa. The .1 on the X axis sets space between the bars.
var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1);

var y = d3.scale.linear()
    .range([height, 0]);

// 3. The first line creates a new default axis. The scale isn't specified other than X, so it defaults to a linear scale. The orientation specifies that the X axis labels are below the axis itself. It becomes somewhat superfluous in this case, but "bottom" is the default.
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

// This is similar to what's happening above, but for the Y axis. Again, with no extra specification beyond Y, the scale defaults to a linear scale. The orientation specifies the ticks to the left of the Y axis, with ticks every 10 pixels.The tickFormat function d, sets the format to the specified function.
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(10)
    .tickFormat(function(d) {
      return d;
    });

// 4. This defines the svg so the origin of the chart is the top-left corner of the chart area. It looks like the box the chart exists in.
var svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// This is the json file.
d3.json("js/mersmann_baseballcard.json", function(error, data) {

	console.log(data);

// 5. This sets the domain range for both the X and Y axes, which come from the year in the X axis and the hits in the Y axis, pulling both from the json file.
  x.domain(data.stats.map(function(d) { return d.year; }));
  y.domain([0, d3.max(data.stats, function(d) { return d.H; })]);

// 6. This sets the standards for the actual data on the X axis and the placement of them. The attributes establish how the data should be shown and which data specifically should be deiplayed. The next chunk fulfills basically the same thing for the Y axis, setting what the axis looks like, how the data is pulled and how the text on the axis and naming the axis is displayed. 
  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Hits");

// 7. This section pulls data and determines the shape and layout of the bars in the graph itself. It establishes the way the rectangles in the graph show up. (From what I can tell), the difference between this and the $.each() method is that this works for each data point at once, allowing us to manipulate one differently, as needed, but not necessarily have to. With the "selectAll", the attributes affect all the bars. 
  svg.selectAll(".bar")
      .data(data.stats)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.H); })
      .attr("height", function(d) { return height - y(d.H); });

});








