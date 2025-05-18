<script setup lang="ts">
import { getMapAnchorList } from '../js/api';
import { ref, onMounted } from 'vue';
const mapAnchorList = ref<any[]>([]);

onMounted(() => {
  init();
})

async function init() {
  let res = await getMapAnchorList();
  mapAnchorList.value = res.data;
  console.log('mapAnchorList', res.data);
}
</script>

<template>
  <div class="location-btn">
    <div class="location-icon"></div>
    <div class="location-content">
      <div class="location-title">快速定位</div>
      <div class="content-area">
        <div class="area-item" v-for="item in mapAnchorList" :key="item.id">
          <div class="area-parent">
            <div class="parent-icon"></div>
            <div class="parent-name">{{ item.name }}</div>
          </div>
          <div class="area-child" v-for="child in item.children" :key="child.id">{{ child.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.location-btn {
  position: absolute;
  top: 84px;
  right: -30px;
  width: 40px;
  height: 40px;
  background-color: rgba(50,57,71,.8);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    .location-content {
      visibility: visible;
    }
  }
  .location-content {
    position: absolute;
    left: 60px;
    top: 0;
    background: #3b4354;
    border-radius: 12px;
    visibility: hidden;
    transition: all .3s;
    .location-title {
      font-size: 16px;
      padding: 12px;
      color: #d3bc8e;
      border-bottom: 1px solid rgba(86,97,120,0.2);
      width: 192px;
    }
   .content-area {
      height: 500px;
      overflow-y: auto;
      &::-webkit-scrollbar {
        display: none;
      }
     .area-item {
        .area-child { 
          display: flex;
          align-items: center;
          padding-left: 32px;
          height: 48px;
          color: hsla(39, 34%, 89%, 0.75);
          &:hover {
            color: #ece5d8;
          }
        }
        .area-parent {
          display: flex;
          align-items: center;
          padding-left: 15px;
          height: 48px;
          &:hover {
            .parent-name {
              color: #ece5d8;
            }
            .parent-icon {
              background-image: url("../assets/images/ui/location-icon-h.png");
            }
          }
          .parent-icon {
            width: 12px;
            height: 12px;
            background-image: url("../assets/images/ui/location-icon-n.png");
            background-size: cover;
            margin-right: 5px;
          }
          .parent-name {
            color: #d3bc8e;
            font-size: 14px;
          }
        }
     }
   }
  }
  .location-icon {
    width: 24px;
    height: 24px;
    background: url("../assets/images/ui/location-btn.png");
    background-size: cover;
  }
}
</style>