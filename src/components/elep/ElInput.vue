<template>
  <oel-input v-model="innerValue" v-bind="$attrs">
    <template #[slotName]="slotProps" v-for="(slot, slotName) in $slots">
      <slot :name="slotName" v-bind="slotProps" />
    </template>
  </oel-input>
</template>

<script setup lang="ts">
  import { validForbid_teshu } from '@/utils/regularExpress.js'
  const props = defineProps(['modelValue'])
  const emits = defineEmits(['update:modelValue'])
  let innerValue = computed({
    get() {
      return props.modelValue
    },
    set(value) {
      emits('update:modelValue', validForbid_teshu(value))
    }
  })
</script>

<style scoped></style>
