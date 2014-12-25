/**
 * @fileOverview
 * @author daiying.zhang
 */
define(["core"], function(light){
    light.each(["attr", "prop"], function(i, e){
        light.fn[e] = function (key, val){
            var type = $.type(key), self = this;
            // get
            if(arguments.length === 1 && type === 'string'){
                return self[0] ? access(self[0], e, key) : ''
            }
            // set
            return this.each(function(){
                if(type === 'string'){
                    access(this, e, key, val)
                }else if(type === 'object'){
                    for(var _key in key){
                        access(this, e, _key, key[_key])
                    }
                }
            })
        }
    });
    light.fn.extend({
        removeAttr: function (key){
            return this.each(function (i, e){
                e.removeAttribute(key)
            })
        },
        removeProp: function (key){
            return this.each(function (i, e){
                delete e[key]
            })
        },
        val: function(val){
            return this.prop.apply(this, [].concat.apply(["value"], arguments))
        }
    });

    function access(dom, type, key, val){
        if(type === 'attr'){
            if(val){
                dom.setAttribute(key, val)
            }else{
                return dom.getAttribute(key)
            }
        }else if(type === 'prop'){
            if(val){
                dom[key] = val
            }else{
                return dom[key]
            }
        }

    }
});