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
            dom.attachEvent('on' + typeNaem, function(){
                fn.call(dom, window.event)
            })
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
                _delegate,
                _events = this.data('_event');

            !_events && this.data('_event',_events = {});

            for(; i<len; i++){
                hs = _events[type = types[i]];

                // 没有注册过type事件
                if(!hs){
                    hs = _events[type] = [];
                    this.each(function(i, ele){
                        addEventListener(ele, type, function(eve){
                            triggerHandel(null, ele, type, fixEvent(eve, ele))
                        });
                        //ele = null
                    })
                }

                if(selector){
                    _delegate = this.data('_delegate');
                    !_delegate && this.data('_delegate',_delegate = {});
                    hs = _delegate[type] || (_delegate[type] = {});
                    hs = hs[selector] = hs[selector] || [];
                }
                hs.push(handel)
            }
            return this
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
            return this
        },
        /**
         * trigger event
         * @param type
         * @example
         *    eve.trigger('click', param1, param2)
         *    eve.trigger('click', [param1, param2])
         */
        trigger : function(type){
            var args = arguments;
            return this.each(function(){
                triggerHandel(args, this, type, {type: type, timeStamp: +new Date, isTrigger: true});
            })
        }
    });

    function triggerHandel(args, self, type, eve, selector){
        if(!type){return}

        // 1 trigger delegated events
        var hs = $(self).data('_delegate'), i = 0, args = args && slice.call(args, 1);
        var $closest;
        // 事件类型`type`对应的处理函数对象
        hs = hs && hs[type];

        for(var key in hs){
            $closest = $(eve.target).closest(key);
            if($closest.length){
                eve.currentTarget = $closest[0];
                hs = hs[key];
                break;
            }
        }
        trigger(hs);

        // 2 trigger events bind on the current `element`
        if(eve.isPropagationStopped){
            return
        }
        hs = $(self).data('_event');
        hs = hs && hs[type];
        //selector && (hs = hs[selector]);

        trigger(hs);

        args && self[type] && self[type]();

        function trigger(hs){
            var len, _args;
            if(hs && (len = hs.length)){
                if(args){
                    _args = [eve].concat(args.length === 1 ? args[0] : args)
                }else{
                    _args = [eve]
                }
                for(i = 0; i<len; i++){
                    hs[i].apply(self, _args)
                }
            }
        }

    }

    function fixEvent(originEve, ele){
        // fuck ie 8
        var eve = $.extend({}, originEve);
        eve.originEvent = originEve;
        eve.stopPropagation = function (){
            eve.isPropagationStopped = true;
            if(originEve.stopPropagation){
                originEve.stopPropagation()
            }else{
                originEve.cancelBubble = true
            }
        };
        eve.preventDefault = function(){
            eve.isDefaultPrevented = true;
            if (originEve.preventDefault) {
                originEve.preventDefault()
            } else {
                originEve.returnValue = false
            }
        };
        eve.stopImmediatePropagation = function (){
            eve.isImmediatePropagationStopped = true;
            if(originEve.stopImmediatePropagation){
                originEve.stopImmediatePropagation()
            }else{
                //eve.stopPropagation();
            }
        }

        eve.target = eve.target || eve.srcElement;
        eve.currentTarget = ele;
        return eve
    }
});