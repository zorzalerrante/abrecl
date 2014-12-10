
define("matta_topojson", ["d3", "matta", "topojson", "leaflet", "force_edge_bundling"], function (d3, matta, topojson, leaflet, force_edge_bundling) {
    
/**
 * mod_matta_topojson was scaffolded using matta
 * Variables that start with an underscore (_) are passed as arguments in Python.
 * Variables that start with _data are data parameters of the visualization, and expected to be given as datum.
 *
 * For instance, d3.select('#figure').datum({'graph': a_json_graph, 'dataframe': a_json_dataframe}).call(visualization)
 * will fill the variables _data_graph and _data_dataframe.
 */

var mod_matta_topojson = function() {
    var __fill_data__ = function(__data__) {
        
            func_matta_topojson.geometry(__data__.geometry);
        
            func_matta_topojson.graph(__data__.graph);
        
            func_matta_topojson.area_dataframe(__data__.area_dataframe);
        
            func_matta_topojson.mark_dataframe(__data__.mark_dataframe);
        
    };

    var func_matta_topojson = function (selection) {
        console.log('selection', selection);
        selection.each(function(__data__) {
            __fill_data__(__data__);

            var container = null;

            if (d3.select(this).select("div.matta_topojson-container").empty()) {
                
                    var div = d3.select(this).append("div")
                        .style("width", _width + "px")
                        .style("height", _height + "px")
                        .attr('class', 'matta_topojson-container');

                    
                        div.style("background", '#dfdfdf');
                    

                    container = div;

                
            } else {
                container = d3.select(this).select("div.matta_topojson-container");
            }

            console.log('container', container.node());

            
                
var map_width = _width;
var map_height = _height;

var map_container = null;
var legend_container;
var threshold_container;
var path_g;
var mark_g;
var projection;
var graph_g;

if (_feature_name == null) {
    _feature_name = d3.keys(_data_geometry.objects)[0];
}

var geometry = topojson.feature(_data_geometry, _data_geometry.objects[_feature_name]);
console.log('geometry', geometry);

var available_ids = d3.set();
geometry.features.forEach(function(d) {
    available_ids.add(d[_feature_id]);
});

console.log('available ids', available_ids);

var path = d3.geo.path();

var legend = matta.symbol_legend()
    .position({x: 20 + _mark_max_ratio, y: _height - 20 });
var threshold_legend = matta.color_thresholds()
        .extent(_area_color_thresholds_extent)
        .width(_area_color_thresholds_width)
        .height(_area_color_thresholds_height)
        .title(_area_color_thresholds_title != null ? _area_color_thresholds_title : _area_value);

var threshold = d3.scale.threshold()
    .domain(_area_color_thresholds_domain)
    .range(_area_color_thresholds_colors);

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

    p.attr({
            'd': path,
            'fill': _fill_color,
            'stroke': _path_stroke,
            'opacity': _path_opacity,
            'stroke-width': _path_stroke_width
        });

    if (_label != null) {
        var label = map_container.selectAll('text').data(geometry.features, function(d, i) { return d[_feature_id]; });

        label.enter()
            .append('text');

        label.attr({
                'x': function(d) { return path.centroid(d)[0]; },
                'y': function(d) { return path.centroid(d)[1]; },
                'font-size': _label_font_size,
                'fill': _label
            })
            .text(function(d) { return d.properties[_label]; });
    }

    console.log('dataframe', _data_area_dataframe, _data_mark_dataframe);

    if (_data_area_dataframe != null){
        var area_colors = d3.map();
        _data_area_dataframe.forEach(function(d) {
            if (_area_value != null && d.hasOwnProperty(_area_value)) {
                area_colors.set(d[_area_feature_name], threshold(d[_area_value]));
            }
        });

        console.log('area colors', area_colors);

        p.each(function(d) {
            if (area_colors.has(d[_feature_id])) {
                d3.select(this).attr({
                    'fill': area_colors.get(d[_feature_id]),
                    'opacity': _area_opacity
                });
            }
        });
        console.log('threshold', threshold);

        threshold_container.data([threshold]).call(threshold_legend);
    }

    if (_data_mark_dataframe != null) {
        var mark_positions = null;

        if (_mark_position) {
            mark_positions = d3.map();
            console.log('position_vars', _mark_position);
        }

        var marks = _data_mark_dataframe == null ? [] : _data_mark_dataframe.filter(function(d) {
            //console.log('symbol', _property_color, d.hasOwnProperty(_property_color), d);
            if (_mark_value != null) {
                return (d.hasOwnProperty(_mark_value));
            }

            if (_mark_feature_name !== null) {
                console.log(d, d[_mark_feature_name], available_ids.has(d[_mark_feature_name]));
                return available_ids.has(d[_mark_feature_name]);
            }

            if (_mark_position !== null) {
                return d.hasOwnProperty(_mark_position[0]) && d.hasOwnProperty(_mark_position[1]);
            }
            return false;
        });

        if (_mark_feature_name) {
            geometry.features.forEach(function(d) {
                mark_positions.set(d[_feature_id], path.centroid(d));
            });
        } else {
            console.log('projection', projection);
            marks.forEach(function(d, i) {
                
                var point = _map.latLngToLayerPoint(new _L.LatLng(d[_mark_position[0]], d[_mark_position[1]]))
                var projected = [point.x, point.y];
                
                mark_positions.set(i, projected);
            });
        }

        console.log('positions', mark_positions);

        var mark_scale = matta.scale(_mark_scale)
            .range([_mark_min_ratio, _mark_max_ratio])
            .domain(d3.extent(marks, function(d) { return d[_mark_value]; }));

        console.log('mark scale', mark_scale.domain(), mark_scale.range());

        var legend_g = null;

        if (legend_container.select('g.axis').empty()) {
            legend_g = legend_container.append('g').classed('axis', true);
        } else {
            legend_g = legend_container.select('g.axis');
        }

        if (_legend === true) {
            legend_g.data([mark_scale]).call(legend);
        }

        var mark = mark_g.selectAll('circle.mark')
            .data(marks, function(d, i) {
                if (_mark_feature_name != null) {
                    return d[_mark_feature_name];
                }
                return i;
            });

        mark.enter()
            .append('circle')
            .attr('class', 'mark');

        mark.exit()
            .remove();

        mark.each(function(d, i) {
            if (_mark_feature_name != null) {
                d3.select(this).attr({
                    'cx': mark_positions.get(d[_mark_feature_name])[0],
                    'cy': mark_positions.get(d[_mark_feature_name])[1]
                });
            } else {
                d3.select(this).attr({
                    'cx': mark_positions.get(i)[0],
                    'cy': mark_positions.get(i)[1]
                });
            }

            if (_mark_color_property != null) {
                d3.select(this).attr({
                    'fill': d[_mark_color_property]
                });
            } else if (_mark_color != null) {
                d3.select(this).attr({
                    'fill': _mark_color
                });
            } else {
                 d3.select(this).attr({
                    'fill': 'none'
                });
            }
        });

        mark.attr({
            'r': function(d) { return mark_scale(d[_mark_value]); },
            'opacity': _mark_opacity,
            'stroke-width': _mark_stroke_width,
            'stroke': _mark_stroke
        });

        mark.sort(function(a, b) {
           return d3.descending(a[_mark_value], b[_mark_value]);
        });
    }

    if (_data_graph != null) {
        if (!_data_graph.hasOwnProperty('__matta_prepared__') || _data_graph['__matta_prepared__'] == false) {
            matta.prepare_graph(_data_graph);
            _data_graph['__matta_prepared__'] = true;
        }

        var node_positions = d3.map();
        _data_graph.nodes.forEach(function(d) {
                
                    var point = _map.latLngToLayerPoint(new _L.LatLng(d[_mark_position[0]], d[_mark_position[1]]));
                    var projected = [point.x, point.y];
                
                node_positions.set(d.id, projected);
        });

        console.log('node positions', node_positions);

        var line = d3.svg.line()
            .x(function(d) { return node_positions.get(d.id)[0]; })
            .y(function(d) { return node_positions.get(d.id)[1]; });

        var node = graph_g.selectAll('circle.node')
            .data(_data_graph.nodes, function(d) { return d.id; });

        node.enter()
            .append('circle')
            .attr({
                'class': 'node',
                'r': 1.5,
                'fill': 'black',
                'opacity': 0.5
            });

        node.attr({
            'cx': function(d) { return node_positions.get(d.id)[0]; },
            'cy': function(d) { return node_positions.get(d.id)[1]; }
        });

        node.exit().remove();

        
            if (!_data_graph.hasOwnProperty('bundled')) {
                // the bundling library requires x and y members in each node
                _data_graph.nodes.forEach(function(d) {
                    //var pos = node_positions.get(d.id);
                    //d.x = pos[0];
                    //d.y = pos[1];
                    d.x = d[_mark_position[0]];
                    d.y = d[_mark_position[1]];
                });

                var fbundling = force_edge_bundling()
                    .step_size(_force_edge_step_size)
                    .compatibility_threshold(_force_edge_compatibility_threshold)
                    .bundling_stiffness(_force_edge_bundling_stiffness)
                    .cycles(_force_edge_cycles)
                    .iterations(_force_edge_iterations)
                    .nodes(_data_graph.nodes)
                    .edges(_data_graph.links);

                _data_graph.bundled = fbundling();
            }

            _data_graph.bundled.forEach(function(bundle) {
                bundle.forEach(function(p) {
                    
                        var point = _map.latLngToLayerPoint(new _L.LatLng(p.x, p.y));
                        var projected = [point.x, point.y];
                    
                    p.screen_x = projected[0];
                    p.screen_y = projected[1];
                });
            });

            console.log('bundle', _data_graph.bundled);

            line.interpolate("linear");
            console.log(_data_graph.bundled);
            var bundled_line = d3.svg.line()
                .x(function(d) { return d.screen_x; })
                .y(function(d) { return d.screen_y; });

            var link = graph_g.selectAll('path.link')
                    .data(_data_graph.bundled);

            link.enter()
                .append('path')
                .classed('link', true);

            link.attr({
                'd': bundled_line,
                'stroke': _link_color,
                'fill': 'none',
                'opacity': _link_opacity,
                'stroke-width': _link_width,
            });

            link.exit()
                .remove();
        
    }

};

!function() {
    
        // code adapted from https://github.com/mbostock/bost.ocks.org/blob/gh-pages/mike/leaflet/index.html#L131-171
        if (_L == null) {
            _L = leaflet;
        }

        var map_initialized = false;
        var map_svg;
        var overlay_svg;

        if (container.select('div.leaflet-map-pane').empty()) {
            _map = _L.map(container.node()).setView([0, 0], 12);
            container.node()['__leaflet_map__'] = _map;
            _L.tileLayer(_leaflet_tile_layer, {attribution: _leaflet_map_link}).addTo(_map);
            map_initialized = true;
            map_svg = d3.select(_map.getPanes().overlayPane).append('svg');
            map_container = map_svg.append('g').attr('class', 'leaflet-zoom-hide');
        } else {
            map = container.node()['__leaflet_map__'];
            map_svg = d3.select(_map.getPanes().overlayPane).select('svg');
            map_container = map_svg.select('g.leaflet-zoom-hide');
        }

        if (!container.select('div.leaflet-top.leaflet-left').select('svg.overlay').empty()) {
            overlay_svg = container.select('div.leaflet-top.leaflet-left').select('svg.overlay');
        } else {
            overlay_svg = container.select('div.leaflet-top.leaflet-left')
                .append('svg').classed('overlay', true)
                .attr({'width': _width, 'height': _height})
                .style({'z-index': 1100, 'position': 'absolute', 'top': 0, 'left': 0});
        }

        path_g = map_container.select('g.geo-paths');

        if (path_g.empty()) {
            path_g = map_container.append('g').attr('class', 'geo-paths');
        }

        mark_g = map_container.select('g.marks');
        if (mark_g.empty()) {
            mark_g = map_container.append('g').attr('class', 'marks');
        }

        graph_g = map_container.select('g.graph');
        if (graph_g.empty()) {
            graph_g = map_container.append('g').attr('class', 'graph');
        }

        projection = d3.geo.transform({point: function(x, y) {
                var point = _map.latLngToLayerPoint(new _L.LatLng(y, x));
                this.stream.point(point.x, point.y);
            }
        });

        console.log('projection', projection);
        // Reposition the SVG to cover the features.
        var reset = function() {
            var bounds = path.bounds(geometry),
                topLeft = bounds[0],
                bottomRight = bounds[1];

            map_svg.attr("width", bottomRight[0] - topLeft[0])
                .attr("height", bottomRight[1] - topLeft[1])
                .style("left", topLeft[0] + "px")
                .style("top", topLeft[1] + "px");

            map_container.attr("transform", "translate(" + -topLeft[0] + "," + -topLeft[1] + ")");
            console.log('zoom', _map.getZoom(), _map.getMaxZoom());
            draw_topojson();
        };

        path.projection(d3.geo.transform());
        var map_bounds = path.bounds(geometry);
        path.projection(projection);
        console.log('bounds', map_bounds);

        if (map_initialized) {
            if (_bounding_box) {
                _map.fitBounds(_bounding_box.map(function(d) { return d.reverse(); }));
            } else {
                _map.fitBounds(map_bounds.map(function(d) { return d.reverse(); }));
            }
        }

        if (!overlay_svg.select('g.mark-legend').empty()) {
            legend_container = overlay_svg.select('g.mark-legend');
        } else {
            legend_container = overlay_svg.append('g').classed('mark-legend', true);
        }

        if (!overlay_svg.select('g.threshold-legend').empty()) {
            threshold_container = overlay_svg.select('g.threshold-legend');
        } else {
            threshold_container = overlay_svg.append('g').classed('threshold-legend', true);
        }

        console.log('threshold position', {x: map_width - _area_color_thresholds_width - 20, y: 20});
        threshold_legend.position({x: map_width - _area_color_thresholds_width - 20, y: 20});

        _map.on("viewreset", reset);
        reset();
    
}();
            

        });
    };

    
        var _data_geometry = null;
        func_matta_topojson.geometry = function(__) {
            if (arguments.length) {
                _data_geometry = __;
                console.log('DATA geometry', _data_geometry);
                return func_matta_topojson;
            }
            return _data_geometry;
        };
    
        var _data_graph = null;
        func_matta_topojson.graph = function(__) {
            if (arguments.length) {
                _data_graph = __;
                console.log('DATA graph', _data_graph);
                return func_matta_topojson;
            }
            return _data_graph;
        };
    
        var _data_area_dataframe = null;
        func_matta_topojson.area_dataframe = function(__) {
            if (arguments.length) {
                _data_area_dataframe = __;
                console.log('DATA area_dataframe', _data_area_dataframe);
                return func_matta_topojson;
            }
            return _data_area_dataframe;
        };
    
        var _data_mark_dataframe = null;
        func_matta_topojson.mark_dataframe = function(__) {
            if (arguments.length) {
                _data_mark_dataframe = __;
                console.log('DATA mark_dataframe', _data_mark_dataframe);
                return func_matta_topojson;
            }
            return _data_mark_dataframe;
        };
    

    
    
        var _leaflet_tile_layer = "https://{s}.tiles.mapbox.com/v4/examples.a4c252ab/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6IlhHVkZmaW8ifQ.hAMX5hSW-QnTeRCMAy9A8Q";
        func_matta_topojson.leaflet_tile_layer = function(__) {
            if (arguments.length) {
                _leaflet_tile_layer = __;
                console.log('setted leaflet_tile_layer', _leaflet_tile_layer);
                return func_matta_topojson;
            }
            return _leaflet_tile_layer;
        };
    
        var _leaflet_map_link = "Tiles &copy; Mapbox";
        func_matta_topojson.leaflet_map_link = function(__) {
            if (arguments.length) {
                _leaflet_map_link = __;
                console.log('setted leaflet_map_link', _leaflet_map_link);
                return func_matta_topojson;
            }
            return _leaflet_map_link;
        };
    
        var _fill_color = "none";
        func_matta_topojson.fill_color = function(__) {
            if (arguments.length) {
                _fill_color = __;
                console.log('setted fill_color', _fill_color);
                return func_matta_topojson;
            }
            return _fill_color;
        };
    
        var _link_opacity = 0.15;
        func_matta_topojson.link_opacity = function(__) {
            if (arguments.length) {
                _link_opacity = __;
                console.log('setted link_opacity', _link_opacity);
                return func_matta_topojson;
            }
            return _link_opacity;
        };
    
        var _mark_position = ["lat", "lon"];
        func_matta_topojson.mark_position = function(__) {
            if (arguments.length) {
                _mark_position = __;
                console.log('setted mark_position', _mark_position);
                return func_matta_topojson;
            }
            return _mark_position;
        };
    
        var _path_stroke = "gray";
        func_matta_topojson.path_stroke = function(__) {
            if (arguments.length) {
                _path_stroke = __;
                console.log('setted path_stroke', _path_stroke);
                return func_matta_topojson;
            }
            return _path_stroke;
        };
    
        var _area_color_thresholds_colors = ["#995d13", "#cfa256", "#f1dfb3", "#f4f5f5", "#b4e2db", "#58b0a7", "#0c7169"];
        func_matta_topojson.area_color_thresholds_colors = function(__) {
            if (arguments.length) {
                _area_color_thresholds_colors = __;
                console.log('setted area_color_thresholds_colors', _area_color_thresholds_colors);
                return func_matta_topojson;
            }
            return _area_color_thresholds_colors;
        };
    
        var _mark_stroke_width = 1;
        func_matta_topojson.mark_stroke_width = function(__) {
            if (arguments.length) {
                _mark_stroke_width = __;
                console.log('setted mark_stroke_width', _mark_stroke_width);
                return func_matta_topojson;
            }
            return _mark_stroke_width;
        };
    
        var _height = 550;
        func_matta_topojson.height = function(__) {
            if (arguments.length) {
                _height = __;
                console.log('setted height', _height);
                return func_matta_topojson;
            }
            return _height;
        };
    
        var _bounding_box = null;
        func_matta_topojson.bounding_box = function(__) {
            if (arguments.length) {
                _bounding_box = __;
                console.log('setted bounding_box', _bounding_box);
                return func_matta_topojson;
            }
            return _bounding_box;
        };
    
        var _feature_name = null;
        func_matta_topojson.feature_name = function(__) {
            if (arguments.length) {
                _feature_name = __;
                console.log('setted feature_name', _feature_name);
                return func_matta_topojson;
            }
            return _feature_name;
        };
    
        var _mark_opacity = 0.8;
        func_matta_topojson.mark_opacity = function(__) {
            if (arguments.length) {
                _mark_opacity = __;
                console.log('setted mark_opacity', _mark_opacity);
                return func_matta_topojson;
            }
            return _mark_opacity;
        };
    
        var _link_width = 2.05;
        func_matta_topojson.link_width = function(__) {
            if (arguments.length) {
                _link_width = __;
                console.log('setted link_width', _link_width);
                return func_matta_topojson;
            }
            return _link_width;
        };
    
        var _label_color = "black";
        func_matta_topojson.label_color = function(__) {
            if (arguments.length) {
                _label_color = __;
                console.log('setted label_color', _label_color);
                return func_matta_topojson;
            }
            return _label_color;
        };
    
        var _force_edge_bundling_stiffness = 0.1;
        func_matta_topojson.force_edge_bundling_stiffness = function(__) {
            if (arguments.length) {
                _force_edge_bundling_stiffness = __;
                console.log('setted force_edge_bundling_stiffness', _force_edge_bundling_stiffness);
                return func_matta_topojson;
            }
            return _force_edge_bundling_stiffness;
        };
    
        var _area_color_thresholds_title = null;
        func_matta_topojson.area_color_thresholds_title = function(__) {
            if (arguments.length) {
                _area_color_thresholds_title = __;
                console.log('setted area_color_thresholds_title', _area_color_thresholds_title);
                return func_matta_topojson;
            }
            return _area_color_thresholds_title;
        };
    
        var _label_font_size = 10;
        func_matta_topojson.label_font_size = function(__) {
            if (arguments.length) {
                _label_font_size = __;
                console.log('setted label_font_size', _label_font_size);
                return func_matta_topojson;
            }
            return _label_font_size;
        };
    
        var _area_color_thresholds_extent = [-0.1, 1.1];
        func_matta_topojson.area_color_thresholds_extent = function(__) {
            if (arguments.length) {
                _area_color_thresholds_extent = __;
                console.log('setted area_color_thresholds_extent', _area_color_thresholds_extent);
                return func_matta_topojson;
            }
            return _area_color_thresholds_extent;
        };
    
        var _label = null;
        func_matta_topojson.label = function(__) {
            if (arguments.length) {
                _label = __;
                console.log('setted label', _label);
                return func_matta_topojson;
            }
            return _label;
        };
    
        var _feature_id = "id";
        func_matta_topojson.feature_id = function(__) {
            if (arguments.length) {
                _feature_id = __;
                console.log('setted feature_id', _feature_id);
                return func_matta_topojson;
            }
            return _feature_id;
        };
    
        var _width = 534;
        func_matta_topojson.width = function(__) {
            if (arguments.length) {
                _width = __;
                console.log('setted width', _width);
                return func_matta_topojson;
            }
            return _width;
        };
    
        var _mark_color_property = null;
        func_matta_topojson.mark_color_property = function(__) {
            if (arguments.length) {
                _mark_color_property = __;
                console.log('setted mark_color_property', _mark_color_property);
                return func_matta_topojson;
            }
            return _mark_color_property;
        };
    
        var _force_edge_compatibility_threshold = 0.75;
        func_matta_topojson.force_edge_compatibility_threshold = function(__) {
            if (arguments.length) {
                _force_edge_compatibility_threshold = __;
                console.log('setted force_edge_compatibility_threshold', _force_edge_compatibility_threshold);
                return func_matta_topojson;
            }
            return _force_edge_compatibility_threshold;
        };
    
        var _area_color_legend = true;
        func_matta_topojson.area_color_legend = function(__) {
            if (arguments.length) {
                _area_color_legend = __;
                console.log('setted area_color_legend', _area_color_legend);
                return func_matta_topojson;
            }
            return _area_color_legend;
        };
    
        var _link_color = "steelblue";
        func_matta_topojson.link_color = function(__) {
            if (arguments.length) {
                _link_color = __;
                console.log('setted link_color', _link_color);
                return func_matta_topojson;
            }
            return _link_color;
        };
    
        var _leaflet_center = null;
        func_matta_topojson.leaflet_center = function(__) {
            if (arguments.length) {
                _leaflet_center = __;
                console.log('setted leaflet_center', _leaflet_center);
                return func_matta_topojson;
            }
            return _leaflet_center;
        };
    
        var _force_edge_iterations = 30;
        func_matta_topojson.force_edge_iterations = function(__) {
            if (arguments.length) {
                _force_edge_iterations = __;
                console.log('setted force_edge_iterations', _force_edge_iterations);
                return func_matta_topojson;
            }
            return _force_edge_iterations;
        };
    
        var _mark_min_ratio = 0;
        func_matta_topojson.mark_min_ratio = function(__) {
            if (arguments.length) {
                _mark_min_ratio = __;
                console.log('setted mark_min_ratio', _mark_min_ratio);
                return func_matta_topojson;
            }
            return _mark_min_ratio;
        };
    
        var _mark_max_ratio = 20;
        func_matta_topojson.mark_max_ratio = function(__) {
            if (arguments.length) {
                _mark_max_ratio = __;
                console.log('setted mark_max_ratio', _mark_max_ratio);
                return func_matta_topojson;
            }
            return _mark_max_ratio;
        };
    
        var _padding = {"top": 0, "right": 0, "left": 0, "bottom": 0};
        func_matta_topojson.padding = function(__) {
            if (arguments.length) {
                _padding = __;
                console.log('setted padding', _padding);
                return func_matta_topojson;
            }
            return _padding;
        };
    
        var _path_opacity = 1.0;
        func_matta_topojson.path_opacity = function(__) {
            if (arguments.length) {
                _path_opacity = __;
                console.log('setted path_opacity', _path_opacity);
                return func_matta_topojson;
            }
            return _path_opacity;
        };
    
        var _mark_color = "indigo";
        func_matta_topojson.mark_color = function(__) {
            if (arguments.length) {
                _mark_color = __;
                console.log('setted mark_color', _mark_color);
                return func_matta_topojson;
            }
            return _mark_color;
        };
    
        var _mark_feature_name = null;
        func_matta_topojson.mark_feature_name = function(__) {
            if (arguments.length) {
                _mark_feature_name = __;
                console.log('setted mark_feature_name', _mark_feature_name);
                return func_matta_topojson;
            }
            return _mark_feature_name;
        };
    
        var _area_color_thresholds_height = 8;
        func_matta_topojson.area_color_thresholds_height = function(__) {
            if (arguments.length) {
                _area_color_thresholds_height = __;
                console.log('setted area_color_thresholds_height', _area_color_thresholds_height);
                return func_matta_topojson;
            }
            return _area_color_thresholds_height;
        };
    
        var _mark_stroke = "gray";
        func_matta_topojson.mark_stroke = function(__) {
            if (arguments.length) {
                _mark_stroke = __;
                console.log('setted mark_stroke', _mark_stroke);
                return func_matta_topojson;
            }
            return _mark_stroke;
        };
    
        var _mark_value = "viajes_3_etapas_z";
        func_matta_topojson.mark_value = function(__) {
            if (arguments.length) {
                _mark_value = __;
                console.log('setted mark_value', _mark_value);
                return func_matta_topojson;
            }
            return _mark_value;
        };
    
        var _area_opacity = 0.5;
        func_matta_topojson.area_opacity = function(__) {
            if (arguments.length) {
                _area_opacity = __;
                console.log('setted area_opacity', _area_opacity);
                return func_matta_topojson;
            }
            return _area_opacity;
        };
    
        var _area_color_thresholds = true;
        func_matta_topojson.area_color_thresholds = function(__) {
            if (arguments.length) {
                _area_color_thresholds = __;
                console.log('setted area_color_thresholds', _area_color_thresholds);
                return func_matta_topojson;
            }
            return _area_color_thresholds;
        };
    
        var _area_color_thresholds_domain = [0.0, 0.20000000000000001, 0.40000000000000002, 0.60000000000000009, 0.80000000000000004, 1.0];
        func_matta_topojson.area_color_thresholds_domain = function(__) {
            if (arguments.length) {
                _area_color_thresholds_domain = __;
                console.log('setted area_color_thresholds_domain', _area_color_thresholds_domain);
                return func_matta_topojson;
            }
            return _area_color_thresholds_domain;
        };
    
        var _area_value = "prevision_n";
        func_matta_topojson.area_value = function(__) {
            if (arguments.length) {
                _area_value = __;
                console.log('setted area_value', _area_value);
                return func_matta_topojson;
            }
            return _area_value;
        };
    
        var _path_stroke_width = 1.0;
        func_matta_topojson.path_stroke_width = function(__) {
            if (arguments.length) {
                _path_stroke_width = __;
                console.log('setted path_stroke_width', _path_stroke_width);
                return func_matta_topojson;
            }
            return _path_stroke_width;
        };
    
        var _mark_scale = 0.75;
        func_matta_topojson.mark_scale = function(__) {
            if (arguments.length) {
                _mark_scale = __;
                console.log('setted mark_scale', _mark_scale);
                return func_matta_topojson;
            }
            return _mark_scale;
        };
    
        var _force_edge_cycles = 6;
        func_matta_topojson.force_edge_cycles = function(__) {
            if (arguments.length) {
                _force_edge_cycles = __;
                console.log('setted force_edge_cycles', _force_edge_cycles);
                return func_matta_topojson;
            }
            return _force_edge_cycles;
        };
    
        var _force_edge_step_size = 0.0015;
        func_matta_topojson.force_edge_step_size = function(__) {
            if (arguments.length) {
                _force_edge_step_size = __;
                console.log('setted force_edge_step_size', _force_edge_step_size);
                return func_matta_topojson;
            }
            return _force_edge_step_size;
        };
    
        var _legend = true;
        func_matta_topojson.legend = function(__) {
            if (arguments.length) {
                _legend = __;
                console.log('setted legend', _legend);
                return func_matta_topojson;
            }
            return _legend;
        };
    
        var _color_scale = "threshold";
        func_matta_topojson.color_scale = function(__) {
            if (arguments.length) {
                _color_scale = __;
                console.log('setted color_scale', _color_scale);
                return func_matta_topojson;
            }
            return _color_scale;
        };
    
        var _leaflet_default_zoom = 11;
        func_matta_topojson.leaflet_default_zoom = function(__) {
            if (arguments.length) {
                _leaflet_default_zoom = __;
                console.log('setted leaflet_default_zoom', _leaflet_default_zoom);
                return func_matta_topojson;
            }
            return _leaflet_default_zoom;
        };
    
        var _area_color_thresholds_width = 150;
        func_matta_topojson.area_color_thresholds_width = function(__) {
            if (arguments.length) {
                _area_color_thresholds_width = __;
                console.log('setted area_color_thresholds_width', _area_color_thresholds_width);
                return func_matta_topojson;
            }
            return _area_color_thresholds_width;
        };
    
        var _area_feature_name = "comuna";
        func_matta_topojson.area_feature_name = function(__) {
            if (arguments.length) {
                _area_feature_name = __;
                console.log('setted area_feature_name', _area_feature_name);
                return func_matta_topojson;
            }
            return _area_feature_name;
        };
    
    

    
    
        var _map = null;
        func_matta_topojson.map = function() {
            return _map;
        };
    
        var _L = null;
        func_matta_topojson.L = function() {
            return _L;
        };
    
    
    return func_matta_topojson;
};
    return mod_matta_topojson;
});