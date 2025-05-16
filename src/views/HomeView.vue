<script setup lang="ts">
import { MapManager } from '../js/map-manager';
import { onMounted } from 'vue';
import FilterHeader from '../components/FilterHeader.vue';
import LocationBtn from '../components/LocationBtn.vue';
import SelectArea from '../components/SelectedArea.vue';
import FilterMain from '../components/FilterMain.vue';

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
    <div class="ui-layer">
      <div class="filter-container">
        <div class="filter-content">
          <div class="close-btn">
            <div class="close-icon"></div>
          </div>
          <LocationBtn />
          <SelectArea />
          <FilterHeader />
          <div class="search-container">搜索</div>
          <FilterMain />
        </div>
      </div>
    </div>
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
    z-index: 1;
  }
  .ui-layer {
    position: absolute;
    left: 0;
    top: 0;
    // width: 100%;
    height: 100%;
    z-index: 2;
    .filter-container {
      position: absolute;
      left: 0;
      top: 0;
      width: 415px;
      height: 100%;
      padding: 20px;
      .filter-content {
        display: flex;
        flex-direction: column;
        background-color: #3b4354;
        width: 100%;
        height: 100%;
        border-radius: 12px;
        .close-btn { 
          position: absolute;
          top: 32px;
          right: -44px;
          width: 64px;
          height: 40px;
          background-image: url('../assets/images/ui/close-bg.png');
          background-size: cover;
          display: flex;
          align-items: center;
          box-sizing: border-box;
          padding-left: 18px;
          .close-icon {
            width: 24px;
            height: 24px;
            background-image: url('../assets/images/ui/close-icon.png');
            background-size: cover;
          }
        }
        .search-container {
          width: 100%;
          height: 52px;
        }
      }
    }
  }
}
</style>
