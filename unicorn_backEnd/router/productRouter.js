const router = require('./index');
const { isLogin } = require('../filter/selfmade');
const productRouterHandler = require('../router_handler/productRouterHandler');

// 保存模板
router.post('/saveTemplate', isLogin, productRouterHandler.saveTemplate);
// 获取最近保存的未发布的项目
router.get('/getRecentlySave', isLogin, productRouterHandler.getRecentlySave);
// 发布项目
router.post('/releaseTemplate', isLogin, productRouterHandler.releaseTemplate);
// 获取项目信息列表
router.get('/getSaveList', isLogin, productRouterHandler.getSaveList);
// 删除指定项目
router.post('/deleteTemplate', isLogin, productRouterHandler.deleteTemplate);
// 批量删除项目
router.post('/deleteTemplateList', isLogin, productRouterHandler.deleteTemplateList);
// 修改名称
router.get('/updateInfo', isLogin, productRouterHandler.updateInfo);
module.exports = router;