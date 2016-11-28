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
	 * @param {Function} params 配置对象
	 * @method compile
	 */
	compile: function(projectPath, pageName, params) {
		var htmlPath = projectPath + "/views/products/" + pageName + ".html";
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
					com.compile(projectPath, comName, comDataKey, params, function(comObj) {
						comObj.comStr = comStr;
						comObjs.push(comObj);
						if (++count >= len) {
							self.writeHTML(projectPath, pageName, pageContent, comObjs, params);
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
	 * @param {Function} params 配置对象
	 * @method compile
	 */
	writeHTML: function(projectPath, pageName, pageContent, comObjs, params) {
		var live;

		if (params && typeof params == "object") {
			live = params.live;
		}

		for (var i = 0, len = comObjs.length; i < len; ++i) {
			var cObj = comObjs[i];
			var htmlContent = "\n<div id=\"" + cObj.id + "\">\n";
			htmlContent += cObj.style? cObj.style : "";
			htmlContent += cObj.tpl? cObj.tpl : "";
			htmlContent += cObj.script? cObj.script : "";
			htmlContent += "\n</div>\n";
			pageContent = pageContent.replace(cObj.comStr, htmlContent);
		}

		if (live) {
			var scriptStr = "<script>" +
				  "document.write('<script src=\"http:\/\/' + (location.host || 'localhost').split(':')[0] +" +
				  "':35729/livereload.js?snipver=1\"></' + 'script>')" +
				"</script>\n" +
				"</html>";
			pageContent = pageContent.replace("</html>", scriptStr);
		}

		if (!fs.existsSync(projectPath + "/output/")) {
			fs.mkdirSync(projectPath + "/output/");
		}

		var htmlPath = projectPath + "/output/" + pageName + ".html";
		fs.writeFileSync(htmlPath, pageContent);
	}
}