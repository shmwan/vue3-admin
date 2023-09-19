<template>
  <div class="LeftEcharts">
    <div class="chartsTitle">
      <div class="titText">产线产能排名</div>
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
import DateUtils from '@/utils/dateUtils.js'
import * as echarts from 'echarts'
const centerCharts = ref()
const { proxy } = getCurrentInstance() as any
let selectDate: any = ref(DateUtils.format(new Date(), 'yyyy-MM-dd'))
interface Datas {
  xData: any
  yData: any
}
const datas: Datas = reactive({
  xData: ['TXF3A01', 'TXF3A01', 'TXF3A01', 'TXF3A01', 'TXF3A01', 'TXF3A01'],
  yData: [45, 75, 85, 60, 55, 80],
})
const dateChange = (dates: any) => {
  selectDate.value = dates
  SearchData()
}
const SearchData = () => {
  let params = {
    time: selectDate.value ? selectDate.value.replace(/-/g, "") : ""
  }
  proxy?.$api.bigScreen.capacity(params).then((res: any) => {
    if (res.code == 200) {
      datas.xData = res.data.xdata
      datas.yData = res.data.ydata
      initEcharts()
    }
  })
}
let timer: any = []
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
    },
    legend: {
      data: [
        {
          name: '达成率'
        }
      ],
      icon: 'rect',
      itemWidth: 13,
      itemHeight: 13,
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
      },
      {
        type: 'value',
        alignTicks: true,
        splitLine: {
          show: false
        },
        axisLabel: {
          color: 'rgba(0, 0, 0, 0.45)'
        }
      }
    ],
    series: [
      {
        yAxisIndex: 0,
        type: 'bar',
        data: datas.yData,
        barMaxWidth: 13,
        itemStyle: {
          normal: {
            borderRadius: [20, 20, 0, 0],
            color: "#4F71FF",
          }
        },
        emphasis: {
          label: {
            show: true,
            position: 'top',
            color: '#1890FF'
          }
        }
      }
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
let otherwindow: any = null
const goNewScreen = (data: any) => {
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
