<template>
  <div :id="'player' + idx" class="videoBox"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, getCurrentInstance } from 'vue'
import { Socket, VideoPlayer, API } from 'castiron'
interface Props {
  lineObj: any
  idx: any
}
const player = ref()
let timer: any = ''
const { proxy } = getCurrentInstance() as any
const { lineObj, idx } = defineProps<Props>()
onMounted(() => {
  if (lineObj.wsUrl) {
    initPlayer()
  }
})
if (lineObj.wsUrl) {
  let str = config().playerTimer || 600000
  timer = setInterval(() => {
    if (player.value) {
      // player.value.socket.disconnect()
      player.value.destroy()
    }
    initPlayer()
  }, str)
}
onUnmounted(() => {
  if (timer) clearInterval(timer)
  player.value.destroy()

})
const initPlayer = () => {
  const options = {
    wsUrl: lineObj.wsUrl,
    el: '#player' + idx
  }
  player.value = new VideoPlayer(options)
  console.log('重加载')
  // player.value.socket.on('data', (data) => {
  //     // console.log("看数据:", data?.meta?.result?.count_result)
  // });
  player.value.play()
  if (lineObj.rotate) {
    player.value.rotate(lineObj.rotate)
  }
  //
  player.value.setTimestampStyle({
    fontSize: 20,
    fontColor: 'red',
    left: 20,
    top: 30,
    format: (timestamp: any) => {
      if (!timestamp) {
        return timestamp
      }
      const date = new Date(timestamp)
      const y = date.getFullYear()
      const m = date.getMonth() + 1
      const d = date.getDate()
      const h = date.getHours()
      const min = date.getMinutes()
      const s = date.getSeconds()
      return `${y}-${m}-${d} ${h}:${min}:${s}`
    }
  })
  player.value.setCountTextStyle({
    fontSize: 80,
    left: 20,
    top: 100
  })
  // } else {
  //     console.log("无视频流地址")
  // }
}
</script>

<style scoped lang="less">
.videoBox {
  position: relative;
  width: 500px;
  height: 280px;
  position: relative;
  // border: solid 1px #eee;
  // margin-top: 30px;
}
</style>
