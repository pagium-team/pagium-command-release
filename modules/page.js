"use strict";

var fs = require("fs");
var com = require("./com"); // 组件逻辑

/**
 * page 页面逻辑
 *
 * @author sam.sin
 * @class page
 * @constructor
 */
module.exports = {
	/**
	 * 编译单个页面
	 *
	 * @param {String} projectPath 项目路径
	 * @param {String} pageName 页面名称
	 * @method compile
	 */
	compile: function(projectPath, pageName) {
		var htmlPath = projectPath + "/views/" + pageName + ".html";
		if (!fs.existsSync(htmlPath)) {
			console.log(htmlPath + " not exist!");
			return ;
		}

		var pageContent = fs.readFileSync(htmlPath, "utf-8"); // 读出 html 内容
		var comsStr = pageContent.match(/{{{.*}}}/g); // 找出所有组件配置
		if (comsStr && comsStr.length > 0) {
			var comObjs = [];
			var count = 0;
			for (var i = 0, len = comsStr.length; i < len; ++i) { 
				var reg = new RegExp(/name="(.*?)"/i);
				var comName;
				if (comsStr[i].match(reg)) {
					comName = RegExp.$1;
				} else {
					console.log("模板格式书写错误");
				}
				
				var reg = new RegExp(/data="(.*?)"/i);
				var comDataKey = "data";
				if (comsStr[i].match(reg)) {
					var comDataKey = RegExp.$1;
				}

				var self = this;
				(function(comStr) {
					com.compile(projectPath, comName, comDataKey, function(comObj) {
						comObj.comStr = comStr;
						comObjs.push(comObj);
						if (++count >= len) {
							self.writeHTML(projectPath, pageName, pageContent, comObjs);
						}
					});
				})(comsStr[i]);
			}
		}
	},

	/**
	 * 输出 HTML
	 *
	 * @param {String} projectPath 项目路径
	 * @param {String} pageName 页面名称
	 * @param {String} pageContent 页面内容
	 * @param {Array} comObjs 组件配置内容
	 * @method compile
	 */
	writeHTML: function(projectPath, pageName, pageContent, comObjs) {
		for (var i = 0, len = comObjs.length; i < len; ++i) {
			var cObj = comObjs[i];
			var htmlContent = "\n<div id=\"" + cObj.id + "\">\n";
			htmlContent += cObj.style + cObj.tpl + cObj.script;
			htmlContent += "\n</div>\n";
			pageContent = pageContent.replace(cObj.comStr, htmlContent);
		}

		if (!fs.existsSync(projectPath + "/output/")) {
			fs.mkdirSync(projectPath + "/output/");
		}

		var htmlPath = projectPath + "/output/" + pageName + ".html";
		fs.writeFileSync(htmlPath, pageContent);
	}
}