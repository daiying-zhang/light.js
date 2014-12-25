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
            //todo elem maybe a html string
            return this.each(function(){
                this.appendChild(elem)
            })
        },
        appendTo: function (selector){
            var target = $(selector)[0];
            return this.each(function(){
                target.appendChild(this)
            })
        },
        prepend: function (){

        },
        prependTo: function (){

        },
        wrap: function (){

        }
    })
});