
define("matta_sankey", ["d3", "matta", "sankey"], function (d3, matta, sankey) {
    
/**
 * mod_matta_sankey was scaffolded using matta
 * Variables that start with an underscore (_) are passed as arguments in Python.
 * Variables that start with _data are data parameters of the visualization, and expected to be given as datum.
 *
 * For instance, d3.select('#figure').datum({'graph': a_json_graph, 'dataframe': a_json_dataframe}).call(visualization)
 * will fill the variables _data_graph and _data_dataframe.
 */

var mod_matta_sankey = function() {
    var __fill_data__ = function(__data__) {
        
            func_matta_sankey.graph(__data__.graph);
        
    };

    var func_matta_sankey = function (selection) {
        console.log('selection', selection);
        selection.each(function(__data__) {
            __fill_data__(__data__);

            var container = null;

            if (d3.select(this).select("svg.matta_sankey-container").empty()) {
                
                    var svg = d3.select(this).append("svg")
                        .attr("width", _width + _padding.left + _padding.right)
                        .attr("height", _height + _padding.top + _padding.bottom)
                        .attr('class', 'matta_sankey-container');

                    
                        svg.append('rect')
                            .attr('width', _width + _padding.left + _padding.right)
                            .attr('height', _height + _padding.top + _padding.bottom)
                            .attr('fill', '#dfdfdf');
                    

                    container = svg.append("g")
                        .classed('matta_sankey-container', true)
                        .attr('transform', 'translate(' + _padding.left + ',' + _padding.top + ')');

                
            } else {
                container = d3.select(this).select("svg.matta_sankey-container");
            }

            console.log('container', container.node());

            
                var sankey_margin = _padding;

// we do this because the sankey layout has hardcoded the value variable.
_data_graph.links.forEach(function(d) {
    d.value = d[_link_weight];
});


    var sankey_width = _width - sankey_margin.left - sankey_margin.right;
    var sankey_height = _height - sankey_margin.top - sankey_margin.bottom;
    var sankey_transform = "translate(" + sankey_margin.left + "," + sankey_margin.top + ")";


if (_link_color_scale_range) {
    sankey_height -= 50;
}

console.log('sankey size', sankey_width, sankey_height);

var sankey_svg;
var links_g;
var nodes_g;

if (!container.select('g.sankey-root').empty()) {
    sankey_svg = container.select('g.sankey-root');
} else {
    sankey_svg = container.append('g').attr('transform', sankey_transform).classed('sankey-root', true);
}

if (!sankey_svg.select('g.sankey-links').empty()) {
    links_g = sankey_svg.select('g.sankey-links');
} else {
    links_g = sankey_svg.append('g').classed('sankey-links', true);
}

if (!sankey_svg.select('g.sankey-nodes').empty()) {
    nodes_g = sankey_svg.select('g.sankey-nodes');
} else {
    nodes_g = sankey_svg.append('g').classed('sankey-nodes', true);
}

var layout = sankey()
    .nodeWidth(_node_width)
    .nodePadding(_node_padding)
    .size([sankey_width, sankey_height]);

var sankey_path = layout.link();

layout
    .nodes(_data_graph.nodes)
    .links(_data_graph.links)
    .layout(_layout_iterations);

var link = links_g.selectAll("path.link")
    .data(_data_graph.links)
    
link.enter().append("path")
    .attr("class", "link")
    .style({
        'stroke-width': function(d){ return Math.max(1, d.dy); },
        'opacity': _link_opacity,
        'stroke': _link_color,
    })
    .sort(function(a, b){ return b.dy - a.dy; });

link.attr("d", sankey_path);
link.call(matta.styler('stroke', 'color'))

if (_link_color_scale_range) {
    var scale_container;

    if (!container.select('g.threshold-legend').empty()) {
        scale_container = container.select('g.threshold-legend');
    } else {
        scale_container = container.append('g').classed('threshold-legend legend', true);
    }

    var threshold_legend = matta.color_thresholds()
        .extent(_link_color_scale_extent)
        .width(_link_color_scale_width)
        .height(_link_color_scale_height)
        .title(_link_color_scale_title);

    threshold_legend.position({x: (_width - _link_color_scale_width) * 0.5, y: _height - 50})

    var threshold = d3.scale.threshold()
        .domain(_link_color_scale_domain)
        .range(_link_color_scale_range);

    console.log('threshold', threshold, threshold.domain(), threshold.range());

    scale_container.data([threshold]).call(threshold_legend);

    link.style('stroke', function(d) { return threshold(d[_link_color_variable]); });
}

var node = nodes_g.selectAll("g.node")
    .data(_data_graph.nodes)
    
node.enter().append("g")
    .attr("class", "node")

node.attr("transform", function(d){  return "translate(" + d.x + "," + d.y + ")"; });

node.append("rect")
    .attr("height", function(d){ return d.dy; })
    .attr("width", layout.nodeWidth())
    .style({
        "stroke": function(d){ return d3.rgb(d.color).darker(2); },
        'fill': _node_color,
        'fill-opacity': _node_opacity
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
    .attr('font-size', _font_size);
    
node.selectAll("text").call(matta.labeler())
console.log('end');


            

        });
    };

    
        var _data_graph = null;
        func_matta_sankey.graph = function(__) {
            if (arguments.length) {
                _data_graph = __;
                console.log('DATA graph', _data_graph);
                return func_matta_sankey;
            }
            return _data_graph;
        };
    

    
    
        var _link_weight = "weight";
        func_matta_sankey.link_weight = function(__) {
            if (arguments.length) {
                _link_weight = __;
                console.log('setted link_weight', _link_weight);
                return func_matta_sankey;
            }
            return _link_weight;
        };
    
        var _link_color_scale_range = ["#995d13", "#cfa256", "#f1dfb3", "#f4f5f5", "#b4e2db", "#58b0a7", "#0c7169"];
        func_matta_sankey.link_color_scale_range = function(__) {
            if (arguments.length) {
                _link_color_scale_range = __;
                console.log('setted link_color_scale_range', _link_color_scale_range);
                return func_matta_sankey;
            }
            return _link_color_scale_range;
        };
    
        var _font_size = 12;
        func_matta_sankey.font_size = function(__) {
            if (arguments.length) {
                _font_size = __;
                console.log('setted font_size', _font_size);
                return func_matta_sankey;
            }
            return _font_size;
        };
    
        var _link_opacity = 0.95;
        func_matta_sankey.link_opacity = function(__) {
            if (arguments.length) {
                _link_opacity = __;
                console.log('setted link_opacity', _link_opacity);
                return func_matta_sankey;
            }
            return _link_opacity;
        };
    
        var _link_color_scale_height = 8;
        func_matta_sankey.link_color_scale_height = function(__) {
            if (arguments.length) {
                _link_color_scale_height = __;
                console.log('setted link_color_scale_height', _link_color_scale_height);
                return func_matta_sankey;
            }
            return _link_color_scale_height;
        };
    
        var _link_color = "#efefef";
        func_matta_sankey.link_color = function(__) {
            if (arguments.length) {
                _link_color = __;
                console.log('setted link_color', _link_color);
                return func_matta_sankey;
            }
            return _link_color;
        };
    
        var _link_color_scale_width = 300;
        func_matta_sankey.link_color_scale_width = function(__) {
            if (arguments.length) {
                _link_color_scale_width = __;
                console.log('setted link_color_scale_width', _link_color_scale_width);
                return func_matta_sankey;
            }
            return _link_color_scale_width;
        };
    
        var _link_color_scale_extent = [0, 11];
        func_matta_sankey.link_color_scale_extent = function(__) {
            if (arguments.length) {
                _link_color_scale_extent = __;
                console.log('setted link_color_scale_extent', _link_color_scale_extent);
                return func_matta_sankey;
            }
            return _link_color_scale_extent;
        };
    
        var _height = 800;
        func_matta_sankey.height = function(__) {
            if (arguments.length) {
                _height = __;
                console.log('setted height', _height);
                return func_matta_sankey;
            }
            return _height;
        };
    
        var _padding = {"right": 100, "bottom": 10, "top": 10, "left": 100};
        func_matta_sankey.padding = function(__) {
            if (arguments.length) {
                _padding = __;
                console.log('setted padding', _padding);
                return func_matta_sankey;
            }
            return _padding;
        };
    
        var _width = 868;
        func_matta_sankey.width = function(__) {
            if (arguments.length) {
                _width = __;
                console.log('setted width', _width);
                return func_matta_sankey;
            }
            return _width;
        };
    
        var _link_color_scale_domain = [4.0, 5.2000000000000002, 6.4000000000000004, 7.5999999999999996, 8.8000000000000007, 10.0];
        func_matta_sankey.link_color_scale_domain = function(__) {
            if (arguments.length) {
                _link_color_scale_domain = __;
                console.log('setted link_color_scale_domain', _link_color_scale_domain);
                return func_matta_sankey;
            }
            return _link_color_scale_domain;
        };
    
        var _link_color_scale_title = "Decil de Ingreso";
        func_matta_sankey.link_color_scale_title = function(__) {
            if (arguments.length) {
                _link_color_scale_title = __;
                console.log('setted link_color_scale_title', _link_color_scale_title);
                return func_matta_sankey;
            }
            return _link_color_scale_title;
        };
    
        var _layout_iterations = 64;
        func_matta_sankey.layout_iterations = function(__) {
            if (arguments.length) {
                _layout_iterations = __;
                console.log('setted layout_iterations', _layout_iterations);
                return func_matta_sankey;
            }
            return _layout_iterations;
        };
    
        var _node_padding = 10;
        func_matta_sankey.node_padding = function(__) {
            if (arguments.length) {
                _node_padding = __;
                console.log('setted node_padding', _node_padding);
                return func_matta_sankey;
            }
            return _node_padding;
        };
    
        var _node_width = 15;
        func_matta_sankey.node_width = function(__) {
            if (arguments.length) {
                _node_width = __;
                console.log('setted node_width', _node_width);
                return func_matta_sankey;
            }
            return _node_width;
        };
    
        var _link_color_variable = "daut";
        func_matta_sankey.link_color_variable = function(__) {
            if (arguments.length) {
                _link_color_variable = __;
                console.log('setted link_color_variable', _link_color_variable);
                return func_matta_sankey;
            }
            return _link_color_variable;
        };
    
        var _node_opacity = 0.85;
        func_matta_sankey.node_opacity = function(__) {
            if (arguments.length) {
                _node_opacity = __;
                console.log('setted node_opacity', _node_opacity);
                return func_matta_sankey;
            }
            return _node_opacity;
        };
    
        var _node_color = "steelblue";
        func_matta_sankey.node_color = function(__) {
            if (arguments.length) {
                _node_color = __;
                console.log('setted node_color', _node_color);
                return func_matta_sankey;
            }
            return _node_color;
        };
    
    

    
    return func_matta_sankey;
};
    return mod_matta_sankey;
});