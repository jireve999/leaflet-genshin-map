<script setup lang="ts">
import { MapManager } from '../js/map-manager';
import { onMounted } from 'vue';

onMounted(() => {
  console.log('HomeView mounted');
  init();
})

function init() {
  const mapManager = new MapManager('map');
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

  mapManager.renderAreaNames(markerList);

  const pointMarkerList = [
    {
      lat: -99.53125,
      lng: 131.65625,
      iconId: 1
    },
    {
      lat: -90.5625,
      lng: 144.65625,
      iconId: 1
    }
  ]
  mapManager.renderPoints(pointMarkerList);
  mapManager.enableClickDebug();
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
