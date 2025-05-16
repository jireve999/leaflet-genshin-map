<script setup lang="ts">
import { ref } from 'vue';

const activeTypeIndex = ref(0);
function onTypeItemClick(index: number) {
  activeTypeIndex.value = index;
}
</script>

<template>
  <div class="filter-main">
    <div class="filter-main-left">
      <div 
        class="filter-type-item" 
        :class="{ active: activeTypeIndex === item }"
        v-for="item in 20" 
        :key="item" 
        @click="onTypeItemClick(item)"
      >
        <div class="item-name">传送点</div>
        <div class="item-count">3</div>
      </div>
    </div>
    <div class="filter-main-right"></div>
  </div>
</template>

<style lang="less" scoped>
.filter-main {
  flex: 1;
  display: flex;
  overflow: hidden;
  .filter-main-left {
    width: 97px;
    height: 100%;
    overflow: auto;
    background-color: #323947;
    padding-bottom: 56px;
    &::-webkit-scrollbar { 
      display: none;
    }
    .filter-type-item {
      position: relative;
      display: flex;
      align-items: center;
      padding: 16px 6px;
      font-size: 12px;
      color: hsla(39, 34%, 89%, 0.75);
      &.active {
        background-image: url("../assets/images/ui/filter-item-dec.png"), url('../assets/images/ui/filter-item-dec2.png');
        background-size: 5px 100%, 24px 100%;
        background-position: 0 0, 5px 0;
        background-repeat: no-repeat;
        background-color: #3b4354;
        color: #d3bc8e;
        padding: 16px 10px;
        &:hover {
          color: #d3bc8e;
        }
      }
      &:hover {
        color: #ece5d8;
      }
    }
    .item-name { 
      font-size: 12px;
    }
    .item-count {
      position: absolute;
      top: 5px;
      right: 4px;
      border-radius: 6px;
      background-color: #3b4354;
      padding: 0 3px;
      line-height: 12px;
      font-size: 9px;
      color: #d3bc8e;
    }
  }
  .filter-main-right {
    flex: 1;
  }
}
</style>