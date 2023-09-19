<template>
  <div class="logo"></div>
  <el-menu
    active-text-color="var(--activeTxt)"
    background-color="var(--back)"
    class="el-menu-vertical-demo"
    :default-active="onRoutes"
    text-color="var(--colorTxt)"
    :collapse="isCollapse"
    :unique-opened="true"
    router
  >
    <div class="titleCon" :class="{ titleConAct: isCollapse }">
      <p v-if="!isCollapse">
        <img src="../../assets/img/logo.png" alt="" class="" />
        智能视觉生产管理系统
      </p>
      <p v-if="isCollapse">
        <img src="../../assets/img/logo.png" alt="" class="LogoImg" />
      </p>
    </div>
    <div v-for="(item, index) in menuList2" :key="index">
      <el-sub-menu v-if="item.type == 0" :index="item.requestUrl">
        <template #title>
          <i class="iconFont" :class="item.icon"></i>
          <!-- <svg-icon :class="item.icon"></svg-icon> -->
          <span>{{ item.name }}</span>
        </template>
        <el-menu-item
          v-for="(item2, index2) in item.children"
          :key="index2"
          :index="item2.requestUrl"
        >
          {{ item2.name }}
        </el-menu-item>
      </el-sub-menu>
      <el-menu-item v-if="item.type == 1" :index="item.requestUrl">
        <template #title>
          <i class="iconFont" :class="item.icon"></i>
          <!-- <svg-icon :class="item.icon"></svg-icon> -->
          <span>{{ item.name }}</span>
        </template>
      </el-menu-item>
    </div>
  </el-menu>
</template>

<script lang="ts" setup>
  import { Menu as IconMenu, Location } from '@element-plus/icons-vue'
  import { computed, reactive } from 'vue'
  import { useRoute } from 'vue-router'
  import { useMenuList } from '@/stores/menu'
  import { useExpand } from '@/stores/expand'
  const expand = useExpand()
  const router: any = useRoute

  const onRoutes = computed(() => {
    return router().fullPath.replace('/', '')
  })
  const isCollapse = computed(() => {
    return expand.getExpand
  })
  const menuStore = useMenuList()
  console.log(menuStore)
  // let menuList2:any= reactive(
  //       [{
  //         "createUser": null,
  //         "createTime": null,
  //         "updateUser": null,
  //         "updateTime": null,
  //         "isDelete": null,
  //         "createTimeStr": null,
  //         "updateTimeStr": null,
  //         "id": 3,
  //         "parentId": 0,
  //         "name": "系统管理",
  //         "requestUrl": "userManager",
  //         "requestMethod": null,
  //         "type": 0, "icon": "xitongguanli",
  //         "orderNum": null,
  //         "routerName": "userManager",
  //         "parentIds": null,
  //         "children": [
  //           {
  //             "createUser": null,
  //             "createTime": null,
  //             "updateUser": null,
  //             "updateTime": null,
  //             "isDelete": null,
  //             "createTimeStr": null,
  //             "updateTimeStr": null,
  //             "id": 5,
  //             "parentId": 3,
  //             "name": "字典管理",
  //             "requestUrl": "diction",
  //             "requestMethod": null,
  //             "type": 1,
  //             "icon": "xitongguanli2",
  //             "orderNum": null,
  //             "routerName": "diction",
  //             "parentIds": null,
  //             "children": null,
  //           },
  //           {
  //             "createUser": null,
  //             "createTime": null,
  //             "updateUser": null,
  //             "updateTime": null,
  //             "isDelete": null,
  //             "createTimeStr": null,
  //             "updateTimeStr": null,
  //             "id": 6,
  //             "parentId": 3,
  //             "name": "基础数据管理",
  //             "requestUrl": "MaterialInfo",
  //             "requestMethod": null,
  //             "type": 1,
  //             "icon": "xitongguanli2",
  //             "orderNum": null,
  //             "routerName": "user",
  //             "parentIds": null,
  //             "children": null,
  //           },
  //           {
  //             "createUser": null,
  //             "createTime": null,
  //             "updateUser": null,
  //             "updateTime": null,
  //             "isDelete": null,
  //             "createTimeStr": null,
  //             "updateTimeStr": null,
  //             "id": 7,
  //             "parentId": 3,
  //             "name": "供应商管理",
  //             "requestUrl": "SupplierInfo",
  //             "requestMethod": null,
  //             "type": 1,
  //             "icon": "xitongguanli2",
  //             "orderNum": null,
  //             "routerName": "user",
  //             "parentIds": null,
  //             "children": null,
  //           },
  //         ]
  //       },
  //       ])

  let menuList2: any[] = []
  let menuList: any = computed(() => {
    return menuStore.getMenuList
  })
  if (menuList) {
    menuList2 = menuList
  }
</script>

<style lang="less" scoped>
  .el-menu {
    border-right: 0;
  }

  .iconFont {
    margin-right: 5px;
  }

  .titleCon {
    height: 65px;
    width: 250px;
    text-align: center;
    background: rgba(64, 71, 110, 1);
    transition: width 1s;

    p {
      width: 100%;
      opacity: 1;
      font-size: 18px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: center;
      color: #f3f4fa;
      line-height: 65px;
      letter-spacing: 1px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .titleConAct {
    width: 64px;
    transition: width 1s;
  }

  :deep(.is-opened) {
    .el-submenu__title {
      color: var(--colorTxt);
    }
  }

  :deep(.el-submenu__title) {
    color: var(--colorTxt);
    background: #40476e;

    i {
      color: var(--colorTxt);
    }
  }

  :deep(.el-submenu__title:hover) {
    background: var(--activeBg);
    color: var(--activeTxt);

    i {
      color: var(--activeTxt);
    }
  }

  :deep(.el-submenu__title:hover) {
    background: var(--activeBg);
    color: var(--activeTxt);

    i {
      color: var(--activeTxt);
    }
  }
  :deep(.el-menu-item) {
    color: var(--colorTxt) !important;
    background: var(--back) !important;
  }
  :deep(.el-menu-item:hover) {
    background: var(--hoverBg) !important;
    color: var(--hoverColor) !important;
  }

  :deep(.el-menu-item.is-active) {
    background: var(--activeBg) !important;
    color: var(--activeTxt) !important;
  }
  :deep(.el-menu) {
    background: var(--back);
  }

  .LogoImg {
    margin-top: 20px;
  }
</style>
