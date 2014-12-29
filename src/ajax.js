/**
 * @fileOverview
 * @author daiying.zhang
 */
define(["core"], function(light){
    light.extend({
        ajax: function (url, config){
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (eve){
                if(xhr.readyState === 4){
                    if(xhr.status >= 200 && xhr.status < 400){
                        var contentType = xhr.getResponseHeader('content-type');
                        var data = xhr.response;
                        data = contentType.match(/application\/json/) ? JSON.parse(data) : data
                        console.log(xhr);
                        config.success && config.success(data)
                    }else{
                        console.log("there is an error!", xhr)
                    }
                }
                //console.log("xhr = ", xhr)
            };
            xhr.onerror = function (){
                console.log("there is an error!")
            };
            xhr.open("GET", url, true);
            xhr.send();

        },
        get: function (){

        },
        post: function (){
            
        },
        load: function (){

        }
    });
});