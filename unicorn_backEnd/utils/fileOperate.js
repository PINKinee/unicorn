const fs = require('fs');
const white = (content, username, productName) => {
    const root = `C:/Users/Administrator/Desktop/`;
    return new Promise((resolve, reject) => {
        fs.mkdir(`${root}files/${username}`, { recursive: true }, err => {
            if (err) {
                reject(err);
            } else {
                const address = `${root}files/${username}/${productName}of${username}.png`;
                // 截取掉base64码前面部分data:image
                const base64 = content.replace(/^data:image\/\w+;base64,/, "");
                const dataBuffer = Buffer.from(base64, "base64");
                fs.writeFile(address, dataBuffer, err => err ? reject(err) :
                    resolve(`${encodeURI(username)}/${encodeURI(productName)}of${encodeURI(username)}.png`));
            }
        })
    })
};
// // 如果该项目名了要写一个新的方法
// // 存数据
const saveData = (content, username, productName) => white(content, username, productName);
// // 拿数据
module.exports = {
    saveData
};