<template>
  <!-- <div>
    <div class="numbers">
      <span>今日每小时产出趋势：{{ datas.totalNumber }}</span>
      <span>实时节拍： {{ datas.realTimeBeat }}</span>
    </div>
    <div ref="echartsTop" class="columnar"></div>
  </div> -->
  <div class="chart">
    <div class="title">
      <div class="titleText">{{ $t('lang.aiBigScreen.hoursChan') }}</div>
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
  lineObj: any,
}
const { proxy } = getCurrentInstance() as any
const $t = proxy.$t
const { lineObj } = defineProps<Props>()

let datas = reactive({
  totalNumber: '',
  realTimeBeat: '',
  showList: {}
})
let timer2: any = ''
let chartTimer: any = ''
let xData: any = []
let yData: any = []
let yData1: any = []
let yRate: any = []

onMounted(() => {
  // loop()

})
onUnmounted(() => {
  if (timer2) clearInterval(timer2)
})
const loop = (obj: any, params: any) => {
  searchLeft1Data(obj, params)
  if (timer2) clearInterval(timer2)
  timer2 = setInterval(() => { searchLeft1Data(obj, params) }, 30000)
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
      backgroundColor: 'rgba(17,95,182,1)',
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
        color: '#fff',
      }
    },
    yAxis: {
      type: 'value',
      splitNumber: 6,
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 142, 114, .2)'
        },
      },
      axisLabel: {
        color: '#fff',
      }
    },
    series: [
      {
        name: '过站总数',
        data: yData,
        type: 'bar',
        barWidth: 15,
        showBackground: false,
        label: {
          normal: {
            show: true,
            fontSize: 12,
            color: '#14B6F3',
            position: 'top',
            formatter: function (data: any) {
              let num = Math.ceil(yRate[data.dataIndex])
              return num + '%'
            }
          }
        },
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
                color: 'rgba(0, 198, 227, 0.6)'
              },
              {
                offset: 1,
                color: 'rgba(0, 104, 220, 0.8)'
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
                color: 'RGBA(6, 27, 49, 0)'
              }
            ]
          }
        }
      }
    ]
  }
  // let series = []
  // series.push()
  // option.series = series
  myChart.setOption(option)
  // timer = setInterval(function () {
  //   if (option.dataZoom[0].endValue == yData.length) {
  //     option.dataZoom[0].endValue = 7
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
const searchLeft1Data = (obj: any, params: any) => {
  let data = { ...params }
  data.id = obj.putOutStationCountId
  data.lineCode = obj.lineCode
  staticQuery(data)
  // proxy.$api.bigScreen.getSystem({}).then((res: any) => {
  //   if (res.code == 200) {
  //     datas.showList = res.data

  //    
  //   }
  // })
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
        yData = res.data.ydata.slice(0, 7)
        yRate = res.data.ydata2.slice(0, 7)
      } else {
        let index = res.data.xdata.findIndex((value, index, arr) => {
          return value == time
        })
        newXData = res.data.xdata.slice(index - 6, index + 1)
        xData = []
        newXData.forEach((item: any, index: any) => {
          xData.push(item + ':00')
        })
        yData = res.data.ydata.slice(index - 6, index + 1)
        yRate = res.data.ydata2.slice(index - 6, index + 1)
      }
      if (res.data.allQuantity == 0 && config().ifUseMock) {
        yData = [10, 60, 30, 50, 5, 23, 78]
        yRate = [10, 60, 30, 50, 5, 23, 78]
      }
      // yRate = [10, 60, 310.34, 501.12, 5.0, 23, 78]   //假数据
      datas.totalNumber = res.data.allQuantity
      datas.realTimeBeat = res.data.realTimeBeat
      console.log('rate', yRate)
      initEcharts()
      // if (chartTimer) clearInterval(chartTimer)
      // chartTimer = setInterval(() => { initEcharts() }, 5000)

    }
  })
}
defineExpose({
  loop
});

</script>

<style scoped lang="less">
.chart {
  // width: 100%;
  // height: 100%;
}

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
