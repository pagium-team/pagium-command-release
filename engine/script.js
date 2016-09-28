"use strict";

var fs = require("fs");

var jsp = require("uglify-js").parser;
var pro = require("uglify-js").uglify;

/**
 * 脚本编译逻辑
 *
 * @author sam.sin
 * @class script
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

		var comScriptPath = comPath + "/" + comName + ".js";
		if (!fs.existsSync(comScriptPath)) {
			console.log(comScriptPath + " is not exist!");
			callback && callback();
			return ;
		}

		var scripts = fs.readFileSync(comScriptPath, "utf-8");
		scripts = scripts.replace(/pgId-*/igm, comId + "-");
		scripts = "(function() {\n" + scripts + "\n})();"; // 保护局部变量

		var ast = jsp.parse(scripts); // parse code and get the initial AST
		ast = pro.ast_mangle(ast); // get a new AST with mangled names
		ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
		scripts = pro.gen_code(ast); // compressed code here

		var scriptContent = "<script type=\"text/javascript\">\n";
		scriptContent += scripts + "\n";
		scriptContent += "</script>";

		callback && callback(scriptContent);
	}
}