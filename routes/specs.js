var express = require('express');
var router = express.Router();
const tableName = 'specs'
const tableNameAttr = 'specs_attr'
const { Success, MError } = require("../utils/Result");
const Db = require("../utils/Db");
const crypto = require('crypto');
const { getUid,getToken,getTree } = require("../utils");
//获取规格总数
router.get("/specscount",async(req,res)=>{
    let data = await Db.select(req, `SELECT COUNT(*) AS total FROM ${tableName}`);
    res.send(Success(data));
});

//规格列表
router.get("/specslist", async (req, res) => {
    const { pid,size,page } = req['query'];
    let sql = '';
    if(size && page){
        sql = `SELECT a.*,(SELECT GROUP_CONCAT(b.specsval) FROM ${tableNameAttr} b WHERE a.id = b.specsid) attrs from ${tableName} a LIMIT ${(page-1)*size},${size}`;
    }else{
        sql = `SELECT a.*,(SELECT GROUP_CONCAT(b.specsval) FROM ${tableNameAttr} b WHERE a.id = b.specsid) attrs from ${tableName} a`;
    }
    let data = await Db.select(req, sql);
    if(!data){
        data = [];
    }else{
        data.map(item=>{
            item.attrs = item.attrs ? item.attrs.split(',') : ''
        })
    }
    res.send(Success(data));
});
//添加规格
router.post("/specsadd", async (req, res) => {
    let { specsname,attrs,status } = req['body'];
    const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE specsname = '${specsname}'`);
    if (info) {
        res.send(MError("规格名已存在，不能重复！"));
    } else {
        const result = await Db.insert(req, tableName, {
            specsname,
            status
        });
        if (result) {
            let attr_arr = [];
            if(attrs){
                attr_arr = attrs.split(',');
                Promise.all(attr_arr.map(async attrval => {
                    await Db.insert(req,tableNameAttr,{specsid:result,specsval:attrval})
                }));
            }
            res.send(Success([], "添加成功"));
        } else {
            res.send(MError("添加失败，请查看字段信息是否正确"));
        }
    }
});
//获取一条
router.get("/specsinfo", async (req, res) => {
    const { id } = req['query'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        const info = await Db.select(req, `SELECT a.*,
(SELECT GROUP_CONCAT(b.specsval) FROM ${tableNameAttr} b WHERE a.id = b.specsid) attrs
from ${tableName} a WHERE a.id = '${id}'`);
        if(info){
            info[0].attrs = info[0].attrs.split(',')
        }
        res.send(Success(info, '获取成功'));
    }

})
//修改规格
router.post("/specsedit", async (req, res) => {
    let { id,specsname,attrs,status } = req['body'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        await Db.delete(req, `DELETE FROM ${tableNameAttr} WHERE specsid = '${id}'`);
        const result = await Db.update(req, tableName, {specsname,status}, ` WHERE id = '${id}'`);
        let attr_arr = [];
        if(attrs){
            attr_arr = attrs.split(',');
            Promise.all(attr_arr.map(async attrval => {
                await Db.insert(req,tableNameAttr,{specsid:id,specsval:attrval})
            }));
        }
        result === true ? res.send(Success()) : res.send(MError(result));
    }
});
//删除规格
router.post("/specsdelete", async (req, res) => {
    let { id } = req['body'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        const result = await Db.delete(req, `DELETE FROM ${tableName} WHERE id = '${id}'`);
        Db.delete(req, `DELETE FROM ${tableNameAttr} WHERE specsid = '${id}'`)
        if(result === true){
            data = await Db.select(req, `SELECT a.*,
(SELECT GROUP_CONCAT(b.specsval) FROM ${tableNameAttr} b WHERE a.id = b.specsid) attrs
from ${tableName} a`);
            data=data?data:[]
            data.map(item=>{
                item.attrs = item.attrs.split(',')
            })
            res.send(Success(data))
        }else{
            res.send(MError());
        }
    }
});
module.exports = router;