import L from 'leaflet';

interface AreaNameConfig {
  lat: number,
  lng: number,
  areaName: string,
}

interface PointConfig {
  lat: number,
  lng: number,
  iconId: number,
}

export class MapManager {
    private map: L.Map;
    private areaNameLayerGroup: L.LayerGroup | undefined;
    private pointMarkersGroup: L.LayerGroup | undefined;
  
    constructor(domId: string) {
      const bounds = L.latLngBounds(L.latLng(0,0), L.latLng(-256, 256));

      this.map = L.map(domId, {
        maxBounds: bounds,
        center: [-102, 148],
        crs: L.CRS.Simple,
        attributionControl: false,
        zoomControl: false,
        minZoom: 4,
        maxZoom: 7,
        zoom: 5
      });

      L.tileLayer('images/map/{z}/{x}/{y}.png', {
        bounds,
        minZoom: 4,
        maxZoom: 7,
        noWrap: true
      }).addTo(this.map);
    }

    renderAreaNames(configList: AreaNameConfig[]) {
      const markers = configList.map((val) => {
      const {lat, lng, areaName} = val;
      const marker = L.marker(L.latLng(lat, lng), {
        icon: L.divIcon({
          className: 'map-marker-item',
          html: `<div class="area-marker-item">${areaName}</div>`,
        }),
      })
      return marker;
    })

    this.areaNameLayerGroup = L.layerGroup(markers);
    this.areaNameLayerGroup.addTo(this.map);
    }

    renderPoints(pointList: PointConfig[]) {
    const pointMarkers = pointList.map((val) => {
      const {lat, lng, iconId} = val;
      const iconUrl = `images/map-icon/${iconId}.png`;
      const marker = L.marker(L.latLng(lat, lng), {
        icon: L.divIcon({
          className: 'map-point-item',
          html: `<div class="point-item-container">
            <div class="point-pic" style="background-image: url(${iconUrl})"></div>
          </div>`,
        }),
      })
      return marker;
    })

    this.pointMarkersGroup = L.layerGroup(pointMarkers);
    this.pointMarkersGroup.addTo(this.map);
    }

    enableClickDebug() {
      this.map.on('click', (workingLayer) => {
        const cordinate  = workingLayer.latlng;
        console.log('cordinate', cordinate);
      });
    }

}