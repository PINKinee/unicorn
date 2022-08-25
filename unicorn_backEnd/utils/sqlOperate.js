const selectOperate = ({ res, flag = true, fn = null }) => {
    return (err, result) => {
        if (err) {
            return res.judge(err, 0);
        } else if (result.length === 0 || result.affectedRows === 0) {
            return res.judge('操作失败', 0);
        } else {
            if (fn) {
                return fn(result);
            }
            if (flag) {
                return res.judge('操作成功', 1);
            } else {
                return res.send({
                    status: 1,
                    msg: '操作成功',
                    data: result
                })
            }
        }
    }
}
const insertOperate = ({ res, flag = true, fn = null }) => {
    return selectOperate({ res, flag, fn });
};

const updateOperate = ({ res, flag = true, fn = null }) => {
    return selectOperate({ res, flag, fn });
}
const deleteOperate = ({ res, flag = true, fn = null }) => {
    return selectOperate({ res, flag, fn });
};

module.exports = {
    selectOperate,
    insertOperate,
    updateOperate,
    deleteOperate,
};