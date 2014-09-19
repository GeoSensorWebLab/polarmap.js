//
//
// PolarMap.js: A Wrapper for Leaflet with projection supports using proj4
//

/* Marker Layer */
function MarkerLayer(name) {
  this._type = "marker_layer";
  this._markers = [];
  this._name = name;

  this.clearMarkers = function() {
  };

  this.addMarker = function(loc, mattr) {
    /* create one marker */
    var obj = L.marker(loc);
    this._markers.push(obj);

    /* popup message if available */
    if (mattr) {
      if("msg" in mattr) {
        obj.bindPopup(mattr.msg).openPopup();
      }
    }
  };
}

/* Tile Layer */
function TileLayer(name, crs_code, tilemap_def) {
  this._type = "tile_layer";
  this._name = name;
  this._crs_code = crs_code;
  this._tilemap_def = tilemap_def;
}

/* Main Library */

function PolarMap()
{
  if (!window.jQuery) {
    alert("Need jquery.js was not loaded. Please check it.");
    return;
  }

  if (!window.proj4) {
    alert("Proj4.js was not loaded. Please check it.");
    return;
  }

  if (!window.L) {
    alert("Leaflet.js was not loaded. Please check it.");
    return;
  }

  if (!window.L.Proj) {
    alert("Proj4Leaflet.js was not loaded. Please check it.");
    return;
  }

  /* check the version of Leaflet and whether it is loaded or not */
  var LEAFLET_VERSION = "0.7.2";
  try {
    if (L.version < LEAFLET_VERSION) {
      alert("Need Leaflet " + LEAFLET_VERSION + " or later.");
      return;
    }
  } catch(err) {
    alert("Leaflet(" + LEAFLET_VERSION + " or above) was not loaded. Please check it.");
    alert(err.message);
    return;
  }

  this.LEAFLET_CRS = {
    "EPSG3857": L.CRS.EPSG3857,
    "EPSG4326": L.CRS.EPSG4326,
    "EPSG3395": L.CRS.EPSG3395
  };

  this.METAFILES = [
    { "code": "EPSG", "url": $("#epsg-data").prop('href') },
    { "code": "ESRI", "url": $("#esri-data").prop('href') }
  ];

  /* class instance variables */
  this._map = {
    /* leaflet map instance */
    leaflet: null,
    /* current map name */
    map_name: "",
    /* registered tile maps */
    tile_maps: {},
    /* div tag id */
    div: null,
    /* Default EPSG of Leaflet */
    /* EPSG:3857 is a Spherical Mercator projection coordinate system
    popularized by web services such as Google and later OpenStreetMap. */
    crs_profile: L.CRS.EPSG3857,
    /* code name */
    crs_code: "EPSG3857",
    /* initial zoom level */
    init_zoom: 15,
    /* initial location */
    init_loc: new L.LatLng(51.078227, -114.13244351),
    /* created markers, later it will used to free them. */
    markers: [],
    /* EPSG metadata */
    metadata: {},
    /* all layers */
    allLayers: {},
    /* onready callback */
    onready_callback: null
  };

  /* register tile maps */
  this.registerTileMaps = function(tilemaps) {
    this._map.tile_maps = tilemaps;
  };

  /* initialize map */
  this.init = function(options) {
    /* set the map div */
    this._map.div = options.div_id;
    this._map.crs_code = options.crs_code;
    this._map.map_name = options.map_name;
    this._map.init_zoom = options.zoom_level;

    /* load epsg, esri csv and then call init_remained */
    this.loadMetaData(this.METAFILES, this.init_remained);
  };

  this.init_remained = function() {
    /* Callback after loading metafiles */
    /* check epsg codes those that are already supported by leaflet */

    var crs_code = this._map.crs_code;
    var map_name = this._map.map_name;

    /* set map */
    this.changeBasemap(map_name, crs_code);

    /* call onready callback */
    this._map.onready_callback();

    /* delete any messages */
    $("#msg").html("");
  };

  /* set onready callback */
  this.onready = function(func) {
    this._map.onready_callback = func;
  };

  /* load csv */
  this.loadMetaData = function(files, callback) {
    var self = this;

    /* load csv and then converted into Array */
    files.forEach(function(file) {
      var meta = self._map.metadata;
      var code_name = file.code;
      var code_url = file.url;

      /* prevent reload it after once it loaded */
      if (code_name in meta) {
        console.log("Warn: " + code_name + " Already loaded");
      } else {
        /* fetch the file */
        $.ajax({
          context: self,
          type: "GET",
          cache: false,
          url: code_url,
          dataType: "text",
          success: function(data) {
            this.loadMetaDataRecv(data, code_name, callback);
          }
        });
      }
    });
  };

  this.loadMetaDataRecv = function(data, code_name, callback) {

    var meta = this._map.metadata;

    /* meta[code_name][0] is header and others are data array not object format */
    /* to save memory, when getProjectionCodeProfile is called, it returns an object having header keys */

    meta[code_name] = CSVToArray(data);
    console.log("Loaded: " + code_name + " size=" + meta[code_name].length);

    if (Object.keys(meta).length === this.METAFILES.length)
    {
      /* finalize the init */
      console.log("Loaded All meta data.");
      this.init_remained();
    }
  };

  /* get a specific EPSG: code_name = "(EPSG|ESRI):NUMBER" */
  this.getProjectionCodeProfile = function(code_name) {
    var meta = this._map.metadata;
    code_name = code_name.toUpperCase();

    /* EPSG or ESRI */
    if (code_name.indexOf("EPSG") >= 0 || code_name.indexOf("ESRI") >= 0)
    {
      /* take the first 4 characters */
      var data_type = code_name.slice(0,4);
      var data = meta[data_type];
      for (var i in data) {
        if (data[i][0].replace(":","") ===  code_name)
        {
          var header = data[0], obj = {};
          for (var j in header) {
            obj[header[j]] = data[i][j];
          }
          return obj;
        }
      }
      return null;
    } else {
      console.log("Error: Not supported type");
      return null;
    }
  };

  this.changeBasemap = function(map_name, crs_code) {

    /* get url from the registered tile maps */
    var crs_profile = null;
    var map_trans = null;
    var map_scale = null;
    var map_center = null;
    var map_cont = null;
    var map_options = {};

    var tilemap_def = this._map.tile_maps[map_name + "@" + crs_code];

    if (tilemap_def === undefined) {
      alert("Not registered map: " + map_name + "@" + crs_code);
      return;
    } else {
      console.log("changeBasemap: " + tilemap_def.url);
    }

    /* reset current map_name */
    this._map.map_name = map_name;

    var tlayer = this.newTileLayer(map_name, crs_code, tilemap_def);

    /* If the request crs is one of Leaflet's supported CRSs */
    if (crs_code in this.LEAFLET_CRS) {
      crs_profile = this.LEAFLET_CRS[crs_code];
      console.log("LEAFTLET CRS", crs_profile);
    } else {
      /* Not one of Leaflet's supported CRSs */
      console.log("NOT LEAFTLET CRS");

      /* find and get projection profile */
      var crs = this.getProjectionCodeProfile(crs_code);

      /* if not found just return null */
      if (crs === null) {
        this.error2div("Not Found Code : "+crs_code);
        return;
      }

      console.log("CRS", crs);

      if (!tilemap_def.center) {
        tilemap_def.center = [ parseFloat(crs.LatCenter), parseFloat(crs.LonCenter) ];
        console.log("centering based on CRS", tilemap_def.center);
      }

      /* if transformation is available */
      if (tilemap_def.transformation) {
        console.log("Yes transformation");
        crs_profile = L.CRS.proj4js(crs.Code, crs.Proj4, tilemap_def.transformation);
      } else {
        console.log("No transformation");
        crs_profile = L.CRS.proj4js(crs.Code, crs.Proj4);
      }

      /* if scale is available */
      if (tilemap_def.scale) {
        console.log("Yes Scale");
        crs_profile.scale = tilemap_def.scale;
      } else {
        console.log("No Scale. Use default scale function.");
        crs_profile.scale = function(zoom) { return 256 * Math.pow(2,0); };
      }
    }

    /* create one tile layer */
    var basemap_layer_name = "basemaplayer"; // THIS IS FIXED MAP FOR ONE BASEMAP.

    /* add one layer. For the basemap, it have the name of basemaplayer. */

    /* if the layer is already exists, just return */
    if (basemap_layer_name in this._map.allLayers) {
      console.log("ChangeBaseMap: Already exists. Remove current layer and add.");

      /* delete from this._map.alllayers */
      this.removeLayer(basemap_layer_name);
    }

    var basemaplayer = this.addLayer(basemap_layer_name, tlayer, true);

    /* create leaflet map instance */

    if (this._map.leaflet === null) {
      map_options.crs = crs_profile;
      // map_options.continuousWorld = false;
      map_options.layers = [ basemaplayer ];

      /* if the leaflet map is not created */
      this._map.leaflet = L.map(this._map.div, map_options);
      this._map.leaflet.setView(this._map.init_loc, Math.min(tlayer._tilemap_def.zoom_range[1], this._map.init_zoom));
    } else {
      /* if the leaflet map is created */

      /* reconfigure crs */
      map_options = this._map.leaflet.options;
      map_options.crs = crs_profile;
      // map_options.continuousWorld = false;

      /* update all markers for the changed crs */
      /* check all layers */
      for (var lname in this._map.allLayers) {
        /* if a layer is 'marker layer' type, update all markers. */
        if (this._map.allLayers[lname]._layer._type=="marker_layer") {
          /* get markers array */
          var markers = this._map.allLayers[lname]._layer._markers;
          for (var m in markers) {
            /* call marker's udpate() to be rearranged on the new projection(CRS). */
            markers[m].update();
          }
        }
      }

      /* add the new basemap layer */
      var current_zoomlevel = this._map.leaflet.getZoom();
      this._map.leaflet.setZoom(Math.min(tlayer._tilemap_def.zoom_range[1], current_zoomlevel));
      basemaplayer.addTo(this._map.leaflet);

      if (tilemap_def.center) {
        this._map.leaflet.setView(tilemap_def.center);
      }
    }

    return {
      "status": "Success",
      "function": "changeBasemap",
      "basemapName": map_name,
      "CRScode": crs_code,
      "message": "This basemap is the current basemap"
      // "message":  "This basemap is the current basemap" or
      //      "No such basemap" or
      //      "This service is not currently supported"
    };
  };

  /* add one layer */
  this.addLayer = function(layer_name, newlayer, is_basemap) {

    var leaflet_layer;

    if (layer_name in this._map.allLayers) {
      console.log("Already exists.");
      return;
    }

    /* if the layer is basemap */
    if (is_basemap) {
      /* baesmap will be added to L.map */
      leaflet_layer = L.tileLayer(newlayer._tilemap_def.url, {
        tms:         newlayer._tilemap_def.tms_inverse,
        minZoom:     newlayer._tilemap_def.zoom_range[0],
        maxZoom:     newlayer._tilemap_def.zoom_range[1],
        attribution: newlayer._tilemap_def.attribution
      });
    } else {
      /* other layers just added in this step */
      if (newlayer._type === "marker_layer") {
        leaflet_layer = L.layerGroup(newlayer._markers);
        leaflet_layer.addTo(this._map.leaflet);
      } else if (newlayer._type === "tile_layer") {
        leaflet_layer = L.tileLayer(newlayer._tilemap_def.url, {
          tms:              newlayer._tilemap_def.tms_inverse,
          minZoom:          newlayer._tilemap_def.zoom_range[0],
          maxZoom:          newlayer._tilemap_def.zoom_range[1],
          continuousWorld:  false,
          attribution:      newlayer._tilemap_def.attribution
        });
        leaflet_layer.addTo(this._map.leaflet);
      } else {
        console.log("Unknown Layer");
      }
    }

    this._map.allLayers[layer_name] = {
      layer: leaflet_layer,
      show: true,
      _layer: newlayer
    };

    return leaflet_layer;
  };

  /* add group layer */
  this.newMarkerLayer = function(layer_name) {
    return new MarkerLayer(layer_name);
  };

  /* add group layer */
  this.newTileLayer = function(layer_name, crs_code, tilemap_def) {
    return new TileLayer(layer_name, crs_code, tilemap_def);
  };

  /* show or hide a Layer */
  this.showhideLayer = function(layer_name, flag_show) {
    var the_layer = this._map.allLayers[layer_name];
    /* return the availabity of the layer */
    if (flag_show) {
      return the_layer !== undefined;
    }

    /* if the layer is available */
    if (the_layer) {
      /* if the layer is shown, hide it */
      if (the_layer.show) {
        the_layer.show = false;
        this._map.leaflet.removeLayer(the_layer.layer);
      } else {
        /* if the layer is hidden, show it */
        the_layer.show = true;
        this._map.leaflet.addLayer(the_layer.layer);
      }
    } else {
      console.log("The requested layer is not available.");
    }
  };

  /* remove Layer */
  this.removeLayer = function(layer_name) {
    if (layer_name in this._map.allLayers) {
      var the_layer = this._map.allLayers[layer_name];

      /* remove from the map */
      this._map.leaflet.removeLayer(the_layer.layer);

      /* remove from the allLayers */
      delete this._map.allLayers[layer_name];
    }
  };

  /* goto a location */
  this.goto = function(loc, zoomlevel) {
    if (!zoomlevel) {
      zoomlevel = this._map.leaflet.getZoom();
    }

    // var map = this._map.tile_maps[this._map.map_name];
    // var max_zoomlevel = map.zoom_range[1];
    // zoomlevel = Math.min(max_zoomlevel, map);
    // this._map.leaflet.setZoom(zoomlevel);

    this._map.leaflet.setView(loc);
  };

  // /* add marker */
  // this.addMarker = function(layer, loc, mtype, mattr) {

  //  var DEFAULT = { size: 100, color:"red", fillColor:"#f03", fillOpacity:0.4 };
  //  var obj;

  //  /* default setting */
  //  if(mtype==undefined)
  //  {
  //    mtype = "marker";
  //    mattr = DEFAULT;
  //  }

  //  /* set with default value if not set */
  //  if(!("size" in mattr)) mattr.size = DEFAULT.size;
  //  if(!("color" in mattr)) mattr.color = DEFAULT.color;
  //  if(!("fillColor" in mattr)) mattr.fillColor = DEFAULT.fillColor;
  //  if(!("fillOpacity" in mattr)) mattr.fillOpacity = DEFAULT.fillOpacity;

  //  /* marker */
  //  if(mtype == "marker")
  //  {
  //    // obj = L.marker(loc).addTo(this._map.leaflet);
  //    obj = L.marker(loc).addLayer(layer);
  //  }
  //  /* circle */
  //  else if(mtype == "circle")
  //  {
  //    // obj = L.circle(loc, mattr.size, {
  //    //      color: mattr.color,
  //    //      fillColor: mattr.fillColor,
  //    //      fillOpacity: mattr.fillOpacity
  //    // }).addTo(this._map.leaflet);
  //    obj = L.circle(loc, mattr.size, {
  //        color: mattr.color,
  //        fillColor: mattr.fillColor,
  //        fillOpacity: mattr.fillOpacity
  //    }).addLayer(layer).addTo(this._map.leaflet);
  //  } else
  //  {
  //    console.log("Unknown marker type: "+mtype);
  //    return;
  //  }

  //  /* popup message if available */
  //  if("msg" in mattr) {
  //    obj.bindPopup(mattr.msg).openPopup();
  //  }

  //  /* keep track of all markers created */
  //  if(obj!=undefined)
  //    this._map.markers.push(obj);
  // };

  // this.clearMarkers = function() {
  //  /* delete all markers created */
  //  for(i in this._map.markers)
  //  {
  //    var m = this._map.markers[i];
  //    this._map.leaflet.removeLayer(m);
  //  }
  //  /* to force garbage collection */
  //  this._map.markers.length = 0;
  //  this._map.markers = [ ];
  // };

  this.error2div = function(msg) {
    var div = document.getElementById(this._map.div);
    div.innerHTML = "Message from cmap.js: "+msg;
  };
}

