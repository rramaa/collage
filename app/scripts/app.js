define([
    'infra',
], function() {
    require([
        'modules/collageMaker/scripts/index'
    ], () => {
        Box.Application.init({
            debug: true
        });
    })
})