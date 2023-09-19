<template>
  <div class="ControlVue">
    <el-button size="small" @click="$_undo" :disabled="undoDisable">
      <img
        v-if="!undoDisable"
        src="../../../assets/img/logicflow/back.png"
        alt=""
      />
      <img v-else src="../../../assets/img/logicflow/backD.png" alt="" />
    </el-button>
    <el-button size="small" @click="$_redo" :disabled="redoDisable">
      <img
        v-if="!redoDisable"
        src="../../../assets/img/logicflow/next.png"
        alt=""
      />
      <img v-else src="../../../assets/img/logicflow/nextD.png" alt="" />
    </el-button>
    <el-button size="small" @click="$_zoomIn">
      <img src="../../../assets/img/logicflow/big.png" alt="" />
    </el-button>
    <el-button size="small" @click="$_zoomOut">
      <img src="../../../assets/img/logicflow/small.png" alt="" />
    </el-button>
    <el-button size="small" @click="$_zoomReset">
      <img src="../../../assets/img/logicflow/nomarl.png" alt="" />
    </el-button>
    <!-- <el-button size="small" @click="$_translateRest">定位还原</el-button> -->
    <!-- <el-button size="small" @click="$_reset">还原(大小&定位)</el-button> -->
  </div>
</template>
<script>
  export default {
    name: 'Control',
    props: {
      lf: Object || String,
      catTurboData: Boolean
    },
    data() {
      return {
        undoDisable: true,
        redoDisable: true,
        graphData: null,
        dataVisible: false
      }
    },
    watch: {
      lf() {
        this.lf.on('history:change', ({ data: { undoAble, redoAble } }) => {
          this.$data.undoDisable = !undoAble
          this.$data.redoDisable = !redoAble
        })
      }
    },
    mounted() {
      // this.$props.lf.on(
      //   'history:change',
      //   ({ data: { undoAble, redoAble } }) => {
      //     this.$data.undoDisable = !undoAble
      //     this.$data.redoDisable = !redoAble
      //   }
      // )
    },
    methods: {
      $_zoomIn() {
        this.$props.lf.zoom(true)
      },
      $_zoomOut() {
        this.$props.lf.zoom(false)
      },
      $_zoomReset() {
        this.$props.lf.resetZoom()
      },
      $_translateRest() {
        this.$props.lf.resetTranslate()
      },
      $_reset() {
        this.$props.lf.resetZoom()
        this.$props.lf.resetTranslate()
      },
      $_undo() {
        this.$props.lf.undo()
      },
      $_redo() {
        this.$props.lf.redo()
      },
      $_download() {
        this.$props.lf.getSnapshot()
      },
      $_catData() {
        this.$emit('catData')
      },
      $_catTurboData() {
        this.$emit('catTurboData')
      },
      $_showMiniMap() {
        const { lf } = this.$props
        lf.extension.miniMap.show(lf.graphModel.width - 150, 40)
      }
    }
  }
</script>
<style lang="less" scoped>
  .ControlVue {
    margin: 5px auto;
    width: 400px;
  }
</style>
