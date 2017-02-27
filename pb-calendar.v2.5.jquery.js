// ---------------------------------
// ---------- PBCalendar ----------
// ---------------------------------
// Brief plugin description
// ------------------------

/*
    **** DEPENDANCIES ****
    # jQuery 
    # 

    **** OPTIONS ****
    - To overwrite these, pass in the options object while inititalizing the plugin.
    $.fn.PBCalendar.defaults = {

    };


    **** METHODS *****
    $(fn).PBCalendar(optionsObject)
        - Initializes target element (fn) as plugins workspace.
        - You can pass different options for the plugin.
    
    $(fn).selected()
        - Get's Selected timespan

    $(fn).reload(optionsObject)


    **** EVENTS (Triggered jQuery Events) ****


    **** EVENTS (Callback from plugin options) ****

*/
;(function ( $, window, document, undefined ) {

    /*
        Store the name of the plugin in the "pluginName" variable. This
        variable is used in the "Plugin" constructor below, as well as the
        plugin wrapper to construct the key for the "$.data" method.

        More: http://api.jquery.com/jquery.data/
    */
    var pluginName = 'PBCalendar';

    $.fn.PBCalendar = function ( options, debug ) {
        this.each(function() {
            if ( !$.data(this, "plugin_" + pluginName ) ) {
                $.data(this, "plugin_" + pluginName, new PBCalendar( this, options, debug ) );
            }
        });
        return this;
    };

    var d = new Date();
    var d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0);
    $.fn.PBCalendar.defaults = {
        locale: 'en',
        mode: 'view',
        entry_limit: 3,
        day_start: '08:00',
        day_end: '23:59',
        prev_nav: '&laquo;',
        next_nav: '&raquo;',
        entries: {

        },
        calendar_type: 'month',
        date: d, // Calendar target date
        slot_html: '<div class="slot"></div>',
        entry_limit: 3,
        breakpoints: {
            767: {
                view_mode: 'day',
                entry_limit: 2
            }
        },
        hour_interval: '00:60:00',
        onEntryResizeConfirm: function() {
            return confirm('Are you sure you want to change this entry\'s length?');
        },
        onEntryMoveConfirm: function() { // Must return boolean
            return confirm('Are you sure you want to change this entry\'s position?');
        },
    };


    $.fn.selection = function() {
        var plugin = $(this).data('plugin_PBCalendar');
        if(plugin) {

        } else {
            console.log('$.fn.selection: PBCalendar not found!');
        }
    };


    $.fn.changeMode = function(mode) {
        if(mode != 'select' && mode != 'view' )  {
            console.log('Invalid mode', mode);
            return;
        }
        var plugin = $(this).data('plugin_PBCalendar');
        plugin.options.mode = mode;
        plugin.unbindEvents();
        plugin.bindEvents();
    };


    $.fn.changeViewMode = function(mode) {
        if(mode != 'month' && mode != 'week' && mode != 'day' )  {
            console.log('Invalid mode', mode);
            return;
        }
        var plugin = $(this).data('plugin_PBCalendar');
        if(plugin.debug) {
            console.log('Changed view mode', mode);
        }
        var plugin = $(this).data('plugin_PBCalendar');
        plugin.options.view_mode = mode;
        plugin.unbindEvents();

        plugin.bindEvents();
        plugin.reload();
    };

    $.fn.nextMonth = function() {
        var plugin = $(this).data('plugin_PBCalendar');
        if(plugin) {
            if(plugin.debug) {
                console.log('Moved to month', plugin.data.selected_date);
            }
            plugin.reload({
                date: plugin.data.today.add(1, 'months').clone()
            });
        } else {
            console.log('$.fn.nextMonth: PBCalendar not found!');
        }
    };

    $.fn.nextWeek = function() {
        var plugin = $(this).data('plugin_PBCalendar');
        if(plugin) {
            if(plugin.debug) {
                console.log('Moved to week', plugin.data.selected_date);
            }
            plugin.reload({
                date: plugin.data.today.add(1, 'weeks').clone()
            });
        } else {
            console.log('$.fn.nextWeek: PBCalendar not found!');
        }
    };

    $.fn.nextDay = function() {
        var plugin = $(this).data('plugin_PBCalendar');
        if(plugin) {
            if(plugin.debug) {
                console.log('Moved to day', plugin.data.selected_date);
            }
            plugin.reload({
                date: plugin.data.today.add(1, 'days').clone()
            });
        } else {
            console.log('$.fn.nextMonth: PBCalendar not found!');
        }
    };

    $.fn.prevMonth = function() {
        var plugin = $(this).data('plugin_PBCalendar');
        if(plugin) {
            if(plugin.debug) {
                console.log('Moved to month', plugin.data.selected_date);
            }
            plugin.reload({
                date: plugin.data.today.subtract(1, 'months').clone()
            });
        } else {
            console.log('$.fn.prevMonth: PBCalendar not found!');
        }
    };

    $.fn.prevWeek = function() {
        var plugin = $(this).data('plugin_PBCalendar');
        if(plugin) {
            if(plugin.debug) {
                console.log('Moved to week', plugin.data.selected_date);
            }
            plugin.reload({
                date: plugin.data.today.subtract(1, 'weeks').clone()
            });
        }
    };

    $.fn.prevDay = function() {
        var plugin = $(this).data('plugin_PBCalendar');
        if(plugin) {
            if(plugin.debug) {
                console.log('Moved to date', plugin.data.selected_date);
            }
            plugin.reload({
                date: plugin.data.today.subtract(1, 'days').clone()
            });
        }
    };

    /** Move PBCalender to custom date by supplying JavaScript Date-object **/
    $.fn.setDate = function(dateObj) {
        var plugin = $(this).data('plugin_PBCalendar');
        if(plugin) {
            plugin.data.selected_date = dateObj;
            if(plugin.debug) {
                console.log('Moved to date', dateObj);
            }
            plugin.reload();
        }
    };


    $.fn.clearSelections = function() {
        var plugin = $(this).data('plugin_' + pluginName);
        if(plugin) {
            plugin.resetSelections();
            plugin.$element.find('.selected').removeClass('selected');
        } else {
            console.log('$.fn.clearSelections: PBCalendar not found!');
        }
    };

    $.PBExtend = function(methods) {
        $.extend(PBCalendar.prototype, methods);
        console.log(PBCalendar.prototype);
        // plugin method despatcher
    };


    // Create the plugin constructor
    function PBCalendar( element, options, debug ) {
        this.debug = debug;

        this.element = element;
        this.$element = $(this.element);
        this._name = pluginName;
        this._defaults = $.fn.PBCalendar.defaults;

        this.data = { };

        this.flags = {
            mouse: {
                down: false,
                up: false,
            },
        };
        this.selections = {
            start: null,
            end: null,
            entry: null,
        };
        this.active_actions = {
            resizing: false,
            selecting: false,
            entry_moving: false,
            entry_selecting: false,
        };
        this.backlog = {
            entry: null,
            start: null,
            end: null,
        };
        this.timers = {
            mouse: null
        };

        this.options = $.extend({ }, this._defaults, options );
        this.initial_options = this.options;

        this.checkBreakpoints();
    }

    // Avoid Plugin.prototype conflicts
    $.extend(PBCalendar.prototype, {

        // Initialization logic
        init: function () {
            this.buildCache();
            // Calendar skeleton
            var times = this.initializeViewData();
            this.initializeView(times);
            this.unbindEvents();
            this.bindEvents();
        },

        // Remove plugin instance completely
        destroy: function() {
            this.unbindEvents();
            this.$element.removeData();
        },

        // Cache DOM nodes for performance
        buildCache: function () {
            // Used on calendar
            this.$entry_container = $('<div class="entry-container">');
            this.$element = $(this.element);
            this.$element.attr('class', '');
            this.$element.addClass(this.options.render_mode);
            this.$element.addClass(this.options.view_mode);
            this.$element.addClass(this.options.calendar_type);
            // Element selector
            this.elementSelector = '';
            if(!this.element.id) { // Generate id
                this.element.id = Math.random(90);
            } 
            this.elementSelector = '#' + this.element.id;

            // Set guid for the entries
            for(var ent in this.options.entries) {
                this.options.entries[ent].guid = this.guid();
            }

            this.$element.addClass('pb-calendar');
            this.data.today = moment(this.options.date);
            this.data.today.locale(this.options.locale);
            this.data.today.locale(this.options.locale);

            var start = this.options.day_start.split(':');
            var hours  = (start.length >= 1) ? parseInt(start[0]) : 0;
            var minutes  = (start.length >= 2) ? parseInt(start[1]) : 0;
            var seconds  = (start.length >= 3) ? parseInt(start[2]) : 0;
            this.data.today.hours(0).minutes(0).seconds(0);

            this.data.selected_day = moment(this.options.date).clone();
            this.data.selected_day.hours(hours).minutes(minutes).seconds(seconds);
            this.data.selected_day.locale(this.options.locale);
            this.data.today.locale(this.options.locale);
            this.data.times = [ this.data.selected_day.clone() ];
        },

        // Bind events that trigger methods
        bindEvents: function() {
            var plugin = this;

/*** Entry events ***/
            plugin.$element.on('click' + '.' + plugin._name, 'a.pb-read-more', function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                if(plugin.detectLeftButton(e)) {
                    var $target = $(e.target);
                    $target.closest('td').find('.pb-read-more-container').toggle();
                }
            });
            plugin.$element.on('click' + '.' + plugin._name, '.entry', function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                clearTimeout(plugin.timers.mouse);
                plugin.flags.mouse.up = false;
                plugin.flags.mouse.down = false;
                plugin.resetSelections();

                var entry = plugin.getEntryByGUID($(this).attr('data-guid'));
                plugin.selections.entry = $(this);
                plugin.backlog.entry = plugin.clone( entry );

                if(plugin.debug) {
                    console.log('Entry clicked');
                }
                plugin._triggerEntryClicked();
            });
            plugin.$element.on('mousedown' + '.' + plugin._name, '.entry', function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                var $this = $(this);
                clearTimeout(plugin.timers.mouse);
                plugin.timers.mouse = setTimeout(function() {

                    plugin.flags.mouse.down = true;
                    plugin.flags.mouse.up = false;

                    plugin.resetSelections();
                    $('.pb-skeleton.selected').removeClass('selected');
                    if(plugin.detectLeftButton(e)) {
                        // Get first entry with the same gui
                        var guid = $this.closest('.entry').attr('data-guid');
                        var $associates = plugin.$element.find('.entry[data-guid="' + guid + '"]');
                        plugin.selections.entry = $associates.first();
                        plugin.active_actions.entry_moving = true;
                        // Save clone for reverting the changes
                        plugin.backlog.entry = plugin.clone(plugin.getEntryByGUID(guid));
                        if(plugin.debug) {
                            console.log('Entry mouse down');
                        }
                    }
                }, 200);
            });
            plugin.$element.on('mouseup' + '.' + plugin._name, '.entry', function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();

                if(plugin.debug) {
                    console.log('Entry: Mouse up');
                }

                // Check for other actions
                if(plugin.active_actions.entry_moving && plugin.flags.mouse.down) {
                    if(!plugin.options.onEntryMoveConfirm()) {
                        plugin.revertEntryChanges();
                        plugin.reload();
                    } else {
                        plugin.renderNormal();
                        plugin._triggerEntryMoved();
                    }
                } else if(plugin.active_actions.resizing && plugin.flags.mouse.down) {
                    if(!plugin.options.onEntryResizeConfirm()) {
                        plugin.revertEntryChanges();
                        plugin.renderNormal();
                    } else {
                        plugin._triggerEntryResized();
                    }
                }

                plugin.flags.mouse.down = false;
                plugin.flags.mouse.up = true;
                if(plugin.debug) {
                    console.log('Entry mouse up');
                }

                plugin.resetSelections();

            });
            plugin.$element.on('mousemove' + '.' + plugin._name, '.entry', function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                if(plugin.active_actions.resizing) {
                    var $this = plugin.getElementFromMousePosition(e.clientX, e.clientY, $(this));
                    plugin.doEntryResize($this);
                } else if(plugin.active_actions.selecting) {
                    var $this = plugin.getElementFromMousePosition(e.clientX, e.clientY, $(this));
                    plugin.doSelections(e, $this);
                }  else if(plugin.active_actions.entry_moving) {
                    var $this = plugin.getElementFromMousePosition(e.clientX, e.clientY, $(this));
                    plugin.doEntryMove($this);
                } 
            });
            plugin.$element.on('mousedown' + '.' + plugin._name, '.pb-resizer', function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                plugin.resetSelections();
                $('.pb-skeleton.selected').removeClass('selected');
                if(!plugin.selections.start && plugin.detectLeftButton(e)) { // Return if range selection is in progress
                    plugin.flags.mouse.down = true;
                    plugin.flags.mouse.up = false;
                    plugin.active_actions.resizing = true;
                    // Get first entry with the same gui
                    var guid = $(this).closest('.entry').attr('data-guid');
                    var $associates = plugin.$element.find('.entry[data-guid="' + guid + '"]');
                    plugin.selections.entry = $associates.first();
                    // Get entry's slot
                    plugin.selections.start = plugin.selections.entry.closest('td');
                    plugin.selections.end = plugin.selections.start;
                    // Save clone for reverting the changes
                    plugin.backlog.entry = plugin.clone(plugin.getEntryByGUID(guid));
                }
            });
