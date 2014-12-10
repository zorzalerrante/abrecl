
define("matta_dst-map", ["d3", "matta", "topojson", "leaflet", "leaflet"], function (d3, matta, topojson, leaflet, leaflet) {
    var mod_dst-map = function() {
        var func_dst-map = function (selection) {
            console.log('selection', selection);
            selection.each(function(json) {
                var width = 510;
                var height = 380;
                var container = null;

                if (d3.select(this).select("svg.dst-map-container").empty()) {
                    
                        var svg = d3.select(this).append("svg")
                            .attr("width", width)
                            .attr("height", height)
                            .attr('class', 'dst-map-container');

                        

                        container = svg.append("g")
                            .attr('class', 'dst-map-container');

                    
                } else {
                    container = d3.select(this).select("svg.dst-map-container");
                }

                
                    
                

            });
        };

        return func_dst-map;
    };

    return mod_dst-map;
});