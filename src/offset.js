/**
 * @fileOverview
 * @author daiying.zhang
 */

define(["core"], function(light){
    var pf = parseFloat;
    light.fn.extend({
        offset: function (coordinates){
            if(coordinates){
                var _left = pf(coordinates.left, 10),
                    _top = pf(coordinates.top, 10);
                return this.each(function (){
                    this.style.position = 'static';
                    var origin = getBound(this);
                    var left = isFinite(_left) && _left - origin.left,
                        top = isFinite(_top) && _top - origin.top;
                    var css = {'position': 'relative'};

                    left && (css.left = left + 'px');
                    top && (css.top = top + 'px');
                    $(this).css(css)
                })
            }
            var bound = getBound(this[0]);
            return bound ? {left: bound.left, top: bound.top} : null
        },
        position: function (){
            var $this = light(this[0]),
                parent = this.offsetParent()[0],
                $parent = light(parent),
                offsetParent = getBound(parent),
                offset = getBound(this[0]),
                res = null,
                marginAndBorder;

            if(offset && offsetParent){
                marginAndBorder = {
                    left : pf($this.css('marginLeft')) + pf($parent.css('borderLeftWidth')),
                    top: pf($this.css('marginTop')) + pf($parent.css('borderTopWidth'))
                };
                res = {
                    left: offset.left - offsetParent.left - marginAndBorder.left,
                    top: offset.top - offsetParent.top - marginAndBorder.top
                }
            }
            return res
        },
        offsetParent: function (){
            return this.map(function (){
                //var offsetParent = this.offsetParent || document.documentElement;
                //while(offsetParent && offsetParent.nodeName !== 'html' && light(offsetParent).css('position') === 'static'){
                //    offsetParent = offsetParent.offsetParent
                //}
                //return offsetParent
                return this.offsetParent
            })
        }
    });

    light.each(['width', 'height'], function(i,e){
        light.fn[e] = function (val){
            // set
            if(val){
                return this.css(e, ~(''+val).indexOf('px') ? val : val + 'px')
            }
            // get
            if(val = getBound(this[0])){
                if($.type(val[e]) !== 'number'){
                    return e === 'width' ? val.right - val.left : val.bottom - val.top
                }
                return Math.floor(val[e])
            }
            return 0
        }
    });

    function getBound(dom){
        if(light.isWindow(dom)){
            var html = dom.document.documentElement;
            return {
                left:0,
                top:0,
                right: html.clientWidth,
                bottom: html.clientHeight
            }
        }

        if(light.isDocument(dom)){
            dom = document.documentElement
        }
        return fixBound(dom ? $.extend({}, dom.getBoundingClientRect()) : null)
    }

    function fixBound(bound){
        var x, y, body = document.body, html = document.documentElement;
        if(bound){
            x = pageXOffset || html.scrollLeft || body.scrollLeft;
            y = pageYOffset || html.scrollTop || body.scrollTop;
            bound.left += x;
            bound.right += x;
            bound.top += y;
            bound.bottom += y;
            return bound
        }
    }
});