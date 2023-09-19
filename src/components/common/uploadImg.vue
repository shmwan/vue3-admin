<template>
  <div class="avatar-uploader">
    <el-upload
      class="avatar-uploader"
      :show-file-list="false"
      :disabled="disabledType"
      :before-upload="beforeUploadForm"
      :auto-upload="false"
      :on-remove="handleRemove"
      accept=".png,.jepg,.jpg"
      ref="excelUploadRef"
      :on-change="handleChange"
    >
      <img v-if="imagesURL" :src="imagesURL" class="avatar" />
      <div class="upImgBox" v-else>
        <el-icon class="avatar-uploader-icon">
          <Plus />
        </el-icon>
        <div>{{ imgUpText }}</div>
      </div>
    </el-upload>
    <div class="upImgText">
      {{ imgText }}
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch, getCurrentInstance } from 'vue'
  import { Plus } from '@element-plus/icons-vue'
  import { ElMessage, ElLoading, configProviderContextKey } from 'element-plus'
  import { fileUpload } from '@/utils/fileUpload.js'
  const { proxy } = getCurrentInstance() as any
  const $t = proxy.$t
  interface Props {
    imageUrl?: string // 回显图片地址
    action?: string //   上传地址
    imgText?: string //   文字可以不传
    imgUpText?: string // 上传按钮的文字
    disabledType?: boolean // 是否禁用上传
  }
  const props = withDefaults(defineProps<Props>(), {
    imageUrl: '',
    action: '/file/minio/upload/file',
    imgText: '',
    imgUpText: '',
    disabledType: false
  })
  const imagesURL = ref<string>(props.imageUrl)
  const emits = defineEmits(['fileDetail'])
  const beforeUploadForm = (file: any) => {
    console.log('object', file)
    if (
      file.type !== 'image/jpeg' &&
      file.type !== 'image/png' &&
      file.type !== 'image/jpg'
    ) {
      ElMessage.error($t('lang.common.plzSupport'))
      return false
    }
    // if (file.size / 1024 / 1024 > 2) {
    //   ElMessage.error('图片文件大小不能超过2MB!')
    //   return false
    // }
  }
  const handleChange = (param: any, UploadFiles: any) => {
    console.log(param, '1')
    console.log(UploadFiles, '2')

    let rawFile = param.raw

    let formData = new FormData()

    formData.append('file', rawFile)
    // formData.append('fileType', '1')
    formData.append(
      'bucketName',
      config().bucketName ? config().bucketName : 'test'
    )
    const loadingInstance = ElLoading.service({
      text: $t('lang.common.loading'),
      background: 'rgba(0,0,0,.2)'
    })
    // 请求接口上传图片到服务器
    let requestURL = props.action
    fileUpload(formData).then((res: any) => {
      loadingInstance.close()
      if (res.code == 200) {
        //   this.fileList.push(res.filePath);
        let obj = {
          imageUrl: config().imgBaseUrl + res.data.filePath,
          fileName: param.raw.name,
          fileUrl: res.data.filePath
        }
        emits('fileDetail', obj)
        imagesURL.value = config().imgBaseUrl + res.data.filePath
      } else {
        loadingInstance.close()
        ElMessage.warning(res.message)
      }
    })
  }
  const handleRemove = () => {}
  watch(
    () => props.imageUrl,
    () => {
      if (props.imageUrl) {
        imagesURL.value = config().imgBaseUrl + props.imageUrl
      } else {
        imagesURL.value = ''
      }
    }
  )
</script>

<style lang="less" scoped>
  :deep(.avatar-uploader) {
    .avatar {
      width: 104px;
      height: 104px;
      display: block;
    }

    .el-upload {
      border: 1px dashed #dcdfe6;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: 0.2s;
      background: rgba(0, 0, 0, 0.04) !important;
    }

    .el-upload:hover {
      border-color: #14b194;
    }
  }

  .el-icon.avatar-uploader-icon {
    font-size: 16px;
    color: rgba(0, 0, 0, 0.45);
    text-align: center;
  }

  .upImgBox {
    width: 104px;
    height: 104px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    text-align: center;
    padding-top: 24px;
    box-sizing: border-box;
  }

  .upImgText {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.6);
    margin-top: 4px;
  }
</style>
