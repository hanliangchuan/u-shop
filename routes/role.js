var express = require('express');
var router = express.Router();
const tableName = 'role'
const { Success, MError } = require("../utils/Result");
const Db = require("../utils/Db");
//角色列表
router.get("/rolelist", async (req, res) => {
    const { pid } = req['query'];
    let data = await Db.select(req, `SELECT * FROM ${tableName}`);
    res.send(Success(data));
});
//添加角色
router.post("/roleadd", async (req, res) => {
    let { rolename,menus,status } = req['body'];
    const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE rolename = '${rolename}'`);
    if (info) {
        res.send(MError("角色名称已存在，不能重复！"));
    } else {
        const result = await Db.insert(req, tableName, {
            rolename,menus,status
        });
        if (result) {
            res.send(Success("添加成功"));
        } else {
            res.send(MError("添加失败，请查看字段信息是否正确"));
        }
    }
});
//获取一条
router.get("/roleinfo", async (req, res) => {
    const { id } = req['query'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE id = '${id}'`);
        res.send(Success(info, '获取成功', tableName));
    }

})
//修改角色
router.post("/roleedit", async (req, res) => {
    let { id, rolename,menus,status } = req['body'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        const result = await Db.update(req, tableName, { rolename,menus,status }, ` WHERE id = ${id}`);
        result === true ? res.send(Success()) : res.send(MError(result));
    }
});
//删除角色
router.post("/roledelete", async (req, res) => {
    let { id } = req['body'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        let data = await Db.select(req, `SELECT * FROM ${tableName} WHERE pid = ${id}`);
        if(data){
            res.send(MError("该角色下还有子级角色，不能删除！"));
            return;
        }
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