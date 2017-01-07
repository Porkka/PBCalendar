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
        dayStart: '08:00',
        dayEnd: '14:00',
        onEntryRender: null,
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
        onEntryRender: function() {            // What to send with upload as FormData
            return '';
        }
    };


    $.fn.selection = function() {
        var plugin = $(this).data('plugin_PBCalendar');
        if(plugin) {
            var retval = { data: { }, elements: $() };
            retval.data = plugin.data.selection.all;
            retval.elements = plugin.getCalendarSlotByTimestamps(retval.data);
            return retval;
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
console.log('unbind');
        plugin.bindEvents();
        plugin.reload();
    };

    $.fn.nextMonth = function() {
        var plugin = $(this).data('plugin_PBCalendar');
        if(plugin) {
            var new_date = new Date( new Date(plugin.data.selected_date).setMonth(plugin.data.selected_date.getMonth()+1) );
            plugin.data.selected_date = new_date;
            if(plugin.debug) {
                console.log('Moved to month', plugin.data.selected_date);
            }
            plugin.reload();
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
                date: plugin.options.date.add(1, 'weeks').clone()
            });
        } else {
            console.log('$.fn.nextMonth: PBCalendar not found!');
        }
    };

    $.fn.nextDay = function() {
        var plugin = $(this).data('plugin_PBCalendar');
        if(plugin) {
            if(plugin.debug) {
                console.log('Moved to day', plugin.data.selected_date);
            }
            plugin.reload({
                date: plugin.options.date.add(1, 'days').clone()
            });
        } else {
            console.log('$.fn.nextMonth: PBCalendar not found!');
        }
    };

    $.fn.prevMonth = function() {
        var plugin = $(this).data('plugin_PBCalendar');
        if(plugin) {
            var new_date = new Date( new Date(plugin.data.selected_date).setMonth(plugin.data.selected_date.getMonth()-1) );
            plugin.data.selected_date = new_date;
            if(plugin.debug) {
                console.log('Moved to month', plugin.data.selected_date);
            }
            plugin.reload();
        }
    };

    $.fn.prevWeek = function() {
        var plugin = $(this).data('plugin_PBCalendar');
        if(plugin) {
            if(plugin.debug) {
                console.log('Moved to week', plugin.data.selected_date);
            }
            plugin.reload({
                date: plugin.options.date.subtract(1, 'weeks').clone()
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
                date: plugin.options.date.subtract(1, 'days').clone()
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
            plugin.clearSelections();
        } else {
            console.log('$.fn.clearSelections: PBCalendar not found!');
        }
    };


    $.fn.reload = function() {
        var plugin = $(this).data('plugin_' + pluginName);
        if(plugin) {
            plugin.reload();
        }
    };


    // Create the plugin constructor
    function PBCalendar( element, options, debug ) {
        this.debug = debug;

        this.element = element;
        this._name = pluginName;
        this._defaults = $.fn.PBCalendar.defaults;

        this.data = { };

        this.options = $.extend( {}, this._defaults, options );
        this.initial_options = this.options;
        this.init();

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
            this.$element.addClass(this.options.render_mode);
            this.$element.addClass(this.options.view_mode);
            this.$element.addClass(this.options.calendar_type);

            // Element selector
            this.elementSelector = '';
            if(!this.element.id) { // Generate id
                this.element.id = Math.random(90);
            } 
            this.elementSelector = '#' + this.element.id;
 
            this.$element.addClass('pb-calendar');

            this.data.today = moment(this.options.date);
            this.data.today.locale(this.options.locale);

            var start = this.options.dayStart.split(':');
            var hours  = (start.length >= 1) ? parseInt(start[0]) : 0;
            var minutes  = (start.length >= 2) ? parseInt(start[1]) : 0;
            var seconds  = (start.length >= 3) ? parseInt(start[2]) : 0;
            this.data.today.hours(0).minutes(0).seconds(0);
            this.data.selected_day = this.data.today.clone();
            this.data.selected_day.hours(hours).minutes(minutes).seconds(seconds);
            this.data.times = [ this.data.selected_day.clone() ];
        },

        // Bind events that trigger methods
        bindEvents: function() {
            var plugin = this;

            plugin.$element.on('click' + '.' + plugin._name, '.slot.time', function(e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                var $target = $(e.target);
                if(!$target.hasClass('slot')) {
                    $target = $target.closest('.slot');
                }
                if(plugin.options.mode != 'view') {
                    plugin._startDateSelect(e, $target);
                } else {
                    plugin._selectDate(e, $target);
                }
            });


            $('.pb-calendar a.prev').on('click' + '.' + plugin._name, function(e) {
                e.preventDefault();
                if(plugin.options.calendar_type == 'week') {
                    $(plugin.$element).prevWeek();
                } else if(plugin.options.calendar_type == 'day') {
                    $(plugin.$element).prevDay();
                }
            });
            $('.pb-calendar a.next').on('click' + '.' + plugin._name, function(e) {
                e.preventDefault();
                if(plugin.options.calendar_type == 'week') {
                    $(plugin.$element).nextWeek();
                } else if(plugin.options.calendar_type == 'day') {
                    $(plugin.$element).nextDay();
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


        // Unbind events that trigger methods
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
            var end = this.options.dayEnd.split(':');
            var hours_end  = (end.length >= 1) ? parseInt(end[0]) : 0;
            var minutes_end = (end.length >= 2) ? parseInt(end[1]) : 0;
            var seconds_end = (end.length >= 3) ? parseInt(end[2]) : 0;

            tmp_end.hours(hours_end);
            tmp_end.minutes(minutes_end);
            tmp_end.seconds(seconds_end);

            var times = [ ];
            do {

                times.push(tmp.clone());
                tmp.add(hours, 'h');
                tmp.add(minutes, 'm');
                tmp.add(seconds, 's');

            } while(tmp.format('X') < tmp_end.format('X'));

            return times;
        },

        initializeView: function(times) {
            if(this.options.calendar_type == 'week') {
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
                var $slots = this.getCalendarSlotInTimestampRange( moment(entry.start).format('X'), moment(entry.end).format('X'))
                ;
                var $spn = $slots.first().find('span');
                $spn.html(entry.title);
                $slots.find('span').addClass('entry');
                $slots.find('span').css('background', entry.color);
                $slots.find('span').attr('title', 'Klo ' + moment(entry.start).format('HH:mm') + ' - ' + moment(entry.end).format('HH:mm'));
            }
        },
  

        renderNormal: function(entry, $slots) {
            var entries = this.options.entries;
            // Contains all the calendar's entries
            var $container = this.$element;

            for(var ent in entries) {
                var entry = entries[ent];
                var $slots = this.getCalendarSlotInTimestampRange( moment(entry.start).format('X'), moment(entry.end).format('X'));

                if(!$slots.length) {
                    continue;
                }

                var $slot = $('<div class="entry">');
                $slot.html(entry.title);

                // tmp
                if(entry.color) {
                    $slot.css('background', entry.color);
                }

                $slot.attr('title', 'Klo ' + moment(entry.start).format('HH:mm') + ' - ' + moment(entry.end).format('HH:mm'));

                // Set slot size
                $slot.css('width', $slots.width()+1 );
                $slot.css('height', parseInt($slots.css('height')) * ($slots.length-1) );

                // Set position
                $slot.css('top', $slots.first().offset().top);
                $slot.css('left', $slots.first().offset().left + parseInt($slots.css('padding-left')));

                $container.append($slot);
            }
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
                $day_cells.append('<span>');
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
                $row.attr('data-from');
                $cell.html(times[t].format('HH:mm'));

                $cell.appendTo($row);
                $row.appendTo($container);
                var $day_cells = this._getDayCells(times[t]);
                $day_cells.append('<span>');
                $row.append($day_cells);
                $row = $('<tr>');
            }
            $container.appendTo(this.$element);
        },

        calendarHeader: function(moment) {
            if(this.options.calendar_type == 'week') {
                // Header
                var tmp = moment.clone();
                var start = tmp.startOf('week').clone();
                var end = tmp.endOf('week').clone();
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

                var $cell = $('<th>');
                $cell.html(start.format('dddd').substr(0, 2) +'<br>'+ start.format('l'));
                $cell.attr('data-sanitized', start.format('l'));
                start.add(1, 'days');
                $cells = $cells.add($cell);

                var $header_content = '<a href="#" class="pb-nav prev">«</a><span class="pb-title">' + range + '</span><a href="#" class="pb-nav next">»</a>';
                var $row = $('<tr class="heading-row">').append($cells);

                $header_content = $('<tr class="heading-row"><th colspan="8">' + $header_content + '</th></tr>');
                $header_content = $header_content.add($row);

                return $header_content;

            } else if(this.options.calendar_type == 'day') {
                var $header_content = '<a href="#" class="pb-nav prev">«</a><span class="pb-title">'  + moment.format('dddd') + ' ' + moment.format('l') + '</span><a href="#" class="pb-nav next">»</a>';
                return $('<tr class="heading-row"><th colspan="2">' + $header_content + '</th></tr>');
            }
        },

        _getDayCells: function(moment) {
            if(this.options.calendar_type == 'week') {
                
                var tmp = moment.clone();
                moment.locale(this.options.locale);
                var start = tmp.isoWeekday(1).clone();
                var end = tmp.endOf('week').clone();
                var $cells = $();
                while(start.format('d') != end.format('d')) {
                    var $cell = $('<td>');
                    $cell.attr('data-timestamp', start.format('X'));
                    $cell.attr('data-sanitized', start.format('l') + ' ' + start.format('LT'));
                    start.add(1, 'days').hours(moment.hours()).minutes(moment.minutes()).seconds(moment.seconds());
                    $cells = $cells.add($cell);
                }

                // Add sunday
                var $cell = $('<td>');
                $cell.attr('data-timestamp', start.format('X'));
                $cell.attr('data-sanitized', start.format('l') + ' ' + start.format('LT'));
                $cells = $cells.add($cell);

                return $cells;
            } else if(this.options.calendar_type == 'day') {
                var $cell = $('<td>');
                $cell.attr('data-timestamp', moment.format('X'));
                $cell.attr('data-sanitized', moment.format('l') + ' ' + moment.format('LT'));
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
            // console.log(from_timestamp, to_timestamp);
            var $slots = this.$element.find('td').filter(function( index, element ) {
                var found = ($(element).data('timestamp') >= from_timestamp && $(element).data('timestamp') <= to_timestamp)
                return found;
            });
            return $slots;
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

            this.reload(options);

        },



    });

})( jQuery, window, document );