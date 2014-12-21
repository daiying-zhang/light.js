/**
 * @fileOverview
 * @author daiying.zhang
 */
define(["core","var/slice"], function(light, slice){
    var addEventListener = document.body.addEventListener
        ? function (dom, typeName, fn){
            dom.addEventListener(typeName, fn, false)
        }
        : function (dom, typeNaem, fn){
            dom.attachEvent('on' + typeNaem, fn)
        };

    light.fn.extend({
        /**
         * bind event
         * @param type
         * @param selector
         * @param handel
         * @example
         *    eve.on('add remove', function(){//...})
         *    eve.on('click', function(){//...})
         */
        on : function(type, selector, handel){
            if(arguments.length === 2){
                handel = selector;
                selector = false
            }
            if(!$.isString(type) || !$.isFunction(handel)){
                return
            }
            var hs,
                types = type.split(/\s+/),
                len = types.length,
                i = 0,
                type,
                _events = this.data('_event');

            !_events && (_events = this.data('_event',{}).data('_event'));

            for(; i<len; i++){
                hs = _events[type = types[i]];
                if(!hs){
                    hs = _events[type] = [];
                    this.each(function(i, ele){
                        addEventListener(ele, type, function(e){
                            //$(ele).trigger(type, e)
                            triggerHandel(ele, type, fixEvent(e || window.event))
                        });
                        //ele = null
                    })
                }
                hs.push(handel)
            }
        },
        /**
         * remove event handel
         * @param type
         * @param handel
         */
        off: function(type, handel) {
            var hs = this.data('_event'), index;
            hs = hs && hs[type];
            if(hs){
                if(!$.isFunction(handel)){
                    hs.length = 0
                }else{
                    index = hs.indexOf(handel);
                    index !== -1 && hs.splice(index, 1)
                }
            }
        },
        /**
         * trigger event
         * @param type
         * @example
         *    eve.trigger('click', param1, param2)
         *    eve.trigger('click', [param1, param2])
         */
        trigger : function(type){
            return this.each(function(){
                if($.isFunction(this[type])){
                    this[type]()
                }else{
                    triggerHandel(this, type, {type: type});
                }
            })
        }
    });

    function triggerHandel(self, type, eve){
        if(!type){return}
        var hs = $(self).data('_event'), len, i = 0, args = slice.call(arguments, 1);
        hs = hs && hs[type];

        eve = eve || {type: type};
        if(hs && (len = hs.length)){
            for(; i<len; i++){
                if(arguments.length === 2
                    && $.isArray(args[0])){
                    hs[i].apply(self, [eve].concat(args[0]))
                }else{
                    hs[i].apply(self, [eve].concat(args))
                }
            }
        }
    }

    function fixEvent(eve){
        // fuck ie 8
        if(!$.isFunction(eve.stopPropagation)){
            eve.stopPropagation = function (){
                eve.cancelBubble = true
            }
        }
        if(!$.isFunction(eve.preventDefault)){
            eve.preventDefault = function (){
                eve.returnValue = false
            }
        }
        eve.target = eve.target || eve.srcElement;
        return eve
    }
});