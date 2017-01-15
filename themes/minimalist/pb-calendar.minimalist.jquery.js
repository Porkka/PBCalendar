;(function ( $, window, document, undefined ) {

    /*
        Store the name of the plugin in the "pluginName" variable. This
        variable is used in the "Plugin" constructor below, as well as the
        plugin wrapper to construct the key for the "$.data" method.

        More: http://api.jquery.com/jquery.data/
    */
    var pluginName = 'PBCalendar';
    $.PBExtend({

        renderNormal: function() {
            var entries = this.options.entries;
            // Contains all the calendar's entries
            var $container = this.$element;

            this.$element.find('.entry').remove();
            this.$element.find('.pb-read-more').remove();

            var $renders = this._monthEntryRender(entries);
        },


        _monthEntryRender: function(entries) {
            var ent = null;
            var end = null;
            var entry = null;
            var start = null;
            var $slots = null;
            var slot_overflow = null;
            var plugin = this;
            // Contains all the calendar's entries
            var $container = plugin.$element;

            var $entries = [ ];

            // Split overflowing entries
            var entry_array = plugin.splitEntries(entries);

            for(var ent in entry_array) {
                entry = entry_array[ent];

                start = moment(entry.start);
                start.seconds(0).minutes(0).hours(0);

                end = moment(entry.end);
                end.seconds(0).minutes(0).hours(0);

                // Find calendar slots
                $slots = plugin.getCalendarSlotInTimestampRange(start.format('X'), end.format('X'));
                if(!$slots.length) {
                    continue;
                }

                $slots.each(function() {
                    if(!$(this).find('.entry-indicator').length) {
                        $(this).append($('<span class="entry-indicator"></span>'));
                    }
                });

            }

            return $entries;
        },



    });

})( jQuery, window, document );