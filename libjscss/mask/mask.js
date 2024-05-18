"use strict";

/*
 * var mask = new Mask();
 * mask.show();
 * mask.hide();
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

var hide = function(elem, timeoutMS) {
	if (window.jQuery) {
		$(elem).finish().fadeOut(timeoutMS > 0 ? timeoutMS : 400);
	} else {
		elem.style["display"] = "none";
	}
};

/**
 * @param color - mask color
 */
function Mask(color) {
	var thiz = this;

	this.elem = document.createElement("div");
	this.elem.style["position"] = "fixed";
	this.elem.style["top"] = "0px";
	this.elem.style["bottom"] = "0px";
	this.elem.style["left"] = "0px";
	this.elem.style["right"] = "0px";
	this.elem.style["zIndex"] = "1000";
	this.elem.style["backgroundColor"] = color ? color : "#F5F5F5";
	this.elem.style["display"] = "none";
	
	document.body.appendChild(this.elem);
}

/**
 * @param color - mask color
 */
Mask.prototype.show = function(color) {
	var thiz = this;
	
	if (color) this.elem.style["backgroundColor"] = color;

	this.elem.style["display"] = "block";

	return this;
};

Mask.prototype.hide = function(timeoutMS) {
	hide(this.elem, timeoutMS);
	return this;
}

window.Mask = Mask;

})(window);
