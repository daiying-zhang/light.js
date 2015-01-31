/**
 * @fileOverview helper function
 * @author xing.wu
 */

define(['core'], function(light){
	var r20 = /%20/g,
        einput = /^(?:submit|reset|file|button)$/;

    light.fn.extend({
        serializeArray: function(){
            return light.param( this.serialize() );
        },
        serialize: function(){
            var name, type, result = [],
            add = function(n, val){
                if(light.isArray(val)) return light.each(val, add);
                result.push({name: n, value: val});
            };

            if(this[0]){
                light.each(this[0].elements, function(i, ele){
                    name = ele.name, type = ele.type;
                    if(name && !ele.disabled && (ele.checked || !einput.test(type) ) ){
                        add(name, light(ele).val());
                    }
                });
            }
            return result;
        }
    });

	light.param = function(obj, traditional){
		var params = [],
			escape = encodeURIComponent;

		params.add = function(key, val){
			if( light.isFunction(val) ) val = val();

			this.push( escape( key ) + "=" + escape( val ) );
		}

		if( light.isArray( obj ) ){
			light.each(obj, function(){
				params.add(this.name, this.value);
			});
		}else{
			for( key in obj ){
				buildParams(key, obj[ key ], traditional, params)
			}
		}

		return params.join("&").replace(r20, "+");
	}

	function buildParams(key, obj, traditional, params){
		if ( light.isArray( obj ) ) {
			light.each(obj, function(i, val){
				if(traditional){
					params.add(key, val);
				}else{
					buildParams(key + '['+ (typeof val == 'object' ? i : "") +']', val, traditional, params);
				}
			})
		}else if(!traditional && light.type( obj ) == "object"){
			for( name in obj ){
				buildParams(key + '[' + name + ']', obj[name] , traditional, params);
			}
		}else{
			params.add(key, obj);
		}
	}
});