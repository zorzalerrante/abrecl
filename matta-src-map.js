
define("matta_src-map", ["d3", "matta", "topojson", "leaflet", "leaflet"], function (d3, matta, topojson, leaflet, leaflet) {
    var mod_src-map = function() {
        var func_src-map = function (selection) {
            console.log('selection', selection);
            selection.each(function(json) {
                var width = 510;
                var height = 380;
                var container = null;

                if (d3.select(this).select("svg.src-map-container").empty()) {
                    
                        var svg = d3.select(this).append("svg")
                            .attr("width", width)
                            .attr("height", height)
                            .attr('class', 'src-map-container');

                        

                        container = svg.append("g")
                            .attr('class', 'src-map-container');

                    
                } else {
                    container = d3.select(this).select("svg.src-map-container");
                }

                
                    
                

            });
        };

        return func_src-map;
    };

    return mod_src-map;
});