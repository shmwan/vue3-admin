<template>
  <div class="home">
    <a-layout class="home">
      <a-layout-sider v-model:collapsed="collapsed" :trigger="null" collapsible>
        <div class="logo"></div>
        <!-- <a-menu
          v-model:openKeys="openKeys"
          v-model:selectedKeys="selectedKeys" 
          mode="inline" 
          theme="dark" 
          :inline-collapsed="collapsed">
          <a-sub-menu v-for="item in menuList" :key="item.id">
            <template #icon>
              <MailOutlined />
            </template>
            <template #title>{{ item.name }}</template>
            <a-menu-item :key="item2.id" v-for="item2 in item.children" 
            @click="toPath(item2,item)">{{
              item2.name
            }}</a-menu-item>
          </a-sub-menu>
        </a-menu> -->
        <siderBar/>
      </a-layout-sider>
      <a-layout>
        <a-layout-header style="background: #fff; padding: 0">
          <div class="left">
            <menu-unfold-outlined v-if="collapsed" class="trigger" @click="() => (collapsed = !collapsed)" />
            <menu-fold-outlined v-else class="trigger" @click="() => (collapsed = !collapsed)" />
          </div>
          <div class="right">
              <headerVue />
          </div>
        </a-layout-header>
        <a-layout-content :style="{
          margin: '24px 16px',
          padding: '24px',
          background: '#fff',
          minHeight: '280px',
          overflow:'auto'
        }">
          <!-- <Breadcrumb/> -->
          <router-view />
        </a-layout-content>
      </a-layout>
    </a-layout>
  </div>
</template>
<script >
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PieChartOutlined,
  MailOutlined,
  DesktopOutlined,
  InboxOutlined,
  AppstoreOutlined,
} from "@ant-design/icons-vue";
import headerVue from "./header.vue";
import Breadcrumb from "./Breadcrumb.vue";
import { defineComponent, reactive, ref,computed,toRefs } from "vue";
import { storeToRefs } from "pinia";
import { useMenuList } from "@/stores/menu";
import { useOpenKey } from "@/stores/homeKey";
import { useRouter } from "vue-router";
import siderBar from "./siderbar.vue"
export default defineComponent({
  components: {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    PieChartOutlined,
    MailOutlined,
    DesktopOutlined,
    InboxOutlined,
    AppstoreOutlined,
    headerVue,
    Breadcrumb
  },
  setup() {
    const menuStore = useMenuList();
    let menuList2= reactive(
      [{
        "createUser": null,
        "createTime": null,
        "updateUser": null,
        "updateTime": null,
        "isDelete": null,
        "createTimeStr": null,
        "updateTimeStr": null,
        "id": 3,
        "parentId": 0,
        "name": "系统管理",
        "requestUrl": "userManager",
        "requestMethod": null,
        "type": 0, "icon": "xitongguanli",
        "orderNum": null,
        "routerName": "userManager",
        "parentIds": null,
        "children": [
          {
            "createUser": null,
            "createTime": null,
            "updateUser": null,
            "updateTime": null,
            "isDelete": null,
            "createTimeStr": null,
            "updateTimeStr": null,
            "id": 5,
            "parentId": 3,
            "name": "菜单管理",
            "requestUrl": "menu",
            "requestMethod": null,
            "type": 1,
            "icon": "xitongguanli2",
            "orderNum": null,
            "routerName": "menu",
            "parentIds": null,
            "children": null,
          },
          {
            "createUser": null,
            "createTime": null,
            "updateUser": null,
            "updateTime": null,
            "isDelete": null,
            "createTimeStr": null,
            "updateTimeStr": null,
            "id": 6,
            "parentId": 3,
            "name": "用户管理",
            "requestUrl": "user",
            "requestMethod": null,
            "type": 1,
            "icon": "xitongguanli2",
            "orderNum": null,
            "routerName": "user",
            "parentIds": null,
            "children": null,
          }
        ]
      },
      ])
    let datas=reactive({
          menuList:computed(()=>menuStore.getMenuList),
      })
    // 动态获取
    const router = useRouter()

    // 设置openKey
    const stores = useOpenKey();
    const toPath = (item,pItem) => {
      stores.setOpenKeys(pItem.id)
      stores.setSelectedKeys(item.id)
      router.push({ path: '/' + item.requestUrl });
    };
    // 设置菜单打开的问题
    let openKeys = reactive({
      selectedKeys: null,
      openKeys: null
    });
    openKeys.selectedKeys = stores.getSelectedKeys ? [stores.getSelectedKeys] : [Number(sessionStorage.getItem('selectedKeys'))];
    openKeys.openKeys = stores.getOpenKeys ? [stores.getOpenKeys] : [Number(sessionStorage.getItem('openKeys'))];
    return {
      ...toRefs(openKeys),
      collapsed: ref(false),
      ...toRefs(datas),
      toPath
    };
  },
});
</script>
<style lang="less">
.home {
  width: 100%;
  height: 100%;
}

.trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

.trigger:hover {
  color: #1890ff;
}

.logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.3);
  margin: 16px;
}

.site-layout .site-layout-background {
  background: #fff;
}
.ant-layout-header{
  display: flex;
 
  .right{
    width: calc(100% - 66px);
    display: flex;
    justify-content: flex-end;
    box-sizing: border-box;
    padding-right: 30px;
  }
}
</style>