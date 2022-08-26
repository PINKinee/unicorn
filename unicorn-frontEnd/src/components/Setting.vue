<template>
  <a-menu v-model:selectedKeys="current" mode="horizontal">
    <a-menu-item key="attribute" @click="showIndex = 1">
      属性
    </a-menu-item>
    <a-menu-item key="animation" @click="showIndex = 2">
      动画
    </a-menu-item>
     <a-menu-item key="event" @click="showIndex = 3"> 
      事件
    </a-menu-item>
  </a-menu>
  <div class="content">
    <div class="attribute" v-show="showIndex === 1">
      <Attribute></Attribute>
    </div>
    <div class="animation" v-show="showIndex === 2">
      <Animation></Animation>
    </div>
    <div class="event" v-show="showIndex === 3">
      <Event></Event>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import Animation from './Animation.vue'
import Attribute from './Attribute.vue';
import Event from './Event.vue'

export default defineComponent({
  name: 'Setting',
  components: { Animation,  Attribute, Event },
  setup() {
    const current = ref(['attribute']);
    let showIndex = 1;

    return {
      current,
      showIndex,
    };
  },
});
</script>
<style lang="less" scoped>
  .ant-menu-overflow {
    .ant-menu-overflow-item {
    padding: 0 5px;
    }
  }
</style>