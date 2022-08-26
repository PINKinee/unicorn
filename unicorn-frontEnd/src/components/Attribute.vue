<template>
  <div
    v-for="item in AttriList"
    :key="item.id"
    :class="item.entitle"
    v-show="!(item.id == 2 && (elClass == 'img' || elClass == 'text'))"
  >
    <span>{{ item.title }}：</span>
    <a-input-number
      @change="changeElProps(item.id)"
      v-model:value="el.style[item.entitle]"
      class="input"
    />
    <span>px</span>
  </div>
  <div class="border">
    <span>边框：</span><br />
    <div class="border-info">
      <div class="cuxi">
        <span>粗细：</span>
        <a-input-number
          v-model:value="el.style.borderWidth"
          class="input"
        />px<br />
      </div>
      <div class="yanse">
        <span>颜色：</span>
        <input type="color" class="color" v-model="el.style.borderColor" />
      </div>
      <div class="fengge">
        <span>风格：</span>
        <a-space class="select">
          <a-select
            ref="select"
            v-model:value="el.style.borderStyle"
            class="select"
          >
            <a-select-option value="solid" selected>实线</a-select-option>
            <a-select-option value="dotted">点线</a-select-option>
            <a-select-option value="dashed">破折线</a-select-option>
            <a-select-option value="double ">双线</a-select-option>
          </a-select>
        </a-space>
      </div>
    </div>
  </div>
  <!-- 内边距 -->
  <div
    class="boxPadding"
    v-show="elClass != 'box' && elClass != 'img' && elClass != ''"
  >
    <span>内边距：</span><br />
    <div v-for="item of padding" :key="item.id" :class="item.valueName">
      <span>{{ item.name }}：</span>
      <a-input-number
        v-model:value="el.style[item.valueName]"
        @change="changeTextHeight"
        class="input"
      />
      <span>px</span>
    </div>
  </div>
  <!-- 文字 -->
  <div
    class="font"
    v-show="elClass == 'input' || elClass == 'button' || elClass == 'text'"
  >
    <span>文字：</span><br />
    <div class="border-info">
      <div class="cuxi">
        <span>字体大小：</span>
        <a-input-number
          v-model:value="el.style.fontSize"
          class="input"
          @change="changeTextHeight"
        />px<br />
      </div>
      <div class="yanse">
        <span>字体颜色：</span>
        <input type="color" class="color" v-model="el.style.color" />
      </div>
      <div class="fengge">
        <span>字体粗细：</span>
        <a-space class="select">
          <a-select
            ref="select"
            v-model:value="el.style.fontWeight"
            class="select"
          >
            <a-select-option v-for="p of 9" :key="p" :value="p * 100">{{
              p * 100
            }}</a-select-option>
          </a-select>
        </a-space>
      </div>
      <div class="fengge" v-show="elClass != 'input'">
        <span>字体修饰：</span>
        <a-space class="select">
          <a-select
            ref="select"
            v-model:value="el.style.textDecoration"
            class="select"
          >
            <a-select-option value="none">无</a-select-option>
            <a-select-option value="overline">上划线</a-select-option>
            <a-select-option value="line-through">中划线</a-select-option>
            <a-select-option value="underline">下划线</a-select-option>
          </a-select>
        </a-space>
      </div>
    </div>
  </div>
  <!-- 表单内容操作 -->
  <div class="inputBox" v-show="elClass == 'input'">
    <span>表单：</span><br />
    <div class="input-info">
      <div class="cuxi">
        <span>类型：</span>
        <a-space class="inputSelect">
          <a-select ref="select" v-model:value="el.other.type" class="select">
            <a-select-option value="text" selected>文本</a-select-option>
            <a-select-option value="password">密码</a-select-option>
            <a-select-option value="color">颜色</a-select-option>
            <a-select-option value="date">日历</a-select-option>
          </a-select>
        </a-space>
      </div>
      <div class="yanse">
        <span>提示语：</span>
        <a-input class="color" v-model:value="el.other.tip" />
      </div>
    </div>
  </div>
  <!-- 按钮内容操作 -->
  <div class="buttonBox" v-show="elClass == 'button'">
    <span>按钮：</span><br />
    <div class="yanse">
      <span>内容：</span>
      <a-input class="color" v-model:value="el.other.content" />
    </div>
    <div class="yanse">
      <span>链接：</span>
      <a-input class="color" v-model:value="el.other.href" />
    </div>
  </div>
  <!-- 旋转 -->
  <div class="rotating">
    <span>旋转：</span><br />
    <div class="rotating-info">
      <div class="jiaodu">
        <span>角度：</span>
        <a-input-number
          v-model:value="el.style.rotate"
          placeholder="请输入角度"
          class="input"
        />
      </div>
    </div>
  </div>
  <!-- 背景 -->
  <div class="background" v-show="elClass != 'img'">
    <span>背景：&nbsp;&nbsp;&nbsp;&nbsp;</span>
    <span>颜色</span>
    <a-switch v-model:checked="checked1" class="switch" /><span>图片</span>
    <div class="color-select">
      <input
        type="color"
        v-model="el.style.backgroundColor"
        v-show="!checked1"
      />
      <div class="loadImg" v-show="checked1">
        <input type="file" accept=".png,.jpg,.jpeg" @change="loadImg" />上传图片
      </div>
      <button v-show="checked1" @click="el.style.backgroundImage = ''">
        无背景
      </button>
      <!-- 图片列表 -->
      <ul v-show="checked1">
        <li
          v-for="(p, index) of fileList"
          :key="p.id"
          @click="el.style.backgroundImage = p.url"
        >
          <img :src="p.url" />
          <p>{{ p.name }}</p>
          <span @click="deleteImg(index)"></span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { defineComponent, reactive, ref, watch, nextTick } from 'vue'
