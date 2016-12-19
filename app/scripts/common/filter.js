/**
 * 一些前端处理小函数
 */
define(['angular', 'common/settings', 'common/factories'], function(angular) {
    angular.module(
        'amengsms.filter', ['amengsms.settings', 'amengsms.factories']
    )
    .filter('join', function () {
        return function (input, sep) {
            if (typeof(input) == 'array') {
                sep = sep || '';
                sep = sep.replace('[br]', '<br />');
                return input.join(sep);
            }
            return input;
        };
    })
    .filter('id2pic', ['settings', function (settings) {
        return function (input, prefix, postfix, random) {
            var id = parseInt(input);
            if (!isNaN(id) && id > 0) {
                var idstr = id.toString();
                // 补位
                var strs = [];
                for (var i = 0; i < 9 - idstr.length; i ++) {
                    strs.push('0');
                }
                strs.push(idstr);
                strs = strs.join('');
                var pathes = strs.substring(0, 3) + '/' + strs.substring(3, 6) + '/' + strs.substring(6);
                var url = settings.upload_url_prefix + prefix + '/' + pathes + '.jpg';
                if (postfix) {
                    url += '!' + postfix;
                }
                if(random === true){
                    url += '?r='+ Math.random();
                }
                return url;
            }
            return settings.default_avatar;
        };
    }])
    .filter('safeString', function () {
        return function (input) {
            var f = input.substring(0, 1), e = input.substring(input.length - 1);
            var stars = [];
            for (var i = 0; i < input.length - 2; i ++) {
                stars.push('*');
            }
            return f + stars.join('') + e;
        };
    })
    .filter('fixed', function () {
        return function (input, round) {
            round = round || 2;
            return parseFloat(input).toFixed(round);
        };
    })
    .filter('number2short', function () {
        var units = [
            '万', '亿', '兆',
        ];
        return function (input, wan , fixed) {
            if(typeof wan == 'undefined'){
                wan = 100;
            }
            if(typeof fixed == 'undefined'){
                fixed = 2;
            }
            var rawValue = parseFloat(input);
            if (!angular.isNumber(rawValue) || isNaN(rawValue)) {
                return 0;
            }
            // 小于0直接返回原始数字
            if (rawValue <= 0) {
                return rawValue;
            } else {
                // 小于100万,直接范围原始数字
                var value = rawValue / 10000;
                if (value < wan) {
                    return rawValue;
                }
                var unit = 0;
                while (value >= 10000 && unit < units.length - 1) {
                    value /= 10000;
                    unit ++;
                }
                return value.toFixed(fixed) + units[unit];
            }
        };
    })
    .filter('money2cn', function () {
        /**
         * 将金额转换为中文大写格式
         * @param money {string}
         * */
        var money2cn = function ( money ) {
            var cnNums	= new Array("零","壹","贰","叁","肆","伍","陆","柒","捌","玖");	//汉字的数字
            var cnIntRadice = new Array("","拾","佰","仟");	//基本单位
            var cnIntUnits = new Array("","万","亿","兆");	//对应整数部分扩展单位
            var cnDecUnits = new Array("角","分","毫","厘");	//对应小数部分单位
            var cnInteger = "整";	//整数金额时后面跟的字符
            var cnIntLast = "元";	//整型完以后的单位
            var maxNum = 999999999999999.9999;	//最大处理的数字

            var IntegerNum;		//金额整数部分
            var DecimalNum;		//金额小数部分
            var ChineseStr="";	//输出的中文金额字符串
            var parts;		//分离金额后用的数组，预定义

            if( money == "" ){
                return "";
            }

            money = parseFloat(money);
            //alert(money);
            if( money >= maxNum ){
                $.alert('超出最大处理数字');
                return "";
            }
            if( money == 0 ){
                ChineseStr = cnNums[0]+cnIntLast+cnInteger;
                //document.getElementById("show").value=ChineseStr;
                return ChineseStr;
            }
            money = money.toString(); //转换为字符串
            if( money.indexOf(".") == -1 ){
                IntegerNum = money;
                DecimalNum = '';
            }else{
                parts = money.split(".");
                IntegerNum = parts[0];
                DecimalNum = parts[1].substr(0,4);
            }
            if( parseInt(IntegerNum,10) > 0 ){//获取整型部分转换
                zeroCount = 0;
                IntLen = IntegerNum.length;
                for( i=0;i<IntLen;i++ ){
                    n = IntegerNum.substr(i,1);
                    p = IntLen - i - 1;
                    q = p / 4;
                    m = p % 4;
                    if( n == "0" ){
                        zeroCount++;
                    }else{
                        if( zeroCount > 0 ){
                            ChineseStr += cnNums[0];
                        }
                        zeroCount = 0;	//归零
                        ChineseStr += cnNums[parseInt(n)]+cnIntRadice[m];
                    }
                    if( m==0 && zeroCount<4 ){
                        ChineseStr += cnIntUnits[q];
                    }
                }
                ChineseStr += cnIntLast;
            }
            if( DecimalNum!= '' ) {//小数部分
                decLen = DecimalNum.length;
                for( i=0; i<decLen; i++ ) {
                    n = DecimalNum.substr(i,1);
                    if( n != '0' ) {
                        ChineseStr += cnNums[Number(n)]+cnDecUnits[i];
                    }
                }
            }
            if( ChineseStr == '' ) {
                ChineseStr += cnNums[0]+cnIntLast+cnInteger;
            } else if( DecimalNum == '' ) {
                ChineseStr += cnInteger;
            }
            return ChineseStr;
        };

        return function (input, defaultText) {
            if (angular.isDefined(input)) {
                return money2cn(input);
            }
            return defaultText;
        };
    })
    .filter('to_js_timestamp', function() {
        // js的时间戳和unix时间戳差3位数,即补充毫秒位才能进行js的运算
        return function(input) {
            if(typeof input == 'undefined'){
                return input;
            }
            return input + '000';
        };
    })
    .filter('accAdd',['accMulFilter',function(accMul) {
        // 加法
        return function(arg1,arg2) {
            var r1,r2,m;
            try{
                r1=arg1.toString().split(".")[1].length
            }catch(e){
                r1=0;
            }
            try{
                r2=arg2.toString().split(".")[1].length;
            }catch(e){
                r2=0;
            }
            m = Math.pow(10,Math.max(r1,r2));
            return (accMul(arg1,m)+accMul(arg2,m))/m;
        };
    }])
    .filter('accMul', function() {
        // 乘法
        return function(arg1,arg2) {
            if(typeof arg1 == 'undefined'){
                console.log('accMul arg1 not defined',arg1,arg2);
                return 0;
            }
            if(typeof arg2 == 'undefined'){
                console.log('accMul arg2 not defined',arg1,arg2);
                return 0;
            }
            var m=0,s1=arg1.toString(),s2=arg2.toString();
            try{
                m += s1.split(".")[1].length;
            }catch(e){}
            try{
                m += s2.split(".")[1].length;
            }catch(e){}
            return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
        };
    })
    .filter('accDiv', function() {
        // 除法
        return function(arg1,arg2) {
            var t1=0,t2=0,r1,r2;
            try{t1=arg1.toString().split(".")[1].length}catch(e){}
            try{t2=arg2.toString().split(".")[1].length}catch(e){}
            with(Math){
                r1=Number(arg1.toString().replace(".",""));
                r2=Number(arg2.toString().replace(".",""));
                return (r1/r2)*pow(10,t2-t1);
            }
        };
    })
    .filter('accSub', function() {
        // 减法
        return function(arg1,arg2) {
            var r1,r2,m,n;
            try{r1=arg1.toString().split(".")[1].length}catch(e){r1=0}
            try{r2=arg2.toString().split(".")[1].length}catch(e){r2=0}
            m=Math.pow(10,Math.max(r1,r2));
            n=(r1>=r2)?r1:r2;
            return ((arg1*m-arg2*m)/m).toFixed(n);
        };
    })
    .filter('split_human_time',function () {
        // 把人性化时间拆分为可以填空的数组
        // 1天03:12:12
        return function (ipt) {
            if(typeof ipt == 'undefined' || ipt == null){
                return ipt;
            }
            var reArr  = [];
            var tmpArr = ipt.split('天');
            var leftPar = ipt;
            if(tmpArr.length == 1){
                // 没有天
                reArr.push('');
            }else{
                reArr.push(tmpArr[0]);
                leftPar = tmpArr[1];
            }
            var tmpArr2 = leftPar.split(':');
            if(tmpArr2.length == 2){
                reArr.push('00');
            }
            for(var i=0; i<tmpArr2.length;i++){
                reArr.push(tmpArr2[i]);
            }
            return reArr;
        };
    })
    .filter('trust_html', ['$sce', function($sce) {
        // 转trust_html用于bing-html
        return function(ipt) {
            return $sce.trustAsHtml(ipt);
        };
    }])
    .filter('int_ip_to_str', function () {
        // int类型的IP地址转为xx.xx.xx.xx的形式
        return function (num) {
            var str;
            var tt = [];
            tt[0] = (num >>> 24) >>> 0;
            tt[1] = ((num << 8) >>> 24) >>> 0;
            tt[2] = (num << 16) >>> 24;
            tt[3] = (num << 24) >>> 24;
            str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "." + String(tt[3]);
            return str;
        };
    })
    .filter('split_str', function() {
        // 分割字符串
        return function(input, pattern) {
            if(typeof input == 'undefined'){
                return input;
            }
            if(typeof pattern == 'undefined'){
               pattern = '|';
            }
            return input.split(pattern);
        };
    })
    .filter('array_intersect', function() {
        // 求两个集合的交集
        return function(a, b) {
            return a.uniquelize().each(function(o){return b.contains(o) ? o : null});
        };
    })
    .filter('round_number', function() {
        // 四舍五入到指定精度,支持到整数位,类似PHP的round函数
        return function(num, len, keep) {
            if(num == 0){
                return '0.00';
            }
            len = parseInt(len,10);
            if( len < 0 )
            {
                len = Math.abs(len);
                return Math.round(Number(num)/Math.pow(10,len))*Math.pow(10,len);
            }
            else if( len == 0 )
            {
                return Math.round(Number(num));
            }
            num = Math.round(Number(num)*Math.pow(10,len))/Math.pow(10,len);
            if( keep && keep == true )
            {
                var t = '';
                num = num.toString();
                if( num.indexOf(".") == -1 )
                {
                    num = "" + num + ".0";
                }
                var data = num.split('.');
                for(var i= data[1].length; i<len; i++ )
                {
                    t += ''+'0';
                }
                return ''+num+''+t;
            }
            return num;
        };
    })
    .filter('is_in_array', function() {
        return function(ipt, arr) {
            if(typeof arr == "undefined" || arr.length < 1){
                return false;
            }
            for(var i=0; i<arr.length; i++){
                if(arr[i] == ipt){
                    return true;
                }
            }
            return false;
        };
    })
    .filter('trim_str', function() {
        return function(str) {
            if(typeof str == "undefined" || str == null){
                return str;
            }
            return str.replace(/(^\s*)|(\s*$)/g,"");
        };
    })
    .filter('move_string', function () {
        return function (sString) {
            var top = '';//开始符串
            var middle = '01'//中间字符串
            var bottom = '';//结束符串
            var tmpone = '';
            var tmptwo = '';
            var find = false;//是否找到分隔字符串
            var findfirst = false;//找到第一个字符
            for (var m=0;m<sString.length;m++){
                if(find == false){
                   top += sString.substr(m,1);
                }
                if( find == false && sString.substr(m,1) == '1'){
                    findfirst = true;
                }else if(find == false && findfirst == true && sString.substr(m,1) == '0'){
                    find = true;
                }else if(find == true){
                   bottom += sString.substr(m,1);
                }
            }
            top = top.substr(0,top.length-2);
            for (var n=0;n<top.length;n++){
                if(top.substr(n,1) == '1'){
                    tmpone += top.substr(n,1);
                }else if(top.substr(n,1) == '0'){
                    tmptwo += top.substr(n,1);
                }
            }
            top = tmpone+tmptwo;
            return top + middle + bottom;
        };
    })
    .filter('combination',function () {
        // 组合数计算
        return function(n, m) {
            m = parseInt(m);
            n = parseInt(n);
            if (m < 0 || n < 0) {
                return false;
            }
            if (m == 0 || n == 0) {
                return 1;
            }
            if (m > n) {
                return 0;
            }
            if (m > n / 2.0) {
                m = n - m;
            }

            var result = 0.0;
            for (var i = n; i >= (n - m + 1); i--) {
                result += Math.log(i);
            }
            for (var i = m; i >= 1; i--) {
                result -= Math.log(i);
            }
            result = Math.exp(result);
            return Math.round(result);
        };
    });
});
