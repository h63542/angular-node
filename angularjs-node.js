var jsdom = require("jsdom");
var fs = require("fs");

//加载编译文件
var originalFile = process.argv[2];
var templateModelJSFile = originalFile+".js";
var template_model,template_module;
if(fs.existsSync(templateModelJSFile)){
	template_model = require("./"+originalFile);
}

//构造BOM对象
var doc = jsdom.jsdom(fs.readFileSync(originalFile+".html","UTF-8"), jsdom.level(3, "core"));
var window = doc.createWindow();
window.navigator = {};
var navigator = {};

//初始化angular
var angularJSNode = require("./public/lib/angular");
var angular = angularJSNode.init(window,doc,navigator);

//初始化业务ModelJS
if(template_model){
	//执行业务代码中的angular Module初始化
	template_model.initAngular(angular);
	template_module = template_model.angularModules;
	angular.forEach(template_model.controllers, function(controller){
  		window[controller.name] = controller;
	});
}

//执行angualr编译
try{
	angular.bootstrap(doc,template_module?template_module:[]);
}catch(e){
	console.log(e);	
}

//输出编译后文件
fs.writeFileSync(originalFile+"-debug.html", doc.outerHTML, "UTF-8");

