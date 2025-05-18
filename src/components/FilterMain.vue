<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getMapFilterTree } from '../js/api';

const activeTypeIndex = ref(0);
const filterTree = ref<any[]>([]);

onMounted(() => {
  init();
})

async function init() {
  let res = await getMapFilterTree();
  filterTree.value = res.data;
  console.log('filterTree', res.data);
}

function onFilterItemClick(child: any) {
  Reflect.set(child, 'active', !child.active);  // 切换选中状态
}

function getActiveCount(item: any) {
  let res = 0;
  item.children.forEach((child: any) => {
    if (child.active) {
      res++;
    }
  })
  return res;
}

function onTypeItemClick(index: number) {
  activeTypeIndex.value = index;

  document.querySelector(`#filterContentItem${index}`)?.scrollIntoView()
}

</script>

<template>
  <div class="filter-main">
    <div class="filter-main-left">
      <div 
        class="filter-type-item" 
        :class="{ active: activeTypeIndex === index }"
        v-for="(item, index) in filterTree" 
        :key="item" 
        @click="onTypeItemClick(index)"
      >
        <div class="item-name">{{ item.name }}</div>
        <div class="item-count" v-if="getActiveCount(item) !== 0">{{ getActiveCount(item) }}</div>
      </div>
    </div>
    <div class="filter-main-right">
      <div class="filter-content-item" :id="`filterContentItem${index}`" v-for="(item,index) in filterTree" :key="item.id">
        <div class="content-head">
          <div class="head-title">{{ item.name }}</div>
        </div>
        <div class="content-body">
          <div class="content-item" :class="{ active: child.active}" v-for="child in item.children" :key="child.id" @click="onFilterItemClick(child)">
            <div class="item-icon-container">
              <div class="icon-pic" :style="{ backgroundImage: `url(${child.icon})`}"></div>
              <div class="icon-count">12</div>
              <div class="selected-icon" v-if="child.active"></div>
            </div>
            <div class="content-item-name">{{ child.name }}</div>
          </div>
        </div>
      </div>
    </div>
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
      cursor: pointer;
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
    padding: 0 10px;
    flex: 1;
    overflow-y: auto;
    &::-webkit-scrollbar { 
      display: none;
    }
    .filter-content-item {
      border-bottom: 1px solid rgba(74, 83, 102, 0.5);
      .content-head {
        padding: 16px 0 0 2px;
        .head-title {
         color: #d3bc8e;
         font-size: 14px;
        }
      }
      .content-body {
        margin-top: 14px;
        display: flex;
        flex-wrap: wrap;
        .content-item {
          cursor: pointer;
          margin-bottom: 15px;
          margin-right: 10px;
          &.active {
            .item-icon-container {
              &::after {
                position: absolute;
                display: block;
                content: "";
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 1px solid #d3bc8e;
                border-radius: 6px;
                -webkit-box-sizing: border-box;
                box-sizing: border-box;
                z-index: 2;
              }
            }
          }
          &:nth-of-type(4n) {
            margin-right: 0;
          }
          .item-icon-container {
            position: relative;
            width: 57px;
            height: 57px;
            border-radius: 6px;
            background-color: #323947;
            .icon-pic {
              width: 100%;
              height: 100%;
              background-size: cover;
            }
            .selected-icon {
              position: absolute;
              top: 0;
              right: -1px;
              width: 24px;
              height: 14px;
              background-image: url("../assets/images/ui/select-icon.png");
              background-size: cover;
            }
            .icon-count {
              position: absolute;
              font-size: 10px;
              right: 0;
              bottom: 0;
              line-height: 13px;
              color: #9b9c9f;
              background-color: #323947;
              padding: 0 4px;
              border-radius: 6px 0 6px 0;
            }
          }
          .content-item-name {
            margin-top: 5px;
            font-size: 12px;
            color: hsla(39, 34%, 89%, .75);
            max-width: 57px;
            overflow: hidden;
            white-space: nowrap;
            -o-text-overflow: ellipsis;
            text-overflow: ellipsis;
            text-align: center;
          }
        }
      }
    }
  }
}
</style>