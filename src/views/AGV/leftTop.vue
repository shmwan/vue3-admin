<template>
  <div class="AGVleftTop">
    <div class="AGVTitle">AGV作业状态</div>
    <div class="AVGBox">
      <div class="AVGInfo" v-for="(item, index) in datas.data" :key="index">
        <div class="AVGImg" :class="'car' + index">
          <div class="AVGname">SMT - {{ item.carId }}</div>
        </div>
        <div class="AVGStatus">
          <div class="AVGItem">
            <span class="name">电量：</span
            ><span class="AVGText" :class="item.battery < 10 ? 'red' : ''"
              >{{ item.battery }}%</span
            >
          </div>
          <div class="AVGItem">
            <span class="name">任务状态：</span>
            <span class="AVGText" :class="item.taskStatus">{{
              SMTstatus[item.taskStatus as keyof typeof SMTstatus]
            }}</span>
          </div>
          <div class="AVGItem">
            <span class="name">载货状态：</span>
            <span class="AVGText" :class="item.cargoStatus">{{
              FreightStatus[item.cargoStatus as keyof typeof FreightStatus]
            }}</span>
          </div>
          <div class="AVGItem">
            <span class="name">线速度：</span
            ><span class="AVGText">{{ item.vx }}m/s</span>
          </div>
          <div class="AVGItem">
            <span class="name">角速度：</span
            ><span class="AVGText">{{ item.w }}m/s</span>
          </div>
          <div class="AVGItem">
            <span class="name">正在前往：</span
            ><span class="AVGText">{{ item.nextStationId }}</span>
          </div>
          <div class="AVGItem">
            <span class="name">配送物料：</span>
            <span class="AVGText">{{ item.materialCode }}</span>
          </div>
        </div>
      </div>
      <!-- <div class="AVGInfo">
        <div class="AVGImg">
          <div class="AVGname">SMT - 40</div>
        </div>
        <div class="AVGStatus">
          <div class="AVGItem">
            <span class="name">电量：</span><span class="AVGText">56%</span>
          </div>
          <div class="AVGItem">
            <span class="name">任务状态：</span
            ><span class="AVGText">任务执行中</span>
          </div>
          <div class="AVGItem">
            <span class="name">载货状态：</span
            ><span class="AVGText">载货中</span>
          </div>
          <div class="AVGItem">
            <span class="name">线速度：</span
            ><span class="AVGText">3.4m/s</span>
          </div>
          <div class="AVGItem">
            <span class="name">角速度：</span
            ><span class="AVGText">3.4m/s</span>
          </div>
          <div class="AVGItem">
            <span class="name">正在前往：</span
            ><span class="AVGText">第一个未取料站点</span>
          </div>
          <div class="AVGItem">
            <span class="name">配送物料：</span>
            <span class="AVGText">第一个未取料站点</span>
          </div>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup lang="ts">
  import {
    ref,
    reactive,
    nextTick,
    getCurrentInstance,
    onMounted,
    defineProps,
    watch
  } from 'vue'
  interface Props {
    showData: any
  }
  const { showData } = defineProps<Props>()
  interface Datas {
    data: any
  }
  let datas: Datas = reactive({
    data: null
  })
  enum SMTstatus {
    'TES_None' = '空闲',
    'TES_Blocked' = '交管中',
    'TES_Running' = '执行任务中',
    'TES_Error' = '异常',
    'TES_Cancel' = '任务取消',
    'TES_Finish' = '任务完成',
    'TES_Charging' = '充电中'
  }
  enum FreightStatus {
    'CARGO_UNKNOWN' = '未知状态',
    'CARGO_YES' = '载货',
    'CARGO_NO' = '未载货'
  }
  const getData = (val: any) => {
    nextTick(() => {
      datas.data = val
    })
    // // data = { ...val }
    // console.log('左上', val)
  }

  // watch(
  //   showData,
  //   (val, oldVal) => {
  //     // datas.data = { ...val }
  //     console.log('lefttop', val)
  //   },
  //   { immediate: true, deep: true }
  // )
  defineExpose({
    getData
  })
</script>

<style scoped lang="less">
  .AGVleftTop {
    width: 100%;
    height: 400px;
    // background-color: #fff;
    .AGVTitle {
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
    .AVGBox {
      width: 100%;
      height: 365px;
      background: url('/src/assets/img/AGV/background.png') no-repeat center
        center;
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-evenly;
      .AVGInfo {
        height: 48%;
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: space-around;
        padding: 0 40px;
        .AVGImg {
          width: 135px;
          height: 100%;

          display: flex;
          justify-content: center;
          .AVGname {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            color: #06fcff;
            margin-top: 20px;
          }
        }
        .AVGStatus {
          width: 185px;
          margin-top: 20px;
          .AVGItem {
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 400;
            line-height: 20px;
            .name {
              color: #ffffff;
            }
            .AVGText {
              color: #18fff1;
            }
          }
        }
      }
    }
  }
  .car0 {
    width: 135px;
    height: 100%;
    background: url('/src/assets/img/AGV/car0.png') no-repeat center center;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
  }
  .car1 {
    width: 135px;
    height: 100%;
    background: url('/src/assets/img/AGV/car1.png') no-repeat center center;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
  }
  .TES_None {
    color: #47e557 !important;
  }
  .TES_Blocked {
    color: #ff6e7b !important;
  }
  .TES_Running {
    color: #13f1f1 !important;
  }
  .TES_Error {
    color: #f87957 !important;
  }
  .TES_Cancel {
    color: #c2b498 !important;
  }
  .TES_Finish {
    color: #7ceaf0 !important;
  }
  .TES_Charging {
    color: #0be6ca !important;
  }
  .red {
    color: #ff183e !important;
  }
</style>
