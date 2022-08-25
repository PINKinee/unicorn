const moment = require('./date');
const fn = (res) => {
    return (result) => {
        res.send({
            status: 1,
            msg: '操作成功',
            data: {
                username: result[0].username,
                productName: result[0].pname,
                content: JSON.parse(result[0].content),
                saveTime: moment(Number(result[0].save_time)).format('yyyy-MM-DD HH:mm'),
                cover: result[0].cover
            }
        })
    }
}
module.exports = fn;