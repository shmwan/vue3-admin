<template>
    <div class="LeftEcharts">
        <div class="chartsTitle">
            <div class="titText">综合产能达成率</div>
            <div class="titRight">
                <el-select v-model="datas.range" placeholder="Select" @change="SearchData(datas.range)">
                    <el-option v-for="item in datas.options" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
            </div>
        </div>
        <div ref="leftCharts" style="width: 100%; height: calc(100% - 100px)"></div>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref, reactive, getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance() as any
import setDateRecent from '@/utils/recentlyDate.js'
import * as echarts from 'echarts'
const leftCharts = ref()
interface Datas {
    xdata: any
    ydata: any
    ydata1: any
    colorList: any
    showData: any
    range: any
}
const datas: Datas = reactive({
    xdata: [],
    ydata: [],
    ydata1: [],

    options: [{
        value: '1',
        label: '近一月'
    }, {
        value: '3',
        label: '近三月'
    },
    {
        value: '6',
        label: '近半年'
    },
    {
        value: '12',
        label: '近一年'
    },

    ],
    range: '1',
    showData: []
})
let timer: any = []
let myTimer: any = null

const SearchData = (val) => {

    let obj = null
    if (val == 1) {
        obj = setDateRecent.getRecentlyDate('month', 1)

    } else if (val == 3) {
        obj = setDateRecent.getRecentlyDate('month', 3)
    } else if (val == 6) {
        obj = setDateRecent.getRecentlyDate('month', 6)
    } else if (val == 12) {
        obj = setDateRecent.getRecentlyDate('year', 1)
    }
    let params = { ...obj }
    proxy?.$api.bigScreen.trend(params).then((res: any) => {
        if (res.code == 200) {
            datas.xdata = res.data.xdata
            datas.ydata = res.data.ydata
            datas.ydata1 = res.data.ydata1
            initEcharts()
        }
    })
}
const initEcharts = () => {
    const myChart = echarts.init(leftCharts.value)
    if (timer) clearInterval(timer)
    myChart.clear()
    let option = {
        color: ['#4ACBD6', '#FCAA3D'],
        tooltip: {
            trigger: "axis",
            borderColor: "rgba(147, 235, 248, 0)",
            formatter: (params: any) => {
                return `产能：${params[0].value} pcs <br> 达成率: ${params[1].value} %`

            }
        },
        grid: {
            top: 80,
            right: 40,
            bottom: 30,
            left: 40,
            containLabel: true
        },
        legend: {
            itemWidth: 18,
            itemHeight: 13,
            data: [
                {
                    name: '产能',
                    // icon: 'image://' + require('@/assets/img/line01.png'),
                    icon: 'image://' + new URL('@/assets/img/line01.png', import.meta.url).href

                },
                {
                    name: '达成率',
                    // icon: 'image://' + require('@/assets/img/line02.png'),
                    icon: 'image://' + new URL('@/assets/img/line02.png', import.meta.url).href
                }
            ],
            icon: 'rect',
            itemGap: 40,
            top: 30,
            right: 30,
            textStyle: {
                color: 'rgba(0, 0, 0, 0.85)'
            }
        },
        xAxis: {
            type: 'category',
            data: datas.xdata,
            splitLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            axisLabel: {
                //坐标轴刻度标签的相关设置。
                // interval: 0,//设置为 1，表示『隔一个标签显示一个标签』
                textStyle: {
                    color: '#6E7287',  //更改坐标轴文字颜色
                    fontSize: 12,    //更改坐标轴文字大小
                },
                formatter: function (value) {
                    return value.slice(4, 6) + '/' + value.slice(6, 8)

                },
                rotate: 30,
                // rotate: 40, //x轴文字是否旋转
            },
        },
        yAxis: [
            {
                type: 'value',
                "name": "k /pcs",
                // max: "dataMax",

                // max: function (value) {
                //     return (value.max) / 1000;
                // },
                // min: 0,
                // splitNumber: 1000,
                axisLabel: {
                    color: 'rgba(0, 0, 0, 0.45)',
                    formatter: function (value, index) {
                        return value / 1000;
                    }
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    show: false
                },
                splitLine: {
                    lineStyle: {
                        type: 'dashed',
                        color: 'rgba(0, 0, 0, 0.15)'
                    }
                }
            },
            {
                min: 0,
                type: 'value',

                // max: "dataMax",
                max: function (value) {
                    return (value.max * 1.4);
                },
                position: "right",
                alignTicks: true,
                splitLine: {
                    show: false
                },
                axisLabel: {
                    color: 'rgba(0, 0, 0, 0.45)',
                    formatter: function (value, index) {
                        return value.toFixed(2) + '%';
                    }

                }
            }
        ],
        dataZoom: [

            {
                xAxisIndex: 0,// 这里是从X轴的0刻度开始
                show: true, // 是否显示滑动条，不影响使用
                zoomLock: false,
                type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                startValue: 0, // 从头开始。
                endValue: 20, // 一次性展示多少个。
                height: 20,
                bottom: 20,
                zoomOnMouseWheel: false,
                brushSelect: false,  //禁止鼠标选中

            },
            // {
            //     show: true,
            //     height: 6,
            //     bottom: 10,
            //     start: 0,
            //     end: '60 %',
            //     type: 'inside'
            // },
        ],
        series: [{

            name: '产能',
            yAxisIndex: 0,
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: datas.ydata,
            areaStyle: {
                //区域填充样式
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: 'rgba(133, 220, 228, 1)'
                            },
                            {
                                offset: 0.7,
                                color: 'rgba(57, 255, 220, 0.1)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(0,0,0, 0)'
                            }
                        ],
                        false
                    ),
                    shadowColor: 'rgba(243,162,45, 0.1)',
                    shadowBlur: 2
                }
            },
        },
        {
            name: '达成率',
            yAxisIndex: 1,
            type: 'line',
            smooth: true,
            symbol: 'none',
            data: datas.ydata1,
            areaStyle: {
                //区域填充样式
                normal: {
                    color: new echarts.graphic.LinearGradient(
                        0,
                        0,
                        0,
                        1,
                        [
                            {
                                offset: 0,
                                color: 'rgba(252, 170, 61, 1)'
                            },
                            {
                                offset: 0.7,
                                color: 'rgba(252, 170, 61, 0.1)'
                            },
                            {
                                offset: 1,
                                color: 'rgba(0,0,0, 0)'
                            }
                        ],
                        false
                    ),
                    shadowColor: 'rgba(243,162,45, 0.1)',
                    shadowBlur: 2
                }
            },
        },

        ]
    };
    myChart.setOption(option, true)
    myChart.on('datazoom', function (event) {
        if (!event.animation) {
            return false
        }
        console.log("datazoom", event)
        if (myTimer >= 0) {//如果有定时器，给它清掉
            clearTimeout(myTimer);
            myTimer = null;
            if (timer) clearInterval(timer)
        }
        myTimer = setTimeout(function () {//开启定时器
            if (timer) clearInterval(timer)
            let objend = myChart.getModel().option.dataZoom[0].endValue
            let objstart = myChart.getModel().option.dataZoom[0].startValue
            option.dataZoom[0].startValue = objstart + 1;
            option.dataZoom[0].endValue = objend + 1;
            let len = objend - objstart
            if (len < datas.ydata.length) {
                timer = setInterval(function () {
                    // let
                    let str = datas.ydata.length
                    // console.log(str, option.dataZoom[0].endValue)
                    if (option.dataZoom[0].endValue > str) {
                        option.dataZoom[0].startValue = 0;
                        option.dataZoom[0].endValue = len;

                    } else {
                        option.dataZoom[0].startValue++;
                        option.dataZoom[0].endValue++;

                    }
                    myChart.setOption(option);
                }, 3000)
            }
        }, 1000);

        // option.dataZoom[0].startValue = objstart
        // option.dataZoom[0].endValue = objend

    })
    timer = setInterval(function (val: any = 20) {
        // let
        let str = datas.ydata.length
        // console.log(str, option.dataZoom[0].endValue)
        if (option.dataZoom[0].endValue > str) {
            option.dataZoom[0].startValue = 0;
            option.dataZoom[0].endValue = val;

        } else {
            option.dataZoom[0].startValue++;
            option.dataZoom[0].endValue++;

        }
        myChart.setOption(option);
    }, 3000)
    window.addEventListener('resize', () => {
        myChart.resize()
    })


}

onUnmounted(() => {
    if (timer) clearInterval(timer)
})
onMounted(() => {
    let obj = setDateRecent.getRecentlyDate('month', 1)
    SearchData('1')

})
</script>
  
<style scoped lang="less">
.LeftEcharts {
    width: 100%;
    height: 100%;
}

// .titRight {
//     padding-right: 18px;
// }
</style>
  