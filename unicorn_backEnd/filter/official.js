// 配置解决跨域的中间件
const cors = require('cors');
// 配置session
const session = require('express-session');
// 配置bodyParser中间件
const bodyParser = require('body-parser');
// 配置验证中间件
const expressJoi = require('@escook/express-joi');
module.exports = {
    cors,
    session,
    bodyParser,
    expressJoi
}