<template>
  <div>
    <div ref="pieChart" class="echart-container"></div>
  </div>
</template>

<script setup lang="ts">
  import Highcharts from 'highcharts/highstock'
  import Highcharts3D from 'highcharts/highcharts-3d'
  Highcharts3D(Highcharts)
  const pieChart = ref()
  let dataList = $ref([
    { name: '清点通过', y: 33, color: '#25BD97', h: 30 },
    { name: '清点异常待复核', y: 33, color: '#2451FF', h: 5 },
    { name: '复核异常', y: 33, color: '#EDCC31', h: 5 }
  ])
  const init = () => {
    let random = randomNum(0, dataList.length - 1)
    let data = dataList.map((item, index) => {
      if (index === random) {
        return {
          ...item,
          sliced: true,
          selected: true
        }
      }
      return item
    })
    let num = 0
    let timer = setInterval(() => {
      for (let i = 0; i < dataList.length; i++) {
        if (num == i) {
          dataList[i].h = 30
        } else {
          dataList[i].h = 5
        }
      }
      num++
    }, 3000)
    var each = Highcharts.each,
      round = Math.round,
      cos = Math.cos,
      sin = Math.sin,
      deg2rad = Math.deg2rad
    Highcharts.wrap(
      Highcharts.seriesTypes.pie.prototype,
      'translate',
      function (proceed) {
        proceed.apply(this, [].slice.call(arguments, 1))
        // Do not do this if the chart is not 3D
        if (!this.chart.is3d()) {
          return
        }
        var series = this,
          chart = series.chart,
          options = chart.options,
          seriesOptions = series.options,
          depth = seriesOptions.depth || 0,
          options3d = options.chart.options3d,
          alpha = options3d.alpha,
          beta = options3d.beta,
          z = seriesOptions.stacking
            ? (seriesOptions.stack || 0) * depth
            : series._i * depth
        z += depth / 2
        if (seriesOptions.grouping !== false) {
          z = 0
        }
        each(series.data, function (point) {
          var shapeArgs = point.shapeArgs,
            angle
          point.shapeType = 'arc3d'
          var ran = point.options.h
          shapeArgs.z = z
          shapeArgs.depth = depth * 0.75 + 10
          shapeArgs.alpha = alpha
          shapeArgs.beta = beta
          shapeArgs.center = series.center
          shapeArgs.ran = ran
          angle = (shapeArgs.end + shapeArgs.start) / 2
          point.slicedTranslation = {
            translateX: round(
              cos(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad)
            ),
            translateY: round(
              sin(angle) * seriesOptions.slicedOffset * cos(alpha * deg2rad)
            )
          }
        })
      }
    )
    ;(function (H) {
      H.wrap(Highcharts.SVGRenderer.prototype, 'arc3dPath', function (proceed) {
        // Run original proceed method
        var ret = proceed.apply(this, [].slice.call(arguments, 1))
        ret.zTop = (ret.zOut + 0.5) / 100
        return ret
      })
    })(Highcharts)
    let myChart = Highcharts.chart(pieChart.value, {
      credits: {
        enabled: false
      },
      chart: {
        type: 'pie',
        backgroundColor: 'rgba(0,0,0,0)',
        options3d: {
          enabled: true,
          alpha: 50,
          beta: 0
        },
        events: {
          load: function () {
            console.log('Highcharts.each', this.series[0].points)
            let each = Highcharts.each
            let points = this.series[0].points
            console.log('points', points)
            each(points, (p: any) => {
              p.graphic.attr({
                translateY: -p.shapeArgs.ran
              })
              p.graphic.side1.attr({
                translateY: -p.shapeArgs.ran
              })
              p.graphic.side2.attr({
                translateY: -p.shapeArgs.ran
              })
            })
            console.log('points', points)
          }
        },
        spacingTop: 0,
        spacingLeft: 0,
        spacingRight: 0
      },
      title: {
        text: '',
        floating: true
      },
      tooltip: {
        enabled: false,
        headerFormat: '',
        pointFormat:
          '<span style="color:{point.color}">\u25CF</span> <b> {point.name}</b><br/>' +
          '占比: <b>{point.y}%</b><br/>'
      },
      legend: {
        //图例
        align: 'center', //程度标的目标地位
        layout: 'horizontal',
        verticalAlign: 'bottom', //垂直标的目标地位
        // padding: 10,
        margin: 10,
        bottom: 0,
        itemStyle: {
          cursor: 'pointer',
          color: '#FFFFFF',
          fontWeight: 100,
          backgroundColor: ['#ccc']
        },
        itemHoverStyle: {
          color: '#FFFFFF'
        },
        symbolWidth: 13, //设置为正方形
        symbolHeight: 10,
        symbolRadius: 0,
        itemMarginBottom: -20
      },
      plotOptions: {
        pie: {
          innerSize: 200,
          depth: 70,
          allowPointSelect: true,
          dataLabels: {
            enabled: true,
            distance: -50, //这里注释掉，数字就会在外面，并且有牵引线
            color: '#fff',
            // format: '{point.percentage:.1f}%',
            formatter: function () {
              if (this.point.y == 33) {
                return '0%'
              } else {
                return this.point.y + '%'
              }
            },
            style: {
              fontSize: '13px',
              fontWeight: 'none',
              textOutline: 'none',
              fontFamily: 'SourceHanSansCN',
              top: '50px',
              textAlign: 'left',
              textDecoration: 'center'
            }
          },
          states: {
            inactive: {
              opacity: 1
            }
          },
          showInLegend: true,
          slicedOffset: 10
        }
      },
      series: [
        {
          data: dataList
        }
      ]
    })
  }
  function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }
  onMounted(() => {
    init()
  })
</script>

<style scoped lang="less">
  .echart-container {
    width: 500px;
    height: 500px;
    background-color: #2a2525;
  }
</style>
