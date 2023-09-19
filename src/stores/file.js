//定义关于counter的store
import { defineStore } from 'pinia'
//defineStore 是返回一个函数 函数命名最好有use前缀，根据函数来进行下一步操作
export const useProgress = defineStore('file', {
	state: () => ({
    progressList: [],
    progress: {}
	}),
  getters: {
    get_progress(state) {
      return state.progress;
    },
    GET_PROGRESS(state) {
      return state.progressList;
    },
    GET_ONCE_PROGRESS(state) {
      return state.onceProgress;
    },
  },
  actions: {
    setProgress(data) {
      this.progress = data;
    },
    SET_PROGRESS(progressObj) { // 修改进度列表
      if(this.progressList.length){ // 如果进度列表存在
        if(this.progressList.find(item=>item.id == progressObj.id)){ // 前面说的path时间戳是唯一存在的，所以如果在进度列表中找到当前的进度对象\
            this.progressList.find(item=>item.id == progressObj.id).progress = progressObj.progress // 改变当前进度对象的progress
            // this.progressList.find(item=>item.id == progressObj.id).status = progressObj.status // 改变当前进度对象的status
            // this.progressList.find(item=>item.id == progressObj.id).speed = progressObj.speed // 改变当前进度对象的speed
        }else{
            this.progressList.push(progressObj) // 当前进度列表为空，没有下载任务，直接将该进度对象添加到进度数组内
        }
    }else{
        this.progressList.push(progressObj) // 当前进度列表为空，没有下载任务，直接将该进度对象添加到进度数组内
      }
    },
 },
})
