const { db } = require('./index');
const { sqlUtils } = require('./index');
const { moment } = require('./index');
const { typeJudge } = require('./index');
const { strJudge } = require('./index');
const { callbackFn } = require('./index');
const { fileUtils } = require('./index');

// 保存模板
const saveTemplate = (req, res) => {
    const sql1 = 'select * from product where username=? and isDeleted=0 and release_state=0';
    const sql2 = 'update product set ? where username=? and pname=? and isDeleted=0 and release_state=0';
    const sql3 = 'insert into product set ?';
    db.query(sql1, req.body.username, async(err, result) => {
        if (err) {
            return res.judge(err, 0);
            // result可能是空数组
        } else if (result.length !== 0 && strJudge(req.body.productName, result.map((item) => { return item.pname }))) {
            await fileUtils.saveData(req.body.cover, req.body.username, req.body.productName).then(v => {
                db.query(sql2, [{ content: req.body.content, save_time: Date.now(), cover: v }, req.body.username, req.body.productName],
                    sqlUtils.updateOperate({ res }));
            }, reason => {
                return res.judge(reason, 0)
            })
        } else {
            if (result.length < 5) {
                await fileUtils.saveData(req.body.cover, req.body.username, req.body.productName).then(v => {
                    db.query(sql3, {
                        username: req.body.username,
                        pname: req.body.productName,
                        save_time: Date.now(),
                        content: req.body.content,
                        // release_state: 0,
                        cover: v,
                    }, sqlUtils.insertOperate({ res }));
                }, reason => {
                    return res.judge(reason, 0);
                })
            } else {
                return res.judge('您已经创建了5个项目啦,不能再新建项目哦!', 0);
            }
        }
    });
};

// 修改模板名称
const updateInfo = (req, res) => {
    const sql = 'update product set pname=? where username=? and pname=? and release_state=0 and isDeleted=0';
    db.query(sql, [req.query.newName, req.query.username, req.query.productName], sqlUtils.updateOperate({ res }));
};

// 获取最近一条保存的模板
const getRecentlySave = (req, res) => {
    const sql = 'select * from product where username=? and pname=? and release_state=0 and isDeleted=0'
    db.query(sql, [req.query.username, req.query.productName], sqlUtils.selectOperate({
        res,
        fn: (result) => {
            res.send({
                status: 1,
                msg: '操作成功',
                data: {
                    username: result[0].username,
                    productName: result[0].pname,
                    content: JSON.parse(result[0].content),
                    saveTime: moment(Number(result[0].save_time)).format('yyyy-MM-DD HH:mm'),
                }
            })
        }
    }))
};

// 获取保存的模板列表信息
const getSaveList = (req, res) => {
    db.query('select * from product where username=? and isDeleted=0 and release_state=0',
        req.query.username, sqlUtils.selectOperate({
            res,
            fn: async(result) => {
                let newArr = [];
                result.forEach(item => {
                    newArr.push({
                        productName: item.pname,
                        saveTime: moment(Number(item.save_time)).format('yyyy-MM-DD HH:mm'),
                        content: JSON.parse(item.content),
                        cover: `http://112.74.166.87:8000/${item.cover}`,
                    });
                });
                return res.send({
                    status: 1,
                    msg: '获取信息成功',
                    data: {
                        list: newArr,
                        maxCount: 5
                    }
                });
                // fileUtils.getData(req.query.username).then(file => {
                //     result.forEach((item, index) => {
                //         newArr.push({
                //             productName: item.pname,
                //             saveTime: moment(Number(item.save_time)).format('yyyy-MM-DD HH:mm'),
                //             content: JSON.parse(item.content),
                //             cover: file[index],
                //         });
                //     })
                //     return res.send({
                //         status: 1,
                //         msg: '获取信息成功',
                //         data: {
                //             list: newArr,
                //             maxCount: 5
                //         }
                //     })
                // }, err => {
                //     return res.judge(err, 0);
                // });
            }
        })
    )
};

// 发布模板
const releaseTemplate = (req, res) => {
    const time = Date.now();
    const sql1 = 'select * from product where username=? and pname=? and isDeleted=0 and release_state=0';
    const sql2 = 'update product set ? where username=? and pname=? and isDeleted=0 and release_state=0';
    db.query(sql1, [req.body.username, req.body.productName], (err, result) => {
        if (err) {
            return res.judge(err, 0);
        } else if (result.length === 0) {
            // 这里要修改
            return res.judge('发布前请先保存哦', 0);
        } else {
            db.query(sql2, [{ release_state: 1, save_time: time }, req.body.username, req.body.productName],
                sqlUtils.updateOperate({
                    res,
                    fn: (result) => {
                        return res.send({
                            status: 1,
                            msg: "发布成功",
                            data: {
                                username: req.body.username,
                                pname: req.body.productName,
                                releaseTime: time,
                                content: req.body.content,
                                cover: typeJudge(req.body.cover)
                            }
                        })
                    }
                }))
        }
    })
};

// 删除模板
const deleteTemplate = (req, res) => {
    const sql = 'update product set isDeleted=1 where username=? and pname=? and release_state=0';
    db.query(sql, [req.body.username, req.body.productName], sqlUtils.deleteOperate({ res }));
};

// 批量删除模板
const deleteTemplateList = (req, res) => {
    const sql = `update product set isDeleted=1 where username=? and release_state=0 and pname in (?)`;
    db.query(sql, [req.body.username, req.body.productNameArr], sqlUtils.deleteOperate({ res }))
};

// 删除指定已发布作品
// const deleteProduct = (req, res) => {
//     return deleteSaveTemplate(req, res);
// };
module.exports = {
    saveTemplate,
    getRecentlySave,
    releaseTemplate,
    getSaveList,
    deleteTemplate,
    deleteTemplateList,
    updateInfo
}