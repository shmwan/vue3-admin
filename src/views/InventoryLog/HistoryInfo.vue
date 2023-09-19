<template>
  <div class="historyBox">
    <div class="historyLeft">
      <el-timeline :reverse="reverse">
        <el-timeline-item
          v-for="(activity, index) in activities"
          :key="index"
          :hollow="true"
          type="primary"
        >
          <div class="time">
            <div class="hour">
              {{ activity.timeList[1] }}
            </div>
            <div class="year">
              {{ activity.timeList[0] }}
            </div>
          </div>
          <div class="stateName" @click="checkList(index)">
            {{ activity.statusStr }}
          </div>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div class="historyRight">
      <div class="video">
        <VideoPlayer :video-url="datas.videoUrl" :live="false"></VideoPlayer>
      </div>
      <div class="info" v-if="datas.num != null">
        <el-form-item :label="$t('lang.InventLog.SheBei') + '：'">
          {{ activities[datas.num].createUser }}
        </el-form-item>
        <el-form-item :label="$t('lang.InventLog.jieGUO') + '：'">
          {{ activities[datas.num].statusStr }}
        </el-form-item>
        <el-form-item :label="$t('lang.InventLog.beiZhu') + '：'">
          {{ activities[datas.num].remark }}
          <span v-if="activities[datas.num].remark != ''">/</span>
          {{ data.actualWeight / 1000 }}KG
        </el-form-item>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { ref, reactive, nextTick, getCurrentInstance, onMounted } from 'vue'
  import VideoPlayer from '@/components/video-player/VideoPlayer.vue'
  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  interface Props {
    BasicList: any
    LogList: any
  }
  interface Datas {
    num: number | null
    videoUrl: string
  }
  let datas: Datas = reactive({
    num: null,
    videoUrl: ''
  })

  const { BasicList, LogList } = defineProps<Props>()
  let data: any = computed(() => {
    return { ...BasicList }
  })
  let activities: any = computed(() => {
    return { ...LogList }
  })

  let reverse = ref(false)

  const checkList = (list: any) => {
    datas.num = list
  }
  let {
    materialVideoTraceability: { maxPlayTime }
  } = config()
  let formatterProcessTime = (time: any, halfTime: any) => {
    let startTime = (new Date(time).getTime() - halfTime) / 1000
    let endTime = (new Date(time).getTime() + halfTime) / 1000
    return {
      startTime,
      endTime
    }
  }
  let onGetVideoTimeRange = (item: any) => {
    if (!item.channelId) {
      return
    }
    console.log('item1111', item)
    let halfTime = Math.floor(maxPlayTime / 2)
    let startTime = 0
    let endTime = 0
    let currentProcessTime: any = {}
    console.log('halfTime', halfTime)
    currentProcessTime = formatterProcessTime(item.createTime, halfTime)

    startTime = parseInt(currentProcessTime.startTime)
    endTime = parseInt(currentProcessTime.endTime)
    let channelIdList = item.channelId.split(',')
    let params = {
      channelId: channelIdList[0],
      startTime: startTime,
      endTime: endTime
    }
    proxy.$api.materialVideoTraceability
      .getTimeRange(params)
      .then((res: any) => {
        onGetVideoUrl(res.data, channelIdList)
      })
  }
  let onGetVideoUrl = (timeRange: any, item: any) => {
    let params = {
      channelId: item[0],
      nStart: timeRange[0].nStart,
      nEnd: timeRange[0].nEnd
    }
    proxy.$api.materialVideoTraceability
      .getVideoUrl(params)
      .then((res: any) => {
        datas.videoUrl = res.data.back_url
      })
  }
  watch(
    activities,
    (newV, oldV) => {
      if (newV[0]) {
        nextTick(() => {
          datas.num = 0
        })
        onGetVideoTimeRange(newV[0])
      } else {
      }
    },
    { immediate: true }
  )
</script>

<style scoped lang="less">
  .historyBox {
    display: flex;
    .historyLeft {
      width: 50%;
      margin-left: 100px;
    }
    .historyRight {
      width: 50%;
      .video {
        width: 345px;
        height: 225px;
      }
      .info {
        margin: 20px 0;
      }
    }
  }
  .el-form-item {
    margin-bottom: 0;
  }
  :deep(.el-timeline-item__content) {
    height: 100%;
    .time {
      position: absolute;
      left: -100px;
      div {
        width: 80px;
        text-align: right;
      }
    }
    .stateName {
      height: 100%;
    }
  }
  .el-timeline-item {
    height: 60px;
  }
  :deep(.el-timeline-item__wrapper) {
    height: 50px;
    cursor: pointer;
  }
</style>
