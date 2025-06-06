/*! waitForImages jQuery Plugin - v1.4.2 - 2013-01-19
* https://github.com/alexanderdickson/waitForImages
* Copyright (c) 2013 Alex Dickson; Licensed MIT */

(function ($) {
    // Namespace all events.
    var eventNamespace = 'waitForImages';

    // CSS properties which contain references to images.
    $.waitForImages = {
        hasImageProperties: ['backgroundImage', 'listStyleImage', 'borderImage', 'borderCornerImage']
    };

    // Custom selector to find `img` elements that have a valid `src` attribute and have not already loaded.
    $.expr[':'].uncached = function (obj) {
        // Ensure we are dealing with an `img` element with a valid `src` attribute.
        if (!$(obj).is('img[src!=""]')) {
            return false;
        }

        // Firefox's `complete` property will always be `true` even if the image has not been downloaded.
        // Doing it this way works in Firefox.
        var img = new Image();
        img.src = obj.src;
        return !img.complete;
    };

    $.fn.waitForImages = function (finishedCallback, eachCallback, waitForAll) {

        var allImgsLength = 0;
        var allImgsLoaded = 0;

        // Handle options object.
        if ($.isPlainObject(arguments[0])) {
            waitForAll = arguments[0].waitForAll;
            eachCallback = arguments[0].each;
            // This must be last as arguments[0]
            // is aliased with finishedCallback.
            finishedCallback = arguments[0].finished;
        }

        // Handle missing callbacks.
        finishedCallback = finishedCallback || $.noop;
        eachCallback = eachCallback || $.noop;

        // Convert waitForAll to Boolean
        waitForAll = !! waitForAll;

        // Ensure callbacks are functions.
        if (!$.isFunction(finishedCallback) || !$.isFunction(eachCallback)) {
            throw new TypeError('An invalid callback was supplied.');
        }

        return this.each(
            function () {
                // Build a list of all imgs, dependent on what images will be considered.
                var obj = $(this);
                var allImgs = [];
                // CSS properties which may contain an image.
                var hasImgProperties = $.waitForImages.hasImageProperties || [];
                // To match `url()` references.
                // Spec: http://www.w3.org/TR/CSS2/syndata.html#value-def-uri
                var matchUrl = /url\(\s*(['"]?)(.*?)\1\s*\)/g;

                if (waitForAll) {

                    // Get all elements (including the original), as any one of them could have a background image.
                    obj.find('*').andSelf().each(
                        function () {
                            var element = $(this);

                            // If an `img` element, add it. But keep iterating in case it has a background image too.
                            if (element.is('img:uncached')) {
                                allImgs.push(
                                    {
                                        src: element.attr('src'),
                                        element: element[0]
                                    }
                                );
                            }

                            $.each(
                                hasImgProperties, function (i, property) {
                                    var propertyValue = element.css(property);
                                    var match;

                                    // If it doesn't contain this property, skip.
                                    if (!propertyValue) {
                                        return true;
                                    }

                                    // Get all url() of this element.
                                    while (match = matchUrl.exec(propertyValue)) {
                                        allImgs.push(
                                            {
                                                src: match[2],
                                                element: element[0]
                                            }
                                        );
                                    }
                                }
                            );
                        }
                    );
                } else {
                    // For images only, the task is simpler.
                    obj.find('img:uncached')
                    .each(
                        function () {
                            allImgs.push(
                                {
                                    src: this.src,
                                    element: this
                                }
                            );
                        }
                    );
                }

                allImgsLength = allImgs.length;
                allImgsLoaded = 0;

                // If no images found, don't bother.
                if (allImgsLength === 0) {
                    finishedCallback.call(obj[0]);
                }

                $.each(
                    allImgs, function (i, img) {

                        var image = new Image();

                        // Handle the image loading and error with the same callback.
                        $(image).bind(
                            'load.' + eventNamespace + ' error.' + eventNamespace, function (event) {
                                allImgsLoaded++;

                                // If an error occurred with loading the image, set the third argument accordingly.
                                eachCallback.call(img.element, allImgsLoaded, allImgsLength, event.type == 'load');

                                if (allImgsLoaded == allImgsLength) {
                                    finishedCallback.call(obj[0]);
                                    return false;
                                }

                            }
                        );

                        image.src = img.src;
                    }
                );
            }
        );
    };
}(jQuery));
