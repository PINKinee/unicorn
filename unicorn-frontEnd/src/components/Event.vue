<template>
  <div class="container">
    <div
    v-for="item in eventList"
    :key="item.id"
    :class="item.class"
    @click="appearBox()"
    >
        {{item.content}}
    </div>
  </div>
  <div class="tooltip" v-show="useElStore.judgeIsShow" >
    <div class="tip">
    已添加点击事件
    </div>
    <div class="delete" @click="deleteLink()">
        ×
    </div>
  </div>
</template>

<script>
import elStore from '@/store/elStore';

export default {
    name: 'Event',
    setup() {
        const useElStore = elStore();
        const eventList = [
            { id: 1, class: 'addClick', content: '添加点击事件', link: 'clickLink'},
        ]

        function appearBox() {
            useElStore.maskLayerValue.style.display =  'block';
        }

        function deleteLink() {
            useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].link = '';
            useElStore.judgeIsShow = false;
        }
         
        return {
            appearBox,
            useElStore,
            deleteLink,
            eventList,
        }
    }
}
</script>

<style lang="less" scoped>
    .container {
        width: 235px;
        margin: 0 auto;
        margin-top: 30px;
        display: flex;
        justify-content: center;
        .addClick {
            width: 110px;
            height: 35px;
            line-height: 35px;
            text-align: center;
            border: 1px solid #1890ff;
            color: #1890ff;
            font-size: 1;
            border-radius: 4px;
            cursor: pointer;
            &:hover {
                background-color: #1890ff;
                border: 1px solid #1890ff;
                color:#fff
            }
        }
    }
    .tooltip {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
        padding: 0 30px;
        .tip {
            width: 130px;
        }
        .delete {
            line-height: 26px;
            font-size: 18px;
            cursor: pointer;
        }
    }
</style>