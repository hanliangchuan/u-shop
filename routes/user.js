var express = require('express');
var router = express.Router();
const tableName = 'user'
const tableNameRole = 'role'
const tableNameMenu = 'menu'
const { Success, MError } = require("../utils/Result");
const Db = require("../utils/Db");
const crypto = require('crypto');
const random = require('string-random');
const { getUUID,getToken,getTree } = require("../utils");
//获取用户总数
router.get("/usercount",async(req,res)=>{
    let data = await Db.select(req, `SELECT COUNT(*) AS total FROM ${tableName}`);
    res.send(Success(data));
});
//用户列表
router.get("/userlist", async (req, res) => {
    const { size,page } = req['query'];
    let data = await Db.select(req, `SELECT a.*,b.rolename FROM ${tableName} a
        LEFT JOIN ${tableNameRole} b
        ON a.roleid = b.id
        ORDER BY a.id
        LIMIT ${(page-1)*size},${size}`);
    res.send(Success(data));
});
//添加用户
router.post("/useradd", async (req, res) => {
    let { roleid,username,password,status } = req['body'];
    const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE username = '${username}'`);
    if (info) {
        res.send(MError("用户名已存在，不能重复！"));
    } else {
        const randstr = random(5);
        password += randstr;
        password = crypto.createHash('md5').update(password).digest("hex");
        const result = await Db.insert(req, tableName, {
            uid: getUUID(),
            username,
            password,
            randstr,
            roleid,
            status
        });
        if (result) {
            res.send(Success([], "添加成功"));
        } else {
            res.send(MError("添加失败，请查看字段信息是否正确"));
        }
    }
});
//获取一条
router.get("/userinfo", async (req, res) => {
    const { uid } = req['query'];
    if (!uid) {
        res.send(MError("缺少必要条件"));
    } else {
        const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE uid = '${uid}'`);
        res.send(Success(info, '获取成功', tableName));
    }

})
//修改用户
router.post("/useredit", async (req, res) => {
    let { uid, roleid,username,password,status } = req['body'];
    if (!uid) {
        res.send(MError("缺少必要条件"));
    } else {
        let info = { roleid,username,status };
        if(password!=''){
            const randstr = random(5);
            password += randstr;
            info.randstr = randstr;
            info.password = crypto.createHash('md5').update(password).digest("hex");
        }
        const result = await Db.update(req, tableName, info, ` WHERE uid = '${uid}'`);
        result === true ? res.send(Success()) : res.send(MError(result));
    }
});
//删除用户
router.post("/userdelete", async (req, res) => {
    let { uid } = req['body'];
    if (!uid) {
        res.send(MError("缺少必要条件"));
    } else {
        const result = await Db.delete(req, `DELETE FROM ${tableName} WHERE uid = '${uid}'`);
        if(result === true){
            data = await Db.select(req, `SELECT * FROM ${tableName}`);
            res.send(Success(data))
        }else{
            res.send(MError());
        }
    }
});
module.exports = router;