<template>
  <el-upload
    class="upload-demo"
    action="1"
    :before-upload="beforeRemove"
    :http-request="requestFile"
    :show-file-list="false"
  >
    <el-button type="primary">文件上传</el-button>
  </el-upload>
</template>
<script lang="ts" setup>
  import { ref } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import type { UploadProps, UploadUserFile } from 'element-plus'
  const beforeRemove = (uploadFile: any) => {
    console.log(uploadFile)
    return true
  }
  const requestFile = async (fileObj: any) => {
    let { file } = fileObj
    const chunkSize = 1024 * 1024 * 1 //1MB
    const totalChunks = Math.ceil(file.size / chunkSize)
    const chunks = []
    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize
      const end = Math.min(start + chunkSize, file.size)
      const chunk = file.slice(start, end)
      chunks.push(chunk)
    }
    for (let i = 0; i < chunks.length; i++) {
      const formData = new FormData()
      formData.append('chunk', chunks[i])
      formData.append('filename', file.name)
      formData.append('totalChunks', totalChunks.toString())
      formData.append('currentChunk', (i + 1).toString())
    }

    JSON.stringify
  }
</script>
