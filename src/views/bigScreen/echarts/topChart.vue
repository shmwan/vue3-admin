<template>
  <div style="width: 100%; height: 100%">
    <div ref="echartsTop" class="columnar" style="width: 100%; height: 100%"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, getCurrentInstance } from "vue";
import * as echarts from "echarts";
const { proxy } = getCurrentInstance() as any;
const echartsTop = ref();
let timer: any = "";
interface Props {
  TopData: any;
}
const { TopData } = defineProps<Props>();
let data = { ...TopData };
let chartsList: any = {};
let xData: any = [];
let yData: any = [];
let zData: any = [];
onMounted(() => {
  getChartsData();
});
const getChartsData = () => {
  let params = data;
  console.log(params, "222");
  proxy.$api.bigScreen.lineStatic(params).then((res: any) => {
    if (res.code == 200) {
      res.data.xdata.forEach((item: any, index: any) => {
        xData.push(item + ":00");
      });
      yData = res.data.ydata;
      res.data.xdata.forEach((item: any, index: any) => {
        zData.push("1");
      });
      initEcharts();
    }
  });
};
const initEcharts = () => {
  if (timer) {
    clearInterval(timer);
  }
  const myChart = echarts.init(echartsTop.value);
  let option = {
    backgroundColor: "RGBA(6, 27, 49, 0)",
    color: ["#63caff", "#49beff", "rgb(2,47,87)", "rgb(2,47,87)"],
    grid: {
      top: "5%",
      left: "3%",
      right: "3%",
      bottom: "3%",
      containLabel: true,
    },
    dataZoom: [
      {
        xAxisIndex: 0, // 这里是从X轴的0刻度开始
        show: false, // 是否显示滑动条，不影响使用
        type: "slider", // 这个 dataZoom 组件是 slider 型 dataZoom 组件
        startValue: 0, // 从头开始。
        endValue: 10, // 一次性展示多少个。
      },
    ],
    tooltip: {
      trigger: "axis",
      borderWidth: 0,
      axisPointer: {
        // 坐标轴指示器，坐标轴触发有效
        type: "shadow", // 默认为直线，可选为：'line' | 'shadow'
      },
      textStyle: {
        color: "#fff",
        fontSize: 12,
      },
      backgroundColor: "rgba(17,95,182,0.5)",
      formatter: (params: any) => {
        return `时间：${params[0].name} <br> 过站总数: ${params[0].value}`;
      },
    },
    xAxis: {
      type: "category",
      data: xData,
      splitLine: {
        show: false,
      },
      axisLabel: {
        color: "rgba(179, 188, 187, 1)",
        fontSize: 10,
        interval: "auto", // x轴间距
        // rotate: 30,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          color: "rgba(0, 142, 114, 0.3)",
        },
      },
    },
    yAxis: [
      {
        type: "value",
        name: "",
        nameGap: "30",
        min: 0,
        splitNumber: 6,
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: true,
          fontSize: 10,
          color: "rgba(179, 188, 187, 1)",
        },
        splitLine: {
          lineStyle: {
            color: "rgba(0, 142, 114, 0.1)",
          },
        },
        nameTextStyle: {
          color: "rgba(179, 188, 187, 1)",
          fontWeight: 400,
          fontSize: 24,
        },
      },
    ],
    series: [
      {
        data: yData,
        type: "bar", // 柱图
        barMaxWidth: "auto",
        barWidth: 15,
        itemStyle: {
          color: {
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            type: "linear",
            global: false,
            colorStops: [
              {
                offset: 0,
                color: "rgba(0, 183, 255, 1)",
              },
              {
                offset: 1,
                color: "rgba(34, 68, 172, 0.35)",
              },
            ],
          },
        },
      },
      {
        data: zData,
        type: "pictorialBar", // 底部
        barMaxWidth: "20",
        symbolOffset: [0, "50%"],
        symbolSize: [15, 8],
        itemStyle: {
          color: "rgba(31, 97, 234, 0.5)",
        },
      },
      {
        data: yData,
        type: "pictorialBar", // 顶部
        barMaxWidth: "20",
        symbolPosition: "end",
        symbolOffset: [0, "-50%"],
        symbolSize: [15, 8],
        itemStyle: {
          color: "rgba(33, 243, 255, 1)",
        },
        zlevel: 2,
      },
    ],
  };
  myChart.setOption(option);
  timer = setInterval(function () {
    if (option.dataZoom[0].endValue == yData.length) {
      option.dataZoom[0].endValue = 10;
      option.dataZoom[0].startValue = 0;
    } else {
      option.dataZoom[0].endValue = option.dataZoom[0].endValue + 1;
      option.dataZoom[0].startValue = option.dataZoom[0].startValue + 1;
    }
    myChart.setOption(option);
  }, 2000);
  window.addEventListener("resize", () => {
    myChart.resize();
  });
};
</script>

<style scoped lang="less">
.columnar {
  width: 100%;

  height: 100%;
}
</style>
