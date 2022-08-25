const express = require('express');
const app = express();
// 引入中间件
const officialFilter = require('./filter/official');
const selfmadeFilter = require('./filter/selfmade');
const path = require('path');
// 引入路由
const userRouter = require('./router/userRouter');
const productRouter = require('./router/productRouter');
// 使用中间件
app.use(express.static(path.join(__dirname, 'files')));
console.log(path.join(__dirname, 'files'));
app.use(officialFilter.cors({
    origin: 'http://112.74.166.87:5500',
    credentials: true,
}));
app.use(selfmadeFilter.judge);
app.use(officialFilter.bodyParser.urlencoded({
    limit: '100mb',
    extended: false
}));
app.use(officialFilter.bodyParser.json({ limit: '100mb' }));
app.use(officialFilter.session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
// 使用路由
app.use(userRouter);
app.use(productRouter);
// 监听端口
app.listen(8000, () => {
    console.log('8000端口已启动');
});