/*** Slot events ***/
            plugin.$element.on('mousedown' + '.' + plugin._name, 'td', function(e) {
                if(plugin.detectLeftButton(e)) {
                    if(plugin.debug) {
                        console.log('TD: down');
                    }
                    plugin.flags.mouse.down = true;
                    plugin.flags.mouse.up = false;
                }
            });
            plugin.$element.on('mouseup' + '.' + plugin._name, 'td', function(e) {
                // Check for other actions
                if(plugin.active_actions.entry_moving && plugin.flags.mouse.down) {
                    if(!plugin.options.onEntryMoveConfirm()) {
                        plugin.revertEntryChanges();
                    } else {
                        plugin.renderNormal();
                        plugin._triggerEntryMoved();
                    }
                    plugin.resetSelections();
                    return;
                } else if(plugin.active_actions.resizing && plugin.flags.mouse.down) {
                    if(!plugin.options.onEntryResizeConfirm()) {
                        plugin.revertEntryChanges();
                        plugin.renderNormal();
                    } else {
                        plugin._triggerEntryResized();
                    }
                    plugin.resetSelections();
                    return;
                }

                plugin.flags.mouse.down = false;
                plugin.flags.mouse.up = true;

                // Check selection order
                if(!plugin.selections.start) {
                    plugin.resetSelections();
                    return;
                }

                var start = parseInt(plugin.selections.start.attr('data-timestamp')) * 1000;
                var end = parseInt(plugin.selections.end.attr('data-timestamp')) * 1000;
                if(start > end) { // The selection was towards the past. 
                    var tmp = plugin.selections.start;
                    plugin.selections.start = plugin.selections.end;
                    plugin.selections.end = tmp;
                    // Change also timestamps for the onRangeSelected trigger
                    tmp = start;
                    start = end;
                    end = tmp; 
                }
            });
            plugin.$element.on('click' + '.' + plugin._name, 'tr:not(.heading-row) td', function(e) {
                if(plugin.debug) {
                    console.log('tr:not(.heading-row) td: Click');
                }
                clearTimeout(plugin.timers.mouse);
                // Set flags
                plugin.flags.mouse.up = true;
                plugin.flags.mouse.down = false;
                // Set selections
                plugin.selections.start = $(this);
                if(!plugin.selections.end) {
                    plugin.selections.end = $(this);
                }
                plugin.doSelections(e, $(this));
                plugin._triggerRangeSelected();
            });
            plugin.$element.on('mousedown' + '.' + plugin._name, 'tr:not(.heading-row) td', function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                var $this = $(this);
                setTimeout(function() {
                    if(plugin.flags.mouse.down && plugin.detectLeftButton(e)) {
                        plugin.active_actions.selecting = true;
                        plugin.selections.start = $this;
                        if(!plugin.selections.end) {
                            plugin.selections.end = $this;
                        }
                    }
                }, 200);
            });
            plugin.$element.on('mousemove' + '.' + plugin._name, 'tr:not(.heading-row) td', function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                var $this = $(this);
                setTimeout(function() {
                    if(plugin.active_actions.entry_moving) {
                        plugin.doEntryMove($this);
                    } else if(plugin.active_actions.resizing) {
                        plugin.doEntryResize($this);
                    } else if(plugin.active_actions.selecting) {
                        plugin.doSelections(e, $this);
                    }
                }, 100);
            });
            plugin.$element.on('mouseup' + '.' + plugin._name, 'tr:not(.heading-row) td', function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                plugin.timers.mouse = setTimeout(function() {
                    if(plugin.debug) {
                        console.log('tr:not(.heading-row) td: Mouse up')
                    }
                    if(plugin.selections.start && plugin.selections.end) {
                        var start = parseInt(plugin.selections.start.attr('data-timestamp')) * 1000;
                        var end = parseInt(plugin.selections.end.attr('data-timestamp')) * 1000;
                        plugin._triggerRangeSelected();
                        plugin.stopActions();
                    }
                }, 200);
            });
