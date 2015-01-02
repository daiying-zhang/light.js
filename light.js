;(function() {
/**
 * @fileOverview
 * @author daiying.zhang
 */
var var_toString, var_slice, var_splice, var_rHTMLTag, var_hasOwn, core, manipulation, traversing, css, data, event, attr, offset, ajax, light;
var_toString = Object.prototype.toString;
var_slice = [].slice;
var_splice = [].splice;
var_rHTMLTag = /^\s*<(\w+)(\s+[^>]+)?>/;
var_hasOwn = Object.prototype.hasOwnProperty;
core = function (toString, slice, splice, rHtml, hasOwn) {
  var $ = light;
  function light(selector, context) {
    return new light.fn.init(selector, context);
  }
  $.fn = $.prototype;
  $.light = '1.0.0';
  /**
   * extend
   * @param deep
   * @param target
   * @param source
   * @returns {*}
   */
  $.extend = $.fn.extend = function (deep, target, source) {
    var tmp, type, isArray, isBool = typeof deep === 'boolean', args = slice.call(arguments, 0), len = args.length, i = 2;
    // .extend(object)        or .extend(true|false, object)
    if (len === 1 && !isBool || len === 2 && isBool) {
      target = this;
      deep = len === 1 ? false : deep;
      i = len - 1;  // .extend(target, source, ...)
    } else if (!isBool) {
      target = deep;
      deep = false;
      i = 1;
    }
    for (; i < len; i++) {
      source = args[i];
      for (var key in source) {
        // deep clone
        if (deep) {
          //if(hasOwn.call(source, key)){
          type = $type(tmp = source[key]);
          isArray = $isArray(tmp);
          if (/^(object|array)$/.test(type)) {
            target[key] = target[key] ? target[key] : isArray ? [] : {};
            $.extend(true, target[key], tmp);
          } else {
            target[key] = tmp;
          }  //}
        } else {
          //if(hasOwn.call(source, key)){
          target[key] = source[key]  //}
;
        }
      }
    }
    return target;
  };
  // tools
  $.extend({
    type: $type,
    isArray: $isArray,
    isFunction: function (obj) {
      return this.type(obj) === 'function';
    },
    isString: $isString,
    isUndefined: function (obj) {
      return obj === undefined;
    },
    isNumber: function (obj) {
      var ps = Number(obj);
      return !$.isArray(obj) && ps === ps;
    },
    isWindow: function (obj) {
      return obj && obj.window === obj;
    },
    isDocument: function (obj) {
      return 'getElementById' in obj;
    },
    isFunction: function (obj) {
      return $type(obj) === 'function';
    },
    isArrayLike: function (obj) {
      var length = obj.length, type = light.type(obj);
      if (type === 'function' || light.isWindow(obj)) {
        return false;
      }
      if (obj.nodeType === 1 && length) {
        return true;
      }
      return type === 'array' || length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj;
    },
    isLight: function (obj) {
      return obj.constructor && obj.constructor === light;
    },
    noop: function () {
    },
    each: function (obj, func) {
      if (!this.isFunction(func))
        return;
      var isArrayLike = this.isArrayLike(obj);
      if (isArrayLike) {
        for (var i = 0, len = obj.length; i < len; i++) {
          if (func.call(obj[i], i, obj[i], obj) === false) {
            return;
          }
        }
      } else {
        for (var key in obj) {
          if (func.call(obj[key], key, obj[key], obj) === false) {
            return;
          }
        }
      }
      return obj;
    },
    map: function (obj, fn) {
      var ret = [], result;
      light.each(obj, function (k, v) {
        if ((result = fn.call(this, k, v)) != null) {
          ret.push(result);
        }
      });
      return [].concat(ret);
    },
    makeArray: function (selector, context) {
      if (!selector) {
        return [];
      }
      var type = $typeOf(selector), context = context || document;
      if (type === 'string') {
        if (rHtml.test(selector)) {
          // html片段
          var div = document.createElement('div');
          div.innerHTML = selector;
          return $.toArray(div.childNodes);
        } else {
          return $.toArray(context.querySelectorAll(selector));
        }
      } else if (type === 'object'  /* || type.match(/html(?:\w+)?element$/)*/) {
        return $.isLight(selector) ? selector : [selector];
      } else {
        return [];
      }
    },
    toArray: function (obj) {
      var result = [];
      try {
        result = slice.call(obj);
      } catch (e) {
        var i = 0, len = obj.length;
        if ($.isNumber(len)) {
          for (; i < len; i++) {
            result.push(obj[i]);
          }
        }
      }
      return result;
    },
    unique: function (obj) {
      var tmp = [], index;
      for (var i = 0; i < obj.length; i++) {
        if (~(index = tmp.indexOf(obj[i]))) {
          splice.call(obj, index, 1);
          i--;
        } else {
          tmp.push(obj[i]);
        }
      }
      return obj;
    },
    expando: ('light' + light.light + Math.random()).replace(/\./g, ''),
    guid: function () {
      var count = 0;
      return function () {
        return ++count;
      };
    }(),
    globalEval: function (code) {
      var script = document.createElement('script');
      script.text = code;
      document.head.appendChild(script).parentNode.removeChild(script);
    }
  });
  light.fn.extend(true, {
    init: function (selector, context) {
      //this.length = 0;
      this.selector = selector;
      this.context = context || document;
      var arr = $.makeArray(selector, this.context), len = arr.length;
      this.length = len;
      this.extend($.toArray(arr));
    },
    /**
     * 遍历所有元素，执行fn，fn接受两个参数`index`和`element`
     * @param {Function} fn
     * @returns {light.fn}
     */
    each: function (fn) {
      for (var i = 0, len = this.length; i < len; i++) {
        if (fn.call(this[i], i, this[i], this) === false) {
          break;
        }
      }
      return this;
    },
    map: function (fn) {
      return this.pushState(light.map(this, fn));
    },
    pushState: function (elems) {
      var ret = $();
      ret.prevObject = this;
      ret.context = this.context;
      ret.selector = this.selector;
      //todo $.extend 有bug，当elems是数组的时候
      ret.length = elems.length;
      return $.extend(ret, elems);
    },
    end: function () {
      return this.prevObject;
    },
    eq: function (index) {
      return this.pushState([this[index]]);
    },
    gt: function (index) {
      return this.pushState(this.slice(index + 1));
    },
    lt: function (index) {
      return this.pushState(this.slice(0, index));
    },
    not: function () {
    },
    add: function () {
    },
    first: function () {
      return this.eq(0);
    },
    last: function () {
      return this.eq(this.length - 1);
    },
    //slice: function (returnArray){
    //    var ret = slice.apply(this, arguments);
    //    return returnArray ? ret : this.pushState(ret)
    //},
    slice: slice,
    splice: splice
  });
  light.fn.init.prototype = light.fn;
  function $type(obj) {
    return toString.call(obj).replace(/^\[object (\w+)\]$/, '$1').toLowerCase();
  }
  function $typeOf(obj) {
    return typeof obj;
  }
  function $isArray(obj) {
    return $type(obj) === 'array';
  }
  function $isString(obj) {
    return $type(obj) === 'string';
  }
  //TODO 移动到对应的文件中
  // extend build-in objects
  if (!$.isFunction([].indexOf)) {
    Array.prototype.indexOf = function (ele) {
      for (var i = 0, len = this.length; i < len; i++) {
        if (this[i] === ele) {
          return i;
        }
      }
      return -1;
    };
  }
  if (!$.isFunction(''.camelize)) {
    String.prototype.camelize = function () {
      if (this.indexOf('_') < 0 && this.indexOf('-') < 0) {
        return this;
      }
      return this.replace(/[-_]([^-_])/, function (match, letter) {
        return letter.toUpperCase();
      });
    };
  }
  return light;
}(var_toString, var_slice, var_splice, var_rHTMLTag, var_hasOwn);
manipulation = function (light) {
  light.fn.extend({
    /**
     * 获取(设置)元素的innerHTML
     * @param {String} htmlString 需要设置的html字符串
     * @returns {String|light}
     */
    html: function (htmlString) {
      return htmlString ? this.each(function () {
        this.innerHTML = htmlString;
      }) : this[0] ? this[0].innerHTML : '';
    },
    /**
     * 获取(设置)元素的textContent/innerText
     * @param {String} text 需要设置的文本
     * @returns {light|String}
     */
    text: function (text) {
      //IE8 support
      var propName = 'textContent' in this[0] ? 'textContent' : 'innerText';
      return arguments.length ? this.each(function () {
        this[propName] = text;
      }) : this[0] ? this[0].textContent || this[0].innerHTML.replace(/<[^>]+>/g, '') : '';
    },
    /**
     * 清空所有的子节点(包括文本节点)，同时清除所有子节点所存储的数据
     * @returns {light}
     */
    empty: function () {
      return this.each(function () {
        var children = this.childNodes, len = children.length;
        while (--len >= 0) {
          $(children[len]).clearData().remove();
        }
      });
    },
    /**
     * 删除元素，同时清除节点所存储的数据
     * @returns {*}
     */
    remove: function () {
      return this.each(function () {
        $(this).clearData();
        this.parentNode.removeChild(this);
      });
    },
    wrap: function () {
    },
    /**
     * 克隆元素
     * @param {Boolean} [deepClone=false]   是否克隆子节点
     * @param {Boolean} [cloneEvnetsAndData=false] 是否克隆元素存储的数据
     * @returns {light}
     */
    clone: function (deepClone, cloneEvnetsAndData) {
      //TODO 处理data()
      return this.map(function () {
        return this.cloneNode(deepClone);
      });
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
  light.each({
    append: 'appendChild',
    prepend: 'insertBefore',
    appendTo: 0,
    prependTo: 0
  }, function (k, v, o) {
    light.fn[k] = function (elem) {
      var _this = this, isTo = !v, method = v;
      elem = light(elem);
      // 如果是appendTo/prependTo, 采用的方法为appendChild/insertBefore
      isTo && (method = o[k.replace(/To$/, '')]);
      return _this.each(function (i, e) {
        elem.each(function () {
          // 如果是appendTo/prependTo, 交换插入元素和被插入元素
          isTo ? this[method](e, this.firstChild) : e[method](this, e.firstChild);
        });
      });
    };
  });
}(core);
traversing = function (light) {
  light.each([
    'children',
    'childNodes'
  ], function (idx, key) {
    light.fn[key] = function () {
      var result = [];
      this.each(function () {
        result = result.concat($.toArray(this[key]));
      });
      return this.pushState($.unique(result));
    };
  });
  light.fn.content = light.fn.childNodes;
  var PN = 'parentNode', NS = 'nextSibling', PS = 'previousSibling';
  light.each({
    parent: {
      key: PN,
      'count': 1
    },
    parents: { key: PN },
    parentsUntil: { key: PN },
    next: {
      key: NS,
      count: 1
    },
    nextAll: { key: NS },
    prev: {
      key: PS,
      count: 1
    },
    prevAll: { key: PS },
    closest: {
      key: PN,
      include: 1
    }
  }, function (key, val) {
    light.fn[key] = function (selector) {
      var result = [];
      if (key.match(/Until$/)) {
        val.until = selector;
      }
      key === 'closest' && !selector && (val.count = 1);
      this.each(function () {
        result = result.concat(traver(this, val.key, val.until, val.include, val.count));
      });
      if (selector) {
        var obj = $.extend($(), result);
        obj.length = result.length;
        result = obj.filter(selector);
      }
      return this.pushState($.unique(result));
    };
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
  function traver(dom, type, until, include, count) {
    var result = [], until = until || null, cur = dom, c = 0;
    count = count || Infinity;
    while ((cur = cur[type]) && cur !== until) {
      if (cur.nodeType === 1) {
        ++c && result.push(cur);
      }
      if (c >= count) {
        break;
      }
    }
    include === 1 && result.unshift(dom);
    include === 2 && result.push(dom);
    return result.slice(0, count);
  }
  light.fn.extend({
    siblings: function () {
      return this.parent().children();
    },
    is: function (selector) {
      var res = false;
      if ($.isLight(selector)) {
        res = true;
        // 如果是light对象，每个元素相同则相同
        this.each(function (idx, el) {
          if (el !== selector[idx]) {
            return res = false;
          }
        });
      } else {
        this.each(function (idx, el) {
          var matchs = match(el, selector);
          return !(res = matchs);
        });
      }
      return res;
    },
    filter: function (selector) {
      var elems = [];
      if (light.isString(selector)) {
        this.each(function () {
          match(this, selector) && elems.push(this);
        });
      } else if (light.isFunction(selector)) {
        this.each(function (i, e) {
          selector(i, e) && elems.push(e);
        });
      }
      return this.pushState(elems);
    },
    not: function (selector) {
      var self = this, indexOf = [].indexOf;
      if ($.isLight(selector)) {
        selector.each(function () {
          var index;
          if ((index = indexOf.call(self, this)) !== -1) {
            self.splice(index, 1);
          }
        });
        return self;
      }
      return self.filter(function (i, e) {
        return !match(e, selector);
      });
    },
    add: function () {
    },
    index: function (elem) {
      var all, curr;
      if (elem) {
        all = this;
        curr = ($.isLight(elem) ? elem : $(elem))[0];
      } else {
        all = this.siblings();
        curr = this[0];
      }
      return [].indexOf.call(all, curr);
    },
    find: function (selector) {
      var result = [];
      this.each(function () {
        result = result.concat($.makeArray(selector, this));
      });
      return this.pushState(result);
    }
  });
  function match(el, selector) {
    var res = false, type = light.type(selector), matches = el.matches || el.matchesSelector || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector || el.oMatchesSelector;
    if (type === 'string') {
      res = matches ? matches.call(el, selector) : matchIE8(el, selector);
    } else {
      res = el === selector;
    }
    return res;
  }
  // Support IE 8
  function matchIE8(elem, selector) {
    // http://tanalin.com/en/blog/2012/12/matches-selector-ie8/
    var elems = elem.parentNode.querySelectorAll(selector), count = elems.length;
    for (var i = 0; i < count; i++) {
      if (elems[i] === elem) {
        return true;
      }
    }
    return false;
  }
}(core);
css = function (light) {
  light.fn.extend({
    css: function (key, val) {
      var type = $.type(key);
      // get
      if (arguments.length === 1 && type === 'string') {
        return getStyle(this[0], key.camelize());
      }
      // set
      return this.each(function () {
        if (type === 'string') {
          // FireFox does not support proper name like `font-size`
          // Should use `fontSize` or use `HTMLElement.style.setProperty()`
          this.style[key.camelize()] = val;
        } else if (type === 'object') {
          for (var _key in key) {
            this.style[_key.camelize()] = key[_key];
          }
        }
      });
    },
    toggle: function (isShow) {
      return this.each(function () {
        var style = this.style, none = 'none';
        if (isShow) {
          style.display = '';
        } else if (isShow === false) {
          style.display = none;
        } else {
          style.display = style.display === none ? '' : none;
        }
      });
    },
    hasClass: function (cls) {
      return getClassList(this[0]).contains(cls);
    }
  });
  light.each([
    'add',
    'remove',
    'toggle'
  ], function (i, e) {
    light.fn[e + 'Class'] = function (cls) {
      return this.each(function () {
        var classList = getClassList(this);
        classList[e](cls);
      });
    };
  });
  light.each({
    hide: 'none',
    show: ''
  }, function (k, v) {
    light.fn[k] = function () {
      return this.each(function () {
        this.style.display = v;
      });
    };
  });
  function getClassList(elem) {
    if (elem.classList) {
      return elem.classList;
    }
    var classList = elem.className.split(' '), setClass = function () {
        elem.className = classList.join(' ');
      };
    return $.extend(classList, {
      add: function (cls) {
        if (classList.indexOf(cls) === -1) {
          classList.push(cls);
          setClass();
        }
      },
      contains: function (cls) {
        return classList.indexOf(cls) > -1;
      },
      remove: function (cls) {
        var index = classList.indexOf(cls);
        if (index) {
          classList.splice(index, 1);
          setClass();
          return true;
        }
        return false;
      },
      toggle: function (cls) {
        // 如果移除成功表示有，没有成功表示没有，直接push
        if (!this.remove.call(this, cls)) {
          classList.push(cls);
        }
        setClass();
      }
    });
  }
  function getStyle(dom, key) {
    var gcs = window.getComputedStyle;
    return dom ? gcs ? gcs(dom)[key] : dom.currentStyle[key] : '';
  }
}(core);
data = function (light) {
  light.fn.extend({
    data: function (key, val) {
      // .data() ==> all the data
      var dom = this[0], data = getDateset(dom), len = arguments.length;
      if (!len) {
        var _data = $.extend(true, {}, data);
        delete _data._event;
        return _data;
      }
      var keyType = $.type(key);
      if (keyType === 'string') {
        return len === 2 ? this.each(function () {
          setData(this, key, val);
        }) : data[key];
      } else if (keyType === 'object') {
        return this.each(function () {
          for (var _key in key) {
            setData(this, _key, key[_key]);
          }
        });
      }
    },
    hasData: function (key) {
      var hasData = false;
      this.each(function () {
        if (getCacheObj(this)[key]) {
          return !(hasData = true);
        }
      });
      return hasData;
    },
    removeData: function (key) {
      return this.each(function () {
        var obj = getCacheObj(this);
        if (obj[key]) {
          delete obj[key];
        }
      });
    },
    clearData: function () {
      return this.each(function () {
        var id = this[$.expando];
        id && delete $.cache[id];
      });
    }
  });
  function getDateset(dom) {
    var data = getCacheObj(dom);
    var dataset = dom.dataset;
    //todo ie8 dataset
    return $.extend(true, data, dataset);
  }
  function getCacheObj(dom) {
    var expando = $.expando, id, cache = $.cache, currCache;
    if (!(id = dom[expando])) {
      dom[expando] = id = $.guid();
    }
    cache = cache || ($.cache = {});
    currCache = cache[id];
    currCache = currCache || (cache[id] = {});
    return currCache;
  }
  function setData(dom, key, val) {
    var cache = getCacheObj(dom);
    cache[key] = val;
  }
}(core);
event = function (light, slice) {
  var addEventListener = document.body.addEventListener ? function (dom, typeName, fn) {
    dom.addEventListener(typeName, fn, false);
  } : function (dom, typeNaem, fn) {
    dom.attachEvent('on' + typeNaem, function () {
      fn.call(dom, window.event);
    });
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
    on: function (type, selector, handel) {
      if (arguments.length === 2) {
        handel = selector;
        selector = false;
      }
      if (!$.isString(type) || !$.isFunction(handel)) {
        return;
      }
      var hs, types = type.split(/\s+/), len = types.length, i = 0, self = this, _delegate, _events = self.data('_event');
      !_events && self.data('_event', _events = {});
      for (; i < len; i++) {
        hs = _events[type = types[i]];
        // 没有注册过type事件
        if (!hs) {
          hs = _events[type] = [];
          self.each(function (i, ele) {
            addEventListener(ele, type, function (eve) {
              triggerHandel(null, ele, type, fixEvent(eve, ele));
            });  //ele = null
          });
        }
        if (selector) {
          _delegate = self.data('_delegate');
          !_delegate && self.data('_delegate', _delegate = {});
          hs = _delegate[type] || (_delegate[type] = {});
          hs = hs[selector] = hs[selector] || [];
        }
        hs.push(handel);
      }
      return self;
    },
    /**
     * remove event handel
     * @param type
     * @param handel
     */
    off: function (type, handel) {
      var self = this, hs = self.data('_event'), index;
      if (arguments.length === 0) {
        self.data('_event', {});
        self.data('_delegete', {});
      } else {
        hs = hs && hs[type];
        if (hs) {
          if (!$.isFunction(handel)) {
            hs.length = 0;
          } else {
            index = hs.indexOf(handel);
            index !== -1 && hs.splice(index, 1);
          }
        }
      }
      return self;
    },
    one: function (type, selector, handel) {
      var args = arguments;
      if (light.isFunction(selector)) {
        args = [
          type,
          handel = selector
        ];
      }
      handel.__isOne = true;
      this.on.apply(this, args);
    },
    /**
     * trigger event
     * @param type
     * @example
     *    eve.trigger('click', param1, param2)
     *    eve.trigger('click', [param1, param2])
     */
    trigger: function (type) {
      var args = arguments;
      return this.each(function () {
        triggerHandel(args, this, type, {
          type: type,
          timeStamp: +new Date(),
          isTrigger: true
        });
      });
    }
  });
  light.each('mousedown mouseup click dblclick keyup keydown keypress blur focus change'.split(' '), function (i, e) {
    light.fn[e] = function (selector, fn) {
      light.isFunction(selector) ? this.on(e, selector) : this.on(e, selector, fn);
    };
  });
  function triggerHandel(args, self, type, eve, selector) {
    if (!type) {
      return;
    }
    // 1 trigger delegated events
    var hs = $(self).data('_delegate'), i = 0, args = args && slice.call(args, 1);
    var $closest;
    // 事件类型`type`对应的处理函数对象
    hs = hs && hs[type];
    for (var key in hs) {
      $closest = $(eve.target).closest(key);
      if ($closest.length) {
        eve.currentTarget = $closest[0];
        hs = hs[key];
        break;
      }
    }
    trigger(hs);
    // 2 trigger events bind on the current `element`
    if (eve.isPropagationStopped) {
      return;
    }
    hs = $(self).data('_event');
    hs = hs && hs[type];
    //selector && (hs = hs[selector]);
    trigger(hs);
    args && self[type] && self[type]();
    function trigger(hs) {
      var _args;
      if (hs && hs.length) {
        if (args) {
          _args = [eve].concat(args.length === 1 ? args[0] : args);
        } else {
          _args = [eve];
        }
        for (i = 0; i < hs.length; i++) {
          if (eve.isImmediatePropagationStopped) {
            break;
          }
          if (hs[i].apply(self, _args) === false) {
            eve.stopPropagation();
            eve.preventDefault();
          }
          // 如果是用`.one()`绑定的方法，执行后立即删除
          if (hs[i].__isOne === true) {
            hs.splice(i--, 1);
          }
        }
      }
    }
  }
  function fixEvent(originEve, ele) {
    // fuck ie 8
    var eve = $.extend({}, originEve);
    eve.originEvent = originEve;
    eve.stopPropagation = function () {
      eve.isPropagationStopped = true;
      if (originEve.stopPropagation) {
        originEve.stopPropagation();
      } else {
        originEve.cancelBubble = true;
      }
    };
    eve.preventDefault = function () {
      eve.isDefaultPrevented = true;
      if (originEve.preventDefault) {
        originEve.preventDefault();
      } else {
        originEve.returnValue = false;
      }
    };
    eve.stopImmediatePropagation = function () {
      eve.isImmediatePropagationStopped = true;
      if (originEve.stopImmediatePropagation) {
        originEve.stopImmediatePropagation();
      } else {
        eve.stopPropagation();
      }
    };
    eve.target = eve.target || eve.srcElement;
    eve.currentTarget = ele;
    return eve;
  }
}(core, var_slice);
attr = function (light) {
  light.each([
    'attr',
    'prop'
  ], function (i, e) {
    light.fn[e] = function (key, val) {
      var type = $.type(key), self = this;
      // get
      if (arguments.length === 1 && type === 'string') {
        return self[0] ? access(self[0], e, key) : '';
      }
      // set
      return this.each(function () {
        if (type === 'string') {
          access(this, e, key, val);
        } else if (type === 'object') {
          for (var _key in key) {
            access(this, e, _key, key[_key]);
          }
        }
      });
    };
  });
  light.fn.extend({
    removeAttr: function (key) {
      return this.each(function (i, e) {
        e.removeAttribute(key);
      });
    },
    removeProp: function (key) {
      return this.each(function (i, e) {
        delete e[key];
      });
    },
    val: function (val) {
      return this.prop.apply(this, [].concat.apply(['value'], arguments));
    }
  });
  function access(dom, type, key, val) {
    if (type === 'attr') {
      if (val) {
        dom.setAttribute(key, val);
      } else {
        return dom.getAttribute(key);
      }
    } else if (type === 'prop') {
      if (val) {
        dom[key] = val;
      } else {
        return dom[key];
      }
    }
  }
}(core);
offset = function (light) {
  var pf = parseFloat;
  light.fn.extend({
    offset: function (coordinates) {
      if (coordinates) {
        var _left = pf(coordinates.left, 10), _top = pf(coordinates.top, 10);
        return this.each(function () {
          this.style.position = 'static';
          var origin = getBound(this);
          var left = isFinite(_left) && _left - origin.left, top = isFinite(_top) && _top - origin.top;
          var css = { 'position': 'relative' };
          left && (css.left = left + 'px');
          top && (css.top = top + 'px');
          $(this).css(css);
        });
      }
      var bound = getBound(this[0]);
      return bound ? {
        left: bound.left,
        top: bound.top
      } : null;
    },
    position: function () {
      var $this = light(this[0]), parent = this.offsetParent()[0], $parent = light(parent), offsetParent = getBound(parent), offset = getBound(this[0]), res = null, marginAndBorder;
      if (offset && offsetParent) {
        marginAndBorder = {
          left: pf($this.css('marginLeft')) + pf($parent.css('borderLeftWidth')),
          top: pf($this.css('marginTop')) + pf($parent.css('borderTopWidth'))
        };
        res = {
          left: offset.left - offsetParent.left - marginAndBorder.left,
          top: offset.top - offsetParent.top - marginAndBorder.top
        };
      }
      return res;
    },
    offsetParent: function () {
      return this.map(function () {
        //var offsetParent = this.offsetParent || document.documentElement;
        //while(offsetParent && offsetParent.nodeName !== 'html' && light(offsetParent).css('position') === 'static'){
        //    offsetParent = offsetParent.offsetParent
        //}
        //return offsetParent
        return this.offsetParent;
      });
    }
  });
  light.each([
    'width',
    'height'
  ], function (i, e) {
    light.fn[e] = function (val) {
      // set
      if (val) {
        return this.css(e, ~('' + val).indexOf('px') ? val : val + 'px');
      }
      // get
      if (val = getBound(this[0])) {
        if ($.type(val[e]) !== 'number') {
          return e === 'width' ? val.right - val.left : val.bottom - val.top;
        }
        return Math.floor(val[e]);
      }
      return 0;
    };
  });
  function getBound(dom) {
    if (light.isWindow(dom)) {
      var html = dom.document.documentElement;
      return {
        left: 0,
        top: 0,
        right: html.clientWidth,
        bottom: html.clientHeight
      };
    }
    if (light.isDocument(dom)) {
      dom = document.documentElement;
    }
    return fixBound(dom ? $.extend({}, dom.getBoundingClientRect()) : null);
  }
  function fixBound(bound) {
    var x, y, body = document.body, html = document.documentElement;
    if (bound) {
      x = pageXOffset || html.scrollLeft || body.scrollLeft;
      y = pageYOffset || html.scrollTop || body.scrollTop;
      bound.left += x;
      bound.right += x;
      bound.top += y;
      bound.bottom += y;
      return bound;
    }
  }
}(core);
ajax = function (light) {
  light.extend({
    ajax: function (url, config) {
      if (!light.isString(url)) {
        // 如果没有url参数
        config = url;
        url = config.url;
      } else {
        // 如果没有config
        config = config || {};
        config.url = url;
      }
      if (!url || !config) {
        return this;
      }
      config.data = config.data || {};
      var type = (config.type || 'GET').toUpperCase();
      var data = light.extend(config.data, light.ajax.data);
      var params = '';
      var xhr = new XMLHttpRequest();
      var handels = {
        fail: [],
        done: [],
        complete: []
      };
      light.each({
        'done': 'success',
        'fail': 'error',
        'complete': 'always'
      }, function (k, v) {
        config[v] && pushHandel(handels, k, [config[v]]);
      });
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 400) {
            fireHandel(handels, 'done', getData(xhr, config));
          } else {
            fireHandel(handels, 'fail', xhr);
          }
        }
      };
      xhr.onerror = function () {
        fireHandel(handels, 'fail', xhr);
      };
      $(document).trigger('ajaxSend', config);
      //window.aaa(config)
      try {
        params = getParams(config.data);
        if (type === 'GET') {
          config.url += (~config.url.indexOf('?') ? '&' : '?') + params;
          params = '';
        }
        xhr.open(type, config.url, true);
        //POST
        type === 'POST' && xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded;charset=UTF-8');
        xhr.send(params);
      } catch (e) {
        // 如果send()或者open()报错(比如跨域)，IE8 会捕获异常
        fireHandel(handels, 'fail', xhr);
      }
      // 给返回的对象提供快捷接口添加毁掉函数
      var res = {};
      light.each('done fail complete'.split(' '), function (i, e) {
        res[e] = function () {
          pushHandel(handels, e, arguments);
          return this;
        };
      });
      res.abort = function () {
        xhr.abort();
        return this;
      };
      return res;
    },
    ajaxSetup: function (data) {
      light.extend(light.ajax.data, data || {});
    }
  });
  light.ajax.data = {};
  light.each([
    'get',
    'post'
  ], function (i, e) {
    light[e] = function (url, data, fnDone, fnFail) {
      if (light.isFunction(data)) {
        fnFail = fnDone;
        fnDone = data;
        data = '';
      }
      return this.ajax(url, {
        type: e.toUpperCase(),
        data: data,
        success: fnDone,
        error: fnFail
      });
    };
  });
  // 添加回调函数
  function pushHandel(handel, type, fns) {
    var handels = handel[type], i = 0, len = fns.length, argsCache = handel[type + 'Arg'];
    // 还没有被触发过
    if (handels) {
      for (; i < len; i++) {
        light.isFunction(fns[i]) && handels.push(fns[i]);
      }
    } else {
      //如果已经触发过 => 直接执行
      for (; i < len; i++) {
        light.isFunction(fns[i]) && fns[i](argsCache);
      }
    }
  }
  // 触发回调函数
  function fireHandel(handel, type, args) {
    var handels = handel[type];
    // 还没有被触发过
    if (handels) {
      light.each(handels, function (i, e) {
        e(args);
      });
      handel[type] = null;
      handel[type + 'Arg'] = args;
    }
    type !== 'complete' && fireHandel(handel, 'complete', args);
  }
  //TODO 临时方法，用来根据data获取参数
  function getParams(data) {
    var str = [];
    return light.isString(data) ? data : function () {
      light.each(data, function (k, v) {
        str.push(k + '=' + v);
      });
      return str.join('&');
    }();
  }
  function getData(xhr, options) {
    var contentType = xhr.getResponseHeader('content-type');
    var data = xhr.response;
    var type = (options.dataType || 'json').toLowerCase();
    if (type === 'json' || contentType.match(/application\/json/)) {
      return JSON.parse(data);
    } else if (type === 'xml') {
      return xhr.responseXML;
    } else if (type === 'script') {
      light.globalEval(data);
      return data;
    } else {
      return data;
    }
  }
}(core);
light = window.light = window.$ = core;
}());