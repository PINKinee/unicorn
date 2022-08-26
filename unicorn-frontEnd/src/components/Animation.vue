<template>
  <!-- <div class="ant-btns">
    <a-button ref="addBtn">添加动画</a-button>
    <a-button ref="lookBtn">预览动画</a-button>
  </div> -->
  <div class="anift">
    <div v-for="item in list" :key="item.id" class="ani" @click="clickAnimation(item.title)">
        <p class="itemP">{{item.title}}</p>
    </div>
    <div class="cancleAni" @click="cancleAnimation">取消动画</div>
  </div>
</template>

<script>
import elStore from '@/store/elStore.js';
import snapshot from '@/store/snapshot';

export default {
  name: 'Animation',
    setup() { 
        let useElStore = elStore();
        const useSnapshot = snapshot();
    // 动画列表
    const list = [
      {id:1,title:'放大'},
      {id:2,title:'缩小'},
      {id:3,title:'抖动'},
      {id:4,title:'上下移动'},
      {id:5,title:'左右移动'}
    ];
        const clickAnimation = (title) => {
        switch (title){
            case '放大':
                // if (useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].class.match(/animation1/) == null) {
                //     useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].animation = 'animation1';
                // } else {
                //     let reg = new RegExp(/ animation1/);
                //     useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].class=useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].class.replace(reg, '');
                // }
                if (useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].animation == 'animation1') {
                    useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].animation=''
                } else {
                    useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].animation='animation1'
                }
                break;
            case '缩小':
                if (useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].animation == 'animation2') {
                    useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].animation=''
                } else {
                    useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].animation='animation2'
                }
                break;
            case '抖动':
                if (useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].animation == 'animation3') {
                    useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].animation=''
                } else {
                    useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].animation='animation3'
                }
                break;
            case '上下移动':
                if (useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].animation == 'animation4') {
                    useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].animation=''
                } else {
                    useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].animation='animation4'
                }
                break;
            case '左右移动':
                if (useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].animation == 'animation5') {
                    useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].animation=''
                } else {
                    useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].animation='animation5'
                }
                break;
        }
        // 添加动画后，添加快照
        useSnapshot.recordSnapshot()
        }
        // 取消动画
        const cancleAnimation = () => {
            useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].animation = '';
            // 取消动画后，添加快照
            useSnapshot.recordSnapshot()
    }
    return {
        list,
        clickAnimation,
        cancleAnimation
    }
  }
}
</script>

<style lang="less">
    .ant-btns {
        text-align: center;
        margin-top: 20px;
        .ant-btn:nth-child(1) {
            margin-right: 20px;
        }
    }
    .anift{
        display: flex;
        justify-content: space-evenly;
        flex-wrap: wrap;
        flex-direction:row;
        font-size: 16px;
        .ani{
            width: 120px;
            height: 50px;
            margin: 20px 0px;
            line-height: 50px;
            border:1px solid #000;
            text-align: center;
            border-radius: 8px;
            background-color: rgb(74, 157, 235);
            color: aliceblue;
            cursor: pointer;
        }
        .cancleAni{
            position: absolute;
            bottom: 20px;
            width: 200px;
            height: 50px;
            line-height: 50px;
            text-align: center;
            background-color: rgb(232, 58, 58);
            color: #fff;
            border-radius: 8px;
            cursor: pointer;
        }
    }
</style>