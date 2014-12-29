/**
 * @fileOverview
 * @author daiying.zhang
 */
if(!$.isFunction([].indexOf)){
    Array.prototype.indexOf = function(ele){
        for(var i= 0, len = this.length; i < len; i++){
            if(this[i] === ele){
                return i
            }
        }
        return -1
    }
}