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
                return this[0] ? getComputedStyle(this[0])[key] : ''
            }
            // set
            return this.each(function(){
                if(type === 'string'){
                    this.style[key] = val
                }else if(type === 'object'){
                    console.log("objdec");
                    for(var _key in key){
                        this.style[_key] = key[_key]
                    }
                }
            })
        },
        hide: function (){
            return this.each(function (){
                this.style.display = "none"
            })
        },
        show: function (){
            return this.each(function(){
                this.style.display = ""
            })
        },
        toggle: function (isShow){
            return this.each(function(){
                var style = this.style;
                if(isShow){
                    style.display = ""
                }else if(isShow === false){
                    style.display = "none"
                }else{
                    style.display = style.display === "none" ? "" : "none"
                }
            })
        },
        addClass: function (cls){
            return this.each(function (){
                var classList = getClassList(this);
                classList.add(cls)
            })
        },
        removeClass: function (cls){
            return this.each(function (){
                var classList = getClassList(this);
                classList.remove(cls)
            })
        },
        toggleClass: function (cls){
            return this.each(function (){
                var classList = getClassList(this);
                classList.toggle(cls)
            })
        },
        hasClass: function (cls){
            return getClassList(this[0]).contains(cls)
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
});