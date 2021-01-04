var mysql = require('mysql'); // node-mysql module
var myConnection = require('express-myconnection') // express连接mysql的中间件
const {
    getModel
} = require("../model"); // 获取对应表model模型字段
const {
    validator
} = require("../validator"); // 引入数据合法性验证
const {
    dbConfig
} = require("../config/global");

class Db {
    constructor() {
        // mysql数据库相关配置
        this.connection = myConnection(mysql, dbConfig, 'single');
    }

    /**
     * 查询方法
     * @param {*} req 网路请求对象
     * @param {*} sqlStr 要执行的SQL语句(查询的)
     * @resolve 非null有结果, null代表无结果
     */
    select(req, sqlStr) {
        return new Promise((resolve, reject) => {
            req.getConnection(function (err, connection) {
                connection.query(sqlStr, [], function (err, results) {
                    if (err) {
                        console.error(err);
                        resolve(null);
                    } else {
                        if (results.length > 0) {
                            resolve(results)
                            // results.length === 1 ? resolve(results[0]) : resolve(results);
                        } else {
                            resolve(null);
                        }
                    }
                });
            });
        })

    }

    /**
     * 插入数据
     * @param {*} req 网络请求对象
     * @param {*} tableName 要执行插入的表名
     * @param {*} obj 代表要插入的数字字段对象
     * @resolve true代表插入成功, 字符串代表插入失败
     */
    insert(req, tableName, obj) {
        return new Promise((resolve, reject) => {
            let sqlStr = "";
            if (obj !== undefined && typeof obj === "object" && Object.keys(obj).length > 0) {
                // 把对象的key:value拼接成 ( field1, field2,...fieldN )
                //    VALUES
                //    ( value1, value2,...valueN )
                sqlStr = ' ( ';
                for (let prop in obj) {
                    sqlStr += prop + " , "
                }
                sqlStr = sqlStr.substr(0, sqlStr.length - 3);
                sqlStr += " ) VALUES ( ";
                for (let prop in obj) {
                    sqlStr += (typeof obj[prop] === 'number' ? obj[prop] : "'" + obj[prop] + "'") + " , ";
                }
                sqlStr = sqlStr.substr(0, sqlStr.length - 3);
                sqlStr += " ) ";
            }
            req.getConnection(function (err, connection) {
                connection.query(`INSERT INTO  ` + "`" + tableName + "`" + sqlStr, [], function (err, results) {
                    if (err) {
                        console.error(err);
                        resolve("数据字段/值有误, 信息可能已存在");
                    } else {
                        if (results.affectedRows > 0) {
                            resolve(results.insertId);
                        } else {
                            resolve('数据可能已经存在');
                        }
                    }
                });
            });
        })
    }

    /**
     * 更新操作
     * @param {*} req   网络请求对象
     * @param {*} tableName 表名
     * @param {*} obj 要更新的数据对象
     * @param {*} where 条件等后面的语句
     * @resolve 只有true, 才是全部正确, 返回字符串则失败
     */
    update(req, tableName, obj, where) {
        return new Promise(async (resolve, reject) => {
            let sqlStr = `UPDATE ${tableName} SET `;
            if (obj !== undefined && typeof obj === "object" && Object.keys(obj).length > 0) {
                // 把对象的key:value拼接成 key=value的字符串
                for (let prop in obj) {
                    sqlStr += prop + " = '" + obj[prop] + "' , "
                }
                sqlStr = sqlStr.substr(0, sqlStr.length - 3); // 去掉最后多加空格和逗号
            }
            sqlStr += where; // 拼接后面的选择性条件
            req.getConnection(function (err, connection) {
                connection.query(sqlStr, [], function (err, results) {
                    if (err) {
                        console.error(err);
                        resolve("更新条件有误");
                    } else {
                        if (results.affectedRows > 0) {
                            resolve(true);
                        } else {
                            resolve("更新条件有误");
                        }
                    }
                });
            });
        })
    }
    delete(req, sqlStr) {
        return new Promise((resolve, reject) => {
            req.getConnection(function (err, connection) {
                connection.query(sqlStr, [], function (err, results) {
                    if (err) {
                        console.error(err);
                        resolve(null);
                    } else {
                        if (results.affectedRows > 0) {
                           resolve(true);
                        } else {
                            resolve(null);
                        }
                    }
                });
            });
        })
    }
}

module.exports = new Db();