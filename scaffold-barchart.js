
define("matta_barchart", ["d3", "matta"], function (d3, matta) {
    
/**
 * mod_matta_barchart was scaffolded using matta
 * Variables that start with an underscore (_) are passed as arguments in Python.
 * Variables that start with _data are data parameters of the visualization, and expected to be given as datum.
 *
 * For instance, d3.select('#figure').datum({'graph': a_json_graph, 'dataframe': a_json_dataframe}).call(visualization)
 * will fill the variables _data_graph and _data_dataframe.
 */

var mod_matta_barchart = function() {
    var __fill_data__ = function(__data__) {
        
            func_matta_barchart.dataframe(__data__.dataframe);
        
    };

    var func_matta_barchart = function (selection) {
        console.log('selection', selection);
        selection.each(function(__data__) {
            __fill_data__(__data__);

            var container = null;

            if (d3.select(this).select("svg.matta_barchart-container").empty()) {
                
                    var svg = d3.select(this).append("svg")
                        .attr("width", _width + _padding.left + _padding.right)
                        .attr("height", _height + _padding.top + _padding.bottom)
                        .attr('class', 'matta_barchart-container');

                    

                    container = svg.append("g")
                        .classed('matta_barchart-container', true)
                        .attr('transform', 'translate(' + _padding.left + ',' + _padding.top + ')');

                
            } else {
                container = d3.select(this).select("svg.matta_barchart-container");
            }

            console.log('container', container.node());

            
                // based on http://bl.ocks.org/mbostock/3885304

var x = d3.scale.ordinal()
    .rangeRoundBands([0, _width], .1);

var y = d3.scale.linear()
    .range([_height, 0]);

if (_y_label == null) {
    _y_label = _y;
}

x.domain(_data_dataframe.map(function(d) { return d[_x]; }));
y.domain([0, d3.max(_data_dataframe, function(d) { return d[_y]; })]);




    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left");

    if (_y_axis_ticks != null) {
        yAxis.ticks(_y_axis_ticks);
    }

    var y_label = container.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text");

    if (_rotate_label) {
        y_label.attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end");
    } else {
        y_label//.attr("transform", "rotate(-90)")
        .attr("y", 6)
            .attr('x', 12)
        .attr("dy", ".71em")
        .style("text-anchor", "start");
    }

    y_label.text(_y_label);


var bar = container.selectAll(".bar")
    .data(_data_dataframe);

bar.enter().append('rect').classed('bar', true);

bar.exit().remove();

bar.attr("x", function(d) { return x(d[_x]); })
    .attr("width", x.rangeBand())
    .attr("y", function(d) { return y(d[_y]); })
    .attr("height", function(d) { return _height - y(d[_y]); })
    .attr('fill', _color);
            

        });
    };

    
        var _data_dataframe = null;
        func_matta_barchart.dataframe = function(__) {
            if (arguments.length) {
                _data_dataframe = __;
                console.log('DATA dataframe', _data_dataframe);
                return func_matta_barchart;
            }
            return _data_dataframe;
        };
    

    
    
        var _color = "steelblue";
        func_matta_barchart.color = function(__) {
            if (arguments.length) {
                _color = __;
                console.log('setted color', _color);
                return func_matta_barchart;
            }
            return _color;
        };
    
        var _y_label = null;
        func_matta_barchart.y_label = function(__) {
            if (arguments.length) {
                _y_label = __;
                console.log('setted y_label', _y_label);
                return func_matta_barchart;
            }
            return _y_label;
        };
    
        var _y_axis_ticks = 10;
        func_matta_barchart.y_axis_ticks = function(__) {
            if (arguments.length) {
                _y_axis_ticks = __;
                console.log('setted y_axis_ticks', _y_axis_ticks);
                return func_matta_barchart;
            }
            return _y_axis_ticks;
        };
    
        var _height = 75;
        func_matta_barchart.height = function(__) {
            if (arguments.length) {
                _height = __;
                console.log('setted height', _height);
                return func_matta_barchart;
            }
            return _height;
        };
    
        var _padding = {"top": 20, "right": 30, "left": 30, "bottom": 30};
        func_matta_barchart.padding = function(__) {
            if (arguments.length) {
                _padding = __;
                console.log('setted padding', _padding);
                return func_matta_barchart;
            }
            return _padding;
        };
    
        var _width = 230;
        func_matta_barchart.width = function(__) {
            if (arguments.length) {
                _width = __;
                console.log('setted width', _width);
                return func_matta_barchart;
            }
            return _width;
        };
    
        var _rotate_label = false;
        func_matta_barchart.rotate_label = function(__) {
            if (arguments.length) {
                _rotate_label = __;
                console.log('setted rotate_label', _rotate_label);
                return func_matta_barchart;
            }
            return _rotate_label;
        };
    
        var _y = "y";
        func_matta_barchart.y = function(__) {
            if (arguments.length) {
                _y = __;
                console.log('setted y', _y);
                return func_matta_barchart;
            }
            return _y;
        };
    
        var _x = "comuna";
        func_matta_barchart.x = function(__) {
            if (arguments.length) {
                _x = __;
                console.log('setted x', _x);
                return func_matta_barchart;
            }
            return _x;
        };
    
    

    
    return func_matta_barchart;
};
    return mod_matta_barchart;
});