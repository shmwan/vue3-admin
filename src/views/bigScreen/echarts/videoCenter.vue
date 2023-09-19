<template>
    <div class="box">
        <div class="conts">
            <video-Box v-if="datas.showLineHeader" class="items" :lineObj="datas.lineListHeader" :idx="0"></video-Box>
        </div>
        <div class="conts">
            <video-Box v-if="datas.showLineFooter" class="items" :lineObj="datas.lineListFooter" :idx="3"></video-Box>
        </div>
        <div class="conts">
            <video-Player v-if="datas.showPlayer" class="items" :videoUrl="datas.videoUrl"></video-Player>
        </div>

        <div class="conts">
            <div class="items videobg">
                <video class="video" :autoplay="datas.play" :loop="datas.loop" muted src="../../../assets/video.mp4"
                    type="video/mp4"></video>
            </div>
        </div>


    </div>
</template>
<script setup lang="ts">

import { ref, reactive, nextTick, getCurrentInstance } from "vue";
import videoBox from "./videoCon.vue";
import videoPlayer from "/src/components/video-player/VideoPlayer.vue";
const { proxy } = getCurrentInstance();
interface Datas {
    lineList: object
    lineListHeader: object
    showLineHeader: boolean
    showLineFooter: boolean
    lineListFooter: object
    videoUrl: string
    play: boolean
    loop: boolean
    showPlayer: boolean
}
let datas: Datas = reactive({
    lineList: [],
    lineListHeader: null,
    showLineHeader: false,
    showLineFooter: false,
    lineListFooter: null,
    videoUrl: '',
    play: true,
    loop: true,
    showPlayer: true,
})
let timer: any = null
const searchData = (obj: any) => {
    datas.showLineHeader = obj.putInStationVideoUrl ? true : false
    datas.showLineFooter = obj.putOutStationVideoUrl ? true : false
    datas.showPlayer = obj.cameraChannelId ? true : false
    datas.lineListHeader = {
        name: "主板投入",
        wsUrl: obj.putInStationVideoUrl,
        id: obj.putInStationCountId,
        rotate: obj.putInStationVideoAngle,
        apiUrl: obj.putInStationApiUrl
    }
    datas.lineListFooter = {
        name: "",
        wsUrl: obj.putOutStationVideoUrl,
        id: obj.putOutStationCountId,
        rotate: obj.putOutStationVideoAngle,
        apiUrl: obj.putOutStationApiUrl
    }
    if (obj.cameraChannelId) {
        let params = {
            // channelId: '91934d77-98bf-4c5a-8af0-00f499213e2c',
            channelId: obj.cameraChannelId
        }
        proxy?.$api.matter.getVideoUrl(params).then((res: any) => {
            if (res.code == 200) {
                datas.videoUrl = res.data[0].address
            }
        })
    }

};
// searchData();
onMounted(() => {
    // searchData();
    // timer = setInterval(() => {
    //     datas.showPlayer = false
    //     setTimeout(() => {
    //         datas.showPlayer = true
    //     }, 100)
    // }, 1000 * 60 * 30)
})
defineExpose({
    searchData
});


</script>
<style scoped lang="less">
.box {
    box-sizing: border-box;
    padding: 20px;
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    height: 100%;

    .conts {
        width: 50%;
        box-sizing: border-box;
        height: 323px;
        padding: 10px;
        // float: left;

        .items {
            width: 100%;
            height: 100%;


            .video {
                background: #000;
                width: 100%;
                // // margin-top: -60px;
                height: 100%;
            }
        }

        .videobg {
            background: #000;
        }
    }

}
</style>
