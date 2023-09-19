<template>
    <div style="width: 100%; height: 100%">
        <div class="numbers">
            <span>实时过站总数：{{ datas.totalNumber }}</span>
            <span>实时节拍： {{ datas.realTimeBeat }}</span>
        </div>
        <div ref="echartsTop" class="columnar"></div>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, reactive, getCurrentInstance } from "vue";

import DateUtils from "@/utils/dateUtils.js";
import * as echarts from "echarts";
const echartsTop = ref();
interface Props {
    lineObj: any;
}
const { proxy } = getCurrentInstance() as any;
const { lineObj } = defineProps<Props>();
let lineItem = { ...lineObj };
let datas = reactive({
    bar: false,
    totalNumber: "",
    realTimeBeat: '',
})
let timer: any = "";
let timer2: any = "";
let xData: any = [];
let yData: any = [];
let yData1: any = [];

onMounted(() => {
    staticQuery(datas.bar)
    timer2 = setInterval(function () {
        datas.bar = !datas.bar
        staticQuery(datas.bar,);
    }, 30000);
});
onUnmounted(() => {
    if (timer2) clearInterval(timer2)
})
const initEcharts = (flag: boolean) => {
    if (timer) {
        clearInterval(timer);
    }
    const myChart = echarts.init(echartsTop.value);
    let option = {
        backgroundColor: 'RGBA(6, 27, 49, 1)',
        grid: {
            top: '15%',
            left: '1%',
            right: '1%',
            bottom: '5%',
            containLabel: true,
        },
        dataZoom: [
            {
                xAxisIndex: 0, // 这里是从X轴的0刻度开始
                show: false, // 是否显示滑动条，不影响使用
                type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                startValue: 0, // 从头开始。
                endValue: 6, // 一次性展示多少个。
            },
        ],
        tooltip: {
            trigger: "axis",
            borderWidth: 0,
            axisPointer: {
                // 坐标轴指示器，坐标轴触发有效
                type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
            },
            textStyle: {
                color: "#fff",
                fontSize: 12,
            },
            backgroundColor: "rgba(17,95,182,0.5)",
            formatter: (params: any) => {
                console.log("toop", params)
                // return `时间：${params[0].name} <br> 数: ${params[0].value}`;
                if (params[0].seriesName == '节拍') {
                    return `时间：${params[0].name} <br> 节拍: ${params[0].value}`;
                } else {
                    return `时间：${params[0].name} <br> 过站数: ${params[0].value}`;
                }

            },
        },


        xAxis: {
            type: 'category',
            data: xData,
            axisTick: {
                show: false
            }
        },
        yAxis: {
            type: 'value',
            splitNumber: 6,
            splitLine: {
                lineStyle: {
                    color: 'rgba(0, 142, 114, .2)'
                }
            }
        },
        series: []
    }
    let series = []
    if (flag) {
        series.push(
            {
                name: '节拍',
                type: 'line',
                smooth: true, //是否平滑曲线显示
                showSymbol: false,
                itemStyle: {
                    color: 'rgba(57, 255, 220, 1)',
                    borderColor: 'rgba(57, 255, 220, 1)',
                    borderWidth: 1
                },
                lineStyle: {
                    normal: {
                        width: 2,
                        color: "rgba(57, 255, 220, 1)",
                        shadowColor: 'rgba(57, 255, 220, 1)',
                        shadowBlur: 30,
                        shadowOffsetY: 5
                    }
                },
                areaStyle: {
                    //区域填充样式
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0,
                            0,
                            0,
                            1,
                            [{
                                offset: 0,
                                color: "rgba(57, 255, 220, 0.6)"
                            }, {
                                offset: 0.7,
                                color: "rgba(28, 119, 216, 0.2)"
                            },
                            {
                                offset: 1,
                                color: "rgba(0,0,0, 0)"
                            }
                            ],
                            false
                        ),
                        shadowColor: "rgba(243,162,45, 0.1)",
                        shadowBlur: 2
                    }
                },
                data: yData1
            }
        )
    } else {
        series.push({
            name: '过站总数',
            data: yData,
            type: 'bar',
            barWidth: 15,
            showBackground: false,
            itemStyle: {
                color: {
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    type: 'linear',
                    global: false,
                    colorStops: [
                        {
                            offset: 0,
                            color: 'rgba(0, 198, 227, 0.3)'
                        },
                        {
                            offset: 1,
                            color: 'rgba(0, 104, 220, 0.3)'
                        }
                    ]
                },
                borderWidth: 2,
                borderColor: {
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    type: 'linear',
                    global: false,
                    colorStops: [
                        {
                            offset: 0,
                            color: 'rgba(0, 235, 232, 1)'
                        },
                        {
                            offset: 1,
                            color: 'RGBA(6, 27, 49, 1)'
                        }
                    ]
                }
            }
        })
    }
    option.series = series
    myChart.setOption(option);
    timer = setInterval(function () {
        if (option.dataZoom[0].endValue == yData.length) {
            option.dataZoom[0].endValue = 6;
            option.dataZoom[0].startValue = 0;
        } else {
            option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
            option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
        }
        myChart.setOption(option);
    }, 2000);
    window.addEventListener("resize", () => {
        myChart.resize();
    });
};
const staticQuery = (flag: boolean) => {
    let params = {
        id: lineItem.id,
        type: '0',
        day: DateUtils.format(new Date(), "yyyyMMdd"),
    };
    proxy?.$api.bigScreen.lineStatic(params).then((res: any) => {
        if (res.code == 200) {
            res.data.xdata.forEach((item: any, index: any) => {
                xData.push(item + ":00");
            });
            yData = res.data.ydata;
            yData1 = res.data.ydata1;
            datas.totalNumber = res.data.allQuantity
            datas.realTimeBeat = res.data.realTimeBeat

        }
    });
    setTimeout(() => { initEcharts(flag) }, 500)

};

</script>
  
<style scoped lang="less">
.columnar {
    width: 100%;
    height: 190px;
    overflow: hidden;
}

.numbers {
    margin: 30px 0 10px;
    color: #fff;
    font-size: 16px;
    display: flex;
    justify-content: space-between;
}
</style>
  