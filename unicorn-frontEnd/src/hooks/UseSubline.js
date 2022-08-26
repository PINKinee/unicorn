/**
 * els 元素的数组
 * elsIdx 矩形框选中的位置
 * sublines 辅助线数组
 * f 父元素
 */
/**
 * 思路：
 * 1、保存移动元素的六条辅助线的位置
 * 2、遍历所有元素除移动元素外 如果x或y的值一样 就加入数组里面
 * 3、最后在数组里面找最大和最小值，就是起点和终点
 */

export default (els, elsIdx, sublines, f) => {
    //父元素中除辅助线和矩形选择框外的所有元素的集合
    let elDomAll = [];
    for (let i = 0; i < els.length; i++)
        if(els[i][0])
            elDomAll.push(...f.querySelectorAll('.' + els[i][0].class));
    //如果元素不够两个不需要比较 直接退出该函数
    if (elDomAll.length < 2) return;
    const fSize = f.getBoundingClientRect();
    //当前移动的结点
    const elDom = document.querySelectorAll('.' + els[elsIdx[0]][0].class)[elsIdx[1]];
    const el = els[elsIdx[0]][elsIdx[1]];
    //为了方便设置id
    const ids = ['x1', 'x2', 'x3', 'y1', 'y2', 'y3'];
    //六条辅助线 取平均值
    const elprop = new Array(6);
    elprop[0] = Math.round(elDom.getBoundingClientRect().top);
    elprop[1] = Math.round(elDom.getBoundingClientRect().top + elDom.getBoundingClientRect().height / 2);
    elprop[2] = Math.round(elDom.getBoundingClientRect().top + elDom.getBoundingClientRect().height);
    elprop[3] = Math.round(elDom.getBoundingClientRect().left);
    elprop[4] = Math.round(elDom.getBoundingClientRect().left + elDom.getBoundingClientRect().width / 2);
    elprop[5] = Math.round(elDom.getBoundingClientRect().left + elDom.getBoundingClientRect().width);

    //相同点的数据 为了方便找到最大和最小值 找到辅助线的长度
    let samePoint = new Array(6);
    for (let i = 0; i < samePoint.length; i++)
        samePoint[i] = [];
    //遍历除了在移动的dom外的所有元素 与移动的dom进行比较
    let flag1 = true;
    let flag2 = true;
    for (let i = 0; i < elDomAll.length; i++) {
        if (elDomAll[i] != elDom) {
            let tmp = new Array(6);
            //当前遍历元素的六个辅助线
            tmp[0] = Math.round(elDomAll[i].getBoundingClientRect().top);
            tmp[1] = Math.round(elDomAll[i].getBoundingClientRect().top + elDomAll[i].getBoundingClientRect().height / 2);
            tmp[2] = Math.round(elDomAll[i].getBoundingClientRect().top + elDomAll[i].getBoundingClientRect().height);
            tmp[3] = Math.round(elDomAll[i].getBoundingClientRect().left);
            tmp[4] = Math.round(elDomAll[i].getBoundingClientRect().left + elDomAll[i].getBoundingClientRect().width / 2);
            tmp[5] = Math.round(elDomAll[i].getBoundingClientRect().left + elDomAll[i].getBoundingClientRect().width);
            for (let j = 0; j < tmp.length; j++) {
                //同方向之间进行对比
                for (let k = (j < 3 ? 0 : 3); k < (j < 3 ? 3 : 6); k++) {
                    let t = tmp[j] - elprop[k];
                    //相同 保存反方向可能的值 比如现在是x方向的j 保存y方向的数据 方便找到最大和最小
                    if (Math.abs(t) < 5 && j < 3 && flag1) {
                        el.style.top += t;
                        elprop[0] += t;
                        elprop[1] += t;
                        elprop[2] += t;
                        samePoint[k].push(tmp[3], tmp[4], tmp[5]);
                        flag1 = false;
                        break;
                    }
                    else if (Math.abs(t) < 5 && j > 2 && flag2) {
                        el.style.left += t;
                        elprop[3] += t;
                        elprop[4] += t;
                        elprop[5] += t;
                        samePoint[k].push(tmp[0], tmp[1], tmp[2]);
                        flag2 = false;
                        break;
                    } else if (t == 0) {
                        if (j < 3)
                            samePoint[k].push(tmp[3], tmp[4], tmp[5]);
                        else
                            samePoint[k].push(tmp[0], tmp[1], tmp[2]);
                        break;
                    }
                }
            }
        }
    }
    //将移动元素的值也放进去 为了找出最大和最小
    for (let i = 0; i < 6; i++) {
        if (i < 3) samePoint[i].push(elprop[3], elprop[4], elprop[5]);
        else samePoint[i].push(elprop[0], elprop[1], elprop[2]);
    }
    //增加线
    for (let i = 0; i < samePoint.length; i++) {
        //大于3才证明有相同的值 因为前面把移动结点的值放进去了
        if (samePoint[i].length > 3) {
            //找最大和最小值 即起点和终点
            let max = Math.max(...samePoint[i]);
            let min = Math.min(...samePoint[i]);
            let obj = {
                id: ids[i],
                //如果是i<3 证明辅助线是x轴方向的 所以left=min y方向的就是elprop[i]
                left: (i < 3 ? min : elprop[i]) - fSize.x,
                top: (i < 3 ? elprop[i] : min) - fSize.y,
                width: i < 3 ? max - min -1: 1,
                height: i < 3 ? 1 : max - min-1
            };
            //把结果添加进去
            sublines.push(obj);
        }
    }
}