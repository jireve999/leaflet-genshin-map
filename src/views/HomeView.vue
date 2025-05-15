<script setup lang="ts">
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { onMounted } from 'vue';

onMounted(() => {
  console.log('HomeView mounted');
  init();
})

function init() {
  let map = L.map('map', {
    center: [0, 0],
    crs: L.CRS.Simple,
    zoom: 5
  });

  map.on('click', (workingLayer) => {
    const cordinate  = workingLayer.latlng;
    console.log('cordinate', cordinate);
  });

  L.tileLayer('images/map/{z}/{x}/{y}.png', {
    maxZoom: 7,
  }).addTo(map);
    console.log(map);
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
