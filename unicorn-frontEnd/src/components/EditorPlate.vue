<template>
	<div
		class="editorPlate"
		ref="editorPlate"
		@mousedown="changeRectShow"
		@contextmenu.prevent="openMeun"
	>
		<!-- 矩形 -->
		<div
			v-for="(p, index) of useElStore.els[0]"
			:key="p.id"
			:class="`${p.class} ${p.animation}`"
			:style="{
				...styleFormat({ ...p.style }),
			}"
			@mousedown.stop="move($event, p, [0, index])"
			@mouseup="addSnapshot"
		></div>
		<!-- 文本 -->
		<div
			v-for="(p, index) of useElStore.els[1]"
			:key="p.id"
			:class="`${p.class} ${p.animation}`"
			:style="{
				...styleFormat({ ...p.style }),
			}"
			:contenteditable="p.isEditable"
			@mousedown.stop="move($event, p, [1, index])"
			@mouseup="addSnapshot"
			@input="changeText($event, p)"
		>
			{{ p.content }}
		</div>
		<!-- 图片 -->
		<img
			v-for="(p, index) of useElStore.els[2]"
			:key="p.id"
			:class="`${p.class} ${p.animation}`"
			:src="p.url"
			:style="{ ...styleFormat({ ...p.style }) }"
			@mousedown.stop="move($event, p, [2, index])"
			@mouseup="addSnapshot"
		/>
		<!-- 按钮 -->
		<button
			v-for="(p, index) of useElStore.els[3]"
			:key="p.id"
			:class="`${p.class} ${p.animation}`"
			:style="{
				...styleFormat({ ...p.style }, 'btn'),
			}"
			@mousedown.stop="move($event, p, [3, index])"
			@mouseup="addSnapshot"
		>
			<a :style="{ color: p.style.color }" :href="p.other.href">{{
				p.other.content
			}}</a>
		</button>
		<!-- 表单 -->
		<input
			v-for="(p, index) of useElStore.els[4]"
			:key="p.id"
			:class="`${p.class} ${p.animation}`"
			:style="{
				...styleFormat({ ...p.style }),
			}"
			@mousedown.stop="move($event, p, [4, index])"
			@mouseup="addSnapshot"
			:type="p.other.type"
			v-model="p.content"
			:placeholder="p.other.tip"
		/>
		<!-- 矩形选择框 -->
		<div
			class="rect"
			ref="rect"
			@mousedown.stop="changeSize"
			v-show="rectIsShow"
			:style="{
				width: useElStore.rectStyle.style.width + 'px',
				height: useElStore.rectStyle.height + 'px',
				top: useElStore.rectStyle.style.top + 'px',
				left: useElStore.rectStyle.style.left + 'px',
				transform: `rotate(${useElStore.rectStyle.style.rotate}deg)`,
			}"
		>
			<span class="l"></span>
			<span class="b"></span>
			<span class="t"></span>
			<span class="r"></span>
			<span class="lt"></span>
			<span class="lb"></span>
			<span class="rb"></span>
			<span class="rt"></span>
			<span class="rotate" @mousedown.stop="changeRotate"></span>
		</div>
		<!-- 辅助线 -->
		<div
			class="subline"
			v-for="p of sublines"
			:key="p.id"
			:style="{
				left: p.left + 'px',
				top: p.top + 'px',
				width: p.width + 'px',
				height: p.height + 'px',
			}"
		></div>
		<!-- 右键菜单 -->
		<div class="handleBox" ref="handleBox">
			<li
				v-for="(p, index) of handleList"
				:key="index"
				@mousedown.stop="handleMeum($event, index)"
			>
				<i :class="`iconfont ${p.class}`"></i>
				<span>{{ p.name }}</span>
			</li>
		</div>
		<div
			class="constituency"
			:style="{
				left: constituenStyle.left + 'px',
				top: constituenStyle.top + 'px',
				width: constituenStyle.width + 'px',
				height: constituenStyle.height + 'px',
				display: constituenStyle.display,
				cursor: constituenStyle.cursor,
			}"
			@mousedown.stop="moveCons"
		></div>
	</div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import UseMove from "../hooks/UseMove";
