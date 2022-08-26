/**
 * @param {可获取鼠标事件} e 
 * @param {要改变元素的参数} el
 * @param {父盒子Dom} f
 * @param {矩阵选择框Dom} rect
 * @param {为了获取text Dom 获取文本框的高度} idx
 */
import snapshot from "../store/snapshot";

export default (e, el, f, rect, idx) => {
    const elName = e.target.className;
    const elStyle = el.style;
    const elW = elStyle.width;
    let elH = elStyle.height;
    const elT = elStyle.top;
    const elL = elStyle.left;
    const elDom = f.querySelectorAll('.' + el.class)[idx];
    const fSize = f.getBoundingClientRect();
    //当高度或者宽度小于minSize不能再小了
    const minSize = elStyle.fontSize ? elStyle.fontSize + 20 : 15;
    //鼠标相对于被点击元素的位置
    let disX = e.pageX - elL - fSize.x;
    let disY = e.pageY - elT - fSize.y;
    const preX = e.pageX;
    const preY = e.pageY;
    /**
     * @param {可获取鼠标事件} e 
     * @param {bool true left值要改变} left 
     * @param {bool true top值要改变} top 
     * @param {bool true width值要改变} width 
     * @param {bool true height值要改变} height
     */
    function changeSize(e, left, top, width, height) {
        new Promise(resolve => {
            let x = left ? e.pageX - disX - fSize.x : elL;
            let y = top ? e.pageY - disY - fSize.y : elT;
            let w = width ? e.pageX - preX + elW : elW;
            let h = height ? e.pageY - preY + elH : elH;
            if (left && width) w = preX - e.pageX + elW;
            if (top && height) h = preY - e.pageY + elH;
            if (x < 0) {
                //左边锁死
                x = left ? 0 : elL;
                w = width ? elL + elW : elW;
            } else if (x + w >= f.offsetWidth) {
                //右边锁死
                w = width ? f.offsetWidth - el.left : elW;
            }
            if (y < 0) {
                //上边锁死
                y = top ? 0 : elT;
                h = height ? elT + elH : elH;
            } else if (y + h >= f.offsetHeight) {
                h = height ? f.offsetHeight - elT : elH;
            }
            if (w > minSize) {
                elStyle.left = x;
                elStyle.width = w;
            }
            if (h > minSize) {
                elStyle.top = y;
                elStyle.height = (height && width ? w * (elH / elW) : h);
            }
            resolve();
        }).then(() => {
            rect.height = elDom.offsetHeight;
        })
    }
    document.onmousemove = (e) => {
        if (elName == 'l') {
            changeSize(e, true, false, true, false);
        } else if (elName == 'r') {
            changeSize(e, false, false, true, false);
        } else if (elName == 't') {
            changeSize(e, false, true, false, true);
        } else if (elName == 'b') {
            changeSize(e, false, false, false, true);
        } else if (elName == 'lt') {
            changeSize(e, true, true, true, true);
        } else if (elName == 'lb') {
            changeSize(e, true, false, true, true);
        } else if (elName == 'rt') {
            changeSize(e, false, true, true, true);
        } else if (elName == 'rb') {
            changeSize(e, false, false, true, true);
        }
    }
    document.onmouseup = () => {
        const useSnapshot = snapshot();
        //改变元素大小时时，获得新的快照
        useSnapshot.recordSnapshot();
        document.onmousemove = null;
        document.onmouseup = null;
    }
}