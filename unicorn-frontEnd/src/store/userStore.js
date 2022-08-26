import { defineStore } from 'pinia'
export default defineStore('userStore', {
    //开启数据持久化
    persist: {
        enabled: true
    },
    state: () => {
        return {
            username: ''
        }
    },
    getters: {},
    actions: {}
})