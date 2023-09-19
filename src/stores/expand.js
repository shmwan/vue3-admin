//定义关于切换
import { defineStore } from 'pinia'
export const useExpand = defineStore('expand', {
	state: () => ({
        isExpand:false,
	}),
    getters: {
        getExpand(state) {
          return state.isExpand;
        },
    },
    actions: {
        setExpand(data) {
          this.isExpand = data
        },
       
      },
})
