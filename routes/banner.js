var express = require('express');
const formidable = require('formidable'); //处理含有文件上传的表单
const path = require('path');
const fs = require('fs');
var multipart = require('connect-multiparty');
var router = express.Router();
const tableName = 'banner'
const { Success, MError } = require("../utils/Result");
const Db = require("../utils/Db");
const { getTree,getUUID } = require("../utils");
//轮播图列表
router.get("/bannerlist", async (req, res) => {
    const { pid,istree } = req['query'];
    let data = [];
    if(pid){
        data = await Db.select(req, `SELECT * FROM ${tableName} WHERE pid = ${pid}`);
    }else{
        data = await Db.select(req, `SELECT * FROM ${tableName}`);
    }
    istree ? res.send(Success(getTree(data))) : res.send(Success(data));
});

// 移动图片的方法
const moveFile = async (req) => {
	const formObj = new formidable.IncomingForm(); // 新建form对象
	formObj.encoding = 'UTF-8'; // UTF8编码
	formObj.uploadDir = "./tempDir"; // 接收的文件缓存路径
	return new Promise((resolve, reject) => {
		formObj.parse(req, (err, fields, files) => {
			if(!files.img){
				resolve({
					body: fields,
					fileName:''
				});
				return;
			}
			let fileObj = files.img;
			let oldPath = fileObj['path'];
			let fileName = getUUID() + path.extname(fileObj['name']);
			let newPath = "public/uploads/banner/" + fileName;
			fs.rename(oldPath, newPath, (err) => { // 7. 挪动
				if (err) {
					console.error(err);
					resolve(false);
				} else {
					resolve({
						body: fields,
						fileName: "/uploads/banner/" + fileName
					});
				}
			});
		});
	})
}

//添加轮播图
router.post("/banneradd", async (req, res) => {
	const resultObj = await moveFile(req);
	if (resultObj === false) {
		res.send(MError([], "轮播图信息上传失败"));
		return;
	}
	let data = resultObj['body'];
	if(resultObj['fileName']){
		data.img = resultObj['fileName'];
	}
	const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE title = '${data.title}'`);
	if (info) {
		res.send(MError("轮播图标题已存在，不能重复！"));
	} else {
		const result = await Db.insert(req, tableName, data);
		if (result) {
			res.send(Success([], "添加成功"));
		} else {
			res.send(MError("添加失败，请查看字段信息是否正确"));
		}
	}
    
});
//获取一条
router.get("/bannerinfo", async (req, res) => {
    const {id} = req['query'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        const info = await Db.select(req, `SELECT * FROM ${tableName} WHERE id = '${id}'`);
        res.send(Success(info, '获取成功', tableName));
    }

})
//修改轮播图
router.post("/banneredit", async (req, res) => {
	const resultObj = await moveFile(req);
	if (resultObj === false) {
		res.send(MError([], "轮播图信息上传失败"));
		return;
	}
	let data = resultObj['body'];
	let id = data.id;
	if (!id) {
        res.send(MError("缺少必要条件"));
    } 
    delete data.id;
	if(resultObj['fileName']){
		data.img = resultObj['fileName'];
	}
	const result = await Db.update(req, tableName, data, ` WHERE id = ${id}`);
    result === true ? res.send(Success()) : res.send(MError(result));
	if (result) {
		res.send(Success([], "添加成功"));
	} else {
		res.send(MError("添加失败，请查看字段信息是否正确"));
	}
});
//删除轮播图
router.post("/bannerdelete", async (req, res) => {
    let { id } = req['body'];
    if (!id) {
        res.send(MError("缺少必要条件"));
    } else {
        let data = await Db.select(req, `SELECT * FROM ${tableName} WHERE pid = ${id}`);
        if(data){
            res.send(MError("该轮播图下还有子级轮播图，不能删除！"));
            return;
        }
        const result = await Db.delete(req, `DELETE FROM ${tableName} WHERE id = '${id}'`);
        if(result === true){
            data = await Db.select(req, `SELECT * FROM ${tableName}`);
            res.send(Success(getTree(data)))
        }else{
            res.send(MError());
        }
    }
});
module.exports = router;