/**
 * @fileOverview
 * @author daiying.zhang
 */
define(["core"], function(light){
    light.fn.extend({
        /**
         * 获取(设置)元素的innerHTML
         * @param {String} htmlString 需要设置的html字符串
         * @returns {String|light}
         */
        html: function (htmlString){
            return htmlString ? this.each(function(){
                this.innerHTML = htmlString
            }) : this[0] ? this[0].innerHTML : ""
        },
        /**
         *
         * @param html
         * @returns {*}
         */
        outerHTML: function(html){
            return html ? this.each(function(){
                this.outerHTML = html
            }) : this[0] ? this[0].outerHTML : ""
        },
        /**
         * 获取(设置)元素的textContent/innerText
         * @param {String} text 需要设置的文本
         * @returns {light|String}
         */
        text: function (text){
            //IE8 support
            var propName = "textContent" in this[0] ? "textContent" : "innerText";
            return arguments.length ? this.each(function(){
                this[propName] = text
            }) : this[0] ? this[0].textContent || this[0].innerHTML.replace(/<[^>]+>/g, "") : ""
        },
        /**
         * 清空所有的子节点(包括文本节点)，同时清除所有子节点所存储的数据
         * @returns {light}
         */
        empty: function(){
            return this.each(function(){
                var children = this.childNodes, len = children.length;
                while(--len >= 0){
                    $(children[len]).clearData().remove();
                }
            })
        },
        /**
         * 删除元素，同时清除节点所存储的数据
         * @returns {*}
         */
        remove: function(){
            return this.each(function(){
                $(this).clearData();
                this.parentNode.removeChild(this)
            })
        },
        wrap: function (){

        },

        /**
         * 克隆元素
         * @param {Boolean} [deepClone=false]   是否克隆子节点
         * @param {Boolean} [cloneEvnetsAndData=false] 是否克隆元素存储的数据
         * @returns {light}
         */
        clone: function(deepClone, cloneEvnetsAndData){
            //TODO 处理data()
            return this.map(function(){
                return this.cloneNode(deepClone)
            })
        }
    });


    /**
     * 向元素末尾插入新的元素，新元素如果已经加入到文档中，会从原来的位置移除
     * 如果要被插入到多个元素，会复制`elem`
     * @name append
     * @param {light|HTMLElement|String} elem 要插入的新元素/light对象/选择器/html片段
     * @returns {light}
     */
    /**
     * 向元素起始位置插入新的元素，新元素如果已经加入到文档中，会从原来的位置移除
     * 如果要被插入到多个元素，会复制`elem`
     * @name prepend
     * @param {light|HTMLElement|String} elem 要插入的新元素/light对象/选择器/html片段
     * @returns {light}
     */
    /**
     * 与`append`操作顺序相反
     * @name appendTo
     * @param {light|HTMLElement|String} elem 目标元素/light对象/选择器/html片段
     * @returns {light}
     */
    /**
     * 与`prepend`操作顺序相反
     * @name prependTo
     * @param {light|HTMLElement|String} elem 目标元素/light对象/选择器/html片段
     * @returns {light}
     */
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