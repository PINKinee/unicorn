/**
 * 改变层级代码
 */
export default (els, elsIdx, idx) => {
    const el = els[elsIdx[0]][elsIdx[1]];
    const elL = el.style.left;
    const elR = el.style.left + el.style.width;
    let arr = [];
    //找到与当前选中的元素部分重叠的元素 保存在数组中
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < els[i].length; j++) {
            if (!(elsIdx[0] == i && elsIdx[1] == j)) {
                let tL = els[i][j].style.left;
                let tR = els[i][j].style.left + els[i][j].style.width;
                if ((elL < tR && elR > tR) || (tL < elR && tR > elR) || (elL < tL && elR > tR) || (elL > tL && elR < tR)) {
                    arr.push(els[i][j]);
                }
            }
        }
    }
    arr.push(el);
    if (arr.length > 1) {
        //找出当前元素的层级顺序
        let sortArr = [];//没有层级的元素 层级为undefined
        let haszIdx = [];//已有层级的元素
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].style.zIndex == undefined)
                sortArr.push(arr[i]);
            else
                haszIdx.push(arr[i]);
        }
        //按层级小到大排序
        haszIdx.sort((a, b) => a.style.zIndex - b.style.zIndex);
        //合并两个数组
        sortArr = [...sortArr, ...haszIdx];
        let elIdx;
        //找到当前元素在排好序的数组中的索引并且将层级为undefined的层级赋予层级
        for (let i = 0; i < sortArr.length; i++) {
            sortArr[i].style.zIndex = i + 1;
            if (sortArr[i].id == el.id)
                elIdx = i;
        }
        switch (idx) {
            case 4:
                //上移一层
                if (elIdx < sortArr.length - 1) {
                    el.style.zIndex = elIdx + 2;
                    sortArr[elIdx + 1].style.zIndex = elIdx + 1;
                }
                break;
            case 5:
                //下移一层
                if (elIdx > 0) {
                    el.style.zIndex = elIdx;
                    sortArr[elIdx - 1].style.zIndex = elIdx + 1;
                }
                break;
            case 6:
                //置顶层级
                el.style.zIndex = sortArr.length + 1;
                break;
            case 7:
                //置底层级
                el.style.zIndex = 0;
                break;
            default:
                break;
        }
    }
}