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
                return this[0] ? this[0].style[key] : ''
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
            //todo 保存当前的display值
            return this.each(function (){
                this.style.display = "none"
            })
        },
        show: function (){
            //todo 根据保存的display设置
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
        }
    })
});