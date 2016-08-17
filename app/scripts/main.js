require.config({
    "baseUrl": "/",
    "paths": {
        "t3": "bower_components/t3js/dist/t3",
        "jquery": "bower_components/jquery/dist/jquery.min",
        "resizePatch": "scripts/vendor/resizePatch",
        "doTCompiler": "bower_components/doT/doT.min",
        "text": "bower_components/requirejs-text/text",
        "doT": "bower_components/requirejs-doT/doT",
        "json": "bower_components/requirejs-json/json",
        "jqueryUI": "bower_components/jquery-ui/jquery-ui.min",
        "jqueryUIRotate": "bower_components/jquery-ui-rotatable/jquery.ui.rotatable.min",
        "infra": "scripts/infra",
        "app": "scripts/app",
        "html2canvas": "bower_components/html2canvas/build/html2canvas.min"
    },
    "shim": {
        "t3": {
            "deps": ["jquery"]
        },
        "jqueryUI": {
            "deps": ["jquery"]
        },
        "bootstrap":{
            "deps": ["jquery"]
        },
        "jqueryUIRotate":{
            "deps": ["jquery","jqueryUI"]
        },
        "resizePatch":{
            "deps": ["jquery","jqueryUI"]
        }
    },
    "doT": {
        "ext": ".html"
    },
    "waitSeconds": 200
});



require(['app']);
