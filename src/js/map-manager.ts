import L from 'leaflet';
import { getMapPointDetail } from './api';
import { EventManager } from './event-manager';
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
  name: string
}

interface Vector {
  x: number
  y: number
}

export interface GuideUIItem {
  lat: number
  lng: number
  icon: string
  angle: number
}

export class MapManager {
    private map: L.Map;
    private areaNameLayerGroup: L.LayerGroup | undefined;
    private pointLayerGroup: L.LayerGroup | undefined;
    private mapAnchorList: AreaNameConfig[] = [];
    private prevZoom = 0;
    private lastActivePointId = -1;
    private pointList: PointConfig[] = [];
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

      this.map.on('click', this.onMapClick.bind(this));

    }

    onMapClick() {
      const lastActivePoint = document.getElementById(`mapPointItem${this.lastActivePointId}`)
      lastActivePoint?.classList.remove('active')
      this.lastActivePointId = -1
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
        const {lat, lng, icon, pointId, name} = val;
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

        marker.bindPopup(
          L.popup({
            content: this.calcPopupContent({ info: {}, correct_user_list: [], last_update_time: '', name: '' })
          })
        )
  
        marker.on('popupopen', async () => {
          const res = await getMapPointDetail(pointId)
          const popupData = { ...res.data, name }
          marker.setPopupContent(this.calcPopupContent(popupData))
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

      this.calcOutScreenPoints();
    }

    calcOutScreenPoints() {
      const guideUIAry: GuideUIItem[] = []
      const calcPointMap: { [key: string]: any } = {}
      const center = this.map.getCenter()
      for (let i = 0; i < this.pointList.length; i++) {
        const pointItem = this.pointList[i]
        const { name } = pointItem
        if (!calcPointMap[name]) {
          calcPointMap[name] = {}
        }
  
        if (calcPointMap[name].inScreen) {
          continue
        }
  
        const isContain = this.map.getBounds().contains(pointItem)
        if (!isContain) {
          const dist = center.distanceTo(pointItem)
          if (!calcPointMap[name].pointItem) {
            calcPointMap[name] = { dist, pointItem, inScreen: false }
          } else {
            const curDist = calcPointMap[name].dist
            if (dist < curDist) {
              calcPointMap[name] = { dist, pointItem, inScreen: false }
            }
          }
        } else {
          calcPointMap[name].inScreen = true
        }
      }
  
      for (const key in calcPointMap) {
        const { inScreen, pointItem } = calcPointMap[key]
        if (!inScreen) {
          const { lat, lng, icon } = pointItem
          const directionVector = { x: lng - center.lng, y: lat - center.lat }
          const xVector = { x: 1, y: 0 }
          const angle = calcVectorAngle(xVector, directionVector)
          guideUIAry.push({ angle, icon, lat, lng })
        }
      }
  
      EventManager.emit('RenderMapGuideUI', guideUIAry)
    }

    calcPopupContent(popupData: any) {
      const { correct_user_list, info, last_update_time, name } = popupData
      const avatarElmStr = correct_user_list.map((val: any) => {
        return `<div class="avatar-item" style="background-image: url(${val.img})"></div>`
      })
      return `<div class="point-popup-container">
      <div class="popup-title">${name}</div>
      <div class="popup-pic" style="background-image: url(${info.img})"></div>
      <div class="point-name">${info.content}</div>
      <div class="contributor-container">
        <div class="contributor-label">贡献者：</div>
        <div class="avatar-container">
          ${avatarElmStr}
        </div>
      </div>
      <div class="point-time">更新时间：${last_update_time}</div>
    </div>`
    }

    flyTo(latlng: L.LatLngExpression, zoom?: number) {
      console.log('flyTo', latlng, zoom);
      this.map.flyTo(latlng, zoom)
    }

    enableClickDebug() {
      this.map.on('click', (workingLayer) => {
        const cordinate = workingLayer.latlng
        console.log('cordinate', cordinate)
        // let curPointId = parseInt(localStorage.getItem('curPointId') || '1')
        // let curPointText = localStorage.getItem('curPointText') || ''
        // const text = `{lat: ${cordinate.lat},lng:${cordinate.lng},pointId:${curPointId}},`
        // curPointText += text
        // curPointId++
        // localStorage.setItem('curPointId', curPointId.toString())
        // localStorage.setItem('curPointText', curPointText)
        // navigator.clipboard.writeText(text)
        // function onTestClick() {
        //   const curPointText = localStorage.getItem('curPointText') || ''
        //   console.log('cuuu', curPointText)
        //   navigator.clipboard.writeText(curPointText)
        // }
        // const testNode = document.querySelector('.header-name')
        // testNode?.removeEventListener('click', onTestClick)
        // testNode?.addEventListener('click', onTestClick)
      })
    }
}

function calcVectorAngle(vectorA: Vector, vectorB: Vector) {
  const dotProduct = vectorA.x * vectorB.x + vectorA.y * vectorB.y
  const magnitudeA = Math.sqrt(vectorA.x * vectorA.x + vectorA.y * vectorA.y)
  const magnitudeB = Math.sqrt(vectorB.x * vectorB.x + vectorB.y * vectorB.y)

  const cosTheta = dotProduct / (magnitudeA * magnitudeB)
  const theta = Math.acos(cosTheta)

  const crossProduct = vectorA.x * vectorB.y - vectorA.y * vectorB.x
  const direction = crossProduct > 0 ? 1 : -1

  return direction * theta
}

