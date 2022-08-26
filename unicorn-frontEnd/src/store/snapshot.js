//用来存储撤回前的快照数据
import { defineStore } from 'pinia'
import { deepCopy } from '@/hooks/DeepCopy'
import elStore from './elStore'

export default defineStore('snapshot', {
    state: () => {
        return {
            snapshotData: [], //保存快照的数组
            snapshotIndex: -1, //快照数组的索引
            isSnapshot: false,
        }
    },
    getters: {},
    actions: {
        //利用快照数组更新画布中的数据
        //改变画布数据
        elsChange(snapshotData) {
            elStore().els = snapshotData;
        },

        //撤回操作
        undo() {
            if (this.snapshotIndex > 0) {
                this.snapshotIndex--;
                const data = deepCopy(this.snapshotData[this.snapshotIndex]) || [];
                this.elsChange(data);
            }
        },

        //恢复操作
        redo() {
            if (this.snapshotIndex < this.snapshotData.length - 1) {
                this.snapshotIndex++;
                this.elsChange(deepCopy(this.snapshotData[this.snapshotIndex]));
            }
        },
        //生成新的快照
        recordSnapshot() {
            //添加新的快照
            this.snapshotData[++this.snapshotIndex] = deepCopy(elStore().els);
            //在 undo 过程中，添加新的快照时，要将它后面的快照清理掉
            if (this.snapshotIndex < this.snapshotData.length - 1) {
                this.snapshotData = this.snapshotData.slice(0, this.snapshotIndex + 1);
            }
        },
    }
});
