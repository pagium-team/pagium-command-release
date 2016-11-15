"use strict";

var walk = require("walk");
var ProgressBar = require('progress');
var globalConfig = require("./config/global");
var modules = require("./modules"); // 逻辑模块
var pagesPath = globalConfig.path + "/views/"; // 模板路劲

/**
 * 程序主入口
 *
 * @param {String} pageName 需要编译的页面名称
 * @method run
 */
var run = function(pageName) {
	var pageList = [];

	if (pageName) {
		pageList.push(pageName);
		_compile(pageList);
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
	        _compile(pageList);
	    });
	}
}

/**
 * 编译
 *
 * @param {Array} pageList 页面列表
 * @method _compile
 */
var _compile = function(pageList) {
	var bar = new ProgressBar("  :title [:bar] :percent", {
	    complete: "=",
	  	incomplete: " ",
	  	width: 30,
	  	total: 100,
	});

	for (var i = 0, len = pageList.length; i < len; ++i) {
		var pName = pageList[i];
		modules.page.compile(pName);
		bar.tick(Math.round((100 * 1 / pageList.length)), { title: pName });
	}
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