<template>
  <div class="twoChart">
    <div class="title">
      <div class="titleText">{{ $t('lang.aiBigScreen.gongXu') }}</div>
      <div class="titleName">{{ datas.lineName }}</div>
      <!--  -->
    </div>
    <div class="numbers">
      <span>{{ $t('lang.aiBigScreen.timesGuozhan')
      }}<span class="numColor">{{ datas.totalNumber }}</span></span>
      <span>{{ $t('lang.aiBigScreen.timesJiepai')
      }}<span class="numColor"> {{ datas.realTimeBeat }}</span></span>
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
interface SearchFroms {
  bar: boolean,
  totalNumber: string,
  realTimeBeat: string,
  showList: object,
  lineName: string,
  results: object
}
let datas: SearchFroms = reactive({
  bar: true,
  totalNumber: '',
  realTimeBeat: '',
  showList: {},
  lineName: "",
  results: []
})
let timer2: any = ''
let timerInner: any = ''
let chartTimer: any = ''
let xData: any = []
let yData: any = []
let yData1: any = []
let yRate: any = []
onMounted(() => {
  //loop()
})
onUnmounted(() => {
  if (timer2) clearInterval(timer2)
  if (timerInner) clearInterval(timerInner)

})
const loop = (obj: any, params: any) => {
  datas.lineName = "主板投入";
  searchData(datas.bar, obj, params)
  let timeStr = config().aiBigLineTimer ? config().aiBigLineTimer / 2 : 5000
  if (timer2) clearInterval(timer2)
  if (chartTimer) clearInterval(chartTimer)
  timer2 = setInterval(() => {
    datas.bar = !datas.bar
    searchData(datas.bar, obj, params)
  }, timeStr)
}

const initEcharts = (flag: boolean) => {


  const myChart = echarts.init(echartsTop.value)
  myChart.clear()
  let color = ['0, 124, 250', '0, 254, 210']
  let option = {
    backgroundColor: 'RGBA(6, 27, 49, 0)',
    grid: {
      top: '15%',
      left: '1%',
      right: '1%',
      bottom: '5%',
      containLabel: true
    },

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
    series: []
  }
  let series = []
  if (flag) {

    series.push({
      name: '节拍',
      type: 'line',
      "smooth": true, //是否平滑曲线显示
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
        "smooth": false,
        "symbol": "circle",
        "effect":
        {
          "show": true,
          "trailLength": 0.1,
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
      })
  } else {
    series.push({
      name: '过站总数',
      data: yData,
      type: 'bar',
      barWidth: 15,
      showBackground: false,
      label: {
        normal: {
          show: true,
          fontSize: 13,
          color: '#14B6F3',
          position: 'top',
          formatter: function (data: any) {
            let num = Math.round(yRate[data.dataIndex])
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
              color: 'rgba(6, 27, 49, 0)'
            }
          ]
        }
      }
    })
  }
  option.series = series
  myChart.setOption(option)

  window.addEventListener('resize', () => {
    myChart.resize()
  })
}

const searchData = (flag: boolean, obj: any, params: any) => {
  datas.showList = params
  datas.showList.id = obj.putInStationCountId
  datas.showList.lineCode = obj.lineCode
  staticQuery(flag)

}
const staticQuery = (flag: boolean) => {
  let params = datas.showList
  proxy?.$api.bigScreen.lineStatic(params).then((res: any) => {
    if (res.code == 200) {
      let newXData: any = []
      var myDate = new Date()
      let time = myDate.getHours()
      if (time > 7 && time < 15) {
        // debugger
        newXData = res.data.xdata.slice(0, 7)
        xData = []
        newXData.forEach((item: any, index: any) => {
          xData.push(item + ':00')
        })
        yData1 = res.data.ydata1.slice(0, 7)
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
        yData1 = res.data.ydata1.slice(index - 6, index + 1)
        yData = res.data.ydata.slice(index - 6, index + 1)
        yRate = res.data.ydata2.slice(index - 6, index + 1)
      }
      if (res.data.allQuantity == 0 && config().ifUseMock) {
        yData = [10, 60, 30, 50, 5, 23, 78]
        yData1 = [100, 600, 310, 150, 305, 203, 780]
        yRate = [10, 60, 30, 50, 5, 23, 78]
      }
      datas.totalNumber = res.data.allQuantity
      datas.realTimeBeat = res.data.realTimeBeat
      datas.results = []
      xData.forEach((item: any, index: any) => {
        let obj = { name: xData[index], val: yData1[index] }
        datas.results.push(obj)
      })
      console.log("查看", datas.results)
      initEcharts(flag)
      // if (flag) {
      //   if (chartTimer) clearInterval(chartTimer)
      //   chartTimer = setInterval(() => { initEcharts(flag) }, 5000)
      // }

    }
  })
}
defineExpose({
  loop
});
</script>

<style scoped lang="less">
.columnar {
  width: 100%;
  height: 73%;
  overflow: hidden;
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
  // justify-content: space-between;
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
    margin-left: 10px;
  }
}
</style>
