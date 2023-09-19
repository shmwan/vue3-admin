<template>
  <div ref="barChart" class="barChart"></div>
</template>

<script setup lang="ts">
  import { formatTime, getMax } from '@/utils/common'
  import * as echarts from 'echarts'
  interface Props {
    data: any
  }
  const props = defineProps<Props>()
  const barChart = ref()
  //
  onMounted(() => {
    console.log(barChart.value)
    getCharts(props.data)
  })
  const getCharts = (item: any) => {
    const myChart = echarts.init(barChart.value)
    let chartData = [
      item.delivery_duration,
      item.charge_duration,
      item.empty_run_duration
    ]
    let option = {
      xAxis: {
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisTick: {
          show: false
        },
        splitArea: { show: false },
        axisLine: {
          show: false
        }
      },
      grid: {
        top: 0,
        bottom: 0,
        left: '5%'
      },
      yAxis: {
        inverse: true,
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#fff',
            padding: [-5, 0, 35, 5]
          },
          rich: {},
          align: 'left'
        },
        data: ['配送', '充电', '空驶']
      },
      series: [
        {
          type: 'bar',
          barWidth: 14,
          data: chartData,
          itemStyle: {
            normal: {
              color: function (params: any) {
                // 给出颜色组
                var colorList = ['#18FFF1', '#44DB57', '#E9CA38']
                return colorList[params.dataIndex]
              }
            }
          },

          z: 1
        },
        {
          type: 'bar',
          barGap: '-100%', // 设置外框粗细
          data: [12 * 60 * 60, 12 * 60 * 60, 12 * 60 * 60],
          barWidth: 15,
          itemStyle: {
            color: 'rgba(53, 115, 252, .2)'
          },
          label: {
            show: true,
            position: 'insideRight',
            distance: 0,
            offset: [0, -15], // 偏移量在阴影中心的偏移量。这个参数也可以是数值或数组
            textStyle: {
              color: '#fff'
            },
            formatter: value => {
              return formatTime(chartData[value.dataIndex])
            },
            rich: {}
          },
          z: 0
        }
      ]
    }
    myChart.setOption(option)
  }
  watch(
    () => props.data,
    data => {
      if (data) {
        console.log(props.data, 'props.data')
        getCharts(props.data)
      }
    },
    { immediate: false, deep: true }
  )
</script>

<style scoped lang="less">
  .barChart {
    width: 100%;
    height: 100%;
  }
</style>
