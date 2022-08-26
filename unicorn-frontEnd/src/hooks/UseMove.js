/**
 * f父盒子
 * s子盒子 即需要操作的盒子
 * rect矩形选择框 点击元素矩形框出现
 */
import UseRectShow from "./UseRectShow";
import UseSubline from "./UseSubline";
export default (e, p, f,rect, rectIsShow, els, elsIdx, sublines) => {
    if (els[elsIdx[0], elsIdx[1]].isEditable) return;
    const s = e.target;//要动的盒子
    const sSize = s.getBoundingClientRect();//子盒子的位置以及大小对象
    //父盒子到浏览器右边与鼠标在移动盒子内部的和
    const x = e.pageX-s.offsetLeft;
    const y = e.pageY-s.offsetTop;
    //改变鼠标样式
    s.style.cursor = 'move';
    //点击时被矩形框选
    rectIsShow.value = UseRectShow(p,rect);
    document.onmousemove = e => {
        //移动盒子相对于父盒子的新位置
        let l = e.pageX - x;
        let t = e.pageY - y;
        //左边锁死
        if (l < 0)
            l = 0;
        //上边锁死
        if (t < 0)
            t = 0;
        //右边锁死
        if (l + sSize.width > f.offsetWidth)
            l = f.offsetWidth - sSize.width;
        //下边锁死
        if (t + sSize.height > f.offsetHeight) {
            f.style.height=f.offsetHeight +50+'px';
        }
        p.style.left = Math.round(l);
        p.style.top = Math.round(t);
        sublines.splice(0, sublines.length);
        UseSubline(els, elsIdx,sublines,f);
    }
    document.onmouseup = () => {
        sublines.splice(0, sublines.length);
        s.style.cursor = 'default';
        document.onmousemove = null;
        document.onmouseup = null;
    }
}