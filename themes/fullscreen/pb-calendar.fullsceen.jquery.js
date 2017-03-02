;(function ( $, window, document, undefined ) {

    /*
        Store the name of the plugin in the "pluginName" variable. This
        variable is used in the "Plugin" constructor below, as well as the
        plugin wrapper to construct the key for the "$.data" method.

        More: http://api.jquery.com/jquery.data/
    */
    var pluginName = 'PBCalendar';
    $.PBExtend({

        calendarHeader: function(moment) {
            if(this.options.calendar_type == 'month') {
                return this.monthHeader(moment);
            } else if(this.options.calendar_type == 'week') {
                // Header
                return this.weekHeader(moment);
            } else if(this.options.calendar_type == 'day') {
                var $header_content = '<a href="#" class="pb-nav prev">' + this.options.prev_nav + '</a>' +
                '<span class="pb-title">'  + moment.format('dd') + ' ' + moment.format('l') + '</span>' +
                '<a href="#" class="pb-nav next">' + this.options.next_nav + '</a>';

                return this.dayHeader(moment);
            }
        },

        dayHeader: function(moment) {
            // Header
            moment.locale(this.options.locale);
            var range = moment.format('dd') + ' ' + moment.format('l');
            var $header_content  = '<span class="pb-title">' + range + '</span>'; 
                $header_content += '<div class="calendar-nav">';

                $header_content += '<a href="#" class="pb-nav prev">' + this.options.prev_nav + '</a>';
                $header_content += '<a href="#" class="pb-nav next">' + this.options.next_nav + '</a>';

                $header_content += '<a href="#" class="btn btn-calendar pb-change-calendar-type day">' + this.options.calendar_type_names[this.options.locale]['day'] + '</a>';
                $header_content += '<a href="#" class="btn btn-calendar pb-change-calendar-type week">' + this.options.calendar_type_names[this.options.locale]['week'] + '</a>';
                $header_content += '<a href="#" class="btn btn-calendar pb-change-calendar-type month">' + this.options.calendar_type_names[this.options.locale]['month'] + '</a>';
                $header_content += '</div>';

            var $row = $('<tr class="heading-row day-name-row">');
            $header_content = $('<tr class="heading-row tools"><th colspan="8">' + $header_content + '</th></tr>');
            $header_content = $header_content.add($row);

            $header_content.find('.pb-change-calendar-type.' + this.options.calendar_type).addClass('active');

            return $header_content;
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

            var $header_content  = '<span class="pb-title">' + range + '</span>'; 
                $header_content += '<div class="calendar-nav">';

                $header_content += '<a href="#" class="pb-nav prev">' + this.options.prev_nav + '</a>';
                $header_content += '<a href="#" class="pb-nav next">' + this.options.next_nav + '</a>';

                $header_content += '<a href="#" class="btn btn-calendar pb-change-calendar-type day">' + this.options.calendar_type_names[this.options.locale]['day'] + '</a>';
                $header_content += '<a href="#" class="btn btn-calendar pb-change-calendar-type week">' + this.options.calendar_type_names[this.options.locale]['week'] + '</a>';
                $header_content += '<a href="#" class="btn btn-calendar pb-change-calendar-type month">' + this.options.calendar_type_names[this.options.locale]['month'] + '</a>';
                $header_content += '</div>';

            var $row = $('<tr class="heading-row day-name-row">').append($cells);
            $header_content = $('<tr class="heading-row tools"><th colspan="8">' + $header_content + '</th></tr>');
            $header_content = $header_content.add($row);

            $header_content.find('.pb-change-calendar-type.' + this.options.calendar_type).addClass('active');

            return $header_content;
        },

        weekHeader: function(moment) {
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

            var $header_content  = '<span class="pb-title">' + range + '</span>'; 
                $header_content += '<div class="calendar-nav">';

                $header_content += '<a href="#" class="pb-nav prev">' + this.options.prev_nav + '</a>';
                $header_content += '<a href="#" class="pb-nav next">' + this.options.next_nav + '</a>';

                $header_content += '<a href="#" class="btn btn-calendar pb-change-calendar-type day">' + this.options.calendar_type_names[this.options.locale]['day'] + '</a>';
                $header_content += '<a href="#" class="btn btn-calendar pb-change-calendar-type week">' + this.options.calendar_type_names[this.options.locale]['week'] + '</a>';
                $header_content += '<a href="#" class="btn btn-calendar pb-change-calendar-type month">' + this.options.calendar_type_names[this.options.locale]['month'] + '</a>';
                $header_content += '</div>';

            var $row = $('<tr class="heading-row day-name-row">').append($cells);
            $header_content = $('<tr class="heading-row tools"><th colspan="8">' + $header_content + '</th></tr>');
            $header_content = $header_content.add($row);

            $header_content.find('.pb-change-calendar-type.' + this.options.calendar_type).addClass('active');

            return $header_content;
        },

    });

})( jQuery, window, document );