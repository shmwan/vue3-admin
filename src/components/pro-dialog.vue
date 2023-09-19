<template>
  <el-dialog v-bind="$attrs">
    <!-- <el-scrollbar max-height="400px"> -->
    <slot></slot>
    <!-- </el-scrollbar> -->
    <template #footer>
      <el-button @click="onCancel" v-if="showCancelButton">
        {{ cancelButtonText }}
      </el-button>
      <el-button type="primary" @click="onSubmit" v-if="showSubmitButton">
        {{ submitButtonText }}
      </el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
  interface IProps {
    showCancelButton?: boolean
    showSubmitButton?: boolean
    cancelButtonText?: string
    submitButtonText?: string
  }
  let {
    showCancelButton,
    showSubmitButton,
    cancelButtonText,
    submitButtonText
  } = withDefaults(defineProps<IProps>(), {
    showCancelButton: true,
    showSubmitButton: true,
    cancelButtonText: '取消',
    submitButtonText: '确定'
  })
  let emits = defineEmits(['on-submit', 'on-cancel'])
  let onCancel = () => {
    emits('on-cancel')
  }
  let onSubmit = () => {
    emits('on-submit')
  }
</script>

<style scoped></style>
