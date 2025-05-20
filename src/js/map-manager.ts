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
  pointId: number
}

export class MapManager {
    private map: L.Map;
    private areaNameLayerGroup: L.LayerGroup | undefined;
    private pointLayerGroup: L.LayerGroup | undefined;
    private mapAnchorList: AreaNameConfig[] = [];
    private prevZoom = 0;
    private lastActivePointId = -1;
  
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
      // this.map.addControl(new L.Control.Zoom({ position: 'bottomright' }));
      // @ts-ignore
      this.map.addControl(new L.Control.Zoomslider({
        position: 'bottomright',
        stepHeight: 30,
        knobHeight: 20,
      }));

      L.tileLayer('images/map/{z}/{x}/{y}.png', {
        bounds,
        minZoom: 4,
        maxZoom: 7,
        noWrap: true
      }).addTo(this.map);

      this.map.on('zoom', () => {
        // console.log('zoom', this.map.getZoom());
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
        const {lat, lng, icon, pointId} = val;
        const marker = L.marker(L.latLng(lat, lng), {
          icon: L.divIcon({
            className: 'map-point-item',
            html: `<div class="point-item-container" id="mapPointItem${pointId}">
              <div class="point-pic" style="background-image: url(${icon})"></div>
              <div class="arrow-icon lt"></div>
              <div class="arrow-icon lb"></div>
              <div class="arrow-icon rb"></div>
              <div class="arrow-icon rt"></div>
            </div>`,
            iconSize: [37, 40],
            iconAnchor: [19, 20],
          }),
        })

        marker.on('click', (e) => {
          if (this.lastActivePointId === pointId) return;

          const lastActivePointId = document.getElementById(`mapPointItem${this.lastActivePointId}`);
          lastActivePointId?.classList.remove('active');
          
          const cutPoint = document.getElementById(`mapPointItem${pointId}`);
          cutPoint?.classList.add('active');

          this.lastActivePointId = pointId;
        })
        return marker;
      })

      this.pointLayerGroup = L.layerGroup(pointMarkers);
      this.pointLayerGroup.addTo(this.map);
    }

    flyTo(latlng: L.LatLngExpression, zoom?: number) {
      console.log('flyTo', latlng, zoom);
      this.map.flyTo(latlng, zoom)
    }

    enableClickDebug() {
      this.map.on('click', (workingLayer) => {
        const cordinate  = workingLayer.latlng;
        console.log('cordinate', cordinate);
      });
    }

}