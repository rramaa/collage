'use strict';
define([
    'json!modules/collageMaker/config/dummyData.json'
    ], function(dummyData) {
    Box.Application.addService("CollageService", function(application) {    
        function getImages(){
            return dummyData;
        }

        return{
            getImages
        }

    });
});
