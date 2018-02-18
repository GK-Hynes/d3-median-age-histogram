var width = 800;
var height = 600;
var padding = 50;
var barPadding = 1;
var ageData = regionData.filter(d => d.medianAge !== null);
var initialBinCount = 16;

// prettier-ignore
var svg = d3.select("svg")
              .attr("width", width)
              .attr("height", height);

// prettier-ignore
d3.select("input")
    .property("value", initialBinCount)
  .on("input", function() {
    updateRects(+d3.event.target.value);
  });

// prettier-ignore
svg.append("g")
   .attr("transform", "translate(0," + (height - padding) + ")")
   .classed("x-axis", true);

// prettier-ignore
svg.append("g")
   .attr("transform", "translate(" + padding + ", 0)")
   .classed("y-axis", true);

// prettier-ignore
svg.append("text")
   .attr("x", width / 2)
   .attr("y", height - 10)
   .attr("text-anchor", "middle")
   .text("Median Age");

// prettier-ignore
svg.append("text")
     .attr("transform", "rotate(-90)")
     .attr("x", -height / 2)
     .attr("y", 15)
     .attr("text-anchor", "middle")
     .text("Frequency");

updateRects(initialBinCount);

function updateRects(val) {
  // prettier-ignore
  var xScale = d3.scaleLinear()
                 .domain(d3.extent(ageData, d => d.medianAge))
                 .rangeRound([padding, width - padding]);

  // prettier-ignore
  var histogram = d3.histogram()
                    .domain(xScale.domain())
                    .thresholds(xScale.ticks(val))
                    .value(d => d.medianAge);

  var bins = histogram(ageData);

  // prettier-ignore
  var yScale = d3.scaleLinear()
               .domain([0, d3.max(bins, d => d.length)])
               .range([height - padding, padding]);

  // prettier-ignore
  d3.select(".y-axis")
      .call(d3.axisLeft(yScale));

  // prettier-ignore
  d3.select(".x-axis")
      .call(d3.axisBottom(xScale)
            .ticks(val))
    .selectAll("text")
      .attr("y", -3)
      .attr("x", 10)
      .attr("transform", "rotate(90)")
      .attr("text-anchor", "start");

  // prettier-ignore
  var rect = svg
                .selectAll("rect")
                .data(bins);

  // prettier-ignore
  rect
    .exit()
    .remove();

  // prettier-ignore
  rect
    .enter()
      .append("rect")
    .merge(rect)
      .attr("x", d => xScale(d.x0))
      .attr("y", d => yScale(d.length))
      .attr("height", d => height - padding - yScale(d.length))
      .attr("width", d => xScale(d.x1) - xScale(d.x0) - barPadding)
      .attr("fill", "blue");

  // prettier-ignore
  d3.select(".bin-count")
      .text("Number of bins: " + bins.length);
}
