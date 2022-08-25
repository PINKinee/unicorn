const db = require('../database/index');
const sqlUtils = require('../utils/sqlOperate');
const moment = require('../utils/date');
const { typeJudge } = require('../utils/judge');
const { strJudge } = require('../utils/judge');
const callbackFn = require('../utils/callbackFn');
const fileUtils = require('../utils/fileOperate');
module.exports = {
    db,
    sqlUtils,
    moment,
    fileUtils,
    typeJudge,
    strJudge,
    callbackFn
}