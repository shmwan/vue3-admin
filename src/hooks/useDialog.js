let useDialog = () => {
  let visible = ref(false)
  let openDialog = () => {
    visible.value = true
  }
  let closeDialog = () => {
    visible.value = false
  }
  let toggleDialog = () => {
    visible.value = !visible.value
  }
  return {
    visible,
    openDialog,
    closeDialog,
    toggleDialog
  }
}
export default useDialog
