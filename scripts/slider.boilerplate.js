(function($, win, doc, undefined) {
    'use strict';
    // Usage
    // $('.carousel').dSlider({
    //     arrowRight: '.arrow-right', //A jQuery reference to the right arrow
    //     arrowLeft: '.arrow-left', //A jQuery reference to the left arrow
    //     speed: 200, //The speed of the animation (milliseconds)
    //     slideDuration: 4000, //The amount of time between animations (milliseconds)
    //     useTimer: false // Use or not automatic sliding
    // });
    var pluginName = 'dSlider';
    var defaults = {
        arrowLeftClass: '.arrow-left',
        arrowRightClass: '.arrow-right',
        speed: 4000,
        slideDuration: 4000,
        useTimer: false
    };
    // The actual plugin constructor
    function Plugin(element, options) {
        this.element = element;
        // Here we'll hold a reference to the DOM element passed in
        // by the $.each function when this plugin was instantiated
        this.$el = $(element);
        // jQuery has an extend method that merges the
        // contents of two or more objects, storing the
        // result in the first object. The first object
        // is generally empty because we don't want to alter
        // the default options for future instances of the plugin
        this.options = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        // This object holds values that will change as the plugin operates
        this.initials = {
            $currSlide: null,
            csstransitions: false,
            currSlide: 0,
            indicatorClass: '.indicator',
            slideClass: '.slide',
            totalSlides: false
        };
        // Attaches the properties of this.initials as direct properties of dSlider
        $.extend(this, this.initials);
        // Ensure that the value of 'this' always references dSlider
        this.changeSlide = $.proxy(this.changeSlide, this);
        this.init();
    }
    Plugin.prototype = {
        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).
            //Test to see if cssanimations are available
            this.csstransitionsTest();
            // Add a class so we can style our carousel
            this.$el.addClass('dSlider-carousel');
            // Build out any DOM elements needed for the plugin to run
            // Eg, we'll create an indicator dot for every slide in the carousel
            this.build();
            // Eg. Let the user click next/prev arrows or indicator dots
            this.events();
            // Bind any events we'll need for the carousel to function
            this.activate();
            // Start the timer loop to control progression to the next slide
            this.initTimer();
        },
        /**
         * [csstransitionsTest detect support for cssTransitions on the browser]
         * @return {void}
         */
        csstransitionsTest: function() {
            var elem = document.createElement('modernizr');
            //A list of properties to test for
            var props = ['transition', 'WebkitTransition', 'MozTransition', 'OTransition', 'msTransition'];
            // Iterate through our new element's Style property to see if these properties exist
            for (var i in props) {
                var prop = props[i],
                    result = typeof(elem.style[prop]) !== undefined ? prop : false;
                if (result) {
                    this.csstransitions = result;
                    break;
                }
            }
        },
        addCSSDuration: function() {
            var that = this;
            this.$el.find('.slide').each(function() {
                this.style[that.csstransitions + 'Duration'] = that.options.speed + 'ms';
            });
        },
        removeCSSDuration: function() {
            var that = this;
            this.$el.find('.slide').each(function() {
                this.style[that.csstransitions + 'Duration'] = '';
            });
        },
        build: function() {
            var $indicators = this.$el.append('<ul class="' + this.indicatorClass + '" >').find('.indicators');
            this.totalSlides = this.$el.find('.slide').length;
            for (var i = 0, max = this.totalSlides; i < max; i++) {
                $indicators.append('<li data-index=' + i + '>');
            }
        },
        /**
         * Activates the first slide
         * Activates the first indicator
         * @params void
         * @returns void
         *
         */
        activate: function() {
            this.$currSlide = this.$el.find('.slide').eq(0);
            this.$el.find('.indicators li').eq(0).addClass('active');
        },
        /**
         * Associate event handlers to events
         * For arrow events, we send the placement of the next slide to the handler
         * @params void
         * @returns void
         *
         */
        events: function() {
            // ~ cachin body and document selectors
            var $body = $('body');
            var $doc = $(doc);
            var that = this;
            // Click on the arrows left / right and default
            $body.on('click', this.options.element, {
                direction: 'right'
            }, this.changeSlide)
                .on('click', this.options.arrowRight, {
                    direction: 'right'
                }, this.changeSlide)
                .on('click', this.options.arrowLeft, {
                    direction: 'left'
                }, this.changeSlide)
                .on('click', '.indicators li', this.changeSlide);
            // Using the arrow left / right of the keyboard
            $doc.keyup(function(e) {
                var key = e.keyCode;
                // Right arrow key on the keyboard
                if (key === 39) {
                    that.changeSlide({
                        data: {
                            direction: 'right'
                        }
                    });
                    // Left arrow key on the keyboard
                } else if (key === 37) {
                    that.changeSlide({
                        data: {
                            direction: 'left'
                        }
                    });
                } else {
                    return false;
                }
            });
        },
        /**
         * TIMER
         * Resets the timer
         * @params void
         * @returns void
         *
         */
        clearTimer: function() {
            if (this.timer) {
                clearInterval(this.timer);
            }
        },
        /**
         * TIMER
         * Initialise the timer
         * @params void
         * @returns void
         *
         */
        initTimer: function() {
            if (this.element.useTimer) {
                this.timer = setInterval(this.changeSlide, this.options.slideDuration);
            }
        },
        /**
         * TIMER
         * Start the timer
         * Reset the isAnimating to allow changeSlide to be executable
         * @params void
         * @returns void
         *
         */
        startTimer: function() {
            this.initTimer();
            this.isAnimating = false;
        },
        /**
         * MAIN LOGIC HANDLER
         * Triggers a set of subfunctions to carry out the animation
         * @params  object  event
         * @returns void
         *
         */
        changeSlide: function(e) {
            // Prevent animating multiple times
            if (this.isAnimating) {
                return;
            }
            this.isAnimating = true;
            //Stop the timer as the animation is getting carried out
            this.clearTimer();
            // Returns the animation direction (left or right)
            var direction = this._direction(e);
            // Selects the next slide
            var animate = this._next(e, direction);
            if (!animate) {
                return;
            }
            //Active the next slide to scroll into view
            var $nextSlide = this.$el.find('.slide').eq(this.currSlide).addClass(direction + ' active');
            // Detects css transitions and use them or use javascript animation for ie9
            if (!this.csstransitions) {
                this._jsAnimation($nextSlide, direction);
            } else {
                this._cssAnimation($nextSlide, direction);
            }
        },
        /**
         * Returns the animation direction, right or left
         * @params  object  event
         * @returns strong  animation direction
         *
         */
        _direction: function(e) {
            var direction;
            // Default to forward movement
            if ((typeof(e)) !== 'undefined') {
                direction = (typeof(e.data) === 'undefined' ? 'right' : e.data.direction);
            } else {
                direction = 'right';
            }
            return direction;
        },
        /**
         * Updates our plugin with the next slide number
         * @params  object  event
         * @params  string  animation direction
         * @returns boolean continue to animate?
         *
         */
        _next: function(e, direction) {
            // If the event was triggered by a slide indicator, we store the data-index value of that indicator
            var index = ((typeof(e) !== 'undefined') ? $(e.currentTarget).data('index') : undefined);
            // Logic for determining the next slide
            switch (true) {
                //If the event was triggered by an indicator, we set the next slide based on index
                case (typeof index !== 'undefined'):
                    if (this.currSlide === index) {
                        this.startTimer();
                        return false;
                    }
                    this.currSlide = index;
                    break;
                case (direction === 'right' && this.currSlide < (this.totalSlides - 1)):
                    this.currSlide++;
                    break;
                case (direction === 'right'):
                    this.currSlide = 0;
                    break;
                case (direction === 'left' && this.currSlide === 0):
                    this.currSlide = (this.totalSlides - 1);
                    break;
                case (direction === 'left'):
                    this.currSlide--;
                    break;
            }
            return true;
        },
        /**
         * Executes the animation via CSS transitions
         * @params  object  Jquery object the next slide to slide into view
         * @params  string  animation direction
         * @returns void
         *
         */
        _cssAnimation: function($nextSlide, direction) {
            setTimeout(function() {
                this.$el.addClass('transition');
                this.addCSSDuration();
                this.$currSlide.addClass('shift-' + direction);
            }.bind(this), 100);
            // CSS Animation Callback
            // After the animation has played out, remove transitions
            // Remove unnecessary classes
            // Start timer
            setTimeout(function() {
                this.$el.removeClass('transition');
                this.removeCSSDuration();
                this.$currSlide.removeClass('active shift-left shift-right');
                this.$currSlide = $nextSlide.removeClass(direction);
                this._updateIndicators();
                this.startTimer();
            }.bind(this), 100 + this.options.speed);
        },
        /**
         * Executes the animation via JS transitions
         * @params  object  Jquery object the next slide to slide into view
         * @params  string  animation direction
         * @returns void
         */
        _jsAnimation: function($nextSlide, direction) {
            //Cache this reference for use inside animate functions
            var that = this;
            var animation = {};
            var animationPrev = {};
            // See css for explanation of .js-reset-left
            if (direction === 'right') {
                that.$currSlide.addClass('js-reset-left');
            }
            animation[direction] = '0%';
            animationPrev[direction] = '100%';
            // Animation: Current slide using the current speed
            this.$currSlide.animate(animationPrev, this.settings.speed);
            // Animation: next slide
            $nextSlide.animate(animation, this.settings.speed, 'swing', function() {
                // Get rid of any JS animation residue ~
                that.$currSlide.removeClass('active js-reset-left').attr('style', '');
                // Cache the next slide after classes and inline styles have been removed
                that.$currSlide = $nextSlide.removeClass(direction).attr('style', '');
                that.that.updateIndicators();
                that.startTimer();
            });
        },
        /**
         * _updateIndicators Ensures the slide indicators are pointing to the currently active slide
         * @return {void}
         */
        _updateIndicators: function() {
            // update the dots
            this.$el.find('.indicators li')
                .removeClass('active')
                .eq(this.currSlide)
                .addClass('active');
            // Just caching this huge ass selctor
            var $indicators = this.$el.parent().parent().find('.thumbs.indicators li');
            // Update thumbnails
            $indicators.removeClass('active')
                .eq(this.currSlide)
                .addClass('active');
        }
    };
    // Preventing against multiple instanciations making the plugin very lightweight
    $.fn[pluginName] = function(options) {
        return this.each(function() {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin(this, options));
            }
        });
    };
})(jQuery, window, document);
