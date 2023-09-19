//定义关于切换
import { defineStore } from 'pinia'
export const useScoketData = defineStore('scoketData', {
    state: () => ({
        scoketData: null,
        matterCount: null,
    }),
    getters: {
        getScoketData(state) {
            return state.scoketData;
        },
        getMatterCount(state) {
            return state.matterCount;
        },
    },
    actions: {
        setScoketData(data) {
            this.scoketData = data
        },
        setMatterCount(data) {
            this.matterCount = data
        },

    },
})
