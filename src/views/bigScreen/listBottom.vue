<template>
    <div class="box">
        <div class="conts">
            <div class="items" v-for="(item, i) in datas.lineList" :key="i">
                <div class="itemContent" :class="i % 2 == 0 ? 'shun' : 'fan'">
                    <div class="lf">
                        <div class="tit">
                            <span class="LineCode">{{ item.name }}</span>
                            <span class="LineName">{{ item.type }}</span>
                        </div>
                        <div class="chartsBox">
                            <item-Chart :ref="'chart' + i" :lineObj="item"></item-Chart>
                        </div>
                    </div>
                    <div class="right">
                        <video-Box :ref="'vid' + i" :lineObj="item" :idx="i"></video-Box>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import itemChart from "./echarts/itemChart.vue";
import videoBox from "./echarts/videoCon.vue";
import { ref, reactive, nextTick, getCurrentInstance } from "vue";
const { proxy } = getCurrentInstance();
let datas = reactive({
    lineList: [],
})
const searchData = () => {
    datas.lineList = config().aiData.lineList;
};
searchData();
const staticLine = (val: any) => {
    let params = {
    };
    proxy?.$api.bigScreen.lineStatic(params).then((res: any) => {
        let data = res.data.records;
        datas.loading = false;
        datas.data = data;
        datas.total = res.data.total;
    });
}


</script>
<style scoped lang="less">
.box {
    box-sizing: border-box;
    margin: 14px;

    .conts {
        box-sizing: border-box;
        border: 1px solid transparent;
        display: flex;
        flex-flow: row wrap;
    }

    .items {
        box-sizing: border-box;
        margin: 10px 20px;
        background: url('/src/assets/img/AIBig/bgItem.png') no-repeat;
        background-size: 100% 100%;
        width: 880px;
        height: 330px;

        .itemContent.fan {
            flex-direction: row-reverse;
        }

        .itemContent.shun {
            flex-direction: row;
        }

        .itemContent {
            display: flex;
            padding: 20px;
            box-sizing: border-box;
            justify-content: space-around;

            .lf {
                width: 49%;
                padding: 0 8px;

                .tit {
                    background: url("/src/assets/img/AIBig/titleBg.png");
                    color: #57e6ff;
                    font-weight: 600;
                    font-size: 18px;
                    line-height: 33px;
                    padding: 0 48px;
                    display: flex;
                    justify-content: space-between;
                }

                // .chartsBox {
                //     height: 200px;
                // }

            }

            .right {
                // margin-left: 15px;
                width: 59%;
                padding: 0 8px;

                .video {
                    width: 500px;
                    height: 300px;
                }
            }
        }
    }
}
</style>
