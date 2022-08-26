const typeJudge = (obj) => {
    if (typeof obj === 'undefined' || obj === null || obj.toString().trim() === '') {
        return null;
    } else {
        return obj;
    }
}

const strJudge = (str, arr) => {
    const num = Array.from(arr).indexOf(str);
    if (num > -1) {
        return true;
    } else {
        return false;
    }
};
module.exports = {
    typeJudge,
    strJudge
}