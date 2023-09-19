<template>
  <div ref="barChart" class="barChart"></div>
</template>

<script setup lang="ts">
  import { formatTime, getMax } from '@/utils/common'
  import * as echarts from 'echarts'

  import 'echarts-liquidfill'
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
    let rate = (item / 100).toFixed(2)
    let option = {
      series: [
        {
          type: 'liquidFill', //水位图
          radius: '80%', //显示比例
          center: ['50%', '50%'], //中心点
          amplitude: 2, //水波振幅
          data: [rate, rate, rate], // data个数代表波浪数
          color: [
            {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(37, 206, 255, 1)'
                },
                {
                  offset: 1,
                  color: 'rgba(60, 145, 255, 1)'
                }
              ],
              globalCoord: false
            }
          ], //波浪颜色
          backgroundStyle: {
            borderWidth: 0, //外边框
            // borderColor: '#23cc72', //边框颜色
            color: 'RGBA(30, 54, 70, 1)' //边框内部填充部分颜色
          },
          label: {
            //标签设置
            position: ['50%', '45%'],
            formatter: item + '%', //显示文本,
            textStyle: {
              fontSize: '16px', //文本字号,
              color: '#fff'
            }
          },
          outline: {
            // show: false
            borderDistance: 0,
            itemStyle: {
              borderWidth: 0,
              borderColor: '#112165'
            }
          }
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
