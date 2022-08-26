export default (e, dels, sty) => {
    //父盒子到浏览器右边与鼠标在移动盒子内部的和
    const x = e.pageX - sty.left;
    const y = e.pageY - sty.top;
    //改变鼠标样式
    sty.cursor = 'move';
    document.onmousemove = e => {
        //移动盒子相对于父盒子的新位置
        let l = e.pageX - x;
        let t = e.pageY - y;
        let bx = l-sty.left;
        let by = t-sty.top;
        sty.left = l;
        sty.top = t;
        dels.forEach(el => {
            el.style.left += bx;
            el.style.top += by;
        });
    }
    document.onmouseup = () => {
        sty.cursor = 'default';
        document.onmousemove = null;
        document.onmouseup = null;
    }
}