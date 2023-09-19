<template>
  <div class="topChart">
    <div class="title">
      <div class="titleText">{{ $t('lang.aiBigScreen.upph') }}</div>
    </div>
    <div class="numbers">
      <span>{{ $t('lang.aiBigScreen.timesUPPH') }}<span class="numColor">{{ datas.upph }}</span></span>
    </div>
    <div ref="echartsTop" class="columnar"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, getCurrentInstance } from 'vue'
import DateUtils from '@/utils/dateUtils.js'
import * as echarts from 'echarts'
const { proxy } = getCurrentInstance() as any
const $t = proxy.$t;
const echartsTop = ref()
let timer: any = ''
let timer2: any = ''
let chartTimer: any = ''
interface Datas {
  type: number | null
  lineList: any
  upph: any
}
let datas = reactive({
  type: null,
  lineList: {},
  upph: 0
})
let chartsList: any = {}
let xData: any = []
let yData: any = []
let zData: any = []
onMounted(() => {
  // datas.lineList = config().aiData
  // searchData()
  // getChartData()
})
onUnmounted(() => {
  if (chartTimer) clearInterval(chartTimer)
  if (timer) clearInterval(timer)
  if (timer2) clearInterval(timer2)
})
const searchData = (obj: any, params: any, total: any) => {

  getDataList(obj, params, total)
  getChartData(obj)
  if (timer2) clearInterval(timer2)
  timer2 = setInterval(() => {
    getDataList(obj, params, total)
    getChartData(obj)
  }, 30000)
}
const getDataList = (obj: any, params: any, total: any) => {
  let data = {
    lineCode: obj.longLineCode,
    recordTime: DateUtils.format(new Date(), 'yyyy-MM-dd'),
    workShift: params.type
  }
  proxy.$api.bigScreen.getOutputInfo(data).then((res: any) => {
    if (res.code == 200) {
      total = total ? total : res.data.totalOutput
      let upph = res.data.workHours
        ? (total / res.data.workHours).toFixed(2)
        : 0
      datas.upph = upph
    }
  })
}
const getChartData = (obj: any) => {
  let params = {
    lineCode: obj.longLineCode,
    recordTime: DateUtils.format(new Date(), 'yyyy-MM-dd'),
    day: 7
  }
  proxy.$api.bigScreen.getUpph(params).then((res: any) => {
    if (res.code == 200) {
      xData = res.data.xaxis
      yData = res.data.data[1]

    }
    initEcharts()
    // if (chartTimer) clearInterval(chartTimer)
    // chartTimer = setInterval(() => { initEcharts() }, 5000)
  })
}
const initEcharts = () => {
  if (timer) {
    clearInterval(timer)
  }
  const myChart = echarts.init(echartsTop.value)
  myChart.clear()
  let option = {
    backgroundColor: 'RGBA(6, 27, 49, 0)',
    color: ['#63caff', '#49beff', 'rgb(2,47,87)', 'rgb(2,47,87)'],
    grid: {
      top: '10%',
      left: '1%',
      right: '1%',
      bottom: '1%',
      containLabel: true
    },
    dataZoom: [
      {
        xAxisIndex: 0, // 这里是从X轴的0刻度开始
        show: false, // 是否显示滑动条，不影响使用
        type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
        startValue: 0, // 从头开始。
        endValue: 10 // 一次性展示多少个。
      }
    ],
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
        return `时间：${params[0].name} <br> upph: ${params[0].value}`
      }
    },
    xAxis: {
      type: 'category',
      data: xData,
      splitLine: {
        show: false
      },
      axisLabel: {
        color: 'rgba(225, 225, 225, 1)',
        fontSize: 10,
        interval: 'auto' // x轴间距
        // rotate: 30,
      },
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 142, 114, 0.3)'
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        name: '',
        nameGap: '30',
        min: 0,
        splitNumber: 6,
        axisTick: {
          show: false
        },
        axisLabel: {
          show: true,
          fontSize: 10,
          color: 'rgba(225, 225, 225, 1)'
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(0, 142, 114, 0.1)'
          }
        },
        nameTextStyle: {
          color: 'rgba(179, 188, 187, 1)',
          fontWeight: 400,
          fontSize: 24
        }
      }
    ],
    series: [
      {
        data: yData,
        type: 'bar', // 柱图
        barMaxWidth: 'auto',
        barWidth: 15,
        label: {
          normal: {
            show: true,
            fontSize: 13,
            color: '#14B6F3',
            position: 'top',
            formatter: function (data: any) {
              // let num = Math.round(data.data)
              return data.data
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
                color: 'rgba(0, 183, 255, 1)'
              },
              {
                offset: 1,
                color: 'rgba(34, 138, 172, 0.55)'
              }
            ]
          }
        }
      },
      {
        data: zData,
        type: 'pictorialBar', // 底部
        barMaxWidth: '20',
        symbolOffset: [0, '50%'],
        symbolSize: [15, 8],
        itemStyle: {
          color: 'rgba(31, 97, 234, 0.5)'
        }
      },
      {
        data: yData,
        type: 'pictorialBar', // 顶部
        barMaxWidth: '20',
        symbolPosition: 'end',
        symbolOffset: [0, '-50%'],
        symbolSize: [15, 8],
        itemStyle: {
          color: 'rgba(33, 243, 255, 1)'
        },
        zlevel: 2
      }
    ]
  }
  myChart.setOption(option)
  timer = setInterval(function () {
    if (option.dataZoom[0].endValue == yData.length) {
      option.dataZoom[0].endValue = 10
      option.dataZoom[0].startValue = 0
    } else {
      option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1
      option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1
    }
    myChart.setOption(option)
  }, 2000)
  window.addEventListener('resize', () => {
    myChart.resize()
  })
}
defineExpose({
  searchData,
  getDataList,
  getChartData

});

</script>

<style scoped lang="less">
.columnar {
  width: 100%;

  height: 73%;
}

.numbers {
  margin: 20px 25px 10px;
  color: #fff;
  font-size: 16px;
  display: flex;
  justify-content: space-between;

  .numColor {
    color: #57e6ff;
  }
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
