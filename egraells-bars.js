/**
 * Created by egraells on 12/6/14.
 */


  var bar_height, bar_separation, bar_width, colors, data, defs, draw_world, gei_data, geo, gradient, hovered, legend, locked, parent, proj, selected_var, stops, unfocus, vars, world_data;


  colors = d3.scale.category20();

  bar_height = 50;

  bar_separation = 10;

  bar_width = 2;

  defs = parent.append('svg:defs');

  draw_world = function() {
    var bars, button, chart, countries, description, focus_country, indicator_div, row;
    chart = row.select(".chart").selectAll("svg").data(function(d) {
      return [d.name];
    });
    chart.enter().append('svg:svg').attr('width', 500).attr('height', 70);
    bars = chart.selectAll("rect").data(function(d) {
      var e, filtered, values;
      filtered = gei_data.slice(0).filter(function(e) {
        return e[d] != null;
      });
      values = (function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = filtered.length; _i < _len; _i++) {
          e = filtered[_i];
          _results.push({
            name: e.Name,
            value: +e[d]
          });
        }
        return _results;
      })();
      values.sort(function(d1, d2) {
        return d3.ascending(d1.value, d2.value);
      });
      return values;
    });
    bars.enter().append("svg:rect").attr("x", function(d, i) {
      return i * (bar_width + 1);
    }).attr("y", function(d, i) {
      return (1.0 - d.value) * bar_height;
    }).attr("width", bar_width).attr("height", function(d, i) {
      return d.value * bar_height;
    }).on('mouseover', function(d, i) {
      return focus_country(d.name);
    });
    return bars.attr("fill", function(d, i) {
      if (d.name === hovered) {
        return colors(d.value).toString();
      } else {
        return "#efefef";
      }
    }).attr('stroke-width', function(d, i) {
      if (d.name === hovered) {
        return 0.1;
      } else {
        return 0;
      }
    }).attr('stroke', '#777');
  };

  d3.json("world.json?" + (Math.random()), function(world) {
    return d3.csv("gei.csv?" + (Math.random()), function(csv) {
      var c, countries, name, v, _i, _j, _k, _len, _len2, _len3, _ref;
      world_data = world;
      gei_data = csv;
      countries = {};
      _ref = world_data.features;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        c = _ref[_i];
        countries[c.properties.name] = {
          'geometry': c,
          'data': {
            'Education': null,
            'Economic_Activity': null,
            'Women_Empowerement': null
          }
        };
      }
      for (_j = 0, _len2 = csv.length; _j < _len2; _j++) {
        c = csv[_j];
        name = c.Name;
        if (!(countries[name] != null)) {
          console.log("" + name + " does not exist on the map");
        } else {
          for (_k = 0, _len3 = vars.length; _k < _len3; _k++) {
            v = vars[_k];
            countries[name]['data'][v.name] = +c[v.name];
          }
        }
      }
      console.log(countries);
      data = countries;
      return draw_world();
    });
  });



define("barchart", ["d3", "matta"], function (d3, matta) {
    var barchart_mod = function() {
        var barchart = function(selection) {

        };

        return barchart;
    };

    return barchart_mod;
});