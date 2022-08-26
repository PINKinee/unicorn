// 深复制撤销前的组件数组
export function deepCopy(els) {
    const result = Array.isArray(els) ? Array.from(new Array(6), () => []) : {};
    if (Array.isArray(result)) {
        for (let i in els) {
            for (let j in els[i]) {
                result[i][j] = deepCopy(els[i][j]);
            }
        }
    } else {
        for (let i in els) {
            if (i === 'style') {
                result[i] = deepCopy(els[i])
                continue;
            }
            result[i] = els[i]
        }
    }
    return result
}