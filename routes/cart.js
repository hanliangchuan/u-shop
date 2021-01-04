var express = require('express');
var router = express.Router();
const tableName = 'cart'
const tableNameGoods = 'goods'
const { Success, MError } = require("../utils/Result");
const Db = require("../utils/Db");
const { getTree } = require("../utils");
//购物车列表
router.get("/cartlist", async (req, res) => {
    const { uid } = req['query'];
    if(!uid){
    	res.send(MError("缺少必要条件"));
    	return;
    }
    let data = await Db.select(req, `SELECT a.*,b.goodsname,b.price,b.img FROM ${tableName} a LEFT JOIN ${tableNameGoods} b ON a.goodsid = b.id WHERE a.uid = '${uid}'`);
    res.send(Success(data));
});
//添加购物车
router.post("/cartadd", async (req, res) => {
    let { uid,goodsid,num } = req['body'];
    const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE uid = '${uid}' AND goodsid = ${goodsid}`);
    let result = '';
    if (info) {
        //更新数量
        result = await Db.update(req, tableName, {num:++info[0].num}, ` WHERE id = ${info[0].id}`);
    } else {
        result = await Db.insert(req, tableName, {
            uid,goodsid,num,status:1
        });
    }
    if (result) {
        res.send(Success([], "添加成功"));
    } else {
        res.send(MError("添加失败，请查看字段信息是否正确"));
    }
});
//修改购物车
router.post("/cartedit", async (req, res) => {
    let { id,type } = req['body'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
    	const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE id = ${id}`);
    	let data = { num:info[0].num };
    	data.num = type==1 ? --data.num : ++data.num;
        const result = await Db.update(req, tableName, data, ` WHERE id = ${id}`);
        result === true ? res.send(Success()) : res.send(MError(result));
    }
});
//删除购物车
router.post("/cartdelete", async (req, res) => {
    let { id } = req['body'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        const result = await Db.delete(req, `DELETE FROM ${tableName} WHERE id = '${id}'`);
        if(result === true){
            res.send(Success([],"删除成功"))
        }else{
            res.send(MError());
        }
    }
});
module.exports = router;