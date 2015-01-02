/**
 * @fileOverview
 * @author daiying.zhang
 */
define(["core"], function(light){
    light.fn.extend({
        data: function (key, val){
            // .data() ==> all the data
            var dom = this[0],
                data = getDateset(dom),
                len = arguments.length;
            if(!len){
                var _data = $.extend(true, {}, data);
                delete _data._event;
                return _data
            }
            var keyType = $.type(key);
            if(keyType === 'string'){
                return len === 2 ? this.each(function(){
                    setData(this, key, val)
                }) : data[key]
            }else if(keyType === 'object'){
                return this.each(function (){
                    for(var _key in key){
                        setData(this, _key, key[_key])
                    }
                })
            }
        },
        hasData: function (key){
            var hasData = false;
            this.each(function(){
                if(getCacheObj(this)[key]){
                    return !(hasData = true)
                }
            });
            return hasData
        },
        removeData: function (key){
            return this.each(function(){
                var obj = getCacheObj(this);
                if(obj[key]){
                    delete obj[key]
                }
            });
        },
        clearData: function (){
            return this.each(function(){
                var id = this[$.expando];
                id && delete $.cache[id]
            });
        }
    });

    function getDateset(dom){
        var data = getCacheObj(dom);
        var dataset = dom.dataset, attributes, i = 0, len, tmp;
        if(dataset === undefined){
            dataset = {};
            attributes = dom.attributes;
            for(len = attributes.length; i<len; i++){
                if(tmp = attributes[i].name.match(/^data\-(.+)$/)){
                    dataset[tmp[1].camelize()] = attributes[i].value
                }
            }
        }
        //todo ie8 dataset
        return $.extend(true, data, dataset)
    }

    function getCacheObj(dom){
        var expando = $.expando, id, cache = $.cache, currCache;
        if(!(id = dom[expando])){
            dom[expando] = id = $.guid()
        }
        cache = cache || ($.cache = {});
        currCache = cache[id];
        currCache = currCache || (cache[id] = {});
        return currCache;
    }

    function setData(dom, key, val){
        var cache = getCacheObj(dom);
        cache[key] = val
    }
});