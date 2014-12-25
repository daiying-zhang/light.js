/**
 * @fileOverview
 * @author daiying.zhang
 */
define(["core"], function(light){
    light.each(["children", "childNodes"],function(idx, key){
        light.fn[key] = function(){
            var result = [];
            this.each(function (){
                result = result.concat($.toArray(this[key]))
            });
            return this.pushState($.unique(result))
        }
    });
    light.fn.content = light.fn.childNodes;

    var PN = 'parentNode', NS = 'nextSibling', PS = 'previousSibling';
    light.each({
        "parent": {"key": PN,"count":1},
        "parents": {"key": PN},
        "parentsUntil": {"key": PN},
        "next": {"key": NS, count: 1},
        "nextAll": {"key": NS},
        "prev": {"key": PS, count:1},
        "prevAll": {"key": PS},
        "closest": {"key": PN}
    }, function(key, val){
        light.fn[key] = function(selector, filter){
            var result = [];
            if(key.match(/Until$/)){
                val.until = selector;
                //todo selector可能为light对象
                selector = filter
            }
            if(key === 'closest'){
                val.include = 1;
                if(!selector){
                    val.count = 1
                }
            }
            this.each(function (){
                result = result.concat(traver(this, val.key, val.until, val.include, val.count))
            });
            if(selector){
                var obj = $.extend($(), result);
                obj.length = result.length;
                result = obj.filter(selector)
            }
            return this.pushState($.unique(result))
        }
    });

    /**
     * 遍历DOM节点
     * @param dom           遍历的起点
     * @param type          遍历的方法,例如：nextSibling
     * @param until         遍历的截止节点
     * @param include       是否包含起止节点 0 => 不包含 1 => 包含起始节点 2 => 包含结束节点
     * @param count         遍历的层次数
     * @returns {Array}
     */
    function traver(dom, type, until, include, count){
        var result = [], until = until || document, cur = dom, c = 0;
        count = count || Infinity;
        while((cur = cur[type]) && cur !== until){
            if(cur.nodeType === 1){
                ++c && result.push(cur);
            }
            if(c >= count){
                break
            }
        }
        include === 1 && result.unshift(dom);
        include === 2 && result.push(dom);
        return result.slice(0,count)
    }

    light.fn.extend({
        "siblings": function (){
            return this.parent().children()
        },
        "is": function (selector){
            var res = false;
            if($.isLight(selector)){
                res = true;
                // 如果是light对象，每个元素相同则相同
                this.each(function (idx, el){
                    if(el !== selector[idx]){
                        return res = false
                    }
                })
            }else{
                this.each(function (idx, el){
                    var matchs = match(el, selector);
                    return !(res = matchs)
                });
            }

            return res
        },
        filter: function(selector){
            var elems = [];
            if(light.isString(selector)){
                this.each(function (){
                    match(this, selector) && elems.push(this)
                })
            }else if(light.isFunction(selector)){
                this.each(function (i, e){
                    selector(i, e) && elems.push(e)
                })
            }
            return this.pushState(elems)
        },
        not: function (selector){
            var self = this, indexOf = [].indexOf;
            if($.isLight(selector)){
                selector.each(function (){
                    var index;
                    if((index = indexOf.call(self, this)) !== -1){
                        self.splice(index, 1)
                    }
                });
                return self
            }
            return self.filter(function(i, e){
                return !match(e, selector)
            })
        },
        index: function (elem){
            var all, curr;
            if(elem){
                all = this;
                curr = ($.isLight(elem) ? elem : $(elem))[0]
            }else{
                all = this.siblings();
                curr = this[0]
            }
            return [].indexOf.call(all, curr)
        },
        find: function (selector){
            var result = [];
            this.each(function (){
                result = result.concat($.makeArray(selector, this))
            });
            return this.pushState($.concat(result))
        }
    });

    function match(el, selector){
        var res = false, type = light.type(selector),
            matches = el.matches || el.matchesSelector || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector;

        if(type === "string"){
            res = matches ? matches.call(el, selector) : matchIE8(el, selector);
        }else{
            res = el === selector
        }
        return res
    }

    // Support IE 8
    function matchIE8(elem, selector){
        // http://tanalin.com/en/blog/2012/12/matches-selector-ie8/
        var elems = elem.parentNode.querySelectorAll(selector),
            count = elems.length;

        for (var i = 0; i < count; i++) {
            if (elems[i] === elem) {
                return true;
            }
        }

        return false;
    }
});