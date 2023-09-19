<template>
  <div class="home">
    <div class="leftSiderBar" :class="{ isCollapse: isOpen }">
      <sider-bar></sider-bar>
    </div>
    <div class="contentCon" :class="{ contentCon1: isOpen }">
      <div class="header">
        <div class="open" @click="handleOpen">
          <el-icon v-if="isOpen" size="24">
            <Expand />
          </el-icon>
          <el-icon v-else size="24">
            <Fold />
          </el-icon>
        </div>
        <header-vue></header-vue>
      </div>
      <div class="content" :class="{ back: isNew, homeCon: isHome }">
        <Breadcrumb v-if="!isHome"></Breadcrumb>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SiderBar from './siderbar.vue'
import headerVue from './header.vue'
import Breadcrumb from './Breadcrumb.vue'
import { Expand, Fold } from '@element-plus/icons-vue'
import { useExpand } from '@/stores/expand'
import { computed, watch } from 'vue'
const stores = useExpand()
import { useRouter } from 'vue-router'
const handleOpen = () => {
  let expand = stores.getExpand
  if (expand) {
    stores.setExpand(false)
  } else {
    stores.setExpand(true)
  }
}
const isOpen = computed(() => {
  return stores.getExpand
})

const router: any = useRouter()
let isNew = false,
  isHome = false
console.log(router.currentRoute)
watch(
  () => router.currentRoute.value.path,
  toPath => {
    //要执行的方法
    isNew = toPath.indexOf('matter') > -1
    isHome = toPath.indexOf('home') > -1 || toPath.indexOf('AiCharts') > -1
    console.log(isHome)
  },
  { immediate: true, deep: true }
)
</script>

<style scoped lang="less">
.home {
  display: flex;
  height: 100%;
  min-height: 100%;
  background: #eee;

  .leftSiderBar {
    width: 250px;
    height: auto;
    background: var(--back);
    transition: width 0.6s;
    min-height: 100%;
    overflow: auto;
  }

  .isCollapse {
    width: 64px;
  }

  .contentCon {
    .header {
      position: relative;
      height: 66px;
      background: #fff;

      .open {
        position: absolute;
        left: 20px;
        top: 50%;
        margin-top: -12px;
        cursor: pointer;
      }
    }

    width: calc(100% - 250px);

    .content {
      margin: 20px 20px 0 20px;
      // background: #fff;
      padding: 20px;
      box-sizing: border-box;
      min-height: calc(100% - 86px);
      overflow: auto;
      height: calc(100% - 86px);
      background: #fff;
    }

    .homeCon {
      padding: 0;
      margin: 0;
      background: url('@/assets/img/home.png') no-repeat center center;
      width: 100%;
      height: 100%;
      background-size: 100% 100%;
    }

    .back {
      background: transparent;
    }

    transition: width 0.6s;
    overflow: hidden;
  }

  .contentCon1 {
    width: calc(100% - 60px);
  }
}
</style>
