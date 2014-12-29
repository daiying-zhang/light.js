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
        append: function (elem){
            light.isString(elem) && (elem = light(elem));
            return this.each(function(i,e){
                if(light.isLight(elem)){
                    elem.each(function (){
                        e.appendChild(this)
                    })
                }else{
                    e.appendChild(elem)
                }
            })
        },
        appendTo: function (selector){
            var target = $(selector), len = target.length;
            return this.each(function(i,e){
                target.each(function (j, el){
                    el.appendChild(len > 1 && j > 0 ? e.cloneNode(true) : e)
                })
            })
        },
        prepend: function (elem){
            //todo 重构代码  & 修复bug，elem，可能为数组
            light.isString(elem) && (elem = light(elem));
            return this.each(function(i,e){
                if(light.isLight(elem)){
                    elem.each(function (){
                        e.insertBefore(this, e.firstChild)
                    })
                }else{
                    e.insertBefore(elem, e.firstChild)
                }
            })
        },
        prependTo: function (selector){
            var target = $(selector), len = target.length;
            return this.each(function(i,e){
                target.each(function (j, el){
                    el.insertBefore(len > 1 && j > 0 ? e.cloneNode(true) : e, el.firstChild)
                })
            })
        },
        wrap: function (){

        }
    })
});