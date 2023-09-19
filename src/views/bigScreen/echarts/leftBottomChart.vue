<template>
  <!-- <div style="margin:10px;width: 95%; height: 90%">
    <div class="numbers">
      <span>今日AI视频节拍：{{ datas.totalNumber }}</span>
      <span>实时节拍： {{ datas.realTimeBeat }}</span>
    </div>
    <div ref="echartsTop" class="columnar"></div>
  </div> -->
  <div class="chart">
    <div class="title">
      <div class="titleText">{{ $t('lang.aiBigScreen.AIJiepai') }}</div>
      <!-- <div class="titleName">{{ datas.totalNumber }}</div> -->
    </div>
    <div ref="echartsTop" class="columnar"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, getCurrentInstance } from 'vue'

import DateUtils from '@/utils/dateUtils.js'
import * as echarts from 'echarts'
const echartsTop = ref()
interface Props {
  lineObj: any
}
const { proxy } = getCurrentInstance() as any
const $t = proxy.$t
const { lineObj } = defineProps<Props>()
// let lineItem = config().aiData.lineList[3]
// let lineList = config().aiData
let datas = reactive({
  totalNumber: '',
  realTimeBeat: '',
  showList: {},
  results: []
})
let chartTimer: any = ''
let xData: any = []
let yData: any = []
let yData1: any = []
let timer2: any = []
onMounted(() => {
  //loop()
})
onUnmounted(() => {
  if (timer2) clearInterval(timer2)
  if (chartTimer) clearInterval(chartTimer)
})
const loop = (obj: any, params: any) => {
  searchData(obj, params)
  if (timer2) clearInterval(timer2)
  timer2 = setInterval(() => {
    searchData(obj, params)
  }, 30000)
}
const initEcharts = () => {
  // if (timer) {
  //   clearInterval(timer)
  // }
  const myChart = echarts.init(echartsTop.value)
  myChart.clear()
  let option = {
    backgroundColor: 'RGBA(6, 27, 49, 0)',
    grid: {
      top: '15%',
      left: '1%',
      right: '1%',
      bottom: '5%',
      containLabel: true
    },
    // dataZoom: [
    //   {
    //     xAxisIndex: 0, // 这里是从X轴的0刻度开始
    //     show: false, // 是否显示滑动条，不影响使用
    //     type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
    //     startValue: 0, // 从头开始。
    //     endValue: 6 // 一次性展示多少个。
    //   }
    // ],
    tooltip: {
      trigger: 'axis',
      borderWidth: 0,
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
      textStyle: {
        color: '#fff',
        fontSize: 12
      },
      backgroundColor: 'rgba(17,95,182,0.5)',
      formatter: (params: any) => {
        // return `时间：${params[0].name} <br> 数: ${params[0].value}`;
        if (params[0].seriesName == '节拍') {
          return `时间：${params[0].name} <br> 节拍: ${params[0].value}`
        } else {
          return `时间：${params[0].name} <br> 过站数: ${params[0].value}`
        }
      }
    },

    xAxis: {
      type: 'category',
      data: xData,
      axisTick: {
        show: false
      },
      axisLabel: {
        color: '#fff'
      }
    },
    yAxis: {
      type: 'value',
      splitNumber: 6,
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 142, 114, .2)'
        }
      },
      axisLabel: {
        color: '#fff'
      }
    },
    series: [
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
            color: 'rgba(57, 255, 220, 1)',
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
              [
                {
                  offset: 0,
                  color: 'rgba(57, 255, 220, 0.6)'
                },
                {
                  offset: 0.7,
                  color: 'rgba(28, 119, 216, 0.2)'
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
        data: yData1
      },
      {
        "name": "节拍动效",
        "data": [{
          "coords": datas.results.map((item: any) => { return [item.name, item.val] }),
        }],
        "type": "lines",
        "coordinateSystem": "cartesian2d",
        "zlevel": 1,
        "polyline": true,
        "smooth": true,
        "symbol": "circle",
        "effect":
        {
          "show": true,
          "trailLength": 0.2,
          "symbol": "circle",
          "period": 4,
          "symbolSize": 8
        },
        "lineStyle":
        {
          "normal":
          {
            "color": `rgba(57, 255, 220, 1)`,
            "width": 0,
            "opacity": 0,
            "curveness": 0
          }
        }
      }
    ]
  }
  myChart.setOption(option)
  // timer = setInterval(function () {
  //   if (option.dataZoom[0].endValue == yData.length) {
  //     option.dataZoom[0].endValue = 6
  //     option.dataZoom[0].startValue = 0
  //   } else {
  //     option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1
  //     option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1
  //   }
  //   myChart.setOption(option)
  // }, 2000)
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

const searchData = (obj: any, params: any) => {
  let data = { ...params }
  data.id = obj.putOutStationCountId
  data.lineCode = obj.lineCode
  staticQuery(data)
}
const staticQuery = (params: any) => {
  proxy?.$api.bigScreen.lineStatic(params).then((res: any) => {
    if (res.code == 200) {
      let newXData: any = []
      var myDate = new Date()
      let time = myDate.getHours()
      if (time > 7 && time < 15) {
        newXData = res.data.xdata.slice(0, 7)
        xData = []
        newXData.forEach((item: any, index: any) => {
          xData.push(item + ':00')
        })
        yData1 = res.data.ydata1.slice(0, 7)
      } else {
        let index = res.data.xdata.findIndex((value, index, arr) => {
          return value == time
        })
        newXData = res.data.xdata.slice(index - 6, index + 1)
        xData = []
        newXData.forEach((item: any, index: any) => {
          xData.push(item + ':00')
        })
        yData1 = res.data.ydata1.slice(index - 6, index + 1)
      }
      if (res.data.allQuantity == 0 && config().ifUseMock) {

        yData1 = [100, 600, 310, 150, 305, 203, 780]
      }
      // let start = myDate.getHours() - 7
      // let end = myDate.getHours()
      // yData = res.data.ydata.slice(start, end)
      // xData = newXData.slice(start, end)
      datas.totalNumber = res.data.allQuantity
      datas.realTimeBeat = res.data.realTimeBeat
    }
    datas.results = []
    xData.forEach((item: any, index: any) => {
      let obj = { name: xData[index], val: yData1[index] }
      datas.results.push(obj)
    })
    initEcharts()
    // if (chartTimer) clearInterval(chartTimer)
    // chartTimer = setInterval(() => { initEcharts() }, 5000)
  })
}
defineExpose({
  loop
})
</script>

<style scoped lang="less">
.columnar {
  width: 100%;
  height: 95%;
  overflow: hidden;
}

.numbers {
  margin: 30px 0 10px;
  color: #fff;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
}

.title {
  height: 33px;
  width: 100%;
  background-image: url(/src/assets/img/AIBig/titleBg.png);
  display: flex;
  justify-content: space-between;
  align-items: center;

  div {
    font-size: 18px;
    font-weight: 600;
    color: #57e6ff;
  }

  .titleText {
    margin-left: 40px;
  }

  .titleName {
    margin-right: 10px;
  }
}
</style>
