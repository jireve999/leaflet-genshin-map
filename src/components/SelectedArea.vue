<script setup lang="ts"></script>

<template>
  <div class="selected-area">
    <!-- <div class="selected-count">2</div>
    <div class="selected-icon"></div> -->
    <div class="list-container">
      <div class="up-container">
        <div class="up-icon"></div>
      </div>
      <div class="selected-item" v-for="item in 3" :key="item">
        <div class="item-container">
          <div class="item-icon" :style="{ backgroundImage: `url(https://uploadstatic.mihoyo.com/ys-obc/2020/09/08/75276545/c59585d1fabc9c22ad3fcf94e1622aa8_357413506633071859.png)` }"></div>
        </div>
        <div class="icon-delete"></div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.selected-area {
  position: absolute;
  top: 136px;
  right: -30px;
  width: 40px;
  height: fit-content;
  background-color: rgba(50,57,71,.8);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 0;
  .selected-count {
    position: absolute;
    top: -4px;
    right: -4px;
    text-align: center;
    color: #fff;
    font-size: 11px;
    line-height: 12px;
    height: 12px;
    background-color: #ff5e41;
    border-radius: 6px;
    padding: 0 3px;
  }
  .selected-icon {
    width: 24px;
    height: 24px;
    background: url("../assets/images/ui/cart-icon.png");
    background-size: cover;
  }
  .list-container {
    .up-container {
      margin-bottom: 8px;
      display: flex;
      justify-content: center;
      .up-icon {
        width: 12px;
        height: 12px;
        background: url("../assets/images/ui/arrow-top.png");
        background-size: cover;
      }
    }
    .selected-item {
      position: relative;
      width: 40px;
      height: 40px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &:hover {
        .item-container {
          border-color: #d3bc8e;
        }
        .icon-delete {
          display: block;
        }
      }
      .item-container {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background-color: #3b4252;
        border: 1px solid hsla(0, 0%, 100%, .16);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        .item-icon {
         width: 100%;
         height: 100%;
         background-size: cover;
        }
      }
      .icon-delete {
        display: none;
        position: absolute;
        top: 0;
        right: 2px;
        width: 12px;
        height: 12px;
        background-image: url('../assets/images/ui/delete-icon.svg');
        background-repeat: no-repeat;
        background-position: 50%;
        background-size: 100%;
      }
    }
  }
}
</style>