function CSVToArray( strData, strDelimiter ) {
    // Check to see if the delimiter is defined. If not,
    // then default to comma.
    strDelimiter = (strDelimiter || ",");

    // Create a regular expression to parse the CSV values.
    var objPattern = new RegExp(
      (
            // Delimiters.
            "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

            // Quoted fields.
            "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

            // Standard fields.
            "([^\"\\" + strDelimiter + "\\r\\n]*))"
      ),
      "gi"
      );

    // Create an array to hold our data. Give the array
    // a default empty first row.
    var arrData = [[]];

    // Create an array to hold our individual pattern
    // matching groups.
    var arrMatches = null;


    // Keep looping over the regular expression matches
    // until we can no longer find a match.
    while (arrMatches = objPattern.exec( strData )){

        // Get the delimiter that was found.
        var strMatchedDelimiter = arrMatches[ 1 ];
        var strMatchedValue;

        // Check to see if the given delimiter has a length
        // (is not the start of string) and if it matches
        // field delimiter. If id does not, then we know
        // that this delimiter is a row delimiter.
        if (
          strMatchedDelimiter.length &&
          (strMatchedDelimiter != strDelimiter)
          ){

            // Since we have reached a new row of data,
            // add an empty row to our data array.
            arrData.push( [] );

          }

        // Now that we have our delimiter out of the way,
        // let's check to see which kind of value we
        // captured (quoted or unquoted).
        if (arrMatches[ 2 ]){

            // We found a quoted value. When we capture
            // this value, unescape any double quotes.
            strMatchedValue = arrMatches[ 2 ].replace(
              new RegExp( "\"\"", "g" ),
              "\""
              );

          } else {
            // We found a non-quoted value.
            strMatchedValue = arrMatches[ 3 ];
          }

        // Now that we have our value string, let's add
        // it to the data array.
        arrData[ arrData.length - 1 ].push( strMatchedValue );
      }

    // Return the parsed data.
    return( arrData );
  }
