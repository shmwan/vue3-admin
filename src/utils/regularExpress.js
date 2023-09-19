export function _validForbid(value, number = 255) {
  value = value
    .replace(
      /[`~!@#$%^&*()\+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\+={}|《》？：“”【】、；‘’，。、]/g,
      ''
    )
    .replace(/\s/g, '')
  if (value.length >= number) {
    this.$message({
      type: 'warning',
      message: `输入内容不能超过${number}个字符`
    })
  }
  return value.substring(0, number)
}
export function nameOrganAndPlace(value, number = 255) {
  value = value.replace(/[<>/\\|:"*?]/g, '').replace(/\s/g, '')
  if (value.length >= number) {
    this.$message({
      type: 'warning',
      message: `输入内容不能超过${number}个字符`
    })
  }
  return value.substring(0, number)
}
export function validForbid_teshu(value, number = 255) {
  value = value.replace(/[&]/g, '').replace(/\s/g, '')
  if (value.length >= number) {
    this.$message({
      type: 'warning',
      message: `输入内容不能超过${number}个字符`
    })
  }
  return value.substring(0, number)
}

export function validForbid(value, number = 32) {
  value = value
    .replace(
      /[`~!@#$%^&*()_\-+=<>?:"{}|,./;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘’，。、]/g,
      ''
    )
    .replace(/\s/g, '')
  if (value.length >= number) {
    this.$message({
      type: 'warning',
      message: `输入内容不能超过${number}个字符`
    })
  }
  return value.substring(0, number)
}

export function numAndEns(value) {
  value = value.replace(/[^\w\.\/]/gi, '')
  return value
}
export function Number4(value) {
  value = value.replace(
    /(?:^[1-9]([0-9]+)?(?:\.[0-9]{1,2})?$)|(?:^(?:0)$)|(?:^[0-9]\.[0-9](?:[0-9])?$)/gi,
    ''
  )
  return value
}

export function nums10(value) {
  if (value.substring(0, 1) == '0' && value.length > 1) {
    value = value.substring(1)
  }
  value = value.replace(/[^\d]/g, '')
  if (value > 10) {
    value = 10
  }
  return value
}
export function numsOnePoint10(value) {
  if (value.substring(0, 1) == '0' && value.length > 1) {
    value = value.substring(1)
  }
  value = value.replace(/[^\d.]/g, '')
  value = value.replace(/\.{2,}/g, '.') //只保留第一个. 清除多余的
  value = value.replace(/^(\-)*(\d+)\.(\d).*$/, '$1$2.$3') //只能输入一个小数
  if (value > 10) {
    value = 10
  }
  return value
}

// 整数
export function numMinMax(value, min = 50, max = 1000) {
  value = value.replace(/[^\d]/g, '')

  if (value > max) {
    value = max
  }
  return parseInt(value)
}
