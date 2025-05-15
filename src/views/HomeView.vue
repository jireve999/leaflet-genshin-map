<script setup lang="ts">
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { onMounted } from 'vue';

onMounted(() => {
  console.log('HomeView mounted');
  init();
})

function init() {
  const bounds = L.latLngBounds(L.latLng(0,0), L.latLng(-256, 256));

  let map = L.map('map', {
    maxBounds: bounds,
    center: [-102, 148],
    crs: L.CRS.Simple,
    attributionControl: false,
    zoomControl: false,
    minZoom: 4,
    maxZoom: 7,
    zoom: 5
  });

  map.on('click', (workingLayer) => {
    const cordinate  = workingLayer.latlng;
    console.log('cordinate', cordinate);
  });

  L.tileLayer('images/map/{z}/{x}/{y}.png', {
    bounds,
    maxZoom: 7,
  }).addTo(map);

  const markerList = [
    {
      lat: -88.125,
      lng: 139.40625,
      areaName: '苍风高地',
    },
    {
      lat: -99.96875,
      lng: 125.71875,
      areaName: '碧水原',
    }
  ]

  let markers = markerList.map((val) => {
    let {lat, lng, areaName} = val;
    const marker = L.marker(L.latLng(lat, lng), {
      icon: L.divIcon({
        className: 'map-marker-item',
        html: `<div class="area-marker-item">${areaName}</div>`,
      }),
    })
    return marker;
  })

  let areaNameLayerGroup = L.layerGroup(markers);
  areaNameLayerGroup.addTo(map);
}
</script>

<template>
  <div class="home-view">
    <div class="map-layer" id="map"></div>
    <!-- <div class="ui-layer"></div> -->
  </div>
</template>

<style lang="less" scoped>
.home-view {
  position: relative;
  width: 100vw;
  height: 100vh;
  .map-layer {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
