// 工具类
const RSA = require("./RSA");
const key = RSA.getRSAKey(); // 得到加密后的秘钥,用于调用加密方法
const Db = require("./Db");
const { tokenTimeout, apiAuthObj } = require("../config/global");
const uuid = require("uuid")['v1'];
const userTable = 'user'
// 生成token字符串
exports.getToken = (uid) => {
    let header = { // token头部信息
        "sec": "RSA", // 密码算法RSA
        "type": "JWT" // 统一jwt类型
    };
    let payload = { // 定义数据信息, 可以自己定义, 但是不要放机密信息
        "nbf": new Date().getTime(), // 生效时间当前系统时间毫秒数
        "uid": uid, // 用户uid
        "lastTime": 60 * 1000 * tokenTimeout,
    }
    const sign = key.encrypt(RSA.base64(header) + "." +
        RSA.base64(payload), 'base64'); // 对前两部分生成RSA签名字符串
    const token = RSA.base64(header) + "." +
        RSA.base64(payload) + "." + sign; // 生成token
    return token;
}

// 负责把前端token中的uid, 挂载到req对象上
// 暂时没考虑uid过期的问题
exports.getuid = async (req) => {
    if (req.headers.authorization === undefined) {
        req.uid = undefined
    } else {
        let arr = req.headers.authorization.split(".");
        if (arr.length === 3 && RSA.base64decode(arr[1]) !== "") {
            let jwtObj = JSON.parse(RSA.base64decode(arr[1]));
            req.uid = jwtObj['uid'];
        }

    }
}

// 检验jwt的token是否过期， 和是否合法
exports.checkToken = async (req) => {
    let arr = req.headers.authorization.split(".");
    let jwtObj;
    if (arr.length === 3 && RSA.base64decode(arr[1]) !== "") {
        jwtObj = JSON.parse(RSA.base64decode(arr[1]));
        // 解密拿出过期时间, 判断是否过期
        if (new Date().getTime() - jwtObj['nbf'] < jwtObj['lastTime']) {
	        if (this.routerAuthFn(req.path)) { // 没过期，而且路由有权限访问
	            return true;
	        } else {
	            return false;
	        }
		} else {
		    return false;
		}
    } else {
        return false; // 前端可以封装网络请求, 判断状态, 统一作出处理
    }
}
// 路由权限验证(用于后台管理系统的)
exports.routerAuthFn = (routerPath,type) => {
    // 每个路由， 对应可以有那些权限用户访问
    return apiAuthObj.indexOf(routerPath) > -1; // true就是有权限
}

exports.getUUID = () => {
    return uuid();
}

exports.getTree = (data) => {
    if(!data){
        return [];
    }
    // 删除 所有 children,以防止多次调用
    data.forEach(function (item) {
        delete item.children;
    });
    // 将数据存储为 以 id 为 KEY 的 map 索引数据列
    var map = {};
    data.forEach(function (item) {
        map[item.id] = item;
    });
    var val = [];
    data.forEach(function (item) {
        // 以当前遍历项，的pid,去map对象中找到索引的id
        var parent = map[item.pid];
        // 如果找到索引，那么说明此项不在顶级当中,那么需要把此项添加到，他对应的父级中
        if (parent) {
            (parent.children || (parent.children = [])).push(item);
        } else {
            //如果没有在map中找到对应的索引ID,那么直接把 当前的item添加到 val结果集中，作为顶级
            val.push(item);
        }
    });
    return val;
}