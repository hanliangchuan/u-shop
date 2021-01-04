
const obj = {
    "/api/enterSearch"(obj) {
        let searchTextReg = /^[\u4E00-\u9FA5A-Za-z0-9]+$/; // 搜索内容只能是英文和文字和数字
        if (searchTextReg.test(obj['search_text']) && obj['search_text'] !== undefined) {
            return true;
        } else {
            return false;
        }
    },
    "/users/register"(obj) {
        // 用户名要么是手机号11位/邮箱/大小写字母+数字组合6到20位的
        let telReg = /^[1][3,4,5,7,8][0-9]{9}$/;
        let mailReg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        let userReg = /^[0-9A-Za-z]{6,20}$/;
        // 对密码进行检查 (是否是md5的32位)
        if (telReg.test(obj['username']) || mailReg.test(obj['username']) || userReg.test(obj['username']) && obj['password'].length === 32) {
            return true;
        } else {
            return false;
        }
    },
    "/users/login" (obj) {
        // 用户名要么是手机号11位/邮箱/大小写字母+数字组合5到20位的
        let telReg = /^[1][3,4,5,7,8][0-9]{9}$/;
        let mailReg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        let userReg = /^[0-9A-Za-z]{5,20}$/;
        // 对密码进行检查 (是否是md5的32位)
        if (telReg.test(obj['username']) || mailReg.test(obj['username']) || userReg.test(obj['username']) && obj['password'].length === 32) {
            return true;
        } else {
            return false;
        }
    }
}

exports.validator = (req) => { // 对每个接口的参数, 做出对应的校验规则
    let targetUrl = req.url; // 目标地址
    // 调用obj里对应url的检验方法(如果是post方式/get方式, 传入不同的参数对象)
    if (obj[targetUrl] !== undefined) { // 有检验方法
        return obj[targetUrl](req.method === "GET" ? req.query : req.body);
    } else {
        return true;
    }

}