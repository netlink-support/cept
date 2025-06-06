/**
 * Project: Bootstrap Hover Dropdown
 * Author: Cameron Spear
 * Contributors: Mattia Larentis
 *
 * Dependencies: Bootstrap's Dropdown plugin, jQuery
 *
 * A simple plugin to enable Bootstrap dropdowns to active on hover and provide a nice user experience.
 *
 * License: MIT
 *
 * http://cameronspear.com/blog/bootstrap-dropdown-on-hover-plugin/
 */
;(function ($, window, undefined) {
    // outside the scope of the jQuery plugin to
    // keep track of all dropdowns
    var $allDropdowns = $();

    // if instantlyCloseOthers is true, then it will instantly
    // shut other nav items when a new one is hovered over
    $.fn.dropdownHover = function (options) {
        // don't do anything if touch is supported
        // (plugin causes some issues on mobile)
        if('ontouchstart' in document) { return this; // don't want to affect chaining
        }

        // the element we really care about
        // is the dropdown-toggle's parent
        $allDropdowns = $allDropdowns.add(this.parent());

        return this.each(
            function () {
                var $this = $(this),
                $parent = $this.parent(),
                defaults = {
                    delay: 500,
                    instantlyCloseOthers: true
                },
                data = {
                    delay: $(this).data('delay'),
                    instantlyCloseOthers: $(this).data('close-others')
                },
                showEvent   = 'show.bs.dropdown',
                hideEvent   = 'hide.bs.dropdown',
                // shownEvent  = 'shown.bs.dropdown',
                // hiddenEvent = 'hidden.bs.dropdown',
                settings = $.extend(true, {}, defaults, options, data),
                timeout;

                $parent.hover(
                    function (event) {
                        // so a neighbor can't open the dropdown
                        if(!$parent.hasClass('open') && !$this.is(event.target)) {
                            // stop this event, stop executing any code 
                            // in this callback but continue to propagate
                            return true; 
                        }

                        $allDropdowns.find(':focus').blur();

                        if(settings.instantlyCloseOthers === true) {
                            $allDropdowns.removeClass('open');
                        }

                        window.clearTimeout(timeout);
                        $parent.addClass('open');
                        $this.trigger(showEvent);
                    }, function () {
                        timeout = window.setTimeout(
                            function () {
                                $parent.removeClass('open');
                                $this.trigger(hideEvent);
                            }, settings.delay
                        );
                    }
                );

                // this helps with button groups!
                $this.hover(
                    function () {
                        $allDropdowns.find(':focus').blur();

                        if(settings.instantlyCloseOthers === true) {
                            $allDropdowns.removeClass('open');
                        }

                        window.clearTimeout(timeout);
                        $parent.addClass('open');
                        $this.trigger(showEvent);
                    }
                );

                // handle submenus
                $parent.find('.dropdown-submenu').each(
                    function () {
                        var $this = $(this);
                        var subTimeout;
                        $this.hover(
                            function () {
                                window.clearTimeout(subTimeout);
                                $this.children('.dropdown-menu').show();
                                // always close submenu siblings instantly
                                $this.siblings().children('.dropdown-menu').hide();
                            }, function () {
                                var $submenu = $this.children('.dropdown-menu');
                                subTimeout = window.setTimeout(
                                    function () {
                                        $submenu.hide();
                                    }, settings.delay
                                );
                            }
                        );
                    }
                );
            }
        );
    };

    $(document).ready(
        function () {
            // apply dropdownHover to all elements with the data-hover="dropdown" attribute
            $('[data-hover="dropdown"]').dropdownHover();
        }
    );
})(jQuery, this);
