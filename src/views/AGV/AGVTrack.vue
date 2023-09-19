<template>
  <div class="Agv">
    <Header />
    <div class="contentVuew">
      <div class="leftCon">
        <leftTop class="leftTop" :showData="data" ref="leftTop1"></leftTop>
        <OEE></OEE>
        <Decoration></Decoration>
      </div>
      <div class="centerDiv">
        <div class="center">
          <liveOLMap ref="ol" />
        </div>
      </div>
      <div class="play">
        <rightTop
          :showData="socketData"
          :channelId="channelId1"
          class="rightTop"
          ref="rightTOP1"
        ></rightTop>
        <rightBottom
          :channelId="channelId2"
          :showData="socketData"
          ref="rightTOP2"
        ></rightBottom>
        <leftBottom></leftBottom>
        <Decoration></Decoration>
      </div>
    </div>
    <bottom></bottom>
  </div>
</template>

<script setup lang="ts">
  import Header from './header.vue'
  import liveOLMap from '@/components/ol/liveOLMap.vue'
  import bottom from './bottom.vue'
  import leftTop from './leftTop.vue'
  import leftBottom from './leftBottom.vue'
  import rightTop from './RightPlay.vue'
  import rightBottom from './RightPlay.vue'
  import Decoration from './decoration.vue'
  import OEE from './oee.vue'
  let ol = $ref(null)
  let leftTop1 = $ref(null)
  let rightTOP1 = $ref(null)
  let rightTOP2 = $ref(null)
  let channelId1 = $ref<string>('')
  let channelId2 = $ref<string>('')
  let socketData = reactive<any>({})
  onMounted(() => {
    // console.log(ol)
    getSocket()
    // leftTop1.value.getData(data)
  })
  import useSocket from '@/utils/socketNew'
  let AGVSocket = config().AgvbaseScoket
  const stompClient = useSocket(AGVSocket).stompClient
  let headers = {
    Authorization: sessionStorage.getItem('token')
  }
  const getSocket = () => {
    stompClient.connect(headers, () => {
      stompClient.subscribe('/agvInfo', (msg: any) => {
        let matterData = msg.body
        if (matterData) {
          let data = JSON.parse(matterData)
          socketData = data
          ol.userInfo(data)
          ol.annimateLine(data)
          console.log(data)
          leftTop1.getData(data)
          // ol.userInfo(data)
          channelId1 = data[0].channelId || config().defaultChannel?.id
          channelId2 = data[1].channelId || config().defaultChannel?.id
          rightTOP1.setData(data[0])
          rightTOP2.setData(data[1])
          console.log(channelId1, channelId2)
        }
      })
    })
  }
  onUnmounted(() => {
    stompClient.disconnect()
  })
</script>
<style scoped lang="less">
  .Agv {
    width: 100%;
    min-height: 100%;
    height: auto;
    background: url('@/assets/img/AGV/bg.png') no-repeat;
    background-size: 100%;
    position: relative;
    .contentVuew {
      width: 100%;
      height: calc(100% - 162px);
      display: flex;
      margin-top: -57px;
      overflow: hidden;
      .leftCon {
        width: 465px;
        height: 100%;
        margin-left: 27px;
        .leftTop {
          margin-bottom: 20px;
        }
      }
      .centerDiv {
        width: 915px;
        height: auto;
        background: url('@/assets/img/AGV/backAgv.png') no-repeat center center;
        background-size: 110%;
        margin-left: 10px;
        margin-right: 10px;
      }
      .center {
        width: 750px;
        height: 100%;
        box-sizing: border-box;
        position: relative;
        display: flex;
        margin-left: 80px;
        margin-right: 100px;

        z-index: 10000;
        .map {
          width: 915px;
          height: 100%;
          position: relative;
        }
      }
      .play {
        width: 465px;
        height: 100%;
        margin-left: 27px;
        .rightTop {
          margin-bottom: 20px;
        }
      }
    }
  }
</style>
