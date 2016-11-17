"use strict";

var fs = require("fs");
var stylus = require("stylus");
var CleanCss = require("clean-css");

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
	 * @param {Function} callback 回调方法
	 * @method compile
	 */
	compile: function(params, callback) {
		var comId = params.comId;
		var comPath = params.comPath;
		var comName = params.comName; 
		var optimize = params.optimize;

		var comStylusPath = comPath + "/" + comName + ".styl";

		if (!fs.existsSync(comStylusPath)) {
			console.log(comStylusPath + " is not exist!");
			callback && callback();
			return ;
		}

		var content = fs.readFileSync(comStylusPath, "utf-8");
		
		stylus(content).render(function(err, css) {
			if (optimize) {
				css = new CleanCss().minify(css).styles;
			}
			
			var styleContent = "<style type=\"text\/css\">\n";
			styleContent += css.replace(/pgClass-*/igm, comId + "-");
			styleContent += "\n</style>";
			callback && callback(styleContent);
		});
	}
}