import UseChangeSize from "../hooks/UseChangeSize";
import UseRotate from "../hooks/UseRotate";
import UseChangeZIndex from "@/hooks/UseChangeZIndex";
import UseGetSelEls from "@/hooks/UseGetSelEls";
import UseMoveEls from "@/hooks/UseMoveEls";
import elStore from "@/store/elStore.js";
import { v4 as uuidv4 } from "uuid";
import snapshot from "@/store/snapshot";
// import { storeToRefs } from 'pinia'
export default {
  name: "EditorPlate",
  setup() {
    const useElStore = elStore();
    const useSnapshot = snapshot();
    const editorPlate = ref(null);
    const rect = ref(null);
    const handleBox = ref(null);
    // constituen样式
    const constituenStyle = reactive({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      display: "none",
    });

    const handleList = [
      {
        name: "复制",
        class: "icon-fuzhi",
      },
      {
        name: "粘贴",
        class: "icon-niantie",
      },
      {
        name: "剪切",
        class: "icon-jianqie",
      },
      {
        name: "删除",
        class: "icon-shanchutianchong",
      },
      {
        name: "上移一层",
        class: "icon-shangyiyiceng1",
      },
      {
        name: "下移一层",
        class: "icon-xiayiyiceng1",
      },
      {
        name: "置于顶层",
        class: "icon-zhiyudingceng",
      },
      {
        name: "置于底层",
        class: "icon-zhiyudiceng",
      },
    ];

    //选择矩形框现在的位置
    let elsIdx = useElStore.elsIdx;
    //矩形选择框是否出现
    let rectIsShow = ref(false);
    //辅助线属性数组
    let sublines = reactive([]);
    //判断是否是移动操作
    let isMove = ref(false);

		//改变大小
		function changeSize(e) {
			e.preventDefault()
			UseChangeSize(
				e,
				useElStore.els[elsIdx[0]][elsIdx[1]],
				editorPlate.value,
				useElStore.rectStyle,
				elsIdx[1]
			)
		}

    // 定时器 为了判断是双击还是单击
    let timer = null;
    let num = 0;

    //如果是移动代码则触发元素的mouseup事件去添加快照
    function addSnapshot() {
      if (isMove) {
        //移动元素时，获得新的快照
        useSnapshot.recordSnapshot();
      }
      isMove = false;
    }

		//移动代码
		function move(e, p, idx) {
			isMove = true
			if (p.class == 'img') {
				e.preventDefault()
			}
			num++
			if (timer) clearTimeout(timer)
			timer = setTimeout(() => {
				num = 0
			}, 300)
			if (
				elsIdx[0] != -1 &&
				{ ...p }.toString() !=
					{ ...useElStore.els[elsIdx[0]][elsIdx[1]] }.toString()
			) {
				if (useElStore.els[elsIdx[0]][0].class == 'text')
					useElStore.els[elsIdx[0]][elsIdx[1]].isEditable = false
				num = 0
			}
			//判断两次点击的是否是同一个元素 不同更换elsIdx 换掉rectStyle里面的style和height
			//如果是原来点击的是text 则需将text改为不是富文本的状态
			if (elsIdx[0] != idx[0] || elsIdx[1] != idx[1]) {
				elsIdx[0] = idx[0]
				elsIdx[1] = idx[1]
				useElStore.rectStyle.style = p.style
				useElStore.rectStyle.height = e.target.offsetHeight
				if (useElStore.els[elsIdx[0]][0].class == 'text')
					useElStore.els[elsIdx[0]][elsIdx[1]].isEditable = false
				num = 0
			}
			if (p.class == 'text' && num >= 2) {
				p.isEditable = true
				clearTimeout(timer)
			} else {
				UseMove(
					e,
					p,
					editorPlate.value,
					rect.value,
					rectIsShow,
					useElStore.els,
					elsIdx,
					sublines
				)
			}
			//将数据rect.value发送给Operation插件
			useElStore.rectValue = rect.value
			//将数据rect.rectIsShow发送给Operation插件
			useElStore.rectIsShow = rectIsShow
      // 判断是否添加了事件
      judge();
		}

     // 判断是否添加了事件
     function judge() {
        if(elsIdx[0] === -1 || elsIdx[1] === -1) {
            useElStore.judgeIsShow = false
            return;
        }
        if(useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]].link === '') {
            useElStore.judgeIsShow = false
        } else {
            useElStore.judgeIsShow = true;
        }
      }

		//改变文本时也改变内容 改变矩形选择框高度
		function changeText(e, p) {
			e.preventDefault()
			p.content = e.target.innerText
			useElStore.rectStyle.height = e.target.offsetHeight
		}

    //旋转
    function changeRotate(e) {
      e.preventDefault();
      UseRotate(useElStore.els, elsIdx, editorPlate.value);
    }
		let dels = []
		//改变矩形选择框展示状态
		function changeRectShow(e) {
			e.preventDefault()
			num = 0
			if (elsIdx[0] == 1) {
					useElStore.els[elsIdx[0]][elsIdx[1]].isEditable = false
			}
			rectIsShow.value = false
			elsIdx[0] = -1
			elsIdx[1] = -1
			handleBox.value.style.display = 'none'
			constituenStyle.display = 'none'
			UseGetSelEls(e, editorPlate.value, useElStore.els, constituenStyle).then(
				(x) => {
					dels = x
				}
			)
      // 判断是否添加了事件
      judge();
		}

    //样式格式化
    function styleFormat(obj, type) {
      for (let key in obj) {
        if (
          typeof obj[key] == "number" &&
          key != "rotate" &&
          key != "fontWeight" &&
          key != "zIndex"
        )
          obj[key] = obj[key].toString() + "px";
      }
      obj.backgroundImage = `url(${obj.backgroundImage})`;
      obj.transform = `rotate(${obj.rotate}deg)`;
      delete obj.rotate;
      if (type == "btn") obj.lineHeight = obj.height;
      return obj;
    }

    //右键点击菜单时的元素
    let xMeum;
    let yMeum;
    //打开菜单栏
    function openMeun(e) {
      const lis = document.querySelectorAll(".handleBox li");

      if (e.target.className == "editorPlate") {
        for (let i = 0; i < lis.length; i++)
          if (i != 1) lis[i].className = "ban";
      } else {
        for (let i = 0; i < lis.length; i++) lis[i].className = "";
      }

      const fStyle = editorPlate.value.getBoundingClientRect();
      xMeum = e.pageX - fStyle.x;
      yMeum = e.pageY - fStyle.y;
      handleBox.value.style.left = xMeum + "px";
      handleBox.value.style.top = yMeum + "px";
      handleBox.value.style.display = "block";
    }

		let copyEl
		let copyElIdx = new Array(2)
		//操作菜单栏
    function handleMeum(e, index) {
      let eClass = e.target.className == ''
      if (index == 0 && eClass) {
        //复制
        copyEl = useElStore.els[elsIdx[0]][elsIdx[1]]
        copyElIdx[0] = elsIdx[0]
        copyElIdx[1] = elsIdx[1]
      } else if (index == 1 && copyEl) {
        //粘贴
        let tObj = JSON.parse(JSON.stringify(copyEl))
        tObj.id = uuidv4()
        tObj.style.left = xMeum
        tObj.style.top = yMeum
        useElStore.els[copyElIdx[0]].push(tObj)
        // 粘贴之后生成快照
        useSnapshot.recordSnapshot()
      } else if (index == 2 && eClass) {
        //剪切
        copyEl = useElStore.els[elsIdx[0]][elsIdx[1]]
        copyElIdx[0] = elsIdx[0]
        copyElIdx[1] = elsIdx[1]
        useElStore.els[elsIdx[0]].splice(elsIdx[1], 1)
        elsIdx[0] = -1
        elsIdx[1] = -1
        rectIsShow.value = false
        // 剪切之后生成快照
        useSnapshot.recordSnapshot()
      } else if (index == 3 && eClass) {
        //删除
        useElStore.els[elsIdx[0]].splice(elsIdx[1], 1)
        elsIdx[0] = -1
        elsIdx[1] = -1
        rectIsShow.value = false
        // 删除之后生成快照
        useSnapshot.recordSnapshot()
      } else {
        UseChangeZIndex(useElStore.els, elsIdx, index)
      }
      handleBox.value.style.display = 'none'
    }

    //移动选区代码
    function moveCons(e) {
      e.preventDefault();
      UseMoveEls(e, dels, constituenStyle);
    }

    onMounted(() => {
      //编辑区大小
      editorPlate.value.style.width = useElStore.els[5][0]
        ? useElStore.els[5][0]+'px'
        : document.body.clientWidth + "px";
      editorPlate.value.style.height = useElStore.els[5][1]
        ? useElStore.els[5][1]+'px'
        : document.body.clientHeight + "px";
    });
    return {
      editorPlate,
      rectIsShow,
      rect,
      move,
      changeText,
      changeSize,
      changeRotate,
      sublines,
      changeRectShow,
      styleFormat,
      handleList,
      openMeun,
      handleBox,
      handleMeum,
      constituenStyle,
      moveCons,
      useElStore,
      useSnapshot,
      addSnapshot,
    };
  },
};
</script>

