export default (e, f, els, sty) => {
    let x = e.pageX;
    let y = e.pageY;
    const fSize = f.getBoundingClientRect();
    let dels = [];
    let flag = true;
    return new Promise((resolve) => {
        document.onmousemove = e => {
            if (flag) {
                sty.display = 'block';
                flag = false;
            }
            let cx = e.pageX - x;
            let cy = e.pageY - y;
            let cl;
            let ct;
            let cw = Math.abs(cx);
            let ch = Math.abs(cy);
            if (cx < 0)
                cl = e.pageX - fSize.x;
            else
                cl = x - fSize.x;
            if (cy < 0)
                ct = e.pageY - fSize.y;
            else
                ct = y - fSize.y;
            if (cl < 0) {
                cl = 0;
                cw = x - fSize.x;
            }
            if (ct < 0) {
                ct = 0;
                ch = y - fSize.y;
            }
            if (fSize.width + fSize.x < e.pageX) {
                cw = fSize.x + fSize.width - x;
            }
            if (fSize.y + fSize.height < e.pageY)
                ch = fSize.y + fSize.height - y;
            sty.width = cw;
            sty.height = ch;
            sty.left = cl;
            sty.top = ct;
        }
        document.onmouseup = () => {
            for (let i = 0; i < dels.length; i++)
                dels[i].style.opacity = 1;
            dels = [];
            let elDomAll = new Array(5);
            for (let i = 0; i < 5; i++) {
                if (els[i][0])
                    elDomAll[i] = [...document.querySelectorAll('.' + els[i][0].class)];
                else
                    elDomAll[i] = [];
            }
            for (let i = 0; i < elDomAll.length; i++) {
                for (let j = 0; j < elDomAll[i].length; j++) {
                    let sSize = elDomAll[i][j].getBoundingClientRect();
                    let sl = sSize.x - fSize.x;
                    let st = sSize.y - fSize.y;
                    if (sl >= sty.left && st >= sty.top && sl + sSize.width <= sty.left + sty.width && sty.top + sty.height >= st + sSize.height) {
                        dels.push(els[i][j]);
                    }
                }
            }
            if (dels.length < 1) {
                sty.display = 'none';
            }
            document.onmousemove = null;
            document.onmouseup = null;
            resolve(dels);
        }
    });
}