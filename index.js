"use strict";

var walk = require("walk");
var ProgressBar = require('progress');
var modules = require("./modules"); // 逻辑模块

/**
 * 程序主入口
 *
 * @param {String} projectPath 项目路径
 * @param {String} pageName 需要编译的页面名称
 * @param {Function} callback 回调方法
 * @method run
 */
var run = function(projectPath, params) {
	if (params && typeof params == "object") {
		var pageName = params.pageName;
		var callback = params.callback;
	}

	var pagesPath = projectPath + "/views/"; // 模板路劲

	var pageList = [];

	if (pageName) {
		pageList.push(pageName);
		_compile(projectPath, pageList);
	} else {
		var self = this;
		var walker = walk.walk(pagesPath);

		/**
	     * 检测到文件
	     *
	     * @event on file
	     */
	    walker.on("file", function(root, fileStats, next) {
	        var fileName = fileStats.name;
	        var htmlReg = new RegExp(/\.html$/);
	        if (htmlReg.test(fileName)) {
	            var pFloder = root.substring(root.lastIndexOf("\\") + 1);
	            var pageName = fileName.replace(htmlReg, "");
	            pageList.push(pageName);
	        }
	        next();
	    });

	    /**
	     * 检测爬虫结束
	     *
	     * @event on end
	     */
	    walker.on("end", function() {
	        _compile(projectPath, pageList, callback);
	    });
	}
}

/**
 * 编译
 *
 * @param {String} projectPath 项目路径
 * @param {Array} pageList 页面列表
 * @param {Function} callback 回调方法
 * @method _compile
 */
var _compile = function(projectPath, pageList, callback) {
	var bar = new ProgressBar("  :title [:bar] :percent", {
	    complete: "=",
	  	incomplete: " ",
	  	width: 30,
	  	total: 100,
	});

	for (var i = 0, len = pageList.length; i < len; ++i) {
		var pName = pageList[i];
		modules.page.compile(projectPath, pName);
		bar.tick(Math.round((100 * 1 / pageList.length)), { title: pName });
	}

	callback && callback();
}

/**
 * pagium 编译模块
 *
 * @author sam.sin
 * @class index
 * @constructor
 */
module.exports = {
	run: run
}