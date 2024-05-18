"use strict";

globalThis.SIMPLE_IS_DEBUG = false;

var getUrlPara = function (name, defVal, url) {
    var val = (new RegExp('(^|\\?|&|#)' + name+ '=([^&#]*)').exec(url || location.href)||[,,undefined===defVal ? '' : defVal])[2];
    return null == val ? val : decodeURIComponent(val).replace(/['"<>]/g, "");
};

var random = function(min, max) {
	if (max == null) {
		max = min;
		min = 0;
	}
	return min + Math.floor(Math.random() * (max - min + 1));
};

/*
    (async function() {
        awaitMS sleep(1.5);
    })();
 */
function sleep(sec) {
    return new Promise(resolve => setTimeout(resolve, 1000 * sec));
}

/**
 * spin CPU sleep
 * @param {Integer} ms 
 */
function sleepMS(ms) {
	if (ms <= 0) return;
	if (ms >= 1000*3) {
		console.warn("sleep too long time: ", ms);
	}
	let startTime = Date.now();
	let now = startTime;
	for (let i = 0; ; ++i) {
		now = Date.now();
		if (now - startTime >= ms) {
			break;
		}
	}
}

var cookie = {
	get : function(name) {
		name = document.cookie.match(RegExp("(^| )" + name + "=([^;]*)(;|$)"));
		return !name ? "" : decodeURIComponent(name[2]);
	},
	/**
	 * set cookie
	 * @param name - cookie name
	 * @param value - cookie value
	 * @param expires - expires, hour.
	 * @param domain - cookie domain. current domain, if not given.
	 * @param path - cookie path. /, if not given.
	 */
	set : function(name, value, expires, domain, path, secure) {
		var date, cookieText ;
		if (expires) {
			date = new Date();
			date.setTime(date.getTime() + 36E5*expires); // hour
		}
		var cookieText  = 
			name + "=" + encodeURIComponent(value)
			+ (domain ? "; domain=" + domain : "")
			+ "; path=" + (path ? path : "/") 
			+ (expires ? "; expires=" + date.toGMTString() : "")
			+ (secure ? "; secure" : "")
			;
		document.cookie = cookieText ;
				
	},
	/**
	 * delete the cookie
	 * @param name - cookie name
	 * @param domain - cookie domain. current domain, if not given.
	 * @param path - cookie path. root path(/), if not given.
	 */
	del : function(name, domain, path) {
		document.cookie = name + "=" 
				+ (domain ? "; domain=" + domain : "")
				+ "; path=" + (path ? path : "/") 
				+ "; expires=Thu, 01 Jan 1970 00:00:00 GMT";
	},
	/**
	 * delete all cookie in current domain and root path(/).
	 */
	delAll : function() {
		var n,
			arr = document.cookie.match(RegExp("([^ ;][^;]*)(?=(=[^;]*)(;|$))",
				"gi"));
		for (n in arr)
			document.cookie = arr[n]
					+ "=; path=/; expires=Mon, 26 Jul 1997 05:00:00 GMT";
	}
}; // $$$ cookie

/**
 * 
 * @param {HTMLElement} elem 
 * @param {string} type - name of event type, such as: click, change
 * @param {*} bubbles 
 * @param {*} cancelable 
 */
var triggerEvent = function (elem, type, bubbles, cancelable) {
	if (typeof jQuery === 'function' && elem instanceof jQuery) {
		elem.each(function(i, e) {
			triggerEvent(e, type, bubbles, cancelable);
		});
		return;
	}
	if (null == elem) {
		console.log("error: elem is null");
		return;
	}
	if (bubbles === undefined) bubbles = true;
	if (cancelable === undefined) cancelable = true;
	var e = new Event(type, {
		bubbles: bubbles,
		cancelable: cancelable
	});
	elem.dispatchEvent(e);
}


/**
 * yyyy-MM-dd hh:mm:ss
 */
function dateToStr(date) {
	if (Number.isInteger(date)) { date = new Date(date); } 
	if (!date) date = new Date();
	var ms = date.getMilliseconds();

	var d = date.getDate();
	var m = date.getMonth() + 1; //Month from 0 to 11
	var y = date.getFullYear();
	var hour = date.getHours();
	var min = date.getMinutes();
	var sec = date.getSeconds();
	var str = '';
	str += '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
	str += " ";
	str += (hour <= 9 ? '0' + hour : hour) + ':' + (min <= 9 ? '0' + min : min) + ':' + (sec <= 9 ? '0' + sec : sec);
	return str;
}
/**
 * yyyy-MM-dd hh:mm:ss.SSS
 */
function dateToMSStr(date) {
	if (Number.isInteger(date)) { date = new Date(date); } 
	if (!date) date = new Date();
	var ms = date.getMilliseconds();

	var str = dateToStr(date);
	if (ms >= 100) { return str + "." + ms; }
	else if (ms >= 10) { return str + ".0" + ms; }
	else { return str + ".00" + ms; }
}
var d2s = dateToStr;
var d2ms = dateToMSStr;

/**
 * hh:mm:ss
 */
function timeToStr(date) {
	if (Number.isInteger(date)) { date = new Date(date); } 
	if (!date) date = new Date();
	var hour = date.getHours();
	var min = date.getMinutes();
	var sec = date.getSeconds();
	var str = '';
	str += (hour <= 9 ? '0' + hour : hour) + ':' + (min <= 9 ? '0' + min : min) + ':' + (sec <= 9 ? '0' + sec : sec);
	return str;
}
var t2s = timeToStr;


/**
 * 
 * @param {Function} func 
 * @param {int} waitMS - wait ms
 * @param {boolean} immediate - is execute immediate
 */
function debounce(func, waitMS, immediate) {
	var timeout, args, context, timestamp, result;
	if (null == waitMS) waitMS = 100;

	function later() {
		var last = Date.now() - timestamp;

		if (last < waitMS && last >= 0) {
			timeout = setTimeout(later, waitMS - last);
		} else {
			timeout = null;
			if (!immediate) {
				result = func.apply(context, args);
				context = args = null;
			}
		}
	};

	var debounced = function() {
		context = this;
		args = arguments;
		timestamp = Date.now();
		var callNow = immediate && !timeout;
		if (!timeout) timeout = setTimeout(later, waitMS);
		if (callNow) {
			result = func.apply(context, args);
			context = args = null;
		}

		return result;
	};

	debounced.clear = function() {
		if (timeout) {
			clearTimeout(timeout);
			timeout = null;
		}
	};

	debounced.flush = function() {
		if (timeout) {
			result = func.apply(context, args);
			context = args = null;

			clearTimeout(timeout);
			timeout = null;
		}
	};

	return debounced;
};


function runAtTime() {
	runAtTime_Interval.apply(this, arguments);
}
/**
 * 
 * @param {*} date Date or millisecond of epoch
 */
function runAtTime_Interval(startTime, fn) {
	var funcname = runAtTime.name;
	var thiz = this;
	var args = new Array();
    for(var i = 2; i < arguments.length; ++i) {
		args.push(arguments[i]);
    }
	if (startTime instanceof Date) {
		startTime = startTime.getTime();
	} else if (Number.isInteger(startTime)) {

	} else {
		throw `illegal start time: ${startTime}`
	}

	// here startTime is millisecond
	console.log(`${funcname}:${dateToMSStr()}: will work at ${dateToMSStr(startTime)}`);


	const ScheduleInterval = 1000*60; // 1分钟
	//const ScheduleInterval = 1000*10; // test code
	SIMPLE_IS_DEBUG && console.log(`${funcname}:${dateToMSStr()}: ScheduleInterval: ${ScheduleInterval}`);

	function isUseInterval() {
		const diff = startTime - Date.now();
		return diff > 2*ScheduleInterval; // 大于2倍的调度周期的时候，才使用interval
	}
	function lastSchedule() { // 进行最后的调度
		let now = Date.now(); // ms
		const lastTimeout = startTime - now - 1000*2; // setTimeout提前N秒
		SIMPLE_IS_DEBUG && console.log(`${funcname}:${dateToMSStr()}: schedule, timeout: ${lastTimeout}`);
		setTimeout(() => {
			console.log(`${funcname}:${dateToMSStr()}: near work time`);
			for (let i = 0; i <= 1234567890123; ++i) {
				now = Date.now();
				if (now >= startTime) {
					console.log(`${funcname}:${dateToMSStr()}: begin work now. dead loop count: ${i}`);
					break;
				}
			}
			fn.apply(thiz, args);
		}, lastTimeout); // 提前N秒
	}



	if (isUseInterval()) { 
		// 先采用setInterval调度到，接近目标的时间。避免笔记本待机恢复后导致时间偏差过大。
		const intervalID = setInterval(() => {
			if (isUseInterval()) { // use interval
				// do nothing
				SIMPLE_IS_DEBUG && console.log(`${funcname}:${dateToMSStr()}: in interval`);
			} else {
				clearInterval(intervalID);
				lastSchedule(); // 接近时间了，开始最后的调度。
			}
		}, ScheduleInterval); 
	} else {
		lastSchedule();
	}

}

/**
 * 
 * @param {*} date Date or millisecond of epoch
 */
function runAtTime_Timeout(startTime, fn) {
	var funcname = runAtTime.name;
	var context = this;
	var args = new Array();
    for(var i = 2; i < arguments.length; ++i) {
		args.push(arguments[i]);
    }
	if (startTime instanceof Date) {
		startTime = startTime.getTime();
	} else if (Number.isInteger(startTime)) {

	} else {
		throw `illegal start time: ${startTime}`
	}
	let now = Date.now();

	console.log(`${funcname}:${dateToMSStr()}: will work at ${dateToMSStr(startTime)}`);

	setTimeout(() => {
		console.log("{runAtTime}: near work time, now is ", dateToMSStr());
		for (let i = 0; i <= 1234567890123; ++i) {
			now = new Date();
			if (now.getTime() >= startTime) {
				console.log(`${runAtTime}:${dateToMSStr()}: begin work at ${dateToMSStr(now)}, loop count ${i}`);
				break;
			}
		}
		fn.apply(context, args);
	}, startTime - now - 1000*2); // 提前N秒开始
}


function __get_module_obj__() {
	return {
		d2s, d2ms, t2s,
		debounce
	}
}
if ( typeof module === 'object' && typeof module.exports === 'object' ) { // CommonJS
	module.exports = __get_module_obj__();
} else if ( typeof define === 'function' && define.amd) { // AMD
	define( [], function () {
		return __get_module_obj__();
	} );
}
