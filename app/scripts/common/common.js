function isInteger(src) {
    return (/^\d+$/g).test(src);
};

/**
 * 长按事件封装
 * @param elmSelector 包含控制句柄的容器元素选择器
 * @param handleSelector 处理器句柄元素选择
 * @param fn 回调函数
 */
function longPress(elmSelector, handleSelector, fn) {
    window.LONG_PRESS = {
        element: null,
        timer: 0
    };
    angular.element(elmSelector).delegate(handleSelector, 'touchstart', function (e) {
        var self = this;
        // 长按的对象
        window.LONG_PRESS.element = null;
        window.LONG_PRESS.timer = window.setTimeout(function () { window.LONG_PRESS.element = self; fn.apply(self, [true]); }, 500);
        e.preventDefault();
    }).delegate(handleSelector, 'touchmove', function (e) {
        window.clearTimeout(window.LONG_PRESS.timer);
        window.LONG_PRESS.timer = 0;
    }).delegate(handleSelector, 'touchend', function (e) {
        window.clearTimeout(window.LONG_PRESS.timer);
        if (window.LONG_PRESS.timer != 0 && window.LONG_PRESS.element == null) {
            fn.apply(this, [false]);
            return true;
        }
        return false;
    });
};

function debounce(fn) {
    var timeout;
    return function () {
        var args = Array.prototype.slice.call(arguments),
            ctx = this;

        clearTimeout(timeout);
        timeout = setTimeout(function () {
            fn.apply(ctx, args)
        }, 1000);
    };
};

/**
 * 获取微信状态
 * @returns {{isWeixin: boolean, version: null, greater5: boolean}}
 */
function getWeixin() {
    var version = null;
    var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+|undefined)/i);
    if (wechatInfo) {
        version = parseFloat(wechatInfo[1]);
    }
    return {
        // 是否在微信内打开
        isWeixin: !!wechatInfo,
        // 微信的版本
        version: isNaN(version) ? 0 : version,
        // 微信版本是否大于5.0
        greater5: isNaN(version) ? false : version >= 5.
    };
}

/**
 * 将给定内容转换为十进制整型
 * @param src {string} 要转换为整型的文本
 * @param defaultValue {anything} 转换失败后的默认值, 默认0
 * */
function intval(src, defaultValue) {
    defaultValue = angular.isDefined(defaultValue) ? defaultValue : 0;
    if (angular.isNumber(src)) {
        return src;
    }
    src = parseInt(src, 10);
    return isNaN(src) ? defaultValue : src;
};

/***
 * 获取url参数
 * @returns {Array}
 */
function getUrlVars($location) {
    var vars = {}, hash;
    var hashes = null;
    if ($location) {
        hashes = $location.$$url;
    } else if (!hashes) {
        hashes = window.location.search || window.location.hash;
        if (hashes.indexOf('?') == -1) {
            hashes = false;
        }
    }
    if (hashes) {
        hashes = hashes.slice(hashes.indexOf('?') + 1).split('&')
        for (var i = 0; i < hashes.length; i++) {
            hash = hashes[i].split('=');
            //vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
    }
    return vars;
};

if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(what, i) {
        i = i || 0;
        var L = this.length;
        while (i < L) {
            if(this[i] === what) return i;
            ++i;
        }
        return -1;
    };
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

Array.prototype.insert = function(index) {
    index = Math.min(index, this.length);
    arguments.length > 1
        && this.splice.apply(this, [index, 0].concat([].pop.call(arguments)))
        && this.insert.apply(this, arguments);
    return this;
};

/**
 * 循环遍历数组
 * @param fn
 * @returns {Array}
 */
Array.prototype.each = function(fn){
    fn = fn || Function.K;
    var a = [];
    var args = Array.prototype.slice.call(arguments, 1);
    for(var i = 0; i < this.length; i++){
        var res = fn.apply(this,[this[i],i].concat(args));
        if(res != null) a.push(res);
    }
    return a;
};

/**
 * 得到一个数组不重复的元素集合<br/>
 * 唯一化一个数组
 * @returns {Array} 由不重复元素构成的数组
 */
Array.prototype.uniquelize = function(){
    var ra = [];
    for(var i = 0; i < this.length; i ++){
        if(!ra.contains(this[i])){
            ra.push(this[i]);
        }
    }
    return ra;
};

/**
 * 求两个集合的补集
{%example
<script>
    var a = [1,2,3,4];
    var b = [3,4,5,6];
    alert(Array.complement(a,b));
</script>
 %}
 * @param {Array} a 集合A
 * @param {Array} b 集合B
 * @returns {Array} 两个集合的补集
 */
Array.complement = function(a, b){
    return Array.minus(Array.union(a, b),Array.intersect(a, b));
};

/**
 * 求两个集合的交集
{%example
<script>
    var a = [1,2,3,4];
    var b = [3,4,5,6];
    alert(Array.intersect(a,b));
</script>
 %}
 * @param {Array} a 集合A
 * @param {Array} b 集合B
 * @returns {Array} 两个集合的交集
 */
Array.intersect = function(a, b){
    return a.uniquelize().each(function(o){return b.contains(o) ? o : null});
};

/**
 * 求两个集合的差集
{%example
<script>
    var a = [1,2,3,4];
    var b = [3,4,5,6];
    alert(Array.minus(a,b));
</script>
 %}
 * @param {Array} a 集合A
 * @param {Array} b 集合B
 * @returns {Array} 两个集合的差集
 */
Array.minus = function(a, b){
    return a.uniquelize().each(function(o){return b.contains(o) ? null : o});
};

/**
 * 求两个集合的并集
{%example
<script>
    var a = [1,2,3,4];
    var b = [3,4,5,6];
    alert(Array.union(a,b));
</script>
 %}
 * @param {Array} a 集合A
 * @param {Array} b 集合B
 * @returns {Array} 两个集合的并集
 */
Array.union = function(a, b){
    return a.concat(b).uniquelize();
};

/**
 * 数组中是否包含元素
 * @param element
 * @returns {boolean}
 */
Array.prototype.contains = function (element) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == element) {
			return true;
		}
	}
	return false;
};

define(['jQuery', 'angular']);