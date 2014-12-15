/**
 * @fileOverview
 * @author daiying.zhang
 */
define(["core"], function(light){
    light.fn.extend({
        data: function (){
            return this[0].dataset
        }
    });
});