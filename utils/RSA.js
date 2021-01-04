const NodeRSA = require('node-rsa');
const fs = require("fs");
// 注意路径,都在app.js运行的,所以以app.js为准
// RSA的私钥
rsaS = fs.readFileSync("./pem/public.pem");
// 对应的公钥
publicKey = fs.readFileSync("./pem/private.pem");
class RSA {
    static base64(str) { //base64加密方法
        if (typeof str !== 'string') {
            str = JSON.stringify(str);
        }
        return Buffer.from(str).toString("base64");
    }
    static base64decode(str = "") { // base64解密
        return Buffer.from(str, "base64").toString('utf-8');
    }
    static getRSAKey() {
        return new NodeRSA(rsaS); // 生成秘钥工具
    }
}

module.exports = RSA;

