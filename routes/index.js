//前台不登录就可以访问的接口
var express = require('express');
const formidable = require('formidable'); //处理含有文件上传的表单
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const random = require('string-random');
const { Success, MError } = require("../utils/Result");
const Db = require("../utils/Db");
const { getUUID,getToken,getTree } = require("../utils");
var router = express.Router();
const tableNameCate = 'category';//商品分类
const tableNameBanner = 'banner';//轮播图
const tableNameGoods = 'goods';//商品
const tableNameSpecs = 'specs';//规格表
const tableNameMember = 'member';//会员表
const tableNameSeck = 'seckill';//限时秒杀表
//获取分类信息
router.get("/getcate", async (req, res) => {
    let data = await Db.select(req, `SELECT * FROM ${tableNameCate} WHERE pid = 0 AND status = 1`);
    res.send(Success(data));
});

//获取轮播图信息
router.get("/getbanner", async (req, res) => {
    let data = await Db.select(req, `SELECT * FROM ${tableNameBanner} WHERE status = 1`);
    res.send(Success(data));
});
//获取限时秒杀
router.get("/getseckill",async(req,res)=>{
    // 当天0点
    var start = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime(); 
    // 当天23:59
    var end = new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1000).getTime();
    let data = await Db.select(req,`SELECT a.*,b.img,b.price FROM ${tableNameSeck} a LEFT JOIN ${tableNameGoods} b ON a.goodsid = b.id WHERE begintime >= ${start} AND endtime <= ${end}`);
    res.send(Success(data));
})
//获取首页商品-推荐、最新上架、所有商品
router.get("/getindexgoods",async(req,res)=>{
	let data1 = await Db.select(req, `SELECT id,goodsname,price,market_price,img FROM ${tableNameGoods} WHERE status = 1 AND ishot = 1 LIMIT 10`);
	let data2 = await Db.select(req, `SELECT id,goodsname,price,market_price,img FROM ${tableNameGoods} WHERE status = 1 AND isnew = 1 LIMIT 10`);
	let data3 = await Db.select(req, `SELECT id,goodsname,price,market_price,img FROM ${tableNameGoods} WHERE status = 1 LIMIT 10`);
	let data = [];
	data.push({content:data1});
	data.push({content:data2});
	data.push({content:data3});
	res.send(Success(data));
});
//获取分类信息
router.get("/getcatetree", async (req, res) => {
    let data = await Db.select(req, `SELECT * FROM ${tableNameCate}`);
    res.send(Success(getTree(data)));
});
//获取商品
router.get("/getgoods",async(req,res)=>{
    const {fid,keyword} = req['query'];
    let condition = 'status = 1'
    if(fid){
        condition += ` AND (first_cateid = ${fid} OR second_cateid = ${fid})`;
    }
    if(keyword){
        condition += ` AND goodsname LIKE '%${keyword}%'`
    }
    let data = await Db.select(req, `SELECT id,goodsname,price,market_price,img FROM ${tableNameGoods} WHERE ${condition} `);
    res.send(Success(data));
});
//获取一条商品信息
router.get("/getgoodsinfo", async (req, res) => {
    const {id} = req['query'];
    if (!id) {
        res.send(MError("缺少必要条件"));
        return;
    }
    const info = await Db.select(req, `SELECT a.*,b.specsname FROM ${tableNameGoods} a LEFT JOIN ${tableNameSpecs} b ON a.specsid = b.id WHERE a.id = '${id}'`);
    res.send(Success(info, '获取成功'));
});
//注册
router.post("/register", async (req, res) => {
    
    let { phone,nickname,password } = req['body'];
    const info = await Db.select(req, `SELECT * FROM ${tableNameMember} WHERE phone = '${phone}'`);
    if (info) {
        res.send(MError("手机号已存在，不能重复！"));
    } else {
        const randstr = random(5);
        password += randstr;
        password = crypto.createHash('md5').update(password).digest("hex");
        const result = await Db.insert(req, tableNameMember, {
            uid: getUUID(),
            phone,
            nickname,
            password,
            randstr,
            addtime:new Date().getTime(),
            status:1//新注册
        });
        if (result) {
            res.send(Success([], "注册成功"));
        } else {
            res.send(MError("注册失败"));
        }
    }
});
//登录
router.post("/login", async (req, res) => {
    let { phone,password } = req['body'];
    if(!phone || !password){
        res.send(MError("请填写手机号和密码"));
        return;
    }
    const result = await Db.select(req, `SELECT * FROM ${tableNameMember} WHERE  phone = '${phone}'`)
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
    let = token = getToken(info['uid']);
    let data = {
    	token,uid:info.uid,phone:info.phone,nickname:info.nickname
    }
    res.send(Success(data, '登录成功'));
});
module.exports = router;