
define("matta_choromap", ["d3", "matta", "topojson"], function (d3, matta, topojson) {
    var mod_choromap = function() {
        var func_choromap = function (selection) {
            console.log('selection', selection);
            selection.each(function(json) {
                var container = null;

                if (d3.select(this).select("svg.choromap-container").empty()) {
                    
                        var svg = d3.select(this).append("svg")
                            .attr("width", width)
                            .attr("height", height)
                            .attr('class', 'choromap-container');

                        

                        container = svg.append("g")
                            .attr('class', 'choromap-container');

                    
                } else {
                    container = d3.select(this).select("svg.choromap-container");
                }

                console.log('container', container.node());

                
                    
                        var map_width = width;
var map_height = height;

var _feature_name = 'santiago-comunas';
var _feature_id = 'id';






var _symbol_color = 'steelblue';







var geometry = topojson.feature(json, json.objects[_feature_name]);
console.log('geometry', geometry);

var available_ids = d3.set();
geometry.features.forEach(function(d) {
    available_ids.add(d[_feature_id]);
});

console.log('available ids', available_ids);

var path = d3.geo.path();


var legend_container;
var legend = matta.symbol_legend()
    .position({x: 20 + 12, y: height - 20 });



    var threshold_container;
    var threshold_legend = matta.color_thresholds()
        .extent(_area_color_thresholds_extent)
        .width(_area_color_thresholds_width)
        .height(_area_color_thresholds_height)
        .title(_area_color_thresholds_title);

    
        map_height -= _area_color_thresholds_height + 50;
        threshold_legend.position({x: (map_width - _area_color_thresholds_width) * 0.5, y: map_height })
    

    var threshold = d3.scale.threshold()
        .domain(_area_color_thresholds_domain)
        .range(_area_color_thresholds_colors);

    var area_colors = d3.map();
    //console.log('area colors', area_color_thresholds);
    console.log('threshold', threshold.range(), threshold.domain());


var draw_topojson = function() {
    console.log('map container', map_container);
    var p = path_g.selectAll('path')
        .data(geometry.features, function(d, i) { return d[_feature_id]; });

    p.enter()
        .append('path');

    p.exit()
        .remove();

    
    var fill_color = 'none';
    

    p.attr({
            'd': path,
            'fill': fill_color,
            'stroke': 'gray',
            'opacity': 1.0,
            'stroke-width': 1.0
        });


    

    
        console.log('dataframe', _dataframe);
        var property_id = null;
        var position_vars = null;
        var symbol_positions = null;
        
            property_id = 'comuna';
        



        var symbols = _dataframe.filter(function(d) {
            console.log('symbol', _property_color, d.hasOwnProperty(_property_color), d);
            

                return (d.hasOwnProperty(_property_color));
            

            if (property_id !== null) {
                console.log(d, d[property_id], available_ids.has(d[property_id]));
                return available_ids.has(d[property_id]);
            }

            if (position_vars !== null) {
                return d.hasOwnProperty(position_vars[0]) && d.hasOwnProperty(position_vars[1]);
            }
            return false;
        });
        console.log('symbols', symbols, position_vars);
        

            symbols.forEach(function(d) {
                if (d.hasOwnProperty(_property_color)) {
                    area_colors.set(d[property_id], threshold(d[_property_color]));
                }
            });

            console.log('area colors', area_colors);

            p.each(function(d) {
                if (area_colors.has(d[_feature_id])) {
                    d3.select(this).attr({
                        'fill': area_colors.get(d[_feature_id]),
                        'opacity': 0.75
                    });
                }
            });
            console.log('threshold', threshold);
            
                threshold_container.data([threshold]).call(threshold_legend);
            
        

        
    
};


    var map_container = container;

    var path_g = map_container.select('g.geo-paths');

    if (path_g.empty()) {
        path_g = map_container.append('g').attr('class', 'geo-paths');
    }

    
    if (!container.select('g.symbol-legend').empty()) {
        legend_container = container.select('g.symbol-legend');
    } else {
        legend_container = container.append('g').classed('symbol-legend legend', true);
    }
    console.log('legend_container', legend_container);
    

    
    if (!container.select('g.threshold-legend').empty()) {
        threshold_container = container.select('g.threshold-legend');
    } else {
        threshold_container = container.append('g').classed('threshold-legend legend', true);
    }
    console.log('threshold_container', threshold_container);
    

    var projection = d3.geo.mercator()
        .center([0,0])
        .scale(1)
        .translate([0, 0]);

    path.projection(projection);

    var st = matta.fit_projection(map_width, map_height, path.bounds(geometry));
    projection.scale(st[0]).translate(st[1]);
    draw_topojson();

                    
                

            });
        };

        var width = 260;
        var height = 300;

        
            var _area_color_thresholds_domain = [0.0, 0.16666666666666666, 0.33333333333333331, 0.5, 0.66666666666666663, 0.83333333333333326, 1.0];
            func_choromap.area_color_thresholds_domain = function(_) {
                if (arguments.length) {
                    _area_color_thresholds_domain = _;
                    console.log('setted area_color_thresholds_domain', _area_color_thresholds_domain);
                    return func_choromap;
                }
                return _area_color_thresholds_domain;
            };
        
            var _property_color = null;
            func_choromap.property_color = function(_) {
                if (arguments.length) {
                    _property_color = _;
                    console.log('setted property_color', _property_color);
                    return func_choromap;
                }
                return _property_color;
            };
        
            var _area_color_thresholds_title = "";
            func_choromap.area_color_thresholds_title = function(_) {
                if (arguments.length) {
                    _area_color_thresholds_title = _;
                    console.log('setted area_color_thresholds_title', _area_color_thresholds_title);
                    return func_choromap;
                }
                return _area_color_thresholds_title;
            };
        
            var _area_color_thresholds_colors = ["#246aae", "#529dc8", "#a7d0e4", "#e1edf3", "#fae7dc", "#f7b799", "#dc6e57", "#b61f2e"];
            func_choromap.area_color_thresholds_colors = function(_) {
                if (arguments.length) {
                    _area_color_thresholds_colors = _;
                    console.log('setted area_color_thresholds_colors', _area_color_thresholds_colors);
                    return func_choromap;
                }
                return _area_color_thresholds_colors;
            };
        
            var _dataframe = null;
            func_choromap.dataframe = function(_) {
                if (arguments.length) {
                    _dataframe = _;
                    console.log('setted dataframe', _dataframe);
                    return func_choromap;
                }
                return _dataframe;
            };
        
            var _area_color_thresholds_extent = [-0.1, 1.1];
            func_choromap.area_color_thresholds_extent = function(_) {
                if (arguments.length) {
                    _area_color_thresholds_extent = _;
                    console.log('setted area_color_thresholds_extent', _area_color_thresholds_extent);
                    return func_choromap;
                }
                return _area_color_thresholds_extent;
            };
        
            var _area_color_thresholds_height = 8;
            func_choromap.area_color_thresholds_height = function(_) {
                if (arguments.length) {
                    _area_color_thresholds_height = _;
                    console.log('setted area_color_thresholds_height', _area_color_thresholds_height);
                    return func_choromap;
                }
                return _area_color_thresholds_height;
            };
        
            var _area_color_thresholds_width = 150;
            func_choromap.area_color_thresholds_width = function(_) {
                if (arguments.length) {
                    _area_color_thresholds_width = _;
                    console.log('setted area_color_thresholds_width', _area_color_thresholds_width);
                    return func_choromap;
                }
                return _area_color_thresholds_width;
            };
        
        return func_choromap;
    };

    return mod_choromap;
});