/*** MISC EVENTS ***/
            plugin.$element.on('mouseleave' + '.' + plugin._name, function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                if(plugin.active_actions.entry_moving || plugin.active_actions.resizing) {
                    plugin.revertEntryChanges();
                }
                plugin.resetSelections();
                plugin.reload();
            });
            $('.pb-calendar a.prev').on('click' + '.' + plugin._name, function(e) {
                e.preventDefault();
                if(plugin.options.calendar_type == 'week') {
                    $(plugin.$element).prevWeek();
                } else if(plugin.options.calendar_type == 'day') {
                    $(plugin.$element).prevDay();
                } else if(plugin.options.calendar_type == 'month') {
                    $(plugin.$element).prevMonth();
                }
            });
            $('.pb-calendar a.next').on('click' + '.' + plugin._name, function(e) {
                e.preventDefault();
                if(plugin.options.calendar_type == 'week') {
                    $(plugin.$element).nextWeek();
                } else if(plugin.options.calendar_type == 'day') {
                    $(plugin.$element).nextDay();
                } else if(plugin.options.calendar_type == 'month') {
                    $(plugin.$element).nextMonth();
                }
            });
            // Prevent constant bashing when resizing
            var reload_timeout = null;
            if(plugin.options.breakpoints) {
                $(window).on('resize' + '.' + plugin._name, function() {
                    clearTimeout(reload_timeout);
                    reload_timeout = setTimeout(function() {
                        plugin.checkBreakpoints();
                    }, 300);
                });
            }
        },

/*** TRIGGERS - Entry ***/
        _triggerEntryMoved: function() {
            var entry = this.getEntryByGUID( this.selections.entry.attr('data-guid') );
            this.$element.trigger('onEntryMoved', [ entry, this ]);
        },
        _triggerEntryResized: function() {
            var entry = this.getEntryByGUID( this.selections.entry.attr('data-guid') );
            this.$element.trigger('onEntryResized', [ entry, this ]);
        },
        _triggerEntryClicked: function() {
            var entry = this.getEntryByGUID( this.selections.entry.attr('data-guid') );
            this.$element.trigger('onEntryClick', [ entry, this ]);  
        },
