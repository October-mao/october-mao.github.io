/*
 * var toptip = new TopTip();
 * toptip.show("msg", 3);
 */

;(function(window, undefined) {

var	docFrag = function(html, context) {
	var doc = (context ? (context.ownerDocument || context) : document);
	var docF = doc.createDocumentFragment(),
		divE = doc.createElement("div"),
		c;
	divE.innerHTML = html;
	while(c = divE.firstChild) {docF.appendChild(c);}
	return docF;
};
var bind = function(elem, eventType, handler, useCapture) {
	if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) { return; }
	if (document.addEventListener) { elem.addEventListener(eventType, handler, useCapture || false);}
	else { elem.attachEvent("on" + eventType, handler); }
};


/**
 * @param id - element id
 * @param top - top px
 */
function TopTip(id, top) {
	var thiz = this;
	this.id = id ? id : "w-simple-top-tip";
	this.top = top || 0;
	this.timeoutId = null;
	this.animate = true;
	
	var html = '' 
		+	'<div id="{id}" style="word-break: break-all; color: #222; font-size: 16px; display: none; position: fixed; z-index: 9999; opacity: 0.9; filter: alpha(opacity=90); text-align: center; width: 100%; top: 0px; left: 0px;">'
		+	'	<div id="{id}-container" style="display: inline-block; margin: 0px 10px; background-color: #f9edbe; padding: 0px 5px 0px 10px; border: 1px solid #f0c36d; border-radius: 2px; -webkit-border-radius: 2px;-webkit-box-shadow: 0 2px 4px rgba(0,0,0,0.2); box-shadow: 0 2px 4px rgba(0,0,0,0.2);">'
		+	'		<span id="{id}-msg">msg</span>&nbsp;&nbsp;<span id="{id}-close" style="font-size: 14px; cursor: pointer; font-weight: 700; line-height: 1; color: #000; text-shadow: 0 1px 0 #fff;opacity: 0.4; filter: alpha(opacity=40);">&times;</span>'
		+	'	</div>'
		+	'</div>';
	html = html.replace(/{id}/g, this.id);
	var docfrag = docFrag(html);
	document.body.appendChild(docfrag);
	
	this.elem = document.getElementById(this.id);
	
	bind(document.getElementById(this.id + "-close"), "click", function() {
		if (thiz.timeoutId) { clearTimeout(thiz.timeoutId); thiz.timeoutId = null; }
		//hide(thiz.elem);
		thiz.hide0();
	});
	
	
		
}

/**
 * @param msg - msg
 * @param autohidetime - auto hide tip time in second
 * @param top - top px
 */
TopTip.prototype.show = function(msg, autohidetime, top) {
	var thiz = this;
	
	top = top || this.top;
	if (top >= 0) this.elem.style["top"] = top + "px";

	document.getElementById(this.id + "-msg").innerHTML = msg;
	//show(thiz.elem);
	thiz.show0();
	if (this.timeoutId) { clearTimeout(this.timeoutId); this.timeoutId = null; }
	if (autohidetime > 0) { // auto hide
		this.timeoutId = setTimeout(function() {
			//hide(thiz.elem);
			thiz.hide0();
		}, autohidetime*1000);
	}
	return this;
};
TopTip.prototype.hide = function() {
	if (this.timeoutId) { clearTimeout(this.timeoutId); this.timeoutId = null; }
	//hide(this.elem);
	this.hide0();
	return this;
};


TopTip.prototype.show0 = function() {
	if (window.jQuery && this.animate) {
		$(this.elem).stop().fadeIn(600);
	} else {
		this.elem.style["display"] = "block";
	}
};
TopTip.prototype.hide0 = function() {
	if (window.jQuery && this.animate) {
		$(this.elem).stop().fadeOut(600);
	} else {
		this.elem.style["display"] = "none";
	}
};

window.TopTip = TopTip;

})(window);
