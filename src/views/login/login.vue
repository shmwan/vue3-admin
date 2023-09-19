<template>
  <canvas id="canvas"> </canvas>
  <div class="logo">
    <img src="/src/assets/img/login/logo.png" alt="" class="logoImg" />
    <div class="logoText">
      <div class="chinese">智能视觉生产管理系统</div>
      <div class="english">Intelligent Visual Production Management System</div>
    </div>
  </div>
  <div class="contentBox">
    <div class="leftImg">
      <img src="/src/assets/img/login/left.png" alt="" />
    </div>
    <div class="formBox">
      <div class="form">
        <div class="loginForm">
          <div class="title">欢迎登录</div>
          <el-input
            v-model="modelRef.name"
            @keydown.enter="onSubmit"
            placeholder="用户名"
          >
            <template #prefix>
              <img src="/src/assets/img/login/user.png" alt="" />
            </template>
          </el-input>
          <!-- <el-input placeholder="请输入用户名" v-model="modelRef.name" /> -->
          <el-input
            v-model="modelRef.password"
            type="password"
            placeholder="密码"
            show-password
            @keydown.enter="onSubmit"
          >
            <template #prefix>
              <img src="/src/assets/img/login/pwd.png" alt="" />
            </template>
          </el-input>
          <!-- <el-input
          type="password"
          placeholder="请输入密码"
          show-password
          @keydown.enter="onSubmit"
          v-model="modelRef.password"
        /> -->
          <buttonVue type="primary" @click="onSubmit">登 录</buttonVue>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import '@/assets/login/css.css'
  import { bg } from '@/assets/login/login.js'
  import { reactive, toRaw, getCurrentInstance, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useMenuList } from '@/stores/menu.js'
  import { useCallback } from '@/hooks/useCallback'
  import { ElMessage } from 'element-plus'
  const { proxy } = getCurrentInstance() as any
  onMounted(() => {
    bg()
  })
  const router = useRouter()
  interface LoginForm {
    name: string
    password: string
  }
  interface SubFrom {
    modelRef: LoginForm
  }
  const modelRef = reactive<LoginForm>({
    name: '',
    password: ''
  })
  const login = (modelRef: any) => {
    let pwd = encryptByDES(modelRef.password, 'sihuatech')
    const systemCode = config().systemCode || 'XCTX_MATTER'
    proxy.$api.login
      .login({
        username: modelRef.name,
        password: pwd,
        systemCode
      })
      .then((res: any) => {
        const flag = useCallback(res, '登录成功！')
        if (!flag) return
        sessionStorage.setItem('token', res.data)
        router.push({ path: '/home' })
      })
  }
  const onSubmit = () => {
    if (modelRef.name == '') {
      ElMessage({
        message: '请输入用户名!',
        type: 'error'
      })
      return false
    }
    if (modelRef.password == '') {
      ElMessage({
        message: '请输入密码！',
        type: 'error'
      })
      return false
    }
    login(modelRef)
  }
  // 加密
  const encryptByDES = (message: any, key: any) => {
    const keyHex = CryptoJS.enc.Utf8.parse(key)
    const encrypted = CryptoJS.DES.encrypt(message, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    })
    return encrypted.toString()
  }
</script>
<style scoped lang="less">
  .formBox {
    width: 438px;
    height: 320px;
    background-color: #050c19;
    position: relative;
    .form {
      width: 504px;
      height: 406px;
      background: url(/src/assets/img/login/right.png) no-repeat center center;
      background-size: 100% 100%;
      position: absolute;
      top: -80px;
      left: -30px;
      display: flex;
      align-items: center;
      justify-content: center;
      .loginForm {
        width: 300px;
        height: 250px;
        .title {
          font-size: 24px;
          font-family: PingFang SC;
          font-weight: 400;
          color: #ffffff;
          text-align: center;
          margin: 40px 0 30px 0;
        }
      }
    }
  }

  .logo {
    height: 53px;
    width: 400px;
    position: absolute;
    top: 55px;
    left: 65px;
    // display: block;
    display: flex;
    // display: block;
    .logoImg {
      width: 59px;
      height: 52px;
    }
    .logoText {
      height: 100%;
      color: #fff;
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
      .chinese {
        font-size: 30px;
        font-family: PingFang SC;
        font-weight: 400;
        color: #ffffff;
      }
      .english {
        font-size: 12px;
        font-family: PingFang SC;
        font-weight: 100;
        color: #d8d8d8;
      }
    }
  }
  .contentBox {
    width: 100%;
    height: calc(100% - 120px);
    position: absolute;
    top: 120px;
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    .leftImg {
      width: 600px;
      img {
        width: 620px;
      }
    }
  }
  :deep(.el-input__wrapper) {
    background: rgba(33, 116, 243, 0.34);

    border-radius: 4px;
    border: 1px solid #2174f3;
    box-shadow: none;
    border-radius: 0;
    margin-bottom: 25px;

    .el-input__inner {
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 400;
      color: #ffffff;
      height: 35px;
    }

    .el-input__inner::placeholder {
      color: #909090;
    }

    .el-input .el-input__password {
      color: #fff;
    }
  }
  :deep(.el-button--primary) {
    width: 100%;
    height: 35px;
    background-color: #1890ff;
    border: 1px soli #1890ff;
  }
</style>
