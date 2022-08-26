/**
 * el 需要旋转dom的参数对象
 * rect 选择矩形的dom
 * p 父元素dom
 */
import snapshot from "../store/snapshot";
export default (els,elsIdx, p) => {
    //获取旋转dom在相对于文档的坐标位置 因为e.pageX和e.pageY是相对于文档的 要一致才可以
    let el = els[elsIdx[0]][elsIdx[1]];
    const elDom = p.querySelectorAll(`.${el.class}`)[elsIdx[1]];
    let centerX = elDom.offsetLeft + elDom.offsetWidth / 2+p.getBoundingClientRect().x;
    let centerY = elDom.offsetTop + elDom.offsetHeight / 2+p.getBoundingClientRect().y;
    document.onmousemove = (e) => {
        //获取三角形的两个直角边的长度
        let x = e.pageX - centerX;
        let y = e.pageY - centerY;
        //用反正切把角度求出来
        el.style.rotate = Math.round(Math.atan2(y, x) / Math.PI * 180 - 90);
    }
    document.onmouseup = () => {
        const useSnapshot = snapshot();
        //旋转元素时，获得新的快照
        useSnapshot.recordSnapshot();
        document.onmousemove = null;
        document.onmouseup = null;
    }
}