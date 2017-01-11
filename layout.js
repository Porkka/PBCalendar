$(function() {
	$('#calendar').PBCalendar({
		locale: 'fi',
		hour_interval: '00:30',
		calendar_type: 'week',
		render_mode: 'normal',
		date: '2016-11-22',
		dayStart: '00:00', 
		prevNav: '<span class="glyphicon glyphicon-menu-left"></span>',
		nextNav: '<span class="glyphicon glyphicon-menu-right"></span>',
		onEntryRender: function(entry, $element) {
			if(entry.color) {
				$element.css('background-color', entry.color);
			}
			$element.attr('data-link_id', entry.link_id);
			$element.html( entry.time_from + ' - ' + entry.time_to + '<br>' + entry.name );
			$element.attr('data-toggle', 'modal');
			$element.attr('data-target', '#' + entry.event_id + '_event_modal');
			$element.html( entry.time_from + ' - ' + entry.time_to + '<br>' + entry.name );
			return $element;
		},
		breakpoints: {
			640: {
				calendar_type: 'day'
			}
		},
		entries: [
			// {
			// 	title: '1111',
			// 	start: '2016-11-21 07:30',
			// 	end: '2016-11-24 09:30',
			// 	color: 'blue'
			// },
			// {
			// 	title: '!!!!',
			// 	start: '2016-11-21 08:30',
			// 	end: '2016-11-24 09:30',
			// 	color: 'blue'
			// }, {
			// 	title: '2222',
			// 	start: '2016-11-22 08:30',
			// 	end: '2016-11-25 09:30',
			// 	color: 'violet'
			// }, {
			// 	title: '4444',
			// 	start: '2016-11-22 08:30',
			// 	end: '2016-11-25 09:30',
			// 	color: 'violet'
			// }, {
			// 	title: '5555',
			// 	start: '2016-11-22 08:30',
			// 	end: '2016-11-25 09:30',
			// 	color: 'pink'
			// }, {
			// 	title: '0000',
			// 	start: '2016-11-14 08:30',
			// 	end: '2016-11-17 09:30',
			// 	color: 'green'
			// },
			 {
				title: '0000',
				start: '2016-11-21 09:30',
				end: '2016-11-21 10:00',
				styles: {
					background: 'red',
				}
			 },
			 {
				title: '1212',
				start: '2016-11-21 08:30',
				end: '2016-11-27 09:30',
				styles: {
					background: 'black',
				}
			},
        ]
	});


	$('#calendar').on('onEntryResized', function(e, entry, plugin) {
		console.log('Resized: ', e, entry, plugin);
	});
	$('#calendar').on('onEntryMoved', function(e, entry, plugin) {
		console.log('Moved: ', e, entry, plugin);
	});
	$('#calendar').on('onEntryClick', function(e, entry, plugin) {
		console.log('Click: ', e, entry, plugin);
	});

});