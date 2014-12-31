/**
 * @fileOverview
 * @author daiying.zhang
 */
define(["core"], function(light){
    light.extend({
        ajax: function (url, config){
            if(!light.isString(url)){
                // 如果没有url参数
                config = url;
                url = config.url
            }else{
                // 如果没有config
                config = config || {};
                config.url = url
            }
            if(!url || !config){
                console.log("error.....")
                return this
            }
            config.data = config.data || {};
            var type = (config.type || 'GET').toUpperCase();
            var data = light.extend(config.data, light.ajax.data);
            var params = '';
            var xhr = new XMLHttpRequest();
            var handels = {
                fail: [],
                done:[],
                complete:[]
            };
            light.each({"done":"success", "fail":"error", "complete":"always"}, function(k, v){
                config[v] && pushHandel(handels, k, [config[v]])
            });
            xhr.onreadystatechange = function (){
                if(xhr.readyState === 4){
                    if(xhr.status >= 200 && xhr.status < 400){
                        fireHandel(handels, 'done', getData(xhr, config))
                    }else{
                        fireHandel(handels, 'fail', xhr)
                    }
                }
            };
            xhr.onerror = function (){
                fireHandel(handels, 'fail', xhr)
            };

            $(document).trigger('ajaxSend', config);
            //window.aaa(config)

            try{
                params = getParams(config.data);
                if(type === 'GET'){
                    config.url += (~config.url.indexOf('?') ? '&' : '?') + params;
                    params = '';
                }
                xhr.open(type, config.url, true);
                //POST
                type === 'POST' && xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
                xhr.send(params);
            }catch(e){
                // 如果send()或者open()报错(比如跨域)，IE8 会捕获异常
                fireHandel(handels, 'fail', xhr)
            }

            // 给返回的对象提供快捷接口添加毁掉函数
            var res = {};
            light.each('done fail complete'.split(' '), function(i, e){
                res[e] = function (){
                    pushHandel(handels, e, arguments);
                    return this
                }
            });
            res.abort = function(){
                xhr.abort();
                return this
            };
            return res
        },
        ajaxSetup: function (data){
            light.extend(light.ajax.data, data || {})
        }
    });

    light.ajax.data = {};

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

    // 添加回调函数
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

    // 触发回调函数
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
        type !== 'complete' && fireHandel(handel, 'complete', args);
    }

    //TODO 临时方法，用来根据data获取参数
    function getParams(data){
        var str = [];
        return light.isString(data) ? data : (function(){
            light.each(data, function(k, v){
                str.push(k + '=' + v)
            });
            return str.join('&')
        })()
    }

    function getData(xhr, options){
        var contentType = xhr.getResponseHeader('content-type');
        var data = xhr.response;
        var type = (options.dataType || 'json').toLowerCase();

        if(type === 'json' || contentType.match(/application\/json/)){
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