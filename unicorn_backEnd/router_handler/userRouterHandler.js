const { db } = require('./index');
const { sqlUtils } = require('./index');
const bcrypt = require('bcrypt');

// 注册
const register = (req, res) => {
    const avator = req.body.avator ? req.body.avator : null;
    db.query('select * from user where username=?', req.body.username, (err, result) => {
        if (err) {
            return res.judge(err, 0);
        } else if (result.length !== 0) {
            return res.judge('该用户名已存在,请更换用户名', 0);
        } else {
            db.query('insert into user set ?', {
                username: req.body.username,
                psw: bcrypt.hashSync(req.body.password, 10),
                avator,
            }, sqlUtils.insertOperate({ res }));
        }
    })
}

// 登录
const login = (req, res) => {
    db.query('select psw from user where username=?', req.body.username, sqlUtils.selectOperate({
        res, fn: (result) => {
            if (bcrypt.compareSync(req.body.password, result[0].psw)) {
                req.session.username = req.body.username;
                return res.judge('登录成功', 1);
            } else {
                return res.judge('密码输入有误，请重新输入', 0);
            }
        }
    })
    )
}

// 退出登录
const logOff = (req, res) => {
    if (req.session.username) {
        req.session.destroy();
        res.judge('已成功退出登录', 1);
    } else {
        res.judge('您还未登录,请登录后操作', 0);
    }
}

// 上传头像
const uploadAvator = (req, res) => {
    if (req.body.avator) {
        db.query('update user set avator=? where username=?', [req.body.avator, req.body.username],
            sqlUtils.updateOperate({ res }))
    } else {
        return res.judge('请提供图片', 0);
    }
}

// 修改密码
const updatePsw = (req, res) => {
    db.query('select psw from user where username=?', req.body.username, sqlUtils.selectOperate({
        res, fn: (result) => {
            if (bcrypt.compareSync(req.body.password, result[0].psw)) {
                const newPsw = bcrypt.hashSync(req.body.rePassword, 10);
                db.query('update user set psw=? where username=?', [newPsw, req.body.username],
                    sqlUtils.updateOperate({ res }))
            } else {
                return res.judge('旧密码输入有误，请重新输入', 0);
            }
        }
    })
    )
}
module.exports = {
    register,
    login,
    logOff,
    uploadAvator,
    updatePsw,
}