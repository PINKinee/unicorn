// 配置优化send方法的中间件
const judge = (req, res, next) => {
    res.judge = (err, status = 0) => {
        res.send({
            status,
            msg: err instanceof Error ? err.message : err
        })
    }
    next();
};
// 配置判断登录状态的中间件
const isLogin = (req, res, next) => {
    if (req.session.username == undefined) {
        return res.send({
            status: 0,
            msg: '您还未登录,请在登录后操作'
        });
    } else {
        next();
    }
}
// 配置判断退出登录的中间件
const isLogOut = (req, res, next) => {
    if (req.session.username) {
        return res.send({
            status: 1,
            msg: '您已登录，请不要重复操作'
        })
    } else {
        next();
    }
}
module.exports = {
    judge,
    isLogin,
    isLogOut
}