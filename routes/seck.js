var express = require('express');
var router = express.Router();
const tableName = 'seckill'
const { Success, MError } = require("../utils/Result");
const Db = require("../utils/Db");
//秒杀活动列表
router.get("/secklist", async (req, res) => {
    let data = await Db.select(req, `SELECT * FROM ${tableName}`);
    res.send(Success(data));
});
//添加秒杀活动
router.post("/seckadd", async (req, res) => {
    let { title,begintime,endtime,first_cateid,second_cateid,goodsid,status } = req['body'];
    const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE title = '${title}'`);
    if (info) {
        res.send(MError("秒杀活动名称已存在，不能重复！"));
    } else {
        const result = await Db.insert(req, tableName, {
            title,
            begintime,
            endtime,
            first_cateid,
            second_cateid,
            goodsid,
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
router.get("/seckinfo", async (req, res) => {
    const { id } = req['query'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        let sql = `SELECT * from ${tableName} WHERE id = ${id}`;
        let info = await Db.select(req, sql);
        res.send(Success(info, '获取成功', tableName));
    }

})
//修改秒杀活动
router.post("/seckedit", async (req, res) => {
    let { id, title,begintime,endtime,first_cateid,second_cateid,goodsid,status } = req['body'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        const result = await Db.update(req, tableName, { title,begintime,endtime,first_cateid,second_cateid,goodsid,status }, ` WHERE id = ${id}`);
        result === true ? res.send(Success()) : res.send(MError(result));
    }
});
//删除秒杀活动
router.post("/seckdelete", async (req, res) => {
    let { id } = req['body'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        const result = await Db.delete(req, `DELETE FROM ${tableName} WHERE id = '${id}'`);
        if(result === true){
            data = await Db.select(req, `SELECT * FROM ${tableName}`);
            res.send(Success(data))
        }else{
            res.send(MError());
        }
    }
});
module.exports = router;