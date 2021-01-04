/*
Navicat MySQL Data Transfer

Source Server         : localhost_3306
Source Server Version : 50520
Source Host           : localhost:3306
Source Database       : usmall

Target Server Type    : MYSQL
Target Server Version : 50520
File Encoding         : 65001

Date: 2020-07-30 18:37:42
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for banner
-- ----------------------------
DROP TABLE IF EXISTS `banner`;
CREATE TABLE `banner` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '轮播图id',
  `title` varchar(50) NOT NULL COMMENT '轮播图标题',
  `img` varchar(255) NOT NULL COMMENT '轮播图图片地址',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='轮播图表';

-- ----------------------------
-- Records of banner
-- ----------------------------
INSERT INTO `banner` VALUES ('1', 'lun1', '/uploads/banner/e5b58320-d20c-11ea-be39-212a38807521.jpg', '1');

-- ----------------------------
-- Table structure for cart
-- ----------------------------
DROP TABLE IF EXISTS `cart`;
CREATE TABLE `cart` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '购物车主键',
  `uid` varchar(50) NOT NULL COMMENT '用户id',
  `goodsid` int(11) NOT NULL COMMENT '商品编号',
  `num` tinyint(3) NOT NULL COMMENT '数量',
  `status` tinyint(1) NOT NULL COMMENT '选中状态',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uid` (`uid`,`goodsid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='购物车表';

-- ----------------------------
-- Records of cart
-- ----------------------------

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '分类编号',
  `pid` smallint(5) unsigned NOT NULL COMMENT '上级分类编号',
  `catename` varchar(50) NOT NULL COMMENT '分类名称',
  `img` varchar(255) NOT NULL COMMENT '分类图片',
  `status` tinyint(1) unsigned NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='商品分类表';

-- ----------------------------
-- Records of category
-- ----------------------------
INSERT INTO `category` VALUES ('6', '0', '家用电器', 'null', '1');
INSERT INTO `category` VALUES ('7', '6', '冰箱', '/uploads/category/72a40300-d06f-11ea-a2bd-59921d076aa0.jpg', '1');
INSERT INTO `category` VALUES ('8', '6', '微波炉', '/uploads/category/82c29940-d06f-11ea-a2bd-59921d076aa0.jpg', '1');
INSERT INTO `category` VALUES ('9', '0', '电子产品', 'null', '1');
INSERT INTO `category` VALUES ('10', '9', '手机', '/uploads/category/90658120-d06f-11ea-a2bd-59921d076aa0.jpg', '1');
INSERT INTO `category` VALUES ('11', '9', '电脑', '/uploads/category/9637fba0-d06f-11ea-a2bd-59921d076aa0.jpg', '1');

-- ----------------------------
-- Table structure for goods
-- ----------------------------
DROP TABLE IF EXISTS `goods`;
CREATE TABLE `goods` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '商品编号',
  `first_cateid` smallint(5) unsigned NOT NULL COMMENT '一级分类编号',
  `second_cateid` smallint(6) NOT NULL COMMENT '二级分类编号',
  `goodsname` varchar(100) NOT NULL COMMENT '商品名称',
  `price` decimal(10,2) NOT NULL COMMENT '商品价格',
  `market_price` decimal(10,2) NOT NULL COMMENT '市场价格',
  `img` varchar(255) NOT NULL COMMENT '商品图片',
  `description` text COMMENT '商品描述',
  `specsid` int(11) NOT NULL COMMENT '规格id',
  `specsattr` varchar(255) NOT NULL COMMENT '规则属性值',
  `isnew` tinyint(1) NOT NULL COMMENT '是否新品1是2不是',
  `ishot` tinyint(1) NOT NULL COMMENT '是否热卖1是2不是',
  `status` tinyint(1) NOT NULL COMMENT '状态1启用2禁用',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='商品表';

-- ----------------------------
-- Records of goods
-- ----------------------------
INSERT INTO `goods` VALUES ('1', '6', '7', '美的', '100.00', '200.00', '/uploads/d16f2b60-d07b-11ea-a2bd-59921d076aa0.jpg', '<h2>美的就是好！</h2>', '15', '[\"22\",\"24\",\"20\"]', '1', '1', '1');

-- ----------------------------
-- Table structure for member
-- ----------------------------
DROP TABLE IF EXISTS `member`;
CREATE TABLE `member` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `uid` varchar(50) NOT NULL COMMENT '用户编号',
  `phone` char(11) NOT NULL COMMENT '手机号',
  `nickname` varchar(50) NOT NULL COMMENT '昵称',
  `password` char(32) NOT NULL COMMENT '密码',
  `randstr` char(5) NOT NULL COMMENT '密码随机串',
  `addtime` char(13) NOT NULL COMMENT '注册时间',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='会员表';

-- ----------------------------
-- Records of member
-- ----------------------------
INSERT INTO `member` VALUES ('1', '11', '111', '小u', '123', '123', '123', '1');
INSERT INTO `member` VALUES ('2', '22', '222', '小就', 'd103aa32000e3d3c16a2ca8d076d4723', '19Dc6', '123', '1');

-- ----------------------------
-- Table structure for menu
-- ----------------------------
DROP TABLE IF EXISTS `menu`;
CREATE TABLE `menu` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '菜单编号',
  `pid` smallint(6) NOT NULL COMMENT '上级菜单编号',
  `title` varchar(50) NOT NULL COMMENT '菜单名称',
  `icon` varchar(100) NOT NULL COMMENT '菜单图标',
  `type` tinyint(1) NOT NULL COMMENT '菜单类型1目录2菜单',
  `url` varchar(100) NOT NULL COMMENT '菜单地址',
  `status` tinyint(1) NOT NULL COMMENT '菜单状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='后台菜单权限表';

-- ----------------------------
-- Records of menu
-- ----------------------------
INSERT INTO `menu` VALUES ('7', '0', '系统设置', 'el-icon-setting', '1', '', '1');
INSERT INTO `menu` VALUES ('8', '7', '菜单管理', '', '2', '/menu', '1');
INSERT INTO `menu` VALUES ('9', '7', '角色管理', '', '2', '/role', '1');
INSERT INTO `menu` VALUES ('10', '7', '管理员管理', '', '2', '/manage', '1');
INSERT INTO `menu` VALUES ('11', '0', '商城管理', 'el-icon-s-help', '1', '', '1');
INSERT INTO `menu` VALUES ('12', '11', '商品分类', '', '2', '/cate', '1');
INSERT INTO `menu` VALUES ('13', '11', '商品规格', '', '2', '/spec', '1');
INSERT INTO `menu` VALUES ('14', '11', '商品管理', '', '2', '/goods', '1');
INSERT INTO `menu` VALUES ('15', '11', '会员管理', '', '2', '/member', '1');
INSERT INTO `menu` VALUES ('16', '11', '轮播图管理', '', '2', '/banner', '1');
INSERT INTO `menu` VALUES ('17', '11', '秒杀活动', '', '2', '/seckill', '1');

-- ----------------------------
-- Table structure for role
-- ----------------------------
DROP TABLE IF EXISTS `role`;
CREATE TABLE `role` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '角色编号',
  `rolename` varchar(100) NOT NULL COMMENT '角色名称',
  `menus` varchar(255) NOT NULL COMMENT '菜单权限 存放的是菜单编号，用逗号隔开',
  `status` tinyint(1) NOT NULL COMMENT '角色状态1正常2禁用',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='后台用户角色表';

-- ----------------------------
-- Records of role
-- ----------------------------
INSERT INTO `role` VALUES ('6', '超级管理员', '[7,8,9,10,11,12,13,14,15,16,17]', '1');
INSERT INTO `role` VALUES ('7', '客服', '[7,8,9,10,15,16,17]', '1');
INSERT INTO `role` VALUES ('8', '活动管理', '[15,16,17]', '1');

-- ----------------------------
-- Table structure for seckill
-- ----------------------------
DROP TABLE IF EXISTS `seckill`;
CREATE TABLE `seckill` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '秒杀表id',
  `title` varchar(100) NOT NULL COMMENT '活动名称',
  `begintime` char(13) NOT NULL COMMENT '秒杀开始时间',
  `endtime` char(13) NOT NULL COMMENT '秒杀结束时间',
  `first_cateid` smallint(5) NOT NULL COMMENT '商品一级分类编号',
  `second_cateid` smallint(5) NOT NULL COMMENT '商品二级分类编号',
  `goodsid` int(11) NOT NULL COMMENT '商品编号',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='限时秒杀活动表';

-- ----------------------------
-- Records of seckill
-- ----------------------------
INSERT INTO `seckill` VALUES ('1', '七夕', '1595260800000', '1597680000000', '9', '10', '1', '1');

-- ----------------------------
-- Table structure for specs
-- ----------------------------
DROP TABLE IF EXISTS `specs`;
CREATE TABLE `specs` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '规格id',
  `specsname` varchar(50) NOT NULL COMMENT '规格名称',
  `status` tinyint(1) NOT NULL COMMENT '规格状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='商品规格表';

-- ----------------------------
-- Records of specs
-- ----------------------------
INSERT INTO `specs` VALUES ('15', '冰箱大小', '1');
INSERT INTO `specs` VALUES ('16', '微波炉颜色', '1');
INSERT INTO `specs` VALUES ('17', '手机内存', '1');
INSERT INTO `specs` VALUES ('18', '电脑尺寸', '1');

-- ----------------------------
-- Table structure for specs_attr
-- ----------------------------
DROP TABLE IF EXISTS `specs_attr`;
CREATE TABLE `specs_attr` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '规格项编号',
  `specsid` int(11) NOT NULL COMMENT '规格的specsid',
  `specsval` varchar(50) NOT NULL COMMENT '规格值',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=45 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='商品规格明细表';

-- ----------------------------
-- Records of specs_attr
-- ----------------------------
INSERT INTO `specs_attr` VALUES ('34', '15', '[\"20\"');
INSERT INTO `specs_attr` VALUES ('35', '15', '\"22\"');
INSERT INTO `specs_attr` VALUES ('36', '15', '\"24\"]');
INSERT INTO `specs_attr` VALUES ('37', '16', '[\"白色\"');
INSERT INTO `specs_attr` VALUES ('38', '16', '\"黑色\"]');
INSERT INTO `specs_attr` VALUES ('39', '17', '[\"64\"');
INSERT INTO `specs_attr` VALUES ('40', '17', '\"128\"');
INSERT INTO `specs_attr` VALUES ('41', '17', '\"256\"]');
INSERT INTO `specs_attr` VALUES ('42', '18', '[\"13.3\"');
INSERT INTO `specs_attr` VALUES ('43', '18', '\"14\"');
INSERT INTO `specs_attr` VALUES ('44', '18', '\"15.6\"]');

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` smallint(5) unsigned NOT NULL AUTO_INCREMENT COMMENT '住建',
  `uid` varchar(50) NOT NULL COMMENT '管理员编号',
  `roleid` smallint(5) NOT NULL COMMENT '角色编号',
  `username` varchar(30) NOT NULL COMMENT '用户名',
  `password` char(32) NOT NULL COMMENT '密码',
  `randstr` char(5) NOT NULL COMMENT '随机加密串',
  `status` tinyint(1) NOT NULL COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uid` (`uid`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 ROW_FORMAT=DYNAMIC COMMENT='后台管理员用户表';

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES ('8', '4dc24a90-cd83-11ea-87be-2d0427c9aba4', '6', 'admin', '9f360b93367b75ad445d5cc4506755f1', '5pyiV', '1');
INSERT INTO `user` VALUES ('9', '52e412b0-cd83-11ea-87be-2d0427c9aba4', '7', 'kefu1', '08663062fd37215d153bd223842d3853', 'CXSVf', '1');
INSERT INTO `user` VALUES ('10', '56ea7fc0-cd83-11ea-87be-2d0427c9aba4', '7', 'kefu2', 'f7d4578441098af084549c3e806dd772', 'zfupr', '1');
INSERT INTO `user` VALUES ('11', '5aa564e0-cd83-11ea-87be-2d0427c9aba4', '7', 'kefu3', '5815e0779829a052b73a8f39fb54f601', 'elHvl', '1');
INSERT INTO `user` VALUES ('12', '31889d50-d096-11ea-ba2e-dd6975a291e7', '8', 'huodong1', 'c8473b36b03a9610ce5d5077618f1d68', 'cjnFk', '1');
