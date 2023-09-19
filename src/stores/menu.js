//定义关于counter的store
import { defineStore } from 'pinia'
import api from '@/api/system/menu.api';
//defineStore 是返回一个函数 函数命名最好有use前缀，根据函数来进行下一步操作
export const useMenuList = defineStore('menu', {
	state: () => ({
		counter:100,
        menuList:[],
	}),
    getters: {
        getMenuList(state) {
          return state.menuList;
        },
        doubleCounter(state) {
            return state.counter * 2
          },
    },
    actions: {
        async setMenuList() {
          try {
           await api.getMenuTree().then(res=>{
                this.menuList = res;
            });
          } catch (error) {
            // 让表单组件显示错误
            return error
          }
        },
        increment(){
            this.counter++
		}
      },
})
