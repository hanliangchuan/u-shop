var express = require('express');
var router = express.Router();
const tableName = 'user'
const tableNameRole = 'role'
const tableNameMenu = 'menu'
const { Success, MError } = require("../utils/Result");
const Db = require("../utils/Db");
const crypto = require('crypto');
const random = require('string-random');
const { getToken,getTree } = require("../utils");
//用户登录
router.post("/userlogin", async (req, res) => { // 登录接口
    let { username,password } = req['body'];
    if(!username || !password){
        res.send(MError("请填写用户名和密码"));
        return;
    }
    const result = await Db.select(req, `SELECT * FROM ${tableName} WHERE  username = '${username}'`)
    if(result === null){
        res.send(MError("用户信息不存在"));
        return;
    }
    const info = result[0];
    password += info.randstr;
    password = crypto.createHash('md5').update(password).digest("hex");
    if(password !== info.password){
        res.send(MError("用户名密码错误"));
        return;
    }
    let role = await Db.select(req,`SELECT * FROM ${tableNameRole} WHERE id = ${info['roleid']}`);
    role.menus=JSON.parse(role[0].menus)
    let menus = await Db.select(req,`SELECT * FROM ${tableNameMenu} WHERE id IN (${role['menus']})`);
    

    let menus_url = [];
    for(let i=0;i<menus.length;i++){
        if(menus[i].pid!=0){
            menus_url.push(menus[i].url);
        }
    }
    info.menus_url = menus_url;
    info.menus = getTree(menus)
    delete info.password;
    delete info.randstr;
    info['token'] = getToken(info['uid']);
    res.send(Success(info, '登录成功'));
});


module.exports = router;