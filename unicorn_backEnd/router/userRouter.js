const router = require('./index');
const userRouterHandler = require('../router_handler/userRouterHandler');
const userSchema = require('../schema/userSchema');
const { expressJoi } = require('../filter/official');
const { isLogin } = require('../filter/selfmade');
const { isLogOut } = require('../filter/selfmade');
// 注册
router.post('/register', expressJoi(userSchema), userRouterHandler.register);
// 登录
router.post('/login', isLogOut, expressJoi(userSchema), userRouterHandler.login);
// 退出登录
router.get('/logOff', isLogin, userRouterHandler.logOff);
// 上传头像
router.post('/uploadAvator', isLogin, userRouterHandler.uploadAvator);
// 修改密码
router.post('/updatePsw', isLogin, userRouterHandler.updatePsw);
module.exports = router;