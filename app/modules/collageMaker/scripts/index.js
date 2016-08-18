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
                }
            },
            "drop": {
                "drawarea": {
                    "accept": config.selector["THUMB-ELEMENT"],
                    "drop": function(event, ui) {
                        _addImageToCollage(ui.draggable);
                    }
                }
            },
            "resize": {
                "collageElement": {
                    "handles": 'ne, nw, se, sw, n, w, s, e',
                    "start": function(event, ui) {
                        ui.element.css('position', 'absolute');
                    }
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
                $item.remove().appendTo($drawArea).fadeIn().css({ "position": "absolute", "left": "35%", "top": "35%" });
                _bindUIEvent('drag', $dragElement, uiconfig.drag.collageElement);
                _bindUIEvent('resize', $resizeElement, uiconfig.resize.collageElement);
                _bindUIEvent('rotate', $rotateElement);
                _addDataType($resizeElement, config.collageElementDataType);
                _selectElement($item);
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

        function _removeSelection() {
            $('.' + config.classes.selected, $drawArea).removeClass('selected').blur();
        }

        function _getMaxZIndex() {
            let maxZIndex = 0;
            $.each($(config.selector["DRAG"], $drawArea), function() {
                let zIndex = parseInt($(this).css('z-index'));
                zIndex = !!zIndex ? zIndex : 0;
                maxZIndex = maxZIndex > zIndex ? maxZIndex : zIndex
            });
            return parseInt(maxZIndex);
        }

        function _selectElement(el) {
            _removeSelection(el);
            let newZindex = _getMaxZIndex() + 1;
            el.closest(config.selector["DRAG"]).css('z-index', newZindex)
            el.addClass(config.classes.selected).focus();
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
            _unbindKeyEvent();
        }

        function onmessage(name, data) {
            switch (name) {

            }
        }

        function hackForBugInLibrary(add) {
            if (add) {
                $.each($(config.selector["RESIZE"], $drawArea), function() {
                    let src = $(this).find('img').addClass(config.classes.hide).attr('src');
                    $(this).css("backgroundImage", `url('${src}')`);
                });
            } else {
                $.each($(config.selector["RESIZE"], $drawArea), function() {
                    $(this).find('img').removeClass(config.classes.hide);
                    $(this).css("backgroundImage", "none");
                });
            }
        }

        function _saveCollage() {
            hackForBugInLibrary(true);
            html2canvas($drawArea, {
                onrendered: function(canvas) {
                    _downloadCollage(canvas.toDataURL("image/png", 1.0), "collage.png");
                    hackForBugInLibrary(false);
                }
            })
        }

        function _downloadCollage(uri, name) {
            var link = document.createElement("a");
            link.download = name;
            link.href = uri;
            link.click();
        }

        function onclick(event, element, elementType) {
            // bind custom messages/events
            switch (elementType) {
                case "collage-element":
                    _selectElement($(element));
                    break;
                case "save":
                    _saveCollage()
                default:
                    _removeSelection();
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