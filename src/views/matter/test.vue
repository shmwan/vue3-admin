<template>
  <!--  通过ref获取html元素 宽高必须设置 -->
  <div style="background-color:#fff">
    <div ref="main" style="width: 400px; height: 300px"></div>
    <div ref="echart" style="width: 400px; height: 300px"></div>
  </div>
</template>
<script setup>
import { onMounted, ref, inject } from "vue";
//  按需引入 echarts
import * as echarts from "echarts";
const main = ref() // 使用ref创建虚拟DOM引用，使用时用main.value
let echart = ref()
onMounted(() => {
  init()
})
const init = () => {
  // 基于准备好的dom，初始化echarts实例
  var myChart = echarts.init(main.value, 'null', { width: 400, height: 300 });
  var myNewChart = echarts.init(echart.value, 'null', { width: 400, height: 300 });
  // 指定图表的配置项和数据
  var option = {
    grid: {
      top: 80,
      right: 40,
      bottom: 40,
      left: 40,
      containLabel: true
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0,0,0,.6)",
      borderColor: "rgba(147, 235, 248, 0)",
      textStyle: {
        color: "#FFF",
      },
    },
    legend: {
      itemWidth: 40,
      itemHeight: 40,
      data: [
        {
          name: '达成率',

        },
        {
          name: '环比',
          icon: 'image://' + require('@/assets/img/ringLine.png'),
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
    xAxis: {
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
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
        name: '达成率',
        yAxisIndex: 0,
        type: 'bar',
        data: [45, 75, 85, 60, 55, 80],
        barMaxWidth: 15,
        itemStyle: {
          normal: {
            borderRadius: [20, 20, 0, 0],
            color: "#4F71FF",
            label: {
              show: true, //开启显示
              position: 'top', //在上方显示
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
      {
        name: '环比',
        yAxisIndex: 1,
        type: 'line',
        data: [20, 70, 41, 19, 30, 50],
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
      }
    ]
  };
  let options = {
    grid: {
      top: 80,
      right: 40,
      bottom: 40,
      left: 40,
      containLabel: true
    },
    tooltip: {
      trigger: "axis",
      backgroundColor: "rgba(0,0,0,.6)",
      borderColor: "rgba(147, 235, 248, 0)",
      textStyle: {
        color: "#FFF",
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
    xAxis: {
      data: ['1月', '2月', '3月', '4月', '5月', '6月'],
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
        data: [45, 75, 85, 60, 55, 80],
        barMaxWidth: 15,
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
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option);
  myNewChart.setOption(options);
}
</script>
