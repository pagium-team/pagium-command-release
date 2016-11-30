"use strict";

var walk = require("walk");
var ProgressBar = require('progress');
var fs = require('fs-extra');
var modules = require("./modules"); // 逻辑模块

/**
 * 程序主入口
 *
 * @param {String} projectPath 项目路径
 * @param {Function} params 配置对象
 * @method run
 */
var run = function(projectPath, params) {
	var pageName;

	if (params && typeof params == "object") {
		pageName = params.pageName;
	}

	var pagesPath = projectPath + "/views/products/"; // 模板路劲

	var pageList = [];

	if (pageName) {
		pageList.push(pageName);
		_compile(projectPath, pageList, params);
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
	        _compile(projectPath, pageList, params);
	    });
	}
}

/**
 * 编译
 *
 * @param {String} projectPath 项目路径
 * @param {Array} pageList 页面列表
 * @param {Function} params 配置对象
 * @method _compile
 */
var _compile = function(projectPath, pageList, params) {
	var callback;

	if (params && typeof params == "object") {
		callback = params.callback;
	}

	var bar = new ProgressBar("  :title [:bar] :percent", {
	    complete: "=",
	  	incomplete: " ",
	  	width: 30,
	  	total: 100
	});

	for (var i = 0, len = pageList.length; i < len; ++i) {
		var pName = pageList[i];
		modules.page.compile(projectPath, pName, params);
		bar.tick(Math.round((80 * 1 / pageList.length)), { title: pName });
		console.log("\n");
	}

	moveLibFiles(projectPath, function() {
		console.log("\n");
		bar.tick(100, { title: pName });
		callback && callback();
	});
}

function moveLibFiles(projectPath, callback) {
    var self = this;
    var walker = walk.walk(projectPath + "/views/lib/");
    var cppyingFileAmount = 0;
    var isEnd = false;

    /**
     * 检测到文件
     *
     * @event on file
     */ 
    walker.on("file", function(root, fileStats, next) {
        if (fileStats && fileStats.type == "file") {
            var parentPath = projectPath + "/output/lib/";
            var parentLen = parentPath.length;
            var filePath = root.substr(parentPath.indexOf(parentPath) + parentLen);

            cppyingFileAmount += 1;
            var copyFromPath = root + "/" + fileStats.name;
            var copyToPath = parentPath + filePath + "/" + fileStats.name;
    		
            fs.copy(copyFromPath, copyToPath, function (err) {
            	cppyingFileAmount -= 1;
                if (err) return console.error(err)
                console.log("copy: ".green + parentPath + filePath + "/" + fileStats.name);
            	if (isEnd && cppyingFileAmount == 0) {
            		callback && callback();
            	}
            });
        }
        next();
    });

    /**
     * 检测到文件夹
     *
     * @event on file
     */ 
    walker.on("directory", function(root, fileStats, next) {
        var parentPath = projectPath + "/output/lib/";
        var parentLen = parentPath.length;
        var floderPath = root.substr(parentPath.indexOf(parentPath) + parentLen);
        if (!fs.existsSync(parentPath + floderPath)) {
            fs.mkdirSync(parentPath + floderPath);
        }
        next();
    });

    /**
     * 检测爬虫结束
     *
     * @event on end
     */
    walker.on("end", function() {
    	isEnd = true;
    	if (cppyingFileAmount == 0) {
        	callback && callback();
    	}
    });
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