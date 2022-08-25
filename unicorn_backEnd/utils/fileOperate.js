const fs = require('fs');
// const writeFile = require("util").promisify(fs.writeFile);
const white = (content, username, productName) => {
    return new Promise(async(resolve, reject) => {
        fs.mkdir(`./files/${username}`, { recursive: true }, err => {
            if (err) {
                reject(err);
            } else {
                const address = `./files/${username}/${productName}of${username}.png`;
                // 截取掉base64码前面部分data:image
                // console.log(content);
                const base64 = content.replace(/^data:image\/\w+;base64,/, "");
                const dataBuffer = Buffer.from(base64, "base64");
                fs.writeFile(address, dataBuffer, err => err ? reject(err) :
                    resolve(`${username}/${productName}of${username}.png`));
            }
        })
    })
};
// 这个方法目前不用到了
// const read = (username) => {
//     return new Promise((resolve, reject) => {
//         fs.readdir(`./files/${username}`, (err, files) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 let fileArr = [];
//                 let promiseArr = [];
//                 files.forEach(async(item, index) => {
//                     try {
//                         promiseArr.push(await readFile(`./files/${username}/${item}`));
//                         if (index == files.length - 1) {
//                             Promise.all(promiseArr).then(v => {
//                                 fileArr.push(...v);
//                                 resolve(fileArr);
//                             })
//                         }
//                     } catch (error) {
//                         console.log(error);
//                         reject(error);
//                     }
//                 })
//             }
//         })
//     })
// };
// // 如果该项目名了要写一个新的方法
// // 存数据
const saveData = (content, username, productName) => white(content, username, productName);
// // 拿数据
// const getData = username => read(username);
module.exports = {
    // getData,
    saveData
};