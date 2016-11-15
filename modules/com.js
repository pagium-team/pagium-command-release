"use strict";

var fs = require("fs");
var globalConfig = require("../config/global"); // 全局配置
var engine = require("../engine");
var uuid = require("../utils/uuid"); // 随机id

/**
 * com 组件逻辑
 *
 * @author sam.sin
 * @class com
 * @constructor
 */
module.exports = {
	/**
	 * 编译
	 *
	 * @param {String} comName 组件名称
	 * @method compile
	 */
	compile: function(comName, comDataKey, callback) {
		var comPath = globalConfig.path + "/components/" + comName;
		if (!fs.existsSync(comPath)) {
			console.log(comPath + " not exist!");
			return ;
		}

		var comObj = {
			id: uuid(),
			style: false,
			tpl: false,
			script: false
		};

		var self = this;

		engine.script.compile({
			comId: comObj.id,
			comPath: comPath, 
			comName: comName
		}, function(scriptContent) {
			comObj.script = scriptContent;
			self.next(comObj, callback);
		});

		engine.style.compile({
			comId: comObj.id,
			comPath: comPath, 
			comName: comName
		}, function(styleContent) {
			comObj.style = styleContent;
			self.next(comObj, callback);
		});

		engine.tpl.compile({
			comId: comObj.id,
			comPath: comPath, 
			comName: comName,
			comDataKey: comDataKey
		}, function(tplContent) {
			comObj.tpl = tplContent;
			self.next(comObj, callback);
		});
	},

	/**
	 * 下一步执行方法
	 *
	 * @param {Function} comObj 组件对象
	 * @param {Function} callback 编译回调方法
	 * @method next
	 */
	next: function(comObj, callback) {
		var isComplete = true;
		for (var key in comObj) {
			if (comObj[key] == false) {
				isComplete = false;
				break ;
			}
		}
		if (isComplete) {
			callback && callback(comObj);
		}
	}
}