//定义关于切换
import { defineStore } from 'pinia'
//defineStore 是返回一个函数 函数命名最好有use前缀，根据函数来进行下一步操作
export const useOpenKey = defineStore('openKey', {
	state: () => ({
        selectedKeys:null,
        openKeys:null,
	}),
    getters: {
        getSelectedKeys(state) {
          return state.selectedKeys;
        },
        getOpenKeys(state) {
            return state.openKeys;
          },
    },
    actions: {
         setSelectedKeys(data) {
          sessionStorage.setItem('selectedKeys', data)
          this.selectedKeys = data
        },
        setOpenKeys(data){
          sessionStorage.setItem('openKeys', data)
          this.openKeys = data
        }
      },
})
