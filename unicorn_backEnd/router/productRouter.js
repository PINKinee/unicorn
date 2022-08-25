const router = require('./index');
const { isLogin } = require('../filter/selfmade');
const productRouterHandler = require('../router_handler/productRouterHandler');

// 保存作品
router.post('/saveTemplate', isLogin, productRouterHandler.saveTemplate);
// 获取最近保存的未发布的作品
router.get('/getRecentlySave', isLogin, productRouterHandler.getRecentlySave);
// 发布作品
router.post('/releaseTemplate', isLogin, productRouterHandler.releaseTemplate);
// 获取作品信息列表
router.get('/getSaveList', isLogin, productRouterHandler.getSaveList);
// 删除指定作品
router.post('/deleteTemplate', isLogin, productRouterHandler.deleteTemplate);
// 批量删除作品
router.post('/deleteTemplateList', isLogin, productRouterHandler.deleteTemplateList);
// 修改名称
router.get('/updateInfo', isLogin, productRouterHandler.updateInfo);
module.exports = router;