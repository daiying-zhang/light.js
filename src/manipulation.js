/**
 * @fileOverview
 * @author daiying.zhang
 */
define(["core"], function(light){
    light.fn.extend({
        html: function (htmlString){
            return htmlString ? this.each(function(){
                this.innerHTML = htmlString
            }) : this[0] ? this[0].innerHTML : ""
        },
        text: function (text){
            //IE8 support
            var propName = "textContent" in this ? "textContent" : "innerText";
            return text ? this.each(function(){
                this[propName] = text
            }) : this[0] ? this[0].textContent || this[0].innerHTML.replace(/<[^>]+>/g, "") : ""
        },
        empty: function(){
            return this.each(function(){
                var children = this.childNodes, len = children.length;
                while(--len >= 0){
                    $(children[len]).clearData().remove();
                }
            })
        },
        remove: function(){
            return this.each(function(){
                this.parentNode.removeChild(this)
            })
        },
        wrap: function (){

        },

        clone: function(deepClone, cloneEvnetsAndData){
            //TODO 处理data()
            return this.map(function(){
                return this.cloneNode(deepClone)
            })
        }
    });

    light.each({append:'appendChild', prepend:'insertBefore', appendTo:0, prependTo: 0}, function(k,v,o){
        light.fn[k] = function(elem){
            var _this = this, isTo = !v, method = v;

            elem = light(elem);

            // 如果是appendTo/prependTo, 采用的方法为appendChild/insertBefore
            isTo && (method = o[k.replace(/To$/,'')]);

            return _this.each(function(i, e){
                elem.each(function (){
                    // 如果是appendTo/prependTo, 交换插入元素和被插入元素
                    isTo
                        ? this[method](e, this.firstChild)
                        : e[method](this, e.firstChild)
                })
            })
        }
    })
});