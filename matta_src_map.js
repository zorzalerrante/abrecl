
define("matta_src_map", ["d3", "matta", "topojson", "leaflet"], function (d3, matta, topojson, leaflet) {
    var mod_src_map = function() {
        var func_src_map = function (selection) {
            console.log('selection', selection);
            selection.each(function(json) {
                var container = null;

                if (d3.select(this).select("div.src_map-container").empty()) {
                    
                        var div = d3.select(this).append("div")
                            .style("width", width + "px")
                            .style("height", height + "px")
                            .attr('class', 'src_map-container');

                        

                        container = div;

                    
                } else {
                    container = d3.select(this).select("div.src_map-container");
                }

                
                    
                        var map_width = width;
var map_height = height;

var _feature_name = 'santiago-comunas';
var _feature_id = 'id';






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
            'stroke-width': 0.0
        });


    

    
        console.log('dataframe', _dataframe);
        var property_id = null;
        var position_vars = null;
        var symbol_positions = null;
        
            symbol_positions = d3.map();
            position_vars = ['lat', 'lon'];
            console.log('position_vars', position_vars);
        



        var symbols = _dataframe.filter(function(d) {
            if (property_id !== null) {
                console.log(d, d[property_id], available_ids.has(d[property_id]));
                return available_ids.has(d[property_id]);
            }
            if (position_vars !== null) {
                return d.hasOwnProperty(position_vars[0]) && d.hasOwnProperty(position_vars[1]);
            }
            return false;
        });
        console.log('symbols', symbols);
        

        
            
                console.log('projection', projection);
                symbols.forEach(function(d, i) {
                    
                    var point = map.latLngToLayerPoint(new L.LatLng(d[position_vars[1]], d[position_vars[0]]))
                    var projected = [point.x, point.y];
                    
                    symbol_positions.set(i, projected);
                });
            

            console.log('positions', symbol_positions);

            var symbol_scale = d3.scale.sqrt()
                .range([0, 12])
                .domain(d3.extent(symbols, function(d) { return d[_property_value]; }));

            console.log('symbol scale', symbol_scale.domain(), symbol_scale.range());

            
            var legend_g = null;

            if (legend_container.select('g.axis').empty()) {
                legend_g = legend_container.append('g').classed('axis', true);
            } else {
                legend_g = legend_container.select('g.axis');
            }

            legend_g.data([symbol_scale]).call(legend);
            

            var symbol_g = map_container.select('g.symbols');
            if (symbol_g.empty()) {
                symbol_g = map_container.append('g').attr('class', 'symbols');
            }

            var symbol = symbol_g.selectAll('circle.symbol')
                .data(symbols, function(d, i) {
                    
                        return i;
                    
                });

            symbol.enter()
                .append('circle')
                .attr({'class': 'symbol', 'r': 0});

            symbol.exit()
                .remove();

            symbol.attr({
                
                'cx': function(d, i) { return symbol_positions.get(i)[0]; },
                'cy': function(d, i) { return symbol_positions.get(i)[1]; },
                'fill': 'indigo',
                
                'opacity': 0.8,
                'stroke-width': 1,
                'stroke': 'gray',
            });

            symbol.transition().delay(500).attr('r', function(d) { return symbol_scale(d[_property_value]); },)

            symbol.sort(function(a, b) {
               return d3.descending(a[_property_value], b[_property_value]);
            });
        
    
};


    // code adapted from https://github.com/mbostock/bost.ocks.org/blob/gh-pages/mike/leaflet/index.html#L131-171
    var L = leaflet;
    var map;
    var map_initialized = false;
    var map_svg;
    var map_container;

    if (container.select('div.leaflet-map-pane').empty()) {
        map = L.map(container.node()).setView([0, 0], 12);
        container.node()['__leaflet_map__'] = map;
        var mapLink = '<a href="http://maps.stamen.com/">Stamen CC</a>';
        L.tileLayer('http://{s}.tile.stamen.com/toner/{z}/{x}/{y}.png', {attribution: '&copy; ' + mapLink + ' Contributors'}).addTo(map);
        map_initialized = true;
        map_svg = d3.select(map.getPanes().overlayPane).append('svg');
        map_container = map_svg.append('g').attr('class', 'leaflet-zoom-hide');
    } else {
        map = container.node()['__leaflet_map__'];
        map_svg = d3.select(map.getPanes().overlayPane).select('svg');
        map_container = map_svg.select('g.leaflet-zoom-hide');
    }

    var path_g = map_container.select('g.geo-paths');

    if (path_g.empty()) {
        path_g = map_container.append('g').attr('class', 'geo-paths');
    }

    var projection = d3.geo.transform({point: function(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
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
        console.log('zoom', map.getZoom(), map.getMaxZoom());
        draw_topojson();
    };

    path.projection(d3.geo.transform());
    var map_bounds = path.bounds(geometry);
    path.projection(projection);
    console.log('bounds', map_bounds);

    if (map_initialized) {
        map.fitBounds(map_bounds.map(function(d) { return d.reverse(); }));
    }

    
        if (!container.select('div.leaflet-top.leaflet-left svg.legend').empty()) {
            legend_container = container.select('div.leaflet-top.leaflet-left').select('svg.legend');
        } else {
            legend_container = container.select('div.leaflet-top.leaflet-left')
                .append('svg').classed('legend', true)
                .attr({'width': width, 'height': height})
                .style({'z-index': 1100, 'position': 'absolute', 'top': 0, 'left': 0});
        }

        
    

    map.on("viewreset", reset);
    reset();

                    
                

            });
        };

        var width = 530;
        var height = 350;

        
            var _dataframe = null;
            func_src_map.dataframe = function(_) {
                if (arguments.length) {
                    _dataframe = _;
                    console.log('setted dataframe', _dataframe);
                    return func_src_map;
                }
                return _dataframe;
            };
        
            var _property_value = null;
            func_src_map.property_value = function(_) {
                if (arguments.length) {
                    _property_value = _;
                    console.log('setted property_value', _property_value);
                    return func_src_map;
                }
                return _property_value;
            };
        
        return func_src_map;
    };

    return mod_src_map;
});