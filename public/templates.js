jade=function(exports){Array.isArray||(Array.isArray=function(arr){return"[object Array]"==Object.prototype.toString.call(arr)}),Object.keys||(Object.keys=function(obj){var arr=[];for(var key in obj)obj.hasOwnProperty(key)&&arr.push(key);return arr}),exports.merge=function merge(a,b){var ac=a["class"],bc=b["class"];if(ac||bc)ac=ac||[],bc=bc||[],Array.isArray(ac)||(ac=[ac]),Array.isArray(bc)||(bc=[bc]),ac=ac.filter(nulls),bc=bc.filter(nulls),a["class"]=ac.concat(bc).join(" ");for(var key in b)key!="class"&&(a[key]=b[key]);return a};function nulls(val){return val!=null}return exports.attrs=function attrs(obj,escaped){var buf=[],terse=obj.terse;delete obj.terse;var keys=Object.keys(obj),len=keys.length;if(len){buf.push("");for(var i=0;i<len;++i){var key=keys[i],val=obj[key];"boolean"==typeof val||null==val?val&&(terse?buf.push(key):buf.push(key+'="'+key+'"')):0==key.indexOf("data")&&"string"!=typeof val?buf.push(key+"='"+JSON.stringify(val)+"'"):"class"==key&&Array.isArray(val)?buf.push(key+'="'+exports.escape(val.join(" "))+'"'):escaped&&escaped[key]?buf.push(key+'="'+exports.escape(val)+'"'):buf.push(key+'="'+val+'"')}}return buf.join(" ")},exports.escape=function escape(html){return String(html).replace(/&(?!(\w+|\#\d+);)/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")},exports.rethrow=function rethrow(err,filename,lineno){if(!filename)throw err;var context=3,str=require("fs").readFileSync(filename,"utf8"),lines=str.split("\n"),start=Math.max(lineno-context,0),end=Math.min(lines.length,lineno+context),context=lines.slice(start,end).map(function(line,i){var curr=i+start+1;return(curr==lineno?"  > ":"    ")+curr+"| "+line}).join("\n");throw err.path=filename,err.message=(filename||"Jade")+":"+lineno+"\n"+context+"\n\n"+err.message,err},exports}({});
this["JST"] = this["JST"] || {};

this["JST"]["templates/doc/audio"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),path = locals_.path;buf.push("<audio" + (jade.attrs({ 'src':(path), 'preload':('none') }, {"src":true,"preload":true})) + "></audio><i" + (jade.attrs({ 'src':(path), "class": [('icon-play'),('audio-switch')] }, {"src":true})) + "></i>");;return buf.join("");
};

this["JST"]["templates/doc/document-in-list"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),_id = locals_._id,name = locals_.name,author = locals_.author,create_time = locals_.create_time;buf.push("<li class=\"document\"><a" + (jade.attrs({ 'href':('#/document/view/' + (_id) + '') }, {"href":true})) + ">" + (jade.escape((jade.interp = name) == null ? '' : jade.interp)) + "</a><span>(</span><a" + (jade.attrs({ 'href':('#/document/user/' + (author) + '') }, {"href":true})) + ">" + (jade.escape((jade.interp = author) == null ? '' : jade.interp)) + "</a><span>&nbsp</span><span>" + (jade.escape((jade.interp = new Date(create_time).format()) == null ? '' : jade.interp)) + "</span><span>)</span></li>");;return buf.join("");
};

this["JST"]["templates/doc/genre"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),type = locals_.type;buf.push("<span class=\"genre\">@" + (jade.escape((jade.interp = type) == null ? '' : jade.interp)) + "</span>");;return buf.join("");
};

this["JST"]["templates/doc/lex"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),descr = locals_.descr,name = locals_.name;buf.push("<span" + (jade.attrs({ 'title':(descr), "class": [('lex')] }, {"title":true})) + ">" + (jade.escape(null == (jade.interp = name) ? "" : jade.interp)) + "</span>");;return buf.join("");
};

this["JST"]["templates/doc/lexS"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),descr = locals_.descr,name = locals_.name;buf.push("<span" + (jade.attrs({ 'title':(descr), 'style':('font-weight:bold;'), "class": [('lex')] }, {"title":true,"style":true})) + ">" + (jade.escape(null == (jade.interp = name) ? "" : jade.interp)) + "</span>");;return buf.join("");
};

this["JST"]["templates/doc/log_row"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),line = locals_.line,pos = locals_.pos,type = locals_.type,text = locals_.text;buf.push("<tr" + (jade.attrs({ 'data-line':('' + (line) + ''), 'data-ch':('' + (pos) + ''), "class": [('' + (type) + '')] }, {"data-line":true,"data-ch":true,"class":true})) + "><td>" + (jade.escape((jade.interp = line) == null ? '' : jade.interp)) + "</td><td>" + (jade.escape((jade.interp = pos) == null ? '' : jade.interp)) + "</td><td>" + (jade.escape((jade.interp = text) == null ? '' : jade.interp)) + "</td></tr>");;return buf.join("");
};

this["JST"]["templates/doc/plain-text"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),item = locals_.item;buf.push("<span class=\"plain-text\">" + (((jade.interp = item) == null ? '' : jade.interp)) + "</span>");;return buf.join("");
};

this["JST"]["templates/doc/ques"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),text = locals_.text;buf.push("<span class=\"ques\"><" + (text) + "></" + (text) + "></span>");;return buf.join("");
};

this["JST"]["templates/doc/theme"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),type = locals_.type;buf.push("<span class=\"theme\">#" + (jade.escape((jade.interp = type) == null ? '' : jade.interp)) + "</span>");;return buf.join("");
};

this["JST"]["templates/doc/track"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),t = locals_.t;buf.push("<li" + (jade.attrs({ 'track':(t.id), "class": [('track')] }, {"track":true})) + "><span class=\"number\">" + (jade.escape((jade.interp = t.id) == null ? '' : jade.interp)) + ".</span>");
if ( t.name)
{
buf.push("<span>" + (jade.escape((jade.interp = t.name) == null ? '' : jade.interp)) + "</span>");
if ( t.uploaded)
{
buf.push("<i class=\"icon-remove\"></i>");
}
else
{
buf.push("<i class=\"icon-refresh\"></i>");
}
}
else
{
buf.push("<label class=\"uploader\"><i class=\"icon-upload\"></i>загрузить</label>");
}
buf.push("</li>");;return buf.join("");
};

this["JST"]["templates/search/result"] = function anonymous(locals) {
var buf = [];
var locals_ = (locals || {}),_id = locals_._id,name = locals_.name;buf.push("<li><a" + (jade.attrs({ 'href':('#/document/view/' + (_id) + '') }, {"href":true})) + "><h5>" + (jade.escape(null == (jade.interp = name) ? "" : jade.interp)) + "</h5></a><div name=\"content\" class=\"docview\"></div></li>");;return buf.join("");
};