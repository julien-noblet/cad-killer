/* @flow */

// thanks to mylen : https://github.com/mylen/leaflet.TileLayer.WMTS/blob/master/leaflet-tilelayer-wmts-src.js

import L from "leaflet";

L.TileLayer.WMTS = L.TileLayer.extend({
  defaultWmtsParams: {
    service: "WMTS",
    request: "GetTile",
    version: "1.0.0",
    layer: "",
    style: "",
    tilematrixSet: "",
    format: "image/jpeg"
  },

  initialize(url, options) {
    // (String, Object)
    let i = "";
    const tileSize = options.tileSize || this.options.tileSize;
    const wmtsParams = L.extend({}, this.defaultWmtsParams);
    if (options.detectRetina && L.Browser.retina) {
      wmtsParams.width = tileSize * 2;
      wmtsParams.height = tileSize * 2;
    } else {
      wmtsParams.width = tileSize;
      wmtsParams.height = tileSize;
    }
    this._url = url;
    for (i in options) {
      // all keys that are not TileLayer options go to WMTS params
      if (!this.options.hasOwnProperty(i) && i !== "matrixIds") {
        wmtsParams[i] = options[i];
      }
    }
    this.wmtsParams = wmtsParams;
    this.matrixIds = options.matrixIds || this.getDefaultMatrix();
    L.setOptions(this, options);
  },

  onAdd(map) {
    L.TileLayer.prototype.onAdd.call(this, map);
  },

  getTileUrl(tilePoint, zoom) {
    // (Point, Number) -> String
    const map = this._map;
    const crs = map.options.crs;
    const tileSize = this.options.tileSize;
    const nwPoint = tilePoint.multiplyBy(tileSize);
    // +/-1 in order to be on the tile
    nwPoint.x += 1;
    nwPoint.y -= 1;
    const sePoint = nwPoint.add(new L.Point(tileSize, tileSize));
    const nw = crs.project(map.unproject(nwPoint, zoom));
    const se = crs.project(map.unproject(sePoint, zoom));
    const tilewidth = se.x - nw.x;
    const z = map.getZoom();
    const ident = this.matrixIds[z].identifier;
    const X0 = this.matrixIds[z].topLeftCorner.lng;
    const Y0 = this.matrixIds[z].topLeftCorner.lat;
    const tilecol = Math.floor((nw.x - X0) / tilewidth);
    const tilerow = -Math.floor((nw.y - Y0) / tilewidth);
    const url = L.Util.template(this._url, {
      s: this._getSubdomain(tilePoint)
    });

    return `${url}${L.Util.getParamString(
      this.wmtsParams,
      url
    )}&tilematrix=${ident}&tilerow=${tilerow}&tilecol=${tilecol}`;
  },

  setParams(params, noRedraw) {
    L.extend(this.wmtsParams, params);
    if (!noRedraw) {
      this.redraw();
    }
    return this;
  },

  getDefaultMatrix() {
    /**
     * the matrix3857 represents the projection
     * for in the IGN WMTS for the google coordinates.
     */
    const matrixIds3857 = new Array(22);
    let i = 0;
    for (i; i < 22; i++) {
      matrixIds3857[i] = {
        identifier: `${i}`,
        topLeftCorner: new L.LatLng(20037508.3428, -20037508.3428)
      };
    }
    return matrixIds3857;
  }
});

export default function(): void {
  L.tileLayer.wmts = function wmts(url, options) {
    return new L.TileLayer.WMTS(url, options);
  };
}
