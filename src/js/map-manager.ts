import L from 'leaflet';

interface AreaNameConfig {
  lat: number
  lng: number
  name: string
  children: any[]
}

interface PointConfig {
  lat: number
  lng: number
  icon: string
}

export class MapManager {
    private map: L.Map;
    private areaNameLayerGroup: L.LayerGroup | undefined;
    private pointLayerGroup: L.LayerGroup | undefined;
    private mapAnchorList: AreaNameConfig[] = [];
    private prevZoom = 0;
  
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

      this.prevZoom = this.map.getZoom();

      L.tileLayer('images/map/{z}/{x}/{y}.png', {
        bounds,
        minZoom: 4,
        maxZoom: 7,
        noWrap: true
      }).addTo(this.map);

      this.map.on('zoom', () => {
        console.log('zoom', this.map.getZoom());
        const prevRenderFlag = this.prevZoom >= 6;
        const curRenderFlag = this.map.getZoom() >= 6;
        if (prevRenderFlag !== curRenderFlag) {
          console.log('zoom change');
          this.renderAreaNames();
          this.prevZoom = this.map.getZoom();
        }
      });
    }

    setMapAnchorList(configList: AreaNameConfig[]) {
      this.mapAnchorList = configList;
    }

    renderAreaNames() {
      this.areaNameLayerGroup?.clearLayers();

      let markers: L.Marker[] = [];
      if (this.map.getZoom() >= 6) {
        this.mapAnchorList.forEach((val) => {
          let childrenList: L.Marker[] = [];
          childrenList = val.children.map(this.getAreaNameMarkerItem);
          markers = markers.concat(childrenList);
        })
      } else {
        markers = this.mapAnchorList.map(this.getAreaNameMarkerItem);
      }
      
    this.areaNameLayerGroup = L.layerGroup(markers);
    this.areaNameLayerGroup.addTo(this.map);
    }

    getAreaNameMarkerItem(config: AreaNameConfig) {
      const {lat = 0, lng = 0, name} = config;
      return L.marker(L.latLng(lat, lng), {
        icon: L.divIcon({
          className: 'map-marker-item',
          html: `<div class="area-marker-item">${name}</div>`,
        }),
      })
    }

    renderPoints(pointList: PointConfig[]) {
      this.pointLayerGroup?.clearLayers();

      const pointMarkers = pointList.map((val) => {
        const {lat, lng, icon} = val;
        const marker = L.marker(L.latLng(lat, lng), {
          icon: L.divIcon({
            className: 'map-point-item',
            html: `<div class="point-item-container">
              <div class="point-pic" style="background-image: url(${icon})"></div>
            </div>`,
          }),
        })
        return marker;
      })

      this.pointLayerGroup = L.layerGroup(pointMarkers);
      this.pointLayerGroup.addTo(this.map);
    }

    enableClickDebug() {
      this.map.on('click', (workingLayer) => {
        const cordinate  = workingLayer.latlng;
        console.log('cordinate', cordinate);
      });
    }

}