<style lang="less" scoped>
.editorPlate {
  position: relative;
  width: 100%;
  box-shadow: 0 0 32px rgba(0, 0, 0, 0.4);
  height: 100%;
  div {
    position: absolute;
    width: 100px;
    word-wrap: break-word;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  a {
    pointer-events: none;
    color: #333;
  }
  input,
  button,
  img {
    position: absolute;
    box-sizing: border-box;
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
  }
  img {
    position: absolute;
  }
  .button {
    text-align: center;
  }
  .el {
    top: 40px;
    left: 200px;
    height: 100px;
    background-color: pink;
  }
  .text {
    padding: 10px;
    box-sizing: border-box;
  }
  .rect {
    position: absolute;
    width: 100px;
    height: 100px;
    border: 1px solid #65a6fa;
    box-sizing: border-box;
    z-index: 888;
    /* 点击上层元素可以穿透 触发下层元素 */
    pointer-events: none;
    span {
      position: absolute;
      display: inline-block;
      width: 14px;
      height: 14px;
      border-radius: 50%;
      border: 1px solid rgba(0, 0, 0, 0.2);
      background-color: #fff;
      pointer-events: auto;
    }
    span:nth-of-type(-n + 4) {
      width: 12px;
      height: 12px;
      border-radius: 0;
      cursor: default;
    }
    .l {
      top: 50%;
      left: -7px;
      transform: translateY(-50%);
      cursor: w-resize;
    }
    .r {
      top: 50%;
      right: -7px;
      transform: translateY(-50%);
      cursor: e-resize;
    }
    .t {
      top: -7px;
      left: 50%;
      transform: translateX(-50%);
      cursor: n-resize;
    }
    .b {
      bottom: -7px;
      left: 50%;
      transform: translateX(-50%);
      cursor: s-resize;
    }

    .lt {
      top: -7px;
      left: -7px;
      cursor: nw-resize;
    }

    .lb {
      bottom: -7px;
      left: -7px;
      cursor: sw-resize;
    }

    .rt {
      top: -7px;
      right: -7px;
      cursor: ne-resize;
    }

    .rb {
      bottom: -7px;
      right: -7px;
      cursor: se-resize;
    }

    .rotate {
      width: 25px;
      height: 25px;
      left: 50%;
      transform: translateX(-50%);
      bottom: -50px;
      border: none;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
      background: #fff url(~@/assets/rotate.svg) no-repeat center center;
      background-size: 16px 16px;
    }
  }
  .subline {
    position: absolute;
    background-color: #fb5127;
  }
  .handleBox {
    position: absolute;
    width: 153px;
    border-radius: 6px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.4);
    font-size: 16px;
    display: none;
    border-radius: 4px;
    z-index: 1000;
    background-color: #fff;
    li {
      position: relative;
      width: 100%;
      height: 50px;
      line-height: 50px;
      border-bottom: 1px solid #d9d9d9;
      list-style: none;
      box-sizing: border-box;
      cursor: pointer;
      i {
        display: inline-block;
        width: 50px;
        height: 50px;
        line-height: 50px;
        text-align: center;
      }
      span {
        display: inline-block;
        width: calc(100% - 50px);
        height: 50px;
        line-height: 50px;
        text-align: center;
      }
    }
    li:hover {
      color: #65a6fa;
    }
    li.ban {
      color: rgb(183, 180, 180);
      cursor: disabled;
    }
  }
  .constituency {
    width: 200px;
    height: 200px;
    position: absolute;
    border: 1px solid rgba(0, 0, 0, 0.5);
    background-color: rgba(0, 0, 0, 0.1);
    z-index: 800;
  }
}
</style>
