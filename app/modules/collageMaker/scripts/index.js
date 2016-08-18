"use strict";
define([
    'doT!modules/collageMaker/views/index',
    'json!modules/collageMaker/config/config.json',
    'modules/collageMaker/scripts/services/collageService'
], (template, config) => {
    Box.Application.addModule('CollageMaker', (context) => {
        var messages = [],
            behaviors = [],
            $moduleEl,
            $drawArea,
            $thumbnails,
            $thumbDrag,
            CollageService = context.getService('CollageService');
        const uiconfig = {
            "drag": {
                "thumbnail": {
                    "revert": "invalid",
                    "containment": "document",
                    "helper": "clone",
                    "scroll": false,
                    "cursor": "move"
                },
                "collageElement": {
                    "cursor": "move",
                    "scroll": false,
                    "stack": config.selector["DRAW-ELEMENT"]
                },
                "drawarea": {

                }
            },
            "drop": {
                "thumbnail": {

                },
                "collagElement": {

                },
                "drawarea": {
                    "accept": config.selector["THUMB-ELEMENT"],
                    "drop": function(event, ui) {
                        _addImageToCollage(ui.draggable);
                    }
                }
            },
            "resize": {
                "thumbnail": {

                },
                "collageElement": {
                    "handles": 'ne, nw, se, sw, n, w, s, e',
                    "start": function(event, ui) {
                        ui.element.css('position', 'absolute');
                    }
                },
                "draw-area": {

                }
            }
        }

        function _drawHTML() {
            let images = CollageService.getImages();
            let html = template(images);
            $moduleEl.find(config.selector["CONTAINER"]).html(html);
        }


        function _bindUIEvent(event, element, config = {}) {
            switch (event) {
                case "drag":
                    element.draggable(config);
                    break;
                case "drop":
                    element.droppable(config);
                    break;
                case "resize":
                    element.resizable(config);
                    break;
                case "rotate":
                    element.rotatable(config);
                    break;
            }
        }

        function _bindEvents() {
            _bindUIEvent('drag', $thumbDrag, uiconfig.drag.thumbnail);
            _bindUIEvent('drop', $drawArea, uiconfig.drop.drawarea);
        }

        function _addDataType(el, value) {
            el.attr('data-type', value);
        }

        function _addImageToCollage($item) {
            let $resizeElement = $(config.selector["RESIZE"], $item);
            let $rotateElement = $(config.selector["ROTATE"], $item);
            let $dragElement = $item;
            // $rotateElement = $resizeElement = $item;
            $item.fadeOut(() => {
                $item.remove().appendTo($drawArea).fadeIn();
                _bindUIEvent('drag', $dragElement, uiconfig.drag.collageElement);
                _bindUIEvent('resize', $resizeElement, uiconfig.resize.collageElement);
                _bindUIEvent('rotate', $rotateElement);
                _addDataType($resizeElement, config.collageElementDataType);
            });
        }

        function _keyuphandler(event) {
            if (event.which == 8) {
                _recycleImage()
            }
        }

        function _bindKeyEvent() {
            $(document).on('keyup', _keyuphandler)
        }

        function _unbindKeyEvent() {
            $(document).off('keyup', _keyuphandler)
        }

        function _initializeVariables() {
            $drawArea = $moduleEl.find(config.selector["DRAW-AREA"]);
            $thumbnails = $moduleEl.find(config.selector["THUMBNAILS"]);
            $thumbDrag = $(config.selector["DRAG"], $thumbnails);
        }

        function _removeSelection(el) {
            $('.' + config.classes.selected, $drawArea).removeClass('selected').blur();
        }

        function _selectElement(el) {
            _removeSelection(el);
            $(el).addClass(config.classes.selected).focus();
        }

        function _recycleImage() {
            let $item = $('.' + config.classes.selected, $drawArea).closest(config.selector["DRAG"]);
            $item.fadeOut(function() {
                let imageUrl = $item.remove().find('img').attr('src'),
                    clone = $('#clone_element').clone();
                clone.removeClass(config.classes.hide).removeAttr('id').find('img').attr("src", imageUrl);
                clone.appendTo($thumbnails).fadeIn();
                _bindUIEvent('drag', clone, uiconfig.drag.thumbnail);
            });
        }

        function _initializeCollage() {
            _drawHTML();
            _initializeVariables();
            _bindEvents();
        }

        function init() {
            $moduleEl = $(context.getElement());
            _initializeCollage();
            _bindKeyEvent();
        }

        function destroy() {
            //clear all the binding and objects
            _unbindKeyEvent();
        }

        function onmessage(name, data) {
            switch (name) {

            }
        }

        function downloadCanvas(link, canvas, filename) {
            link.href = canvas.toDataURL();
            link.download = filename;
        }

        function onclick(event, element, elementType) {
            // bind custom messages/events
            switch (elementType) {
                case "collage-element":
                    _selectElement(element);
                    break;
                case "save":
                    html2canvas($drawArea, {
                        onrendered: function(canvas) {
                            downloadCanvas(element, canvas, 'test.png');
                        }
                    })
                default:
                    _removeSelection(element);
                    break
            }
        }

        return {
            init,
            messages,
            behaviors,
            onmessage,
            onclick,
            destroy
        };
    });
});