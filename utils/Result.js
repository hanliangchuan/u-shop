// 参数正确， 获取成功
const {getModel} = require("../model"); // 统一格式化出口的数据

/**
 * list 数据
 * msg 提示文字
 * tableName 需要格式化的表名
 */
exports.Success = (list = [] ,msg = '操作成功', tableName) => {
    if (tableName !== undefined) { // 证明需要格式化
        list = getModel(list, tableName);
    }
    return {
        msg,
        code: 200,
        list
    }
}
// 参数正确， 但是权限不够
exports.Guest = (list = [], msg = '权限非法') => {
    return {
        msg,
        code: 403,
        list
    }
}
// 参数错误，请检查传递的参数
exports.MError = ( msg = '参数等发生错误') => {
    return {
        msg,
        code: 500
    }
}