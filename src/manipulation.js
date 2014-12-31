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
        //appendTo: function (selector){
        //    var target = $(selector), len = target.length;
        //    return this.each(function(i,e){
        //        target.each(function (j, el){
        //            el.appendChild(len > 1 && j > 0 ? e.cloneNode(true) : e)
        //        })
        //    })
        //},
        //prependTo: function (selector){
        //    var target = $(selector), len = target.length;
        //    return this.each(function(i,e){
        //        target.each(function (j, el){
        //            el.insertBefore(len > 1 && j > 0 ? e.cloneNode(true) : e, el.firstChild)
        //        })
        //    })
        //},
        wrap: function (){

        },
        clone: function(){

        }
    });

    light.each({append:'appendChild', prepend:'insertBefore', appendTo:0, prependTo: 0}, function(k,v,o){
        light.fn[k] = function(elem){
            //debugger
            //var isLight, _this = this;
            //!v && (_this = elem, elem = this, v = o[k.replace(/To$/,'')]);
            //isLight = light.isLight(elem);
            //light.isString(elem) && (elem = light(elem), isLight = true);
            //return _this.each(function(i, e){
            //    if(isLight){
            //        elem.each(function (){
            //            e[v](this, e.firstChild)
            //        })
            //    }else{
            //        e[v](elem, e.firstChild)
            //    }
            //})
            var isLight, _this = this, isTo = !v, method = v;
            //!v && (_this = elem, elem = this, v = o[k.replace(/To$/,'')]);
            isLight = light.isLight(elem);

            isTo && (method = o[k.replace(/To$/,'')]);
            light.isString(elem) && (elem = light(elem), isLight = true);
            return _this.each(function(i, e){

                if(isLight){
                    elem.each(function (){
                        isTo
                            ? this[method](e, this.firstChild)
                            : e[method](this, e.firstChild)
                    })
                }else{
                    isTo
                        ? this[method](e, this.firstChild)
                        : e[method](elem, e.firstChild)
                    //e[v](elem, e.firstChild)
                }
            })
        }
    })
});