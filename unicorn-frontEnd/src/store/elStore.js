import { defineStore } from 'pinia'
export default defineStore('mystore', {
    //开启数据持久化
    persist: {
        enabled: true
    },
    state: () => {
        return {
            elDom: '',
            els: [],
            elsIdx: new Array(2).fill(-1), //当前
            rectStyle: { style: {} },
            editorScroll: 0,
            rectValue: null,
            rectIsShow: false,
            maskLayerValue: null,
            judgeIsShow: false,
        }
    },
    getters: {},
    actions: {
        updataEls(newEls) {
            this.els = newEls
        }
    }
})