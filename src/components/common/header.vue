<template>
  <div class="headerCon">
    <el-tooltip
      class="box-item"
      effect="dark"
      content="返回主界面"
      placement="bottom"
    >
      <el-icon v-if="url" @click="goHome" size="20" class="homeIcon"
        ><House />
      </el-icon>
    </el-tooltip>
    <el-dropdown>
      <div class="showName">
        <el-icon size="20"><UserFilled /></el-icon>
        <span class="name">{{ data.name }}</span>
        <el-icon><CaretBottom /></el-icon>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- <div class="logout">
      <el-dropdown>
        <span class="el-dropdown-link">
          <el-icon><SwitchButton /></el-icon>
        </span>
      </el-dropdown>
    </div> -->
  </div>
</template>

<script lang="ts" setup>
  import { getCurrentInstance, reactive } from 'vue'
  import {
    SwitchButton,
    UserFilled,
    CaretBottom,
    House
  } from '@element-plus/icons-vue'
  import { useRouter } from 'vue-router'
  const { proxy } = getCurrentInstance() as any
  const router = useRouter()
  const url = sessionStorage.getItem('url') // 获取当前页面的URL地址;
  const logout = () => {
    if (url) {
      window.location.href = url
    } else {
      router.push({ path: '/login' })
    }
  }
  const token = sessionStorage.getItem('token')
  const goHome = () => {
    window.location.href = url + '/webSwitch?token=' + token
  }
  let data = reactive({ name: '' })
  const getInfo = () => {
    proxy.$api.login.getInfo().then((res: any) => {
      if (res.code == 200) {
        data.name = res.data.showName
      }
    })
  }
  getInfo()
</script>

<style lang="less" scoped>
  .headerCon {
    display: flex;
    align-items: center;
    position: absolute;
    right: 0;
    height: 100%;
    .homeIcon {
      cursor: pointer;
    }
    .logout {
      margin: 0 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
    }
    .showName {
      cursor: pointer;
      margin: 0 20px;
      display: flex;
      width: 100%;
      align-items: center;
      .name {
        margin: 0 5px;
      }
    }
  }
</style>
