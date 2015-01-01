/**
 * @fileOverview
 * @author daiying.zhang
 */
define(["core"], function(light){
    light.fn.extend({
        css: function (key, val){
            var type = $.type(key);
            // get
            if(arguments.length === 1 && type === 'string'){
                return getStyle(this[0], key.camelize())
            }

            // set
            return this.each(function(){
                if(type === 'string'){
                    // FireFox does not support proper name like `font-size`
                    // Should use `fontSize` or use `HTMLElement.style.setProperty()`
                    this.style[key.camelize()] = val;
                }else if(type === 'object'){
                    for(var _key in key){
                        this.style[_key.camelize()] = key[_key];
                    }
                }
            })
        },
        toggle: function (isShow){
            return this.each(function(){
                var style = this.style, none = 'none';
                if(isShow){
                    style.display = ""
                }else if(isShow === false){
                    style.display = none
                }else{
                    style.display = style.display === none ? "" : none
                }
            })
        },
        hasClass: function (cls){
            return getClassList(this[0]).contains(cls)
        }
    });

    light.each(["add", "remove", "toggle"], function(i, e){
         light.fn[e + 'Class'] = function(cls){
             return this.each(function (){
                 var classList = getClassList(this);
                 classList[e](cls)
             })
         }
    });

    light.each({hide:'none', show:''}, function(k,v){
        light.fn[k] = function(){
            return this.each(function(){
                this.style.display = v
            })
        }
    });

    function getClassList(elem){
        if(elem.classList){
            return elem.classList
        }
        var classList = elem.className.split(" "),
            setClass = function (){
                elem.className = classList.join(' ')
            };
        return $.extend(classList, {
            add: function (cls){
                if(classList.indexOf(cls) === -1){
                    classList.push(cls);
                    setClass()
                }
            },
            contains: function (cls){
                return classList.indexOf(cls) > -1
            },
            remove: function (cls){
                var index = classList.indexOf(cls);
                if(index){
                    classList.splice(index, 1);
                    setClass();
                    return true
                }
                return false
            },
            toggle: function (cls){
                // 如果移除成功表示有，没有成功表示没有，直接push
                if(!this.remove.call(this, cls)){
                    classList.push(cls)
                }
                setClass()
            }
        })
    }

    function getStyle(dom, key){
        var gcs = window.getComputedStyle;
        return dom ? gcs ? gcs(dom)[key] : dom.currentStyle[key] : ''
    }
});