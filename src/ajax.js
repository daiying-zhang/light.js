/**
 * @fileOverview
 * @author daiying.zhang
 */
define(["core"], function(light){
    light.extend({
        ajax: function (url, config){
            if(!light.isString(url)){
                config = url;
                url = config.url
            }
            if(!url){
                return this
            }
            var type = (config.type || 'GET').toUpperCase();
            var data = config.data;
            var params = getParams(data);
            var xhr = new XMLHttpRequest();
            var handels = {
                fail: [],
                done:[],
                always:[]
            };
            light.each({"done":"success", "fail":"error", "complete":"always"}, function(k, v){
                pushHandel(handels, k, [config[v]])
            });
            xhr.onreadystatechange = function (){
                if(xhr.readyState === 4){
                    if(xhr.status >= 200 && xhr.status < 400){
                        //var contentType = xhr.getResponseHeader('content-type');
                        //var data = xhr.response;
                        //data = contentType.match(/application\/json/) ? JSON.parse(data) : data;
                        console.log("xhr", xhr)
                        fireHandel(handels, 'done', getData(xhr, config))
                    }else{
                        fireHandel(handels, 'fail', xhr)
                    }
                }
            };
            xhr.onerror = function (){
                fireHandel(handels, 'fail')
            };

            try{
                if(type === 'GET'){
                    url += (~url.indexOf('?') ? '&' : '?') + params;
                    params = '';
                }
                xhr.open(type, url, true);
                //POST
                type === 'POST' && xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
                xhr.send(params);
            }catch(e){
                // 如果send()或者open()报错(比如跨域)，IE8 会捕获异常
                fireHandel(handels, 'fail', xhr)
            }

            var res = {};
            light.each('done fail always'.split(' '), function(i, e){
                res[e] = function (){
                    pushHandel(handels, e, arguments);
                    return this
                }
            });
            return res
        }
    });

    light.each(["get", "post"], function(i,e){
        light[e] = function (url, data, fnDone, fnFail){
            if(light.isFunction(data)){
                fnFail = fnDone;
                fnDone = data;
                data = "";
            }
            return this.ajax(url, {type: e.toUpperCase(), data: data, success:fnDone, error: fnFail})
        }
    });

    function pushHandel(handel, type, fns){
        var handels = handel[type], i= 0, len = fns.length, argsCache = handel[type + "Arg"];
        // 还没有被触发过
        if(handels){
            for(;i<len;i++){
                light.isFunction(fns[i]) && handels.push(fns[i])
            }
        }else{
            //如果已经触发过 => 直接执行
            for(;i<len;i++){
                light.isFunction(fns[i]) && fns[i](argsCache)
            }
        }
    }

    function fireHandel(handel, type, args){
        var handels = handel[type];
        // 还没有被触发过
        if(handels){
            light.each(handels, function(i,e){
                e(args)
            });
            handel[type] = null;
            handel[type + 'Arg'] = args;
        }
    }

    function getParams(data){
        return light.isString(data) ? data : "a=1&b=2&c=3"
    }

    function getData(xhr, options){
        var contentType = xhr.getResponseHeader('content-type');
        var data = xhr.response;
        var type = (options.dataType || 'json').toLowerCase();

        if(type === 'json' && contentType.match(/application\/json/)){
            return JSON.parse(data)
        }else if(type === 'xml'){
            return xhr.responseXML
        }else if(type === 'script'){
            light.globalEval(data);
            return data
        }else{
            return data
        }
    }
});