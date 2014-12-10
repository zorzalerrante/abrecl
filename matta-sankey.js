
define("matta_sankey", ["d3", "matta", "sankey"], function (d3, matta, sankey) {
    var mod_sankey = function() {
        var func_sankey = function (selection) {
            console.log('selection', selection);
            selection.each(function(json) {
                var container = null;

                if (d3.select(this).select("svg.sankey-container").empty()) {
                    
                        var svg = d3.select(this).append("svg")
                            .attr("width", width)
                            .attr("height", height)
                            .attr('class', 'sankey-container');

                        
                            svg.append('rect')
                                .attr('width', width)
                                .attr('height', height)
                                .attr('fill', "#dfdfdf");
                        

                        container = svg.append("g")
                            .attr('class', 'sankey-container');

                    
                } else {
                    container = d3.select(this).select("svg.sankey-container");
                }

                console.log('container', container.node());

                
                    
                        
var sankey_margin = {
    left: 200,
    top: 3,
    right: 200,
    bottom: 3
};


    sankey_margin.bottom = 50;


json.links.forEach(function(d) {
    if (!d.hasOwnProperty('value')) {
        d.value = d.weight;
    }
});

var container_width = 1068 

var sankey_width = width - sankey_margin.left - sankey_margin.right;
var sankey_height = height - sankey_margin.top - sankey_margin.bottom;

console.log('sankey size', sankey_width, sankey_height, 200);

var longest = Math.max(width, height);


    var svg_width = width;
    var svg_height = height;  
    var draw_horizontal = false;


var ratio = svg_width * 1.0 / svg_height;

if (draw_horizontal) {
    var sankey_transform = "translate(" + height + ")rotate(90)translate(" + sankey_margin.left + "," + sankey_margin.top + ")";
} else {
    var sankey_transform = "translate(" + sankey_margin.left + "," + sankey_margin.top + ")";
}

var sankey_svg = container.append('g')
    .attr('transform', sankey_transform);


var layout = sankey()
    .nodeWidth(15)
    .nodePadding(10)
    .size([sankey_width, sankey_height]);

var sankey_path = layout.link();

layout
    .nodes(json.nodes)
    .links(json.links)
    .layout(64);

var link = sankey_svg.append("g").selectAll(".link")
    .data(json.links)
    
link.enter().append("path")
    .attr("class", "link")
    .style({
        'stroke-width': function(d){ return Math.max(1, d.dy); },
        'opacity': 0.95,
        'stroke': ''
    })
    .sort(function(a, b){ return b.dy - a.dy; });

link.attr("d", sankey_path);
link.call(matta.styler('stroke', 'color'))
//link.call(matta.styler('stroke-opacity', 'opacity'));


    var link_color_scale = {'domain': [4.0, 5.2000000000000002, 6.4000000000000004, 7.5999999999999996, 8.8000000000000007, 10.0], 'title': 'daut', 'height': 8, 'width': 300, 'colors': ['#995d13', '#cfa256', '#f1dfb3', '#f4f5f5', '#b4e2db', '#58b0a7', '#0c7169'], 'extent': [3, 11]};
    var scale_container;

    if (!container.select('g.threshold-legend').empty()) {
        scale_container = container.select('g.threshold-legend');
    } else {
        scale_container = container.append('g').classed('threshold-legend legend', true);
    }

    var threshold_legend = matta.color_thresholds()
        .extent(link_color_scale['extent'])
        .width(link_color_scale['width'])
        .height(link_color_scale['height'])
        .title(link_color_scale['title']);

    threshold_legend.position({x: (width - link_color_scale['width']) * 0.5, y: height - sankey_margin.bottom})

    var threshold = d3.scale.threshold()
        .domain(link_color_scale['domain'])
        .range(link_color_scale['colors']);

    console.log('area colors', link_color_scale);
    console.log('threshold', threshold, threshold.domain(), threshold.range());

    scale_container.data([threshold]).call(threshold_legend);

    link.style('stroke', function(d) { return threshold(d['daut']); });



var node = sankey_svg.append("g").selectAll(".node")
    .data(json.nodes)
    
node.enter().append("g")
    .attr("class", "node")
    
node.attr("transform", function(d){  return "translate(" + d.x + "," + d.y + ")"; });

node.append("rect")
    .attr("height", function(d){ return d.dy; })
    .attr("width", layout.nodeWidth())
    .style({
        "stroke": function(d){ return d3.rgb(d.color).darker(2); },
        'fill': 'steelblue',
        'fill-opacity': 0.85
    });
    
node.call(matta.styler('fill', 'color'));

node.append("text")
    .attr("x", -6)
    .attr("y", function(d){ return d.dy / 2; })
    .attr("dy", ".35em")
    .attr("text-anchor", "end")
    .attr("transform", null)
    .filter(function(d){ return d.x > sankey_width / 2; })
    .attr("x", 6 + layout.nodeWidth())
    .attr("text-anchor", "start")
    .attr('font-size', 12);
    
node.selectAll("text").call(matta.labeler())
console.log('end');


                    
                

            });
        };

        var width = 1068;
        var height = 800;

        
        return func_sankey;
    };

    return mod_sankey;
});