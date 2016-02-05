var width = 500,
    height = 500,
    n = 22,
    m = 30,
    r = 3,
    dr = 20,
    g = 137.5 * Math.PI / 180;
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background", "#d1d1d1")
    .append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")");
var data = [];
for (var r = 1; r <= n; r++) {
    for (var ø = 0; ø < Math.PI * 2; ø += 2 * Math.PI / m) {
        data.push({r: r, ø: ø});
    }
}
var seeds = svg.selectAll("circle")
    .data(data)
    .enter().append("circle")
    .attr("cx", function(d) { return d.r * d.r * Math.cos(d.ø + g * d.r); })
    .attr("cy", function(d) { return d.r * d.r * Math.sin(d.ø + g * d.r); })
    .attr("fill", "#000")
    .attr("fill-opacity", 0.3);
d3.timer(function(t) {
    seeds.attr("r", function(d) { return 0.3 * (Math.sin(t / 2000) + 1) * Math.pow(d.r, 2); });
});