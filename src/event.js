/**
 * @fileOverview
 * @author daiying.zhang
 */
define(["core","var/slice"], function(light, slice){
    var addEventListener = document.body.addEventListener
        ? function (dom, typeName, fn){
            dom.addEventListener(typeName, fn, false)
        }
        : function (dom, typeName, fn){
            dom.attachEvent('on' + typeName, function(){
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
                nameSpace = '',
                len = types.length,
                i = 0,
                self = this,
                _delegate,
                _events = self.data('_event');

            !_events && self.data('_event',_events = {});

            for(; i<len; i++){
                type = types[i];
                type = (nameSpace = type.split('.'))[0];
                nameSpace = nameSpace[1] || '';

                if($.isArray(handel.namespace)){
                    handel.namespace.push(nameSpace)
                }else{
                    handel.namespace = [nameSpace]
                }

                hs = _events[type];
                // 没有注册过type事件
                if(!hs){
                    hs = _events[type] = [];
                    self.each(function(i, ele){
                        ele.nodeType && addEventListener(ele, type, function(eve){
                            triggerHandel(null, ele, type, fixEvent(eve, ele))
                        });
                        //ele = null
                    })
                }

                if(selector){
                    _delegate = self.data('_delegate');
                    !_delegate && self.data('_delegate',_delegate = {});
                    hs = _delegate[type] || (_delegate[type] = {});
                    hs = hs[selector] = hs[selector] || [];
                }
                hs.push(handel)
            }
            return self
        },
        /**
         * remove event handel
         * @param type
         * @param handel
         */
        off: function(type, handel) {
            var self = this, hs = self.data('_event'), index;
            if(arguments.length === 0){
                self.data('_event', {});
                self.data('_delegete', {});
            }else{
                if(hs = hs && hs[type.split('.')[0]]){
                    if(!$.isFunction(handel)){
                        hs.length = 0
                    }else{
                        index = hs.indexOf(handel);
                        index !== -1 && hs.splice(index, 1)
                    }
                }
            }

            return self
        },
        one: function (type, selector, handel){
            var args = arguments;
            if(light.isFunction(selector)){
                args = [type, handel = selector]
            }
            handel.__isOne = true;
            return this.on.apply(this, args)
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
                var self = this;
                $.each(type.split(' '), function(i, type){
                    triggerHandel(args, self, type, {type: type, timeStamp: +new Date, isTrigger: true});
                })
            })
        },
        hover: function (fnEnter, fnLeave){
            return this.on('mouseenter', fnEnter)
                .on('mouseleave', fnLeave)
        }
    });

    light.each('mousedown mouseup click dblclick keyup keydown keypress blur focus change'.split(' '), function(i,e){
        light.fn[e] = function(selector, fn){
            light.isFunction(selector) ? this.on(e, selector) : this.on(e, selector, fn)
        }
    });

    function triggerHandel(args, self, type, eve){
        if(!type){return}

        // 1 trigger delegated events
        var hs = $(self).data('_delegate'),
            i = 0,
            $closest,
            typeAndNamespace = type.split('.'),
            namespace;

        type = typeAndNamespace[0];
        namespace = typeAndNamespace[1];

        args = args && slice.call(args, 1);

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
            var _args;
            if(hs && hs.length){
                if(args){
                    _args = [eve].concat(args.length === 1 ? args[0] : args)
                }else{
                    _args = [eve]
                }
                for(i = 0; i<hs.length; i++){
                    if(eve.isImmediatePropagationStopped){
                        break
                    }
                    if(!namespace || ~hs[i].namespace.indexOf(namespace)){
                        if(hs[i].apply(self, _args) === false){
                            eve.stopPropagation();
                            eve.preventDefault();
                        }
                        console.warn("the namespace ===", hs[i].namespace);
                        // 如果是用`.one()`绑定的方法，执行后立即删除
                        if(hs[i].__isOne === true){
                            hs.splice(i--, 1);
                        }
                    }
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
                eve.stopPropagation();
            }
        };

        eve.target = eve.target || eve.srcElement;
        eve.currentTarget = ele;
        return eve
    }
});