import elStore from '@/store/elStore'
import snapshot from '@/store/snapshot'
import { v4 as uuidv4 } from 'uuid'
// import { storeToRefs } from 'pinia'

export default defineComponent({
	name: 'Attribute',
	setup() {
		//选择
		const checked1 = ref(false)
		const fileList = reactive([])
		const useElStore = elStore()
		const useSnapshot = snapshot()
		const elsIdx = useElStore.elsIdx
		const rectStyle = useElStore.rectStyle

		//多选框
		const options1 = [
			{
				value: 'right',
				label: 'right',
			},
			{
				value: 'left',
				label: 'left',
			},
		]

		const padding = [
			{ id: 1, name: '左边距', valueName: 'paddingLeft' },
			{ id: 2, name: '右边距', valueName: 'paddingRight' },
			{ id: 3, name: '上边距', valueName: 'paddingTop' },
			{ id: 4, name: '下边距', valueName: 'paddingBottom' },
		]

		let AttriList = reactive([
			{ id: 1, title: '宽度', entitle: 'width', valueName: 0 },
			{ id: 2, title: '高度', entitle: 'height', valueName: 0 },
			{ id: 3, title: '弧度', entitle: 'borderRadius', valueName: 0 },
			{
				id: 4,
				title: 'x坐标',
				entitle: 'left',
				valueName: 0,
			},
			{
				id: 5,
				title: 'y坐标',
				entitle: 'top',
				valueName: 0,
			},
		])
		let el = reactive({
			style: {
				color: '#000000',
				borderColor: '#000000',
				backgroundColor: '#000000',
			},
			other: {},
		})
		let elClass = ref('')

		//监听isSnapshot值的变化，给el重新赋值
		watch(() => useSnapshot.isSnapshot, () => {
			if (elsIdx[0] !== -1 && elsIdx[1] !== -1 && !JSON.parse(JSON.stringify(useElStore.els) === '{}') && !(useElStore.els[useElStore.elsIdx[0]][useElStore.elsIdx[1]] === undefined)) {
				el.style = useElStore.els[elsIdx[0]][elsIdx[1]].style;
			}
			// rectStyle.style = el.style
			useSnapshot.isSnapshot = false;
		})

		//监听elsIdx改变 改变更换el值
		watch(elsIdx, () => {
			if (elsIdx[0] != -1 || elsIdx[0] == 0) {
				let t = useElStore.els[elsIdx[0]][elsIdx[1]]
				el.style = t.style
				elClass.value = t.class
				if (elClass.value == 'input' || elClass.value == 'button') {
					el.other = t.other
				}
			} else {
				el.style = {
					color: '#000000',
					borderColor: '#000000',
					backgroundColor: '#000000',
				}
				el.other = {}
				elClass.value = ''
			}
		})

		//改变高度
		function changeElProps(idx) {
			if (idx == 2) {
				rectStyle.height = el.style.height
			}
			if (idx == 2 || idx == 5) {
				const f = document.querySelector(".editorPlate");
				let t = rectStyle.height + el.style.top;
				if(f.offsetHeight<t)
					f.style.height = t + "px";
			}
		}

		//从input中上传图片并添加到fileList中
		function loadImg(e) {
			const files = e.target.files
			for (let i = 0; i < files.length; i++) {
				let fileObj = { id: uuidv4() }
				let file = files[i]
				fileObj.name = file.name
				let aBlob = new Blob([file], { type: file.type })
				let reader = new FileReader()
				new Promise((resolve) => {
					reader.onload = (ev) => {
						fileObj.url = ev.target.result
						resolve()
					}
				}).then(() => {
					fileList.push(fileObj)
				})
				reader.readAsDataURL(aBlob)
			}
		}

		//从图片列表中删除元素
		function deleteImg(idx) {
			fileList.splice(idx, 1)
		}

		//改变背景图片
		function changeBackImg(idx) {
			el.style.backgroundImage = fileList[idx].url
		}

		function changeTextHeight() {
			nextTick(() => {
				if (elClass.value == 'text') {
					let elDom = document.querySelectorAll('.editorPlate .text')[elsIdx[1]]
					rectStyle.height = elDom.offsetHeight
				}
			})
		}

		return {
			checked1,
			fileList,
			options1,
			AttriList,
			el,
			elClass,
			padding,
			changeElProps,
			deleteImg,
			loadImg,
			changeBackImg,
			changeTextHeight,
		}
	},
})
</script>

