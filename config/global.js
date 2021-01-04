/** -------------数据库变更需要修改的地方----------- */
// 数据库连接参数
exports.dbConfig = {
    host: 'localhost', //数据库地址
    user: 'root',//数据库用户名
    password: 'root',//数据库用户密码
    port: 3306,
    database: 'umall' // 数据库名字
}

// token过期时间 (分钟单位)
exports.tokenTimeout = 60;

// api路由权限对照列表(字段是用户表中用户身份标识字符串)
exports.apiAuthObj = [
    '/api/menulist','/api/menuadd','/api/menuinfo','/api/menuedit','/api/menudelete',
    '/api/rolelist','/api/roleadd','/api/roleinfo','/api/roleedit','/api/roledelete',
    '/api/usercount','/api/userlist','/api/useradd','/api/userinfo','/api/useredit','/api/userdelete',
    '/api/catelist','/api/cateadd','/api/cateinfo','/api/cateedit','/api/catedelete',
    '/api/specscount','/api/specslist','/api/specsadd','/api/specsinfo','/api/specsedit','/api/specsdelete',
    '/api/goodscount','/api/goodslist','/api/goodsadd','/api/goodsinfo','/api/goodsedit','/api/goodsdelete',
    '/api/bannerlist','/api/banneradd','/api/bannerinfo','/api/banneredit','/api/bannerdelete',
    '/api/secklist','/api/seckadd','/api/seckinfo','/api/seckedit','/api/seckdelete',
    '/api/membercount','/api/memberlist','/api/memberinfo','/api/memberedit',
    '/api/cartlist','/api/cartadd','/api/cartinfo','/api/cartedit','/api/cartdelete'
]