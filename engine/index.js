"use strict";

/**
 * engine 核心逻辑引擎
 *
 * @author sam.sin
 * @class loader
 * @constructor
 */
module.exports = {
      /**
       * 脚本解析器
       * @property script 
       * @type Object
       * @static
       */
	script: require("./script"),

      /**
       * 样式解析器
       * @property style 
       * @type Object
       * @static
       */
	style: require("./style"),

      /**
       * 模板解析器
       * @property tpl 
       * @type Object
       * @static
       */
      tpl: require("./tpl")
}