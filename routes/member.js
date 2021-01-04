var express = require('express');
var router = express.Router();
const tableName = 'member'
const { Success, MError } = require("../utils/Result");
const Db = require("../utils/Db");
const crypto = require('crypto');
const random = require('string-random');
//获取会员总数
router.get("/membercount",async(req,res)=>{
    let data = await Db.select(req, `SELECT COUNT(*) AS total FROM ${tableName}`);
    res.send(Success(data));
});
//会员列表
router.get("/memberlist", async (req, res) => {
    const { size,page } = req['query'];
    let data = [];
    if(size && page){
        data = await Db.select(req, `SELECT * FROM ${tableName} LIMIT ${(page-1)*size},${size}`);
    }else{
        data = await Db.select(req, `SELECT * FROM ${tableName}`);
    }
    res.send(Success(data));
});
//获取一条
router.get("/memberinfo", async (req, res) => {
    const { uid } = req['query'];
    if (!uid) {
        res.send(MError("缺少必要条件"));
    } else {
        const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE uid = '${uid}'`);
        res.send(Success(info, '获取成功', tableName));
    }

})
//修改会员
router.post("/memberedit", async (req, res) => {
    let { uid, nickname,phone,password,status } = req['body'];
    if (!uid) {
        res.send(MError("缺少必要条件"));
    } else {
        let info = { nickname,phone,password,status };
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
module.exports = router;