/*** TRIGGERS - Slots ***/
        _triggerRangeSelected: function() {

            var range = {
                start: moment(this.selections.start.attr('data-timestamp') * 1000),
                end: moment(this.selections.end.attr('data-timestamp') * 1000),
            };

            if(this.options.calendar_type != 'month') {
                var intervals = this.options.hour_interval.split(':');
                var hours = (intervals.length >= 1) ? parseInt(intervals[0]) : 0;
                var minutes = (intervals.length >= 2) ? parseInt(intervals[1]) : 0;
                var seconds = (intervals.length >= 3) ? parseInt(intervals[2]) : 0;

                if(!hours && !minutes) {
                    console.log('Invalid hour interval');
                    return;
                }
                range.end.add(hours, 'hours').add(minutes, 'minutes').add(seconds, 'seconds');
            }


            this.$element.trigger('onRangeSelected', [ range, this ]);  
        },

        getElementFromMousePosition: function(x, y, $obscuring_element) {
            if($obscuring_element) {
                $obscuring_element.hide();
            }
            var elementMouseIsOver = document.elementFromPoint(x, y);
            if($obscuring_element) {
                $obscuring_element.show();
            }
            return $(elementMouseIsOver);
        },


        resetSelections: function() {
            this.selections.end = null;
            this.selections.start = null;
            this.selections.entry = null;
            this.stopActions();
        },

        stopActions: function() {
            this.active_actions.resizing = false;
            this.active_actions.selecting = false;
            this.active_actions.entry_moving = false;
            this.active_actions.entry_selecting = false;
        },


        doEntryResize: function($end_slot) {
            if(!this.selections.entry && $end_slot) {
                return;
            } else if(!$end_slot.hasClass('pb-skeleton')) {
                return;
            } else if(!this.selections.entry.length) {
                return;
            }

            var start = parseInt(this.selections.entry.attr('data-from'));
            var end = parseInt($end_slot.attr('data-timestamp'));


            var guid = this.selections.entry.attr('data-guid');
            var entry = this.clone( this.getEntryByGUID(guid) );

            var moment_start = moment(start*1000);
            var moment_end = moment(end*1000);

            var old_start = moment(entry.start);
            var old_end = moment(entry.end);

            var tmp = moment_start.clone();

            if(tmp.hours(0).minutes(0).seconds(0).format('X') > moment_end.format('X')) {
                return;
            }

            moment_start.hours(old_start.hours());
            if(this.options.calendar_type == 'month') {
                moment_end.hours(old_end.hours());
            }

            entry.start = this._longFormat(moment_start);
            entry.end = this._longFormat(moment_end);
            entry.most_top = 1;

            var $associates = this.$element.find('.entry[data-guid="' + guid + '"]');
            $associates.remove();
            delete entry.has_resizer;

            if(this.options.calendar_type == 'month') {
                var $rendered_entries = this._monthEntryRender([ entry ]);
            } else {
                var $rendered_entries = this._dayEntryRender([ entry ]);
            }

            if($rendered_entries) {
                var $entry = $rendered_entries[0];
                this.selections.entry = $entry;
                delete entry.most_top;
                this.replaceEntryByGUID(guid, entry);
            }

        },


         doEntryMove: function($move_to_slot) {
      
            if(!this.selections.entry && $move_to_slot) {
                return;
            } else if(!$move_to_slot.hasClass('pb-skeleton')) {
                return;
            } else if(!this.selections.entry.length) {
                return;
            }

            var guid = this.selections.entry.attr('data-guid');
            var entry = this.getEntryByGUID(guid);

            var start = parseInt($move_to_slot.attr('data-timestamp'));
            var old_start = parseInt(this.selections.entry.attr('data-from'));

            old_start = moment(old_start * 1000);
            start = moment(start * 1000);
            end = moment(entry.end);
            if(this.options.calendar_type == 'month') { // Move in days
                old_start.hours(0).minutes(0).seconds(0);
                var diff = Math.abs(old_start.diff(start, 'days'));
                if(old_start.format('x') > start.format('x')) {
                    end.subtract(diff, 'days');
                } else if(old_start.format('x') < start.format('x')) {
                    end.add(diff, 'days');
                }
                var old_start = moment(entry.start);
                var old_end = moment(entry.end);
                start.hours(old_start.hours());
                end.hours(old_end.hours());
            } else { // Move in minutes
                var diff = Math.abs(old_start.diff(start, 'minutes'));
                if(old_start.format('x') > start.format('x')) {
                    end.subtract(diff, 'minutes');
                } else if(old_start.format('x') < start.format('x')) {
                    end.add(diff, 'minutes');
                }
            }


            entry.start = this._longFormat(start);
            entry.end = this._longFormat(end);
            entry.most_top = 1;

            var $associates = this.$element.find('.entry[data-guid="' + guid + '"]');
            $associates.remove();

            if(this.options.calendar_type == 'month') {
                var $rendered_entries = this._monthEntryRender([ entry ]);
            } else {
                var $rendered_entries = this._dayEntryRender([ entry ]);
            }

            if($rendered_entries) {
                var $entry = $rendered_entries[0];
                this.selections.entry = $entry;
                delete entry.most_top;
                this.replaceEntryByGUID(guid, entry);
            }

        },


        revertEntryChanges: function() {
            var guid = this.selections.entry.attr('data-guid');
            var $associates = $('.pb-skeleton .entry[data-guid="' + guid + '"]');
            // Delete the created entry elements
            $associates.remove();
            var entry = this.getEntryByGUID(guid);
            entry = this.clone(this.backlog.entry);
            // Render the old entry
            var $rendered_entries = this._monthEntryRender([ entry ]);
            if($rendered_entries) {
                var $entry = $rendered_entries[0];
                this.selections.entry = $entry;
                this.replaceEntryByGUID(guid, entry);
                if(this.debug) {
                    console.log( this.selections.entry, this.getEntryByGUID(guid));
                }
            }
        },


        getEntryByGUID: function(guid) {
            if(!guid) {
                return;
            }
            for(var ent in this.options.entries) {
                if(this.options.entries[ent].guid == guid) {
                    return this.options.entries[ent];
                }
            }
            return null;
        },


        replaceEntryByGUID: function(guid, replacement) {
            if(!guid) {
                return;
            }
            for(var ent in this.options.entries) {
                if(this.options.entries[ent].guid == guid) {
                    this.options.entries[ent] = replacement;
                    break;
                }
            }
            return true;
        },


        doSelections: function(e, $slot) {
            if(!this.active_actions.resizing && this.selections.start) {
                this.selections.end = $slot;
                var start = parseInt(this.selections.start.attr('data-timestamp')) * 1000;
                var end = parseInt(this.selections.end.attr('data-timestamp')) * 1000;
                if(start > end) {
                    var tmp = start;
                    start = end;
                    end = tmp; 
                }
                var $slots = this.getCalendarSlotInTimestampRange(start / 1000, end / 1000);
                $('.pb-main-table .selected').removeClass('selected');
                $slots.addClass('selected');
            }
        },

        /*** Unbind events that trigger methods ***/
        unbindEvents: function() {
            $(window).off('.'+this._name);
            $('.pb-calendar a.next').off('.'+this._name);
            $('.pb-calendar a.prev').off('.'+this._name);
            this.$element.off('.'+this._name);
        },

        reload: function(options) {
            this.options = $.extend({ }, this.options, options);
            this.$element.html('');
            this.init();
        },

        /*** One days worth of data **/
        initializeViewData: function() {

            var intervals = this.options.hour_interval.split(':');
            var hours  = (intervals.length >= 1) ? parseInt(intervals[0]) : 0;
            var minutes  = (intervals.length >= 2) ? parseInt(intervals[1]) : 0;
            var seconds  = (intervals.length >= 3) ? parseInt(intervals[2]) : 0;

            if(!hours && !minutes) {
                console.log('Invalid interval');
                hours = 1;
            }

            var tmp = this.data.times[0].clone();

            // Create day end moment
            var tmp_end = tmp.clone();
            var end = this.options.day_end.split(':');
            var hours_end  = (end.length >= 1) ? parseInt(end[0]) : 0;
            var minutes_end = (end.length >= 2) ? parseInt(end[1]) : 0;
            var seconds_end = (end.length >= 3) ? parseInt(end[2]) : 0;

            tmp_end.hours(hours_end);
            tmp_end.minutes(minutes_end);
            tmp_end.seconds(seconds_end);

            var times = [ ];
            if(this.options.calendar_type == 'week' || this.options.calendar_type == 'day') {
                do {

                    times.push(tmp.clone());
                    tmp.add(hours, 'h');
                    tmp.add(minutes, 'm');
                    tmp.add(seconds, 's');

                } while(tmp.format('X') < tmp_end.format('X'));
            } else {
                times = this.monthData(tmp);
            }

            return times;
        },


        monthData: function(moment) {
            var times = [];            
            var tmp = moment.clone();
            var start = tmp.startOf('month').clone();
            var start_day_num = start.day();
            if(!start_day_num) {
                start_day_num = 7;
            }
            start.hours(0);
            start.minutes(0);
            start.seconds(0);
            // Subtract so we get the start of the 1st week 
            start.subtract(start_day_num, 'd');
            while(times.length < 49) {
                start.add(1, 'd');
                times.push(start.clone());
            }
            return times;
        },


        /*** Render calendar skeleton and entries ***/
        initializeView: function(times) {
            if(this.options.calendar_type == 'month') {
                this._renderAgendaMonth(times);
            } else if(this.options.calendar_type == 'week') {
                this._renderAgendaWeek(times);
            } else if(this.options.calendar_type == 'day') {
                this._renderAgendaDay(times);
            }
            this.initializeEntryObjects();
        },


        initializeEntryObjects: function() {
            switch(this.options.render_mode) {
                case 'simple':
                    this.renderSimple();
                break;
                case 'normal':
                    this.renderNormal();
                break;
            }
        },


        renderSimple: function() {
            var entries = this.options.entries;
            for(var ent in entries) {
                var entry = entries[ent];
                var $slots = this.getCalendarSlotInTimestampRange( moment(entry.start).format('X'), moment(entry.end).format('X'));
                var $spn = $slots.first().find('span');
                $spn.html(entry.title);
                $slots.find('span').addClass('entry');
                $slots.find('span').css('background', entry.color);
                $slots.find('span').attr('title', 'Klo ' + moment(entry.start).format('HH:mm') + ' - ' + moment(entry.end).format('HH:mm'));
            }
        },
  

        renderNormal: function() {
            var entries = this.options.entries;
            // Contains all the calendar's entries
            var $container = this.$element;

            this.$element.find('.entry').remove();
            this.$element.find('.pb-read-more').remove();

            if(this.options.calendar_type != 'month') {
                var $renders = this._dayEntryRender(entries);
            } else {
                var $renders = this._monthEntryRender(entries);
            }
        },


        _dayEntryRender: function(entries) {
            var plugin = this;
            var $entries = [ ];
            var $container = this.$element;

            // Split overflowing entries
            var entry_array = plugin.splitDayEntries(entries);
            entry_array = entry_array.sort(function(a,b){
                if(a.split) {
                    return -1;
                } else if(b.split) {
                    return 1;
                }
                if(a.start < b.start) {
                    return -1;
                } else {
                    return 1;
                }
            });
            for(var ent in entry_array) {

                entry = entry_array[ent];
                end = moment(entry.end);
                end.seconds(0);
                start = moment(entry.start);
                start.seconds(0);

                // Find calendar slots
                $slots = plugin.getCalendarSlotInTimestampRange(start.format('X'), end.format('X'));
                if(!$slots.length) {
                    continue;
                }
                var $first_slot = $slots.first();
                var base_offset = $slots.first().offset().left + parseInt($slots.css('padding-left'));

                var from_stamp = start.format('X');
                var $overlapping_entries = plugin.getEntriesInTimestampRange(from_stamp, from_stamp);
                // Sort the elements
                var $entry = plugin._createEntryElement(entry);
                if(entry.split) {
                    $entry.attr('data-splitted', 1);
                }
                if(entry.has_resizer) {
                    $entry.append('<p href="#" class="pb-resizer"></p>');
                }
                // Set entry size
                var offset = 0;
                var o_len = $overlapping_entries.length;
                if(o_len) {
                    offset = $slots.width() / (o_len + 1);
                    $overlapping_entries.css('width', offset);
                    $entry.css('width', offset);
                    $overlapping_entries.each(function(index) {
                        $(this).css('left', base_offset + offset * index);
                    });
                    offset = offset * o_len;
                } else {
                    $entry.css('width', $slots.width());
                }
                // Set position
                $entry.css('top', $slots.first().offset().top);
                $entry.css('height', parseInt($slots.css('height')) * ($slots.length-1) );
                $entry.css('left', base_offset + (offset));
                $container.append($entry);
                $entries.push($entry);
            }
            return $entries;    
        },


        _monthEntryRender: function(entries) {
            var ent = null;
            var entry = null;
            var end = null;
            var start = null;
            var $slots = null;
            var slot_overflow = null;
            var plugin = this;
            // Contains all the calendar's entries
            var $container = plugin.$element;

            var $entries = [ ];

            // Split overflowing entries
            var entry_array = plugin.splitEntries(entries);
            entry_array = entry_array.sort(function(a,b){
                if(a.split) {
                    return -1;
                } else if(b.split) {
                    return 1;
                }
                if(a.start < b.start) {
                    return -1;
                } else {
                    return 1;
                }
            });

            for(var ent in entry_array) {
                entry = entry_array[ent];
                end = moment(entry.end);
                end.seconds(0);
                end.minutes(0);
                end.hours(0);
                start = moment(entry.start);
                start.seconds(0);
                start.minutes(0);
                start.hours(0);

                // Find calendar slots
                $slots = plugin.getCalendarSlotInTimestampRange(start.format('X'), end.format('X'));
                if(!$slots.length) {
                    continue;
                }

                var $first_slot = $slots.first();

                var from_stamp = start.format('X');
                var to_stamp = end.hours(23).minutes(59).seconds(59).format('X');
                var $overlapping_entries = plugin.getEntriesInTimestampRange(from_stamp, to_stamp);
                // Sort the elements
                var $entry = plugin._createEntryElement(entry);
                if(entry.split) {
                    $entry.attr('data-splitted', 1);
                }
                if(entry.has_resizer) {
                    $entry.append('<p href="#" class="pb-resizer"></p>');
                }
                if($overlapping_entries.length >= 3 && !entry.most_top) {
                    plugin.appendToReadMore($entry, $first_slot);
                } else {
                    var top = !entry.most_top ? 24 * ($overlapping_entries.length+1) : 24;
                    $entry.css({
                        top: top,
                        width: ( $slots.length * 100 - 8 ) + '%'
                    });
                    $first_slot.append($entry);
                }
                $entries.push($entry);
            }

            return $entries;
        },


        appendToReadMore: function($entry, $slot) {
            var $a = $slot.find('.pb-read-more');
            var $readMore = $slot.find('.pb-read-more-container');
            if(!$a.length) {
                $a = $('<a href="#" class="pb-read-more">Show more</a>');
                $readMore = $('<div class="pb-read-more-container">');
                $a.appendTo($slot);
                $readMore.appendTo($slot);
            }

            $entry.css({
                top: 'auto',
                left: 'auto'
            });

            $entry.appendTo($readMore);
        },


        splitEntries: function(entries) {
            var plugin = this;
            var entry_array = [ ]; // 
            var slot_overflow = 0;
            for(var ent in entries) {
           
                // Shorten things
                entry = entries[ent];

                // Instanciate moment from entry's start & end.
                // Make sure they are at 00:00:00 time 
                end = moment(entry.end);
                end.seconds(0);
                end.minutes(0);
                end.hours(0);
                start = moment(entry.start);
                start.seconds(0);
                start.minutes(0);
                start.hours(0);

                // Find calendar slots
                $slots = plugin.getCalendarSlotInTimestampRange(start.format('X'), end.format('X'));
                if(!$slots.length) { // If there is no slots continue.
                    // This event is not on the shown time perioid.
                    continue;
                }

                // If the event goes to next week, we have to split it
                slot_overflow = 7 - (parseInt(start.format('d')) + $slots.length - 1);
                if(slot_overflow < 0) {
                    // Clone so we don't change the existing one...
                    var weeks = plugin.rangeToWeeks(entry.start, entry.end);
                    var weeks_count = weeks.length;
                    for(var i = 0; i < weeks_count; i++) {
                        var split = plugin.clone(entry);

                        split.start = weeks[i].start;
                        split.end = weeks[i].end;

                        if((i+1) == weeks_count) {
                            split.has_resizer = true;
                        }

                        entry_array.push(split);
                    }
                } else {
                    entry.has_resizer = true;
                    entry_array.push(entry);
                }
            }
            return entry_array;
        },


        splitDayEntries: function(entries) {
            var plugin = this;
            var entry_array = [ ]; // 
            var slot_overflow = 0;
            for(var ent in entries) {
           
                // Shorten things
                entry = entries[ent];

                // Instanciate moment from entry's start & end.
                // Make sure they are at 00:00:00 time 
                end = moment(entry.end);
                end.locale(plugin.options.locale);
                end.seconds(0);
                end.minutes(0);
                end.hours(0);
                start = moment(entry.start);
                start.locale(plugin.options.locale);
                start.seconds(0);
                start.minutes(0);
                start.hours(0);

                var days = plugin.rangeToDays(entry.start, entry.end);
                if(days.length > 1) {
                    // Clone so we don't change the existing one...
                    var days_count = days.length;
                    for(var i = 0; i < days_count; i++) {
                        var split = plugin.clone(entry);

                        split.start = days[i].start;
                        split.end = days[i].end;

                        if((i+1) == days_count) {
                            split.has_resizer = true;
                        }

                        entry_array.push(split);
                    }
                } else {
                    entry.has_resizer = true;
                    entry_array.push(entry);
                }
            }
            return entry_array;
        },

        /** Starting and ending dates are the dates supplied as parameters **/
        rangeToDays: function(a_date, b_date) {

            var start = moment(a_date);
            var end = moment(b_date);
            var tmp = start.clone();

            // Days to add to start and to end to get full weeks
            var start_num = 24 - start.hour() - start.minutes() / 60 - 0.01;
            var end_num = 24 - end.hour() - end.minutes() / 60 - 0.01;

            // Return variable
            var days = [ ];

            // Init day variable and add first day to return array
            var day = { start: null, end: null };
            day.start = this._longFormat(tmp);
            tmp.add(start_num, 'hours');
            day.end = this._longFormat(tmp);

            // Loop till too far (same day as the parameter end date)
            while(tmp.format('x') <= end.format('x')) {
                // Add to return value
                days.push(day);
                var day = { start: null, end: null };
                // Skip to monday
                tmp.add(1, 'hours');
                day.start = this._longFormat(tmp);
                // Skip to sunday
                tmp.add(23, 'hours');
                day.end = this._longFormat(tmp);
            }
            tmp.subtract(end_num, 'hours');
            day.end = this._longFormat(tmp);
            // Add to return value
            days.push(day);

            return days;
        },

        /** Starting and ending dates are the dates supplied as parameters **/
        rangeToWeeks: function(a_date, b_date) {

            var start = moment(a_date);
            var end = moment(b_date);
            var tmp = start.clone();

            // Days to add to start and to end to get full weeks
            var start_num = 7 - start.day();
            var end_num = 7 - end.day();

            // Return variable
            var weeks = [ ];

            // Init week variable and add first week to return array
            var week = { start: null, end: null };
            week.start = this._longFormat(tmp);
            // Skip to sunday
            tmp.add(start_num, 'days');
            week.end = this._longFormat(tmp);
            // Loop till too far (same week as the parameter end date)
            while(tmp.format('x') <= end.format('x')) {
                // Add to return value
                weeks.push(week);
                var week = { start: null, end: null };
                // Skip to monday
                tmp.add(1, 'days');
                week.start = this._longFormat(tmp);
                // Skip to sunday
                tmp.add(6, 'days');
                week.end = this._longFormat(tmp);
            }
            tmp.subtract(end_num, 'days');
            week.end = this._longFormat(tmp);
            // Add to return value
            weeks.push(week);
            return weeks;
        },


        _longFormat: function(moment) {
            return moment.format('YYYY') + '-' + moment.format('MM') + '-' + moment.format('DD') 
            + ' ' + moment.format('HH')+ ':' + moment.format('mm')
        },


        guid: function() {
          function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
              .toString(16)
              .substring(1);
          }
          return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
        },


        clone: function(obj) {
            if (null == obj || "object" != typeof obj) return obj;
            var copy = obj.constructor();
            for (var attr in obj) {
                if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
            }
            return copy;
        },


        _createEntryElement: function(entry) {
            var end = moment(entry.end);
            end.seconds(0);
            end.minutes(0);
            end.hours(0);
            var start = moment(entry.start);
            start.seconds(0);
            start.minutes(0);
            start.hours(0);

            var $entry = $('<div class="entry"></div>');

            for(var key in entry) {
                if(key == 'attributes') {
                    for(var a in entry[ key ]) {
                        $entry.attr(a, entry[ key ]);
                    }
                } else if(key == 'styles') {
                    for(var s in entry[ key ]) {
                        $entry.css(s, entry[ key ][ s ]);
                    }
                } else if(key != 'from' && key != 'tp') {
                    $entry.attr('data-' + key, entry[key]);
                }
            }

            $entry.attr('data-from', moment(entry.start).format('X'));
            $entry.attr('data-to', moment(entry.end).format('X'));

            var display = entry.title;
            $entry.attr('title', moment(entry.start).format('L'));

            $entry.html(display);

            return $entry;
        },


        _renderAgendaDay: function(times) {
            var $element = null;

            var tmp = this.data.selected_day.clone();

            var $container = $('<table class="pb-main-table">');
            var $row = $('<tr>');
            var $cell = null;

            // Header
            var $header_content = this.calendarHeader(tmp);
            $container.append($header_content);

            for(var t in times) {
                $cell = $('<td class="pb-time">');
                $row.attr('data-from');
                $cell.html(times[t].format('HH:mm'));

                $cell.appendTo($row);
                $row.appendTo($container);
                var $day_cells = this._getDayCells(times[t]);
                $row.append($day_cells);
                $row = $('<tr>');
            }
            $container.appendTo(this.$element);
        },


        _renderAgendaWeek: function(times) {
            var $element = null;
            var tmp = this.data.selected_day.clone();

            var $container = $('<table class="pb-main-table">');
            var $row = $('<tr>');
            var $cell = null;

            // Header
            var $header_content = this.calendarHeader(tmp);
            $container.append($header_content);

            for(var t in times) {
                $cell = $('<td class="pb-time">');
                $cell.html(times[t].format('HH:mm'));

                $cell.appendTo($row);
                $row.appendTo($container);
                var $day_cells = this._getDayCells(times[t]);
                $row.append($day_cells);
                $row = $('<tr>');
            }

            $container.appendTo(this.$element);
        },


        _renderAgendaMonth: function(times) {

            var date_now = this.data.selected_day.format('l');
            var stamp_now = this.data.selected_day.format('X');
            var month_no_now = this.data.selected_day.format('M');

            var tmp = this.data.selected_day.clone();
            var $container = $('<table class="pb-main-table">');

            // Header
            var $header_content = this.calendarHeader(tmp);
            $container.append($header_content);

            var $cell = null;
            var $row = $('<tr>');
            var $entryRow = $('<tr class="entry-row">');
            for(var t in times) {
                if(t % 7 == 0 && t!=0) { // Row every 7th
                    $row.appendTo($container);
                    $row = $('<tr>');
                }
                $cell = $('<td class="pb-skeleton date-row">');
                // $cell.append(times[t].format('DD'));
                $cell.appendTo($row);

                // Prev and next month classes
                if(times[t].format('M') < month_no_now) { 
                    $cell.addClass('pb-prev-month');
                } else if( times[t].format('M') > month_no_now) {
                    $cell.addClass('pb-next-month');
                }

                // Today class
                if(times[t].format('l') == date_now) {
                    $cell.addClass('pb-today');
                }

                // Add indicators for past and future times
                if(times[t].format('l') != date_now && times[t].format('X') < stamp_now) {
                    $cell.addClass('pb-past');
                } else if(times[t].format('l') != date_now) {
                    $cell.addClass('pb-future');
                }

                // Add data attributes for easier manipulation
                $cell.attr('data-sanitized', times[t].format('l'));
                $cell.attr('data-timestamp', times[t].format('X'));
                $cell.html(times[t].format('DD'));
                $cell.attr('title', times[t].format('L'));
            }

            $container.appendTo(this.$element);
        },


        createMonthEntryTable: function(moment) {
            // Prep container elements
            var $table = $('<table class="pb-entry-table">')
            var $row = $('<tr>');
            var $cell = $('<th>');
            $cell.html(moment.format('DD'));
            $cell.appendTo($row);
            $row.appendTo($table);

            return $table;
        },


        calendarHeader: function(moment) {
            if(this.options.calendar_type == 'month') {
                return this.monthHeader(moment);
            } else if(this.options.calendar_type == 'week') {
                // Header
                var tmp = moment.clone();

                var start = tmp.isoWeekday(1).clone();
                var end = tmp.endOf('isoWeek').clone();

                var $cells = $();
                $cells = $cells.add($('<th>'));
                var range = start.format('L') + ' - ' + end.format('L');

                while(start.format('d') != end.format('d')) {
                    var $cell = $('<th class="day-title">');
                    $cell.html(start.format('dddd').substr(0, 2) +'<br>'+ start.format('l'));
                    $cell.attr('data-sanitized', start.format('l'));
                    start.add(1, 'days');
                    $cells = $cells.add($cell);
                }

                var $cell = $('<th class="day-title">');
                $cell.html(start.format('dddd').substr(0, 2) +'<br>'+ start.format('l'));
                $cell.attr('data-sanitized', start.format('l'));
                $cells = $cells.add($cell);

                var $header_content = '<a href="#" class="pb-nav prev">' + this.options.prev_nav + '</a>' + 
                '<span class="pb-title">' + range + '</span>' +
                '<a href="#" class="pb-nav next">' + this.options.next_nav + '</a>';
                var $row = $('<tr class="heading-row">').append($cells);

                $header_content = $('<tr class="heading-row"><th colspan="8">' + $header_content + '</th></tr>');
                $header_content = $header_content.add($row);

                return $header_content;

            } else if(this.options.calendar_type == 'day') {
                var $header_content = '<a href="#" class="pb-nav prev">' + this.options.prev_nav + '</a>' +
                '<span class="pb-title">'  + moment.format('dddd') + ' ' + moment.format('l') + '</span>' +
                '<a href="#" class="pb-nav next">' + this.options.next_nav + '</a>';

                return $('<tr class="heading-row"><th colspan="2">' + $header_content + '</th></tr>');
            }
        },


        monthHeader: function(moment) {
            // Header
            moment.locale(this.options.locale);
            var tmp = moment.clone();
            var start = tmp.clone();
            var end = tmp.clone();
            start = start.startOf('month');
            end = end.endOf('month');

            var range = start.format('MMMM') + ' ' + end.format('YYYY');
            var $cells = $();
            var $cell = $('<th>');

            tmp = moment.clone();

            var startWeek = tmp.startOf('isoWeek').clone();
            var endWeek = tmp.endOf('isoWeek').clone();

            while(startWeek.format('d') != endWeek.format('d')) { // Day names
                var $cell = $('<th class="day-title">');
                $cell.html(startWeek.format('dddd').substr(0, 2));
                $cell.attr('data-sanitized', startWeek.format('l'));
                startWeek.add(1, 'days');
                $cells = $cells.add($cell);
            }

            var $cell = $('<th class="day-title">');
            $cell.html(startWeek.format('dddd').substr(0, 2));
            $cell.attr('data-sanitized', startWeek.format('l'));
            $cell.attr('data-timestamp', startWeek.format('X'));
            $cells = $cells.add($cell);

            var $header_content = '<a href="#" class="pb-nav prev">' + this.options.prev_nav + '</a>' + 
                '<span class="pb-title">' + range + '</span>' +
                '<a href="#" class="pb-nav next">' + this.options.next_nav + '</a>';
            var $row = $('<tr class="heading-row">').append($cells);

            $header_content = $('<tr class="heading-row"><th colspan="8">' + $header_content + '</th></tr>');
            $header_content = $header_content.add($row);


            return $header_content;
        },


        noActionStarted: function() {
            return (!this.flags.mouse.down && !this.selections.start && !this.active_actions.resizing
                 && !this.active_actions.selecting && !this.active_actions.entry_selecting);
        },

        detectLeftButton: function(e) {
            var evt = e || window.event;
            if ("buttons" in evt) {
                return evt.buttons == 1;
            }
            var button = evt.which || evt.button;
            return button == 1;
        },

        _getDayCells: function(moment) {
            if(this.options.calendar_type == 'week') {

                var tmp = moment.clone();
                var start = tmp.isoWeekday(1).clone();
                var end = tmp.endOf('week').clone();

                var $cells = $();
                // Loop trough the week
                while(start.format('d') != end.format('d')) {
                    var $cell = $('<td>');
                    $cell.attr('data-timestamp', start.format('X'));
                    $cell.attr('data-sanitized', start.format('l') + ' ' + start.format('LT'));
                    $cell.addClass('pb-skeleton');
                    start.add(1, 'days').hours(moment.hours()).minutes(moment.minutes()).seconds(moment.seconds());
                    $cells = $cells.add($cell);
                }

                // Add sunday
                var $cell = $('<td>');
                $cell.attr('data-timestamp', start.format('X'));
                $cell.attr('data-sanitized', start.format('l') + ' ' + start.format('LT'));
                $cell.addClass('pb-skeleton');
                $cells = $cells.add($cell);
                return $cells;
            } else if(this.options.calendar_type == 'day') {
                var $cell = $('<td>');
                $cell.attr('data-timestamp', moment.format('X'));
                $cell.attr('data-sanitized', moment.format('l') + ' ' + moment.format('LT'));
                $cell.addClass('pb-skeleton');
                return $cell;
            };

        },

        createTimestamp: function(minutes, hours, days) {
            minutes = minutes * 60;
            hours = hours * 60 * 60;
            days = days * 24 * 60 * 60;
            return (minutes + hours + days);
        },

        createPBDateObject: function(d, get_time) {
            moment.locale(this.options.locale);

            return dd;
        },
       
        getDayName: function(number) {
            return this._day_names[this.options.locale][number];
        },

        getDayLongName: function(number) {
            return this._day_long_names[this.options.locale][number];
        },


        getDayNames: function() {
            return this._day_names[this.options.locale];
        },


        getMonthName: function(number) {
            return this._month_names[this.options.locale][number];
        },


        /*** Iterates trough calendar slots and compares timestamp to slots' data-timestamp value ***/
        getCalendarSlotInTimestampRange: function(from_timestamp, to_timestamp) {
            var $slots = this.$element.find('td').filter(function( index, element ) {
                var found = ($(element).data('timestamp') >= from_timestamp && $(element).data('timestamp') <= to_timestamp)
                return found;
            });
            return $slots;
        },

        getEntriesInTimestampRange: function(from_timestamp, to_timestamp) {
            var $entries = this.$element.find('.entry').filter(function( index, element ) {
                var found = ($(element).data('to') >= from_timestamp && $(element).data('from') <= to_timestamp)
                return found;
            });
            return $entries;
        },

        getMonthNames: function() {
            return this._month_names[this.options.locale];
        },

        checkBreakpoints: function() {
            // Hunt for breakpoints
            var plugin = this;
            var min_width = null;
            var cw = window.innerWidth;
            for(var w in plugin.options.breakpoints) {
                if(( cw <= w && min_width == null ) || ( w < min_width && min_width != null )) {
                    min_width = w;
                }
            }

            // If we got min_width => Set new options and rerender the calendar
            if(min_width) {
                var options = $.extend({}, plugin.options, plugin.options.breakpoints[w]);
            } else {
                var options = $.extend({}, plugin.initial_options);
            }
            plugin.reload(options);
        },

    });

})( jQuery, window, document );