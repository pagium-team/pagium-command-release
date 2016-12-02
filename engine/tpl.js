"use strict";

var fs = require("fs");
var ejs = require("ejs");

/**
 * 样式编译逻辑
 *
 * @author sam.sin
 * @class style
 * @constructor
 */
module.exports = {
	/**
	 * 编译
	 *
	 * @param {String} comId 组件id
	 * @param {String} comPath 组件路径
	 * @param {String} comName 组件名称
	 * @param {String} dataKey 数据键值
	 * @param {Function} callback 回调方法
	 * @method compile
	 */
	compile: function(params, callback) {
		var comId = params.comId;
		var comPath = params.comPath;
		var comName = params.comName; 
		var dataKey = params.comDataKey;

		var dataPath = comPath + "/" + dataKey + ".js";

		if (!fs.existsSync(dataPath)) {
			console.log(dataPath + " is not exist!");
			callback && callback();
			return ;
		}

		var comEjsPath = comPath + "/" + comName + ".ejs";
		if (!fs.existsSync(comEjsPath)) {
			console.log(comEjsPath + " is not exist!");
			callback && callback();
			return ;	
		}

		var ejsContent = fs.readFileSync(comEjsPath, "utf-8");
		ejsContent = ejsContent.replace(/pgId-*/igm, comId + "-");
		ejsContent = ejsContent.replace(/pgClass-*/igm, comId + "-");
		var data = require(dataPath);
		delete require.cache[require.resolve(dataPath)];
		var content = ejs.render(ejsContent, data);
		callback && callback(content);
	}
}