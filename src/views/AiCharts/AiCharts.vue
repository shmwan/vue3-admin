<template>
  <div class="chartsWrapper" id="log">
    <div class="top">
      <div class="sel">
        协创-清溪工厂
        <!-- <el-icon :size="size" :color="color">
                  <CaretBottom />
              </el-icon> -->
        <!-- <el-select style="border: none; background: transparent; " v-model="data.factoryCode" class="m-2"
                  placeholder="Select" size="small" popper-class="mySel">
                  <el-option v-for="item in data.factoryList" :key="item.value" :label="item.label" :value="item.code" />
              </el-select> -->
      </div>
      <div class="fullBox">
        <img v-if="isFullScreen" @click="toggleFullscreen" src="@/assets/img/full.png" />
        <img v-else @click="exitFullscreen" src="@/assets/img/unFull.png" />
      </div>
    </div>
    <div class="first">
      <div class="left">
        <div class="inner">
          <img src="" alt="" />
        </div>
        <div class="factoryName">协创-清溪工厂</div>
      </div>
      <div class="right">
        <top-Right></top-Right>
      </div>
    </div>
    <div class="second">
      <div class="left">
        <bottom-Left></bottom-Left>
      </div>
      <div class="center">
        <bottom-Center></bottom-Center>
      </div>
      <div class="right">
        <bottom-Right></bottom-Right>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import topRight from './charts/topRight.vue'
import bottomLeft from './charts/bottomLeft.vue'
import bottomCenter from './charts/bottomCenter.vue'
import bottomRight from './charts/bottomRight.vue'
import screenfull from '@/utils/screenfull'
import {
  ref,
  reactive,
  toRaw,
  computed,
  getCurrentInstance,
  onMounted,
  watch,
  watchEffect
} from 'vue'
const { proxy } = getCurrentInstance() as any
const $t = proxy.$t
interface Data {
  factoryList: any
  factoryObj: any
  factoryCode: any
}
let data: Data = reactive({
  factoryList: [
    {
      label: '清溪工厂',
      code: 'qingxi'
    }
  ],
  factoryObj: null,
  factoryCode: 'qingxi'
})
let isFullScreen = $ref(true)

const toggleFullscreen = () => {
  isFullScreen = false
  const screen = new screenfull('log')
  if (!screen.isEnabled) {
    screen.initScreen()
  }
}
const exitFullscreen = () => {
  isFullScreen = true
  const screen = new screenfull('log')
  if (!screen.isEnabled) {
    screen.exitScreen()
  }
}
</script>
<style lang="less" scoped>
.chartsWrapper {
  background: rgb(238, 238, 238, 1);
  padding: 10px 22px 10px;
  box-sizing: border-box;

  .top {
    height: 20px;
    border-left: 4px solid #4f71ff;
    margin-bottom: 10px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;

    .sel {
      padding-left: 15px;

      .mySel {
        border: none;
        // background: transparent;
      }


    }

    .fullBox {
      img {
        width: 20px;
        height: 20px;
      }
    }
  }

  .first {
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    height: 500px;

    .left {
      width: 27%;
      height: 100%;
      background: #fff;
      margin-right: 26px;
      background: url('/src/assets/img/aiFactory.png');
      box-shadow: 0px 0px 10px 0px rgba(64, 71, 110, 0.7);
      text-align: center;
      color: #fff;
      font-size: 24px;
      font-family: PingFangSC-Semibold, PingFang SC;
      font-weight: 600;

      .inner {
        margin: 150px auto 25px;
        background: url('/src/assets/img/factorylogo.png');
        width: 92px;
        height: 92px;
        // background: #fff;
        border-radius: 50%;
      }
    }

    .right {
      width: 72%;
      height: 100%;
      background: #fff;
      box-shadow: 0px 0px 12px 0px rgba(64, 71, 110, 0.15);
    }
  }

  .second {
    box-sizing: border-box;
    height: 500px;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    // justify-content: space-between;

    .left {
      width: 27%;
      height: 100%;
      background: #fff;
      margin-right: 26px;
      box-shadow: 0px 0px 12px 0px rgba(64, 71, 110, 0.15);
    }

    .center {
      width: 35%;
      height: 100%;
      background: #fff;
      margin-right: 26px;
      box-shadow: 0px 0px 12px 0px rgba(64, 71, 110, 0.15);
    }

    .right {
      width: 35%;
      height: 100%;
      background: #fff;
      box-shadow: 0px 0px 12px 0px rgba(64, 71, 110, 0.15);
    }

    // .right {
    //   width: 570px;
    //   height: 450px;
    //   background: #fff;
    // }
  }
}
</style>
<!-- <style lang="less">
.mySel {
  border: none;
  background: transparent;
}

.el-input--small .el-input__wrapper {
  background: #eee !important;
  border: none;
}
</style> -->
