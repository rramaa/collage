'use strict';
define([
    'json!modules/collageMaker/config/dummyData.json'
], function(dummyData) {
    Box.Application.addService("CollageService", function(application) {
        function getImages() {
            return dummyData;
        }

        function uploadImage(files) {
            if (window.File && window.FileReader && window.FileList && window.Blob) {
                for (let i = 0; i < files.length; i++) {
                    var reader = new FileReader();
                    reader.onload = function(event) {
                        let the_url = event.target.result
                        Box.Application.broadcast('CollageMaker_File_Uploaded', {
                            url: the_url
                        })
                    }
                    reader.readAsDataURL(files[i]);
                }

            } else {
                alert('The File APIs are not fully supported in this browser.');
            }
        }

        return {
            getImages,
            uploadImage
        }

    });
});