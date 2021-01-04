exports.getModel = (data, tableName) => { // data: 传入要处理的数据, tableName为了查找对应执行的文件名
    // 先调用表里固定的check方法, 先处理数据
    const check = require("./" + tableName)['check'];
    let objArg = check(data);
    // 再执行下面, 处理需要留下的字段
    if (objArg instanceof Array) { // 格式化数组里的对象
        const objModel = require("./" + tableName)['model'];
        let resultArr = objArg.map(dataObj => {
            let obj = {...objModel};
            for (let prop in obj) {
                obj[prop] = dataObj[prop];
            }
            return obj;
        })
        if (resultArr.length === 1) return resultArr[0]; // 如果只有一个元素, 则返回对象
        return resultArr;
    } else if (objArg instanceof Object) { // 格式化普通对象
        const objModel = require("./" + tableName)['model'];
        for (let prop in objModel) {
            objModel[prop] = objArg[prop];
        }
        return objModel;
    }
    
}