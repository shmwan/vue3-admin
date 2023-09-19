<template>
  <div>
    <div class="mapCon">
      <div id="map" ref="rootmap"></div>
      <div v-show="popup" class="ol-popup people" ref="userInfo">
        <div class="id">{{ agvData[0].id }}</div>
        <div class="state" :class="agvData[0].status">
          {{ agvData[0].state }}
        </div>
      </div>
      <div v-show="popup" class="ol-popup people" ref="agv2">
        <div class="id">{{ agvData[1].id }}</div>
        <div class="state" :class="agvData[1].status">
          {{ agvData[1].state }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import 'ol/ol.css'
  import ImageLayer from 'ol/layer/Image'
  import Projection from 'ol/proj/Projection'
  import Static from 'ol/source/ImageStatic'
  import { getCenter, applyTransform } from 'ol/extent'
  import TileJSON from 'ol/source/TileJSON'
  // import getPixels from 'get-pixels'
  import Select from 'ol/interaction/Select'
  import { Modify } from 'ol/interaction'
  import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
  import 'ol/ol.css'
  import { Circle as CircleStyle, Fill, Style, Icon, Stroke } from 'ol/style'
  import { Feature, Map, Overlay, View } from 'ol/index'
  import { OSM, Vector as VectorSource } from 'ol/source'
  import { Point, LineString } from 'ol/geom'
  // import easyPlay from '@/components/common/easyPlay.vue'
  import MousePosition from 'ol/control/MousePosition'
  import { defaults as defaultControls } from 'ol/control'
  import { getServerConfigInit } from '@/utils/mock.ts'
  import api from '@/api/AGV/AGV.api'
  // var getPixels = require('get-pixels')

  export default {
    components: {
      // easyPlay
    },
    props: {},
    data() {
      return {
        popup: false,
        overlays: {
          popupIsShow: false,
          userIsShow: false
        },
        map: null,
        vectorLayer: null, // 矢量图层
        gujiLayer: null,
        cameraFeatures: [],
        defFeatures: [],
        userFeatures: [],
        stationFeatures: [],
        userLayer: null,
        gujiSource: null,
        userList: [],
        camerasList: [],
        def: [],
        vedioFlag: false,
        agvData: [
          {
            id: '',
            state: ''
          },
          {
            id: '',
            state: ''
          }
        ],
        defDetil: '',
        offset: {
          x: -24.875900268554688,
          y: -67.57460021972656
        },
        styles: {
          route: new Style({
            // 线的样式
            stroke: new Stroke({
              width: 2,
              color: '#1d606a',
              lineDash: [4, 8]
            })
          }),
          route1: new Style({
            // 线的样式
            stroke: new Stroke({
              width: 2,
              color: '#FFA128',
              lineDash: [4, 8]
            })
          })
        },
        SMTstatus: {
          TES_None: '空闲',
          TES_Blocked: '交管中',
          TES_Running: '执行任务中',
          TES_Error: '异常',
          TES_Cancel: '任务取消',
          TES_Finish: '任务完成',
          TES_Charging: '充电中'
        },
        typeMenu: {
          ROUTER_STATION: 'LY',
          STATION: 'KW',
          CHARGER_STATION: 'CD',
          HOME_STATION: 'DJ'
        },
        lineSource1: {},
        lineLayer1: {}
      }
    },
    watch: {
      imgId: {
        immediate: true,
        handler(n, o) {
          if (n) {
            this.getPicData(n)
          }
        }
      }
    },
    methods: {
      // 根据设置重新生成地图
      async reInit() {
        this.clearCavans()
        let imageUrl = 'imgs/map.png'
        this.pixelX = 1207
        this.pixelY = 1873
        let lx = this.offset.x,
          ly = this.offset.y,
          h = 93.65,
          w = 60.35
        // 根据极维数据做坐标转换
        let floor = {
          coordinateDown: ly,
          coordinateLeft: lx,
          coordinateRight: w + lx,
          coordinateUpper: h + ly
        }
        // console.log(floor);
        const extent = [0, 0, this.pixelX, this.pixelY]
        const dextent = [
          floor.coordinateLeft,
          floor.coordinateDown,
          floor.coordinateRight,
          floor.coordinateUpper
        ]
        new applyTransform(
          dextent,
          function (cr) {
            cr[0] = dextent[0]
            cr[1] = dextent[1]
            cr[2] = dextent[2]
            cr[4] = dextent[2]
            cr[5] = dextent[3]
            cr[7] = dextent[3]
          },
          extent
        )
        this.extent = extent
        console.log(extent)
        const projection = new Projection({
          code: 'xkcd-image',
          units: 'pixels',
          extent: dextent
        })
        let that = this

        // 图层展示
        this.vectorLayer = new VectorLayer({
          source: new VectorSource({
            features: []
          }),
          style: function (feature) {}
        })
        // 集成人员图层
        this.userInfoPopup = new Overlay({
          element: this.$refs.userInfo,
          offset: [0, 0]
          // autoPan: {
          //   animation: {
          //     duration: 250
          //   }
          // }
        })
        this.agv2Popup = new Overlay({
          element: this.$refs.agv2,
          offset: [0, 0]
          // autoPan: {
          //   animation: {
          //     duration: 250
          //   }
          // }
        })

        const view = new View({
          projection: projection,
          center: getCenter(extent),
          zoom: 2,
          maxZoom: 10,
          minZoom: 2
        })
        this.view = view
        const mousePositionControl = new MousePosition({
          className: 'custom-mouse-position',
          target: document.getElementById('mouse-position')
        })
        this.map = new Map({
          controls: defaultControls().extend([mousePositionControl]),
          layers: [
            new ImageLayer({
              source: new Static({
                url: imageUrl,
                projection: projection,
                imageExtent: extent
              })
            }),
            this.vectorLayer
            // clusterCircles
          ],
          overlays: [this.userInfoPopup, this.agv2Popup],
          target: 'map',
          view: view
        })
        // this.userInfo()
        // this.addLayer();
        this.popup = true
        // this.addClick()
      },
      clearCavans() {
        if (this.$refs.rootmap) {
          this.$refs.rootmap.innerHTML = ''
        }
      },
      clear() {
        if (this.map && this.gujiLayer) {
          this.gujiSource.clear()
          this.gujiLayer.getSource().clear()
          // this.map.removeLayer(this.gujiLayer);
          this.gujiLayer = null
        }
      },
      clearUser() {
        if (this.map && this.userLayer) {
          this.userSource.clear()
          this.userFeatures = []
          this.userLayer.getSource().clear()
          // this.map.removeLayer();
          this.userLayer = null
        }
      },
      // 清除clearStationPosition
      clearStationPosition() {
        if (this.map && this.stationLayer) {
          this.stationSource.clear()
          this.stationFeatures = []
          this.stationLayer.getSource().clear()
          // this.map.removeLayer();
          this.stationLayer = null
        }
      },
      // 获取图片像素
      async pixels(imageUrl) {
        return await new Promise(resolve => {
          getPixels(imageUrl, function (err, pixels) {
            if (err) {
              return
            }
            resolve(pixels.shape.slice())
          })
        })
      },
      hidefeature() {
        this.userInfoPopup.setPosition(null)
        this.agv2Popup.setPosition(null)

        this.tagId = null
        this.vedioFlag = false
      },
      // 显示人员
      userInfo(list, type, data) {
        let userList =
          list?.map(item => {
            return {
              status: item.taskStatus,
              state: this.SMTstatus[item.taskStatus],
              id: item.carId,
              position: `${item.position.x},${item.position.y}`
            }
          }) || []
        if (userList.length == 0) {
          return
        }
        this.agvData = userList
        const state = 1
        this.userList = userList
        this.clearUser()
        if (this.map && this.userLayer) {
          return false
        }
        let position1 = userList[0].position.split(',')
        let position2 = userList[1].position.split(',')
        this.userInfoPopup.setPosition(position1)
        this.agv2Popup.setPosition(position2)
        let that = this
        for (let i = 0; i < that.userList.length; i++) {
          const userInfo = that.userList[i]

          if (!userInfo.position) continue
          let user = userInfo.relationInfo
            ? this.JSONPase(userInfo.relationInfo)
            : {}
          // 这里模拟
          const position = userInfo.position.split(',')
          const feature = new Feature({
            type: 'user',
            geometry: new Point(position),
            posi: position
          })
          const styles = new Style({
            image: new Icon({
              anchor: [0.5, 0.5], // 水平和垂直锚点位置都为图标底部中心
              anchorXUnits: 'fraction', // 水平锚点位置相对于图标宽度的比例
              anchorYUnits: 'fraction', // 垂直锚点位置相对于图标高度的比例
              scale: 0.5,
              src: `/imgs/AGV${i}.png`
            })
          })
          feature.setStyle(styles)
          that.userFeatures.push(feature)
        }
        that.userSource = new VectorSource({
          features: that.userFeatures
        })
        that.userLayer = new VectorLayer({
          source: that.userSource,
          zIndex: 10
        })
        that.map?.addLayer(that.userLayer)
      },
      setPosition(list) {
        console.log(userList)
      },
      // 设置站点
      setStationPosition(list) {
        let stationList =
          list?.map(item => {
            return {
              id: item.info.type + item.info.currentSiteIndex,
              position: `${item.info.pose.x},${item.info.pose.y}`
            }
          }) || []
        if (stationList.length == 0) {
          return
        }
        this.clearStationPosition()
        if (this.map && this.stationLayer) {
          return false
        }
        let that = this
        for (let i = 0; i < stationList.length; i++) {
          const Info = stationList[i]

          if (!Info.position) continue
          let user = Info.relationInfo ? this.JSONPase(Info.relationInfo) : {}
          const position = Info.position.split(',')
          const feature = new Feature({
            type: 'station',
            geometry: new Point(position),
            posi: position
          })
          const styles = new Style({
            image: new Icon({
              anchor: [0.5, 0.5], // 水平和垂直锚点位置都为图标底部中心
              anchorXUnits: 'fraction', // 水平锚点位置相对于图标宽度的比例
              anchorYUnits: 'fraction', // 垂直锚点位置相对于图标高度的比例
              scale: 0.6,
              src: `/imgs/point.png`
            })
          })
          feature.setStyle(styles)
          that.stationFeatures.push(feature)
        }
        that.stationSource = new VectorSource({
          features: that.stationFeatures
        })
        that.stationLayer = new VectorLayer({
          source: that.stationSource,
          zIndex: 3
        })
        that.map?.addLayer(that.stationLayer)
      },

      /**
       *获取所有的站点数据
       */
      async getAllPosition() {
        let data = await api.getAllPosition()
        console.log(data, 'data')
        let {
          response: { stationMsgs, segmentMsgs }
        } = data
        this.setStationPosition(stationMsgs)
        this.startLine(segmentMsgs)
        this.stationMsgs = stationMsgs
      },
      // 根据点位画线
      startLine(list) {
        for (let i = 0; i < list.length; i++) {
          let lineList = []
          lineList.push(
            [
              list[i].info.segmentParams.endPoints[0].x,
              list[i].info.segmentParams.endPoints[0].y
            ],
            [
              list[i].info.segmentParams.endPoints[1].x,
              list[i].info.segmentParams.endPoints[1].y
            ]
          )
          this.drawnLine(lineList, 'route')
        }
      },

      drawnLine(lineList, routeStyle, type) {
        // this.clearLine()
        let that = this
        let route = new LineString(lineList)
        let routeFeature = new Feature({
          type: 'route',
          geometry: route
        })
        let gujiSource = new VectorSource({
          features: [routeFeature]
        })
        this.lineSource = gujiSource
        const gujiLayer = new VectorLayer({
          source: gujiSource,
          zIndex: 4,
          style: that.styles[routeStyle]
        })
        this.lineLayer = gujiLayer
        this.map.addLayer(gujiLayer)
      },
      clearLine(index) {
        if (this.map && this.lineLayer1) {
          console.log(this.lineLayer1)
          this.lineSource1['type' + index]?.clear()
          this.lineLayer1['type' + index]?.getSource().clear()
          // this.map.removeLayer(this.gujiLayer);
          this.lineLayer1['type' + index] = null
        }
      },
      drawnLine1(lineList, routeStyle, index) {
        this.clearLine(index)
        let that = this
        let route = new LineString(lineList)
        let routeFeature = new Feature({
          type: 'route',
          geometry: route
        })
        let gujiSource = new VectorSource({
          features: [routeFeature]
        })
        this.lineSource1['type' + index] = gujiSource
        const gujiLayer = new VectorLayer({
          source: gujiSource,
          zIndex: 4,
          style: that.styles[routeStyle]
        })
        this.lineLayer1['type' + index] = gujiLayer
        this.map.addLayer(gujiLayer)
      },
      annimateLine(data) {
        data.forEach((element, index) => {
          if (element.path?.length > 0) {
            this.startLine1(element.path, index)
          } else {
            this.clearLine(index)
          }
        })
      },
      // 根据path 画出线路
      startLine1(path, index) {
        // path = [
        //   'LY33',
        //   'LY32',
        //   'LY31',
        //   'LY30',
        //   'LY29',
        //   'LY28',
        //   'LY27',
        //   'LY26',
        //   'LY25',
        //   'LY24',
        //   'LY23',
        //   'LY22',
        //   'LY58',
        //   'LY7',
        //   'LY57',
        //   'LY56',
        //   'LY2',
        //   'LY55',
        //   'LY63',
        //   'LY46',
        //   'LY47',
        //   'LY66',
        //   'LY53',
        //   'DJ1'
        // ]
        let stationMsgs = this.stationMsgs
        let lineArr = []
        if (stationMsgs) {
          for (let i = 0; i < path.length; i++) {
            let info = path[i]

            for (let j = 0; j < stationMsgs.length; j++) {
              let name =
                this.typeMenu[stationMsgs[j].info.type] +
                stationMsgs[j].info.currentSiteIndex
              if (info == name) {
                lineArr.push([
                  stationMsgs[j].info.pose.x,
                  stationMsgs[j].info.pose.y
                ])
                break
              }
            }
          }
          this.drawnLine1(lineArr, 'route1', index)
        }
      }
      /**
       * 聚合图
       */
    },
    mounted() {
      this.reInit()
      this.getAllPosition()
    }
  }
</script>
<style lang="less" scoped>
  .mapCon {
    width: 100%;
    height: 100%;
    .btnGroup {
      position: absolute;
      z-index: 100;
    }
  }
  #map {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    bottom: 0;
  }
  /*隐藏ol的一些自带元素*/
  .ol-attribution,
  .ol-zoom {
    display: none;
  }
  .layerList {
    position: absolute;
    opacity: 0;
    z-index: 0;
  }
  :deep(.border-box-content) {
    display: flex;
    flex-direction: column !important;
  }
  .staff {
    padding: 10px;
    width: 380px;
    height: auto;
    background: #ffffff;
    border-radius: 2px 2px 2px 2px;
    padding: 10px;
    opacity: 1;
    .goInner {
      top: 10px;
      right: 5px;
      background: transparent;
      height: 20px;
      font-size: 14px;
      font-family: PingFang SC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 16px;
      align-items: center;
    }
  }
  .ol-popup {
    position: absolute;
    background-color: rgba(0, 0, 0, 0);
    // box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    // border-radius: 10px;
    // border: 1px solid #cccccc;
    bottom: 17px;
    left: 50%;
    transform: translateX(-30%);
  }
  .people {
    background: url(@/assets/img/AGV/back.png) no-repeat;
    background-size: 100% 100%;
    width: 118px;
    height: 56px;
    padding: 0 5px;
    .id {
      width: 100%;
      height: 12px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
      height: 20px;
      line-height: 28px;
    }
    .state {
      height: 14px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #1cfff2;
      height: 20px;
      line-height: 28px;
    }
  }
  .esayPlay {
    padding: 2px;
    position: fixed;
    width: 320px;
    height: 180px;
    border-radius: 2px 2px 2px 2px;
    opacity: 1;
    right: 50px;
    top: 20%;
    background: url('../../../assets/img/common/videoBox.png');
    background-size: 100% 100%;
  }
  /deep/.ol-zoom {
    z-index: 1000;
  }
  .TES_None {
    color: #47e557 !important;
  }
  .TES_Blocked {
    color: #ff6e7b !important;
  }
  .TES_Running {
    color: #13f1f1 !important;
  }
  .TES_Error {
    color: #f87957 !important;
  }
  .TES_Cancel {
    color: #c2b498 !important;
  }
  .TES_Finish {
    color: #7ceaf0 !important;
  }
  .TES_Charging {
    color: #0be6ca !important;
  }
</style>
