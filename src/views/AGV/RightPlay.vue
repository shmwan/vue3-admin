<template>
  <div class="playBox">
    <div class="AGVTitle">
      SMT - {{ datas.data.carId }}(<span :class="datas.data.taskStatus">{{
        SMTstatus[datas.data.taskStatus as keyof typeof SMTstatus]
      }}</span
      >)
    </div>
    <div class="AVGBox">
      <div class="name">
        <img
          src="../../assets/img/AGV/camera.png"
          alt=""
          style="width: 26px; height: 24px"
        />
        <div>{{ datas.data.deviceName || deviceName }}</div>
      </div>
      <div class="videoCon">
        <!-- <div class="video">
          <VideoPlayer
            v-show="nextVideo"
            :video-url="datas.nextVideoUrl"
            :live="true"
          ></VideoPlayer>
        </div> -->
        <div class="video">
          <VideoPlayer :video-url="datas.videoUrl" :live="true"></VideoPlayer>
        </div>
      </div>
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
  import VideoPlayer from '@/components/video-player/VideoPlayer.vue'
  import { useGetAddress } from '@/hooks/useGetLive.ts'

  const { proxy } = getCurrentInstance() as any
  interface Props {
    showData: any
    channelId: string | undefined
  }
  const prop = defineProps<Props>()
  const deviceName = $ref<string>(config().defaultChannel?.name)
  console.log(prop)
  const { showData, channelId } = prop
  let nextVideo = $ref<boolean>(true)
  interface Datas {
    videoUrl: string
    showStatus: string
    nextVideoUrl: string
    data: any
  }
  let datas: Datas = reactive({
    videoUrl: '',
    showStatus: '',
    nextVideoUrl: '',
    data: {
      carId: '',
      taskStatus: '',
      deviceName: ''
    }
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
  let useAdd = useGetAddress()

  const getData = async (data: any) => {
    console.log(data)
    let res = await useAdd.getData(data)
    datas.videoUrl = res[0].address
  }
  let setData = (data: any) => {
    if (data.carId) {
      nextTick(() => {
        datas.data = data
      })
      // datas.showStatus = SMTstatus[data.taskStatus as keyof typeof SMTstatus]
    }
  }

  watch(
    () => prop.channelId,
    data => {
      if (data) {
        console.log(data, 'showData')
        getData(data) //
      }
    },
    { immediate: true, deep: true }
  )
  defineExpose({
    setData
  })
</script>

<style scoped lang="less">
  .playBox {
    width: 100%;
    height: 280px;
    // background-color: #fff;
    .AGVTitle {
      font-size: 18px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
    }
    .AVGBox {
      width: 100%;
      height: 266px;
      background: url('/src/assets/img/AGV/background.png') no-repeat center
        center;
      background-size: 100% 100%;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      padding: 0 17px;
      box-sizing: border-box;
      .name {
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
        margin: 10px 0;
        display: flex;
        align-items: center;
      }
      .videoCon {
        width: 100%;
        height: 280px;
        position: relative;
        .video {
          width: 100%;
          height: 212px;
          position: absolute;
        }
      }
    }
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
</style>
