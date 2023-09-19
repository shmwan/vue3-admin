<template>
  <div class="LeftEcharts">
    <div class="chartsTitle">
      <div class="titText">产线产能达成率分析</div>
      <div style="width: 150px;">
        <el-date-picker value-format="YYYY-MM-DD" style="width: 100%;" v-model="selectDate" type="date"
          @change="dateChange" />
      </div>
    </div>
    <div ref="centerCharts" style="width: 100%; height: 85%"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, reactive, getCurrentInstance } from 'vue'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'
import DateUtils from '@/utils/dateUtils.js'
const centerCharts = ref()
const { proxy } = getCurrentInstance() as any
let selectDate: any = ref(DateUtils.format(new Date(), 'yyyy-MM-dd'))
const router = useRouter()
interface Datas {
  xData: any
  yData: any
  lineData: any
  colorList: any
}
const datas: Datas = reactive({
  xData: ['TXF3A01', 'TXF3A01', 'TXF3A01', 'TXF3A01', 'TXF3A01', 'TXF3A01'],
  yData: ["45", "75", "85", "60", "55", "80"],
  lineData: ["20", "70", "41", "19", "-30", "50"],
})
const dateChange = (dates: any) => {
  selectDate.value = dates
  SearchData()
}
const SearchData = () => {
  let params = {
    time: selectDate.value ? selectDate.value.replace(/-/g, "") : ""
  }
  proxy?.$api.bigScreen.achievement(params).then((res: any) => {
    if (res.code == 200) {
      datas.xData = res.data.xdata
      datas.yData = res.data.ydata
      datas.lineData = res.data.ydata1
      initEcharts()
    }
  })
}
let timer: any = []
let otherwindow: any = null
const initEcharts = () => {
  if (timer) clearInterval(timer)
  const myChart = echarts.init(centerCharts.value)
  myChart.clear()
  let option = {
    grid: {
      top: 80,
      right: 40,
      bottom: 40,
      left: 40,
      containLabel: true
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      borderColor: "rgba(147, 235, 248, 0)",
      textStyle: {
        color: "rgba(64, 71, 110, 1)",
      },
      formatter: (params: any) => {
        return `环比：${params[0].value}% <br> 达成率: ${params[1].value} %`

      }
    },
    legend: {
      itemWidth: 18,
      itemHeight: 13,
      data: [
        {
          name: '达成率',

        },
        {
          name: '环比',
          // icon: 'image://' + require('@/assets/img/ringLine.png'),
          icon: 'image://' + new URL('@/assets/img/ringLine.png', import.meta.url).href
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
    dataZoom: [
      {
        xAxisIndex: 0,// 这里是从X轴的0刻度开始
        show: false, // 是否显示滑动条，不影响使用
        type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
        startValue: 0, // 从头开始。
        endValue: 7, // 一次性展示多少个。
      },
    ],
    xAxis: {
      data: datas.xData,
      axisLabel: {
        color: 'rgba(0, 0, 0, 0.45)'
      },
      axisTick: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 0, 0, 0.15)',
          type: 'dashed',
          width: 0
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        alignTicks: true,
        splitLine: {
          show: false
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.45)'
        }
      },
      {
        type: 'value',
        splitNumber: 10,
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.45)'
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
      }

    ],
    series: [
      {
        name: '环比',
        yAxisIndex: 0,
        type: 'line',
        data: datas.lineData,
        symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
        smooth: true,
        symbolSize: 8,
        lineStyle: {
          color: '#FF8C09'
        },
        itemStyle: {
          color: '#FF8C09'
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgba(252, 170, 61, 0.5)',
                },
                {
                  offset: 1,
                  color: 'rgba(212,190,161,0)',
                },
              ],
              false
            ),
          },
        },
        emphasis: {
          itemStyle: {
            borderWidth: 2,
            borderColor: '#fff'
          },
          label: {
            show: true,
            position: 'top',
            color: '#FF8C09',
            align: 'left',
            offset: [10, 5]
          }
        }
      },
      {
        name: '达成率',
        yAxisIndex: 1,
        type: 'bar',
        data: datas.yData,
        barMaxWidth: 15,
        itemStyle: {
          normal: {
            borderRadius: [20, 20, 0, 0],
            color: "#4F71FF",
            label: {
              show: true, //开启显示
              position: 'top', //在上方显示
              formatter: (params) => {
                return `${params.value}%`

              },
              textStyle: {
                //数值样式
                color: '#3b6ebf',
                fontSize: 12,
                fontWeight: 400,
              },
            },
          }
        },
        emphasis: {
          label: {
            show: true,
            position: 'top',
            color: '#1890FF'
          }
        }
      },

    ]
  };
  myChart.setOption(option)
  timer = setInterval(function () {
    let str = datas.yData.length
    if (option.dataZoom[0].endValue == str) {
      option.dataZoom[0].startValue = 0;
      option.dataZoom[0].endValue = 7;

    } else {
      option.dataZoom[0].startValue++;
      option.dataZoom[0].endValue++;

    }
    myChart.setOption(option);
  }, 5000)
  window.addEventListener('resize', () => {
    myChart.resize()
  })
  myChart.on("click", (params) => {
    console.log("点击对象", params)
    // name: "TXF3A01" 线体标识 时间
    goNewScreen(params)
  });
}

const goNewScreen = (data: any) => {
  // router.push('/productionDataQuery')
  if (otherwindow && !otherwindow.closed) {
    if (otherwindow.location.search == `?lineCode=${data.name}&date=${selectDate.value}`) {
      otherwindow.focus()
    } else {
      otherwindow = window.open(
        `/productionDataQuery?lineCode=${data.name}&date=${selectDate.value}`, 'productionDataQuery'
      )
    }
  } else {
    otherwindow = window.open(
      `/productionDataQuery?lineCode=${data.name}&date=${selectDate.value}`, 'productionDataQuery'
    )
  }
}
onMounted(() => {
  SearchData()
  // initEcharts()
})
onUnmounted(() => {
  if (timer) clearInterval(timer)
})
</script>

<style scoped lang="less">
.LeftEcharts {
  width: 100%;
  height: 100%;
}
</style>
