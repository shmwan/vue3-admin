<template>
  <div class="pro-form">
    <el-form
      ref="formRef"
      inline
      :model="formModel"
      :rules="rules"
      :label-suffix="visibleLabel ? '' : ':'"
      v-bind="$attrs"
    >
      <!-- <slot v-if="slots.prepend" name="prepend"></slot> -->
      <el-row :gutter="20">
        <el-col
          v-for="{
            label,
            prop,
            options,
            component,
            span,
            ...rest
          } in computedFields"
          :key="prop"
          :span="wrapSpan || span || 4"
        >
          <el-form-item
            :label="visibleLabel ? ' ' : label"
            :prop="prop"
            :class="{ 'el-form-item-empty': visibleLabel }"
          >
            <!-- select,radio,checkbox 有子集 -->
            <template v-if="options && options.length">
              <component
                :placeholder="setPlaceholder({ label, component })"
                :is="getComponentName(component)"
                v-model="formModel[prop]"
                v-bind="rest"
              >
                <template v-if="component === 'select'">
                  <el-option
                    v-for="option in options"
                    :key="option.value"
                    :label="option.label"
                    :value="option.value"
                  ></el-option>
                </template>

                <template v-if="component === 'radio-group'">
                  <el-radio
                    v-for="option in options"
                    :key="option.value"
                    :label="option.value"
                  >
                    {{ option.label }}
                  </el-radio>
                </template>
                <template v-if="component === 'checkbox-group'">
                  <el-checkbox
                    v-for="option in options"
                    :key="option.value"
                    :label="option.value"
                  >
                    {{ option.label }}
                  </el-checkbox>
                </template>
              </component>
            </template>
            <!-- 单个组件 -->
            <component
              v-else
              :placeholder="setPlaceholder({ label, component })"
              :is="getComponentName(component)"
              v-model="formModel[prop]"
              v-bind="rest"
            ></component>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-if="query">
          <el-form-item>
            <el-button type="primary" @click="onQuery" :icon="Search">
              查询
            </el-button>
            <el-button @click="onReset" :icon="Refresh">重置</el-button>
          </el-form-item>
        </el-col>
      </el-row>
      <slot v-if="slots.append" name="append"></slot>
    </el-form>
  </div>
</template>

<script setup lang="ts">
  import { Search, Refresh } from '@element-plus/icons-vue'
  let slots = useSlots()
  let props = withDefaults(
    defineProps<{
      modelValue: any
      fields: any[]
      rules?: any
      query?: boolean
      visibleLabel?: boolean
      wrapSpan?: number | string
    }>(),
    {
      modelValue: {
        // required: true,
        // type: Object,
        default: () => ({})
      },
      fields: () => [],
      rules: () => ({}),
      query: false,
      visibleLabel: false,
      wrapSpan: ''
    }
  )
  let { modelValue, fields, rules, query, visibleLabel, wrapSpan } = props
  let formRef = $ref(null)
  let rangeTypes = ['datetimerange', 'daterange', 'monthrange']
  let computedFields = $computed(() =>
    fields
      .filter(item => !item.hidden)
      .map(item => ({ ...item, clearable: true }))
  )
  let flatFields = $computed(() => {
    return fields.reduce((result, item) => {
      if (item.groups) {
        item.groups.forEach(group => {
          result.push(group)
        })
      } else {
        result.push(item)
      }
      return result
    }, [])
  })
  let emits = defineEmits(['update:modelValue', 'on-query', 'on-reset'])
  let formModel = $ref({})
  let newModelValue = $ref({})
  let hasDateRange = flatFields.some(item => rangeTypes.includes(item.type))
  let setValueByPath = (obj, path, value) => {
    const pathArr = path.split('.')
    const lastKeyIndex = pathArr.length - 1
    obj = pathArr.reduce((acc, cur, index) => {
      if (index === lastKeyIndex) {
        acc[cur] = value
      } else if (!acc[cur]) {
        acc[cur] = {}
      }
      return acc[cur]
    }, obj)
    return obj
  }

  watch(
    () => props.modelValue,
    newVal => {
      Object.entries(newVal).forEach(([key, value]) => {
        if (hasDateRange && Array.isArray(value)) {
          let propsMap = flatFields.find(item => item.prop === key)['propsMap']
          let startPorp = propsMap[0]
          let endPorp = propsMap[1]
          newModelValue[startPorp] = value[0] || ''
          newModelValue[endPorp] = value[1] || ''
          formModel[key] = value
          // setValueByPath(newModelValue, startPorp, (value && value[0]) || '')
          // setValueByPath(newModelValue, endPorp, (value && value[1]) || '')
          // setValueByPath(formModel, key, value)
        } else {
          // newModelValue[key] = value
          // formModel[key] = value
          setValueByPath(newModelValue, key, value)
          setValueByPath(formModel, key, value)
        }
      })
      emits('update:modelValue', newModelValue)
    },
    { deep: true, immediate: true }
  )

  watch(
    () => formModel,
    newVal => {
      Object.entries(newVal).forEach(([key, value]) => {
        // 日期范围组件的值为null时，转换成空数组
        let computedValue = value === null ? [] : value
        if (hasDateRange && Array.isArray(computedValue)) {
          let currentItem = flatFields.find(item => item.prop === key)
          let propsMap = currentItem['propsMap']
          let startPorp = propsMap[0]
          let endPorp = propsMap[1]
          // newModelValue[startPorp] = (value && value[0]) || ''
          // newModelValue[endPorp] = (value && value[1]) || ''
          newVal[startPorp] = (value && value[0]) || ''
          newVal[endPorp] = (value && value[1]) || ''
          // setValueByPath(newVal, startPorp, (value && value[0]) || '')
          // setValueByPath(newVal, endPorp, (value && value[1]) || '')
        } else {
          // newModelValue[key] = value
          setValueByPath(newModelValue, key, value)
        }
      })
      emits('update:modelValue', newModelValue)
    },
    { deep: true }
  )

  let setPlaceholder = ({ label, component, placeholder }) => {
    if (['select', 'radio', 'checkbox'].includes(component)) {
      return placeholder || `请选择${label}`
    }
    return placeholder || `请输入${label}`
  }
  let getComponentName = component => {
    return resolveComponent(`el-${component}`)
  }

  let onQuery = () => {
    emits('on-query')
  }
  let onReset = () => {
    emits('on-reset')
  }

  let validate = async () => {
    return new Promise(resolve => {
      formRef.validate(valid => {
        if (valid) {
          resolve(valid)
        }
      })
    })
  }
  let resetFields = () => {
    return new Promise(resolve => {
      formRef.resetFields()
      resolve(true)
    })
  }
  let clearValidate = () => {
    return new Promise(resolve => {
      formRef.clearValidate()
      resolve(true)
    })
  }

  defineExpose({
    validate,
    resetFields,
    clearValidate
  })
</script>

<style lang="less" scoped>
  .pro-form {
    .el-form {
      :deep(.el-form-item) {
        display: flex;
        margin-right: 0;
        &.el-form-item-empty {
          .el-form-item__label {
            padding: 0;
            width: 0;
          }
        }
      }
    }
  }
</style>
