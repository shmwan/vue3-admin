<template>
  <el-button
    :type="type"
    @click="click"
    :disabled="disabled"
    :icon="icon"
    v-has="data.permission"
  >
    <slot name="icon"> </slot>
    <slot>
      {{ text }}
    </slot>
  </el-button>
</template>

<script setup>
  // 引入hooks for Permission
  import { computed, reactive } from 'vue'
  import { useRouterPermission } from '@/hooks/permission'
  const routerPermission = useRouterPermission()
  const props = defineProps({
    hasPermission: {
      type: String,
      default: 'default'
    },
    type: {
      type: String,
      default: 'primary'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    icon: {
      type: Object
    }
  })
  const data = reactive({
    permission: computed(() => {
      if (props.hasPermission == 'default') {
        return 'default'
      } else {
        return routerPermission + ':' + props.hasPermission
      }
    })
  })
  const emit = defineEmits(['click'])
  const click = () => {
    emit('click', 'd')
  }
</script>
<script>
  export default {
    name: 'b-button'
  }
</script>

<style lang="less" scoped></style>