<style lang="less">
.attribute {
  text-align: center;

  .width,
  .height,
  .borderRadius,
  .left,
  .top {
    margin-top: 30px;

    span {
      font-size: 14px;
    }

    .input {
      width: 156px;
      height: 32px;
      border: 1px solid rgb(199, 199, 199);
      outline: none;
      margin: 0 10px;
      padding-left: 10px;
      border-radius: 4px;
      font-size: 14px;
    }
  }

  .rotating {
    margin-top: 30px;

    > span {
      display: inline-block;
      margin-right: 185px;
    }

    .input {
      width: 105px;
      height: 32px;
      text-align: center;
      margin: 0 15px;
      padding-left: 5px;
      border-radius: 4px;
      margin-top: 15px;
    }

    .rotating-info {
      margin-top: 15px;

      .fangxiang {
        margin-top: 15px;
        text-align: left;
        padding-left: 50px;

        .ant-space {
          width: 105px;
          border-radius: 4px;
          margin-left: 14px;
        }
      }

      .jiaodu {
        text-align: left;
        padding-left: 40px;
      }
    }
  }

  .background {
    margin-top: 30px;
    padding: 0 20px;
    text-align: left;

    span {
      text-align: left;
    }

    .switch {
      margin: 0 10px;
    }

    .color-select {
      text-align: center;

      input {
        width: 35px;
        height: 35px;
        margin-top: 15px;
      }

      .loadImg {
        display: inline-block;
        position: relative;
        width: 100px;
        height: 43px;
        line-height: 40px;
        text-align: center;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        margin-top: 15px;
        input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          margin-top: 0;
        }
        &:hover {
          border: 1px solid #1890ff;
          color: #1890ff;
        }
      }

      ul {
        width: 100%;
        padding: 0;
        margin: 0;
        li {
          position: relative;
          margin-top: 10px;
          width: 100%;
          height: 66px;
          line-height: 66px;
          padding: 8px;
          border: 1px solid #d9d9d9;
          border-radius: 4px;
          list-style: none;
          img {
            float: left;
            width: 48px;
            height: 48px;
            overflow: hidden;
            object-fit: cover;
            object-position: top;
            vertical-align: top;
          }
          p {
            float: left;
            width: 120px;
            height: 100%;
            line-height: 100%;
            padding: 14px 8px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            text-align: left;
            margin: 0;
          }
          span {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            float: left;
            width: 16px;
            height: 16px;
            background: url(~@/assets/shanchu.png) center no-repeat;
            cursor: pointer;
            margin: 0;
          }
        }
        li:hover {
          border: 1px solid #1890ff;
          p {
            color: #1890ff;
          }
        }
      }

      button {
        width: 100px;
        height: 43px;
        border: 1px solid #d9d9d9;
        margin-left: 10px;
        background: none;
        outline: none;
        &:hover {
          border: 1px solid #1890ff;
          color: #1890ff;
        }
      }
    }
  }

  .border,
  .font,
  .buttonBox,
  .boxPadding {
    margin-top: 30px;
    text-align: left;
    padding-left: 20px;

    .a-checkbox {
      margin-right: 15px;
    }

    .input {
      width: 105px;
      height: 32px;
      text-align: center;
      margin: 0 15px;
      padding-left: 5px;
      border-radius: 4px;
      margin-top: 15px;
      margin-right: 5px;
    }

    .border-info {
      margin-top: 15px;

      .cuxi,
      .yanse {
        padding-left: 20px;

        .select {
          width: 15px;
        }

        .color {
          width: 25px;
          height: 25px;
          margin-top: 15px;
          margin-left: 15px;
        }
      }

      .fengge {
        margin-top: 15px;
        padding-left: 20px;

        .ant-space {
          width: 105px;
          margin-left: 15px;
        }
      }
    }
  }

  .boxPadding div {
    margin-left: 20px;
  }

  .inputBox {
    padding: 0 20px;
    text-align: left;
    margin-top: 20px;
    .input-info {
      padding-left: 20px;
      .inputSelect {
        margin-left: 15px;
      }
      input {
        margin-left: 15px;
        width: 136px;
      }
    }
    .input-info > div {
      margin-top: 15px;
    }
  }

  .buttonBox {
    div {
      padding-left: 20px;
      input {
        margin-top: 20px;
        margin-left: 15px;
        width: 145px;
      }
    }
  }
}

.upload-list-inline :deep(.ant-upload-list-item) {
  float: left;
  width: 200px;
  margin-right: 8px;
}

.upload-list-inline [class*="-upload-list-rtl"] :deep(.ant-upload-list-item) {
  float: right;
}
</style>
