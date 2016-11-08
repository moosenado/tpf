'use strict';

var TpfHome = (function()
{
	// Globals

	var park_li                  = document.getElementById('park-list').getElementsByTagName('li'),
		park_li_length		     = park_li.length,
		facility_selection_array = [],
		global_go_btn		     = false,
		CSRF_TOKEN               = $('meta[name="csrf-token"]').attr('content'),
		user_location			 = false,
		on_home_page             = true,
		$loadingscreen           = $('.loading-screen'),
		$loadingscreen_small     = $('.loading-screen-small'),
		selection_index          = 0,
		unique_user              = Math.random() + '',
		unique_user_id           = parseInt(unique_user.replace('.', '')),
		location_cache_time      = 60000,
		location_cached          = false,
		lnglat_array             = [],
		location_timer,
		directionsDisplay,
		directionsService,
		current_park_selection_data,
		map;


	// Launch On Load

	var populateImages = function()
	{
	    for (var i = 0; i < park_li_length; i++) {
	    	var park_id   = park_li[i].id,
	    		park_name = park_li[i].getAttribute('data-parkval');

	    	$('#' + park_id).css({
				'background-image' : 'url(../public/images/' + park_name + '.jpg)',
	    	});
	    }
	};

	var attachEventListeners = function()
	{
		for (var i = 0; i < park_li_length; i++)
		{
			park_li[i].addEventListener('click', function() {
				_setSelectionStyles(this);
				_displayFireBtn();
			}, false);
		}

		window.addEventListener('load', function() {
  			setTimeout(function() {
				window.addEventListener('popstate', function(e) {
					checkHistoryState();
				}, false);
			}, 0);
		});
	};

	var attachFindAll = function()
	{
		var find_all = document.getElementById('find-all');

		find_all.addEventListener('click', function() {
			_displayLoadingScreen( $loadingscreen );
			_getUserLocation(_getParksFromDB, facility_selection_array);
		}, false);
	};

	var attachGoClick = function()
	{
		$('#park-find-btn').click(function() {
			if (global_go_btn) {
				_getParkSelection();
			}
		});
	};

	var attachResetClick = function()
	{
		$('#park-reset-btn').click(function() {
			if (global_go_btn) {
				_resetSelection();
			}
		});
	};

	var checkHistoryState = function()
	{
		var current_state = history.state;

		if (current_state !== null) {
			current_park_selection_data = current_state.data;
			lnglat_array                = current_state.location;
			selection_index             = current_state.checkpoint;

			on_home_page = true;
			_performPageTransition();
		} else {
			on_home_page = false;
			_performPageTransition();
		}
	};

	var loadCheckmarkInit = function()
	{
		var checkmark = 'https://www.parkstoronto.ca/images/check.svg';
		(new Image()).src = checkmark;
	};


	// After Init load - handle user events

	var _setSelectionStyles = function(park_choice)
	{
		var selected_attr = park_choice.getAttribute('data-selected'),
			clicked_id    = park_choice.id;

		if (selected_attr == 0) {
			_selectChanges(clicked_id, '.5', 1, 'block');
			_addToParkList(park_choice, clicked_id);
	    } else {
	    	_selectChanges(clicked_id, '.9', 0, 'none');
	    	_removeFromParkList(clicked_id);
	    }
	};

	var _addToParkList = function(park_choice, clicked_id)
	{
		var selected_attr = park_choice.getAttribute('data-nicename');

		$('.chosen-park-list').css({'display':'block'});

		$('.chosen-park-list ul').prepend(
			"<li id='chosenlist-"+clicked_id+"' class='fade-in-and-up'><i class='fa fa-times' aria-hidden='true'></i> "+selected_attr+"</li>"
		);

		document.getElementById('chosenlist-'+clicked_id).addEventListener('click', function() {
			_setSelectionStyles(park_choice);
			_displayFireBtn();
		}, false);
	};

	var _removeFromParkList = function(clicked_id)
	{
		$('#chosenlist-'+clicked_id).remove();

	    // remove these elements from dom if ul is empty
	    if (!($('.chosen-park-list ul').has('li').length)) {
	    	$('.chosen-park-list').css({'display':'none'});
	    }
	};

	var _clearEntireParkList = function()
	{
		$('.chosen-park-list').css({'display':'none'});
		$('.chosen-park-list ul').empty();
	};

	var _getParkSelection = function()
	{
		for (var i = 0; i < park_li_length; i++) {
	    	if (park_li[i].getAttribute('data-selected') == 1 )	{
	    		facility_selection_array.push( park_li[i].getAttribute('data-parkvaloffish'));
	    	}
	    }

	    _displayLoadingScreen($loadingscree);
	    _getUserLocation(_getParksFromDB, facility_selection_array);

	    facility_selection_array = []; // reset selection array
	};

	var _displayLoadingScreen = function(loading_screen)
	{
		loading_screen.removeClass('ani-fadeOutZindex').addClass('ani-fadeInZindex');
	};

	var _removeLoadingScreen = function(loading_screen)
	{
		loading_screen.removeClass('ani-fadeInZindex').addClass('ani-fadeOutZindex');
	};

	var _getUserLocation = function(callback, facility_selection_array)
	{
		var yourLat,
			yourLng,
			timeout = 8000;

		var geo_options = {
			enableHighAccuracy: false,
		    timeout: 7500,
		    maximumAge: 0
		};

		if (navigator.geolocation) {
			if (location_cached === true) {
				callback( facility_selection_array );
			} else {
				var location_timeout = setTimeout(function() {
					$('#location-fail').show();
				}, timeout);

				navigator.geolocation.getCurrentPosition(function(position) {
					$('#location-fail').hide();
					clearTimeout(location_timeout);

					lnglat_array = [];

					var lat = (position.coords.latitude),
						lng = (position.coords.longitude);

					lnglat_array.push(lat, lng);

					location_cached = true;
					location_timer = setTimeout(function() {
						location_cached = false;
					}, location_cache_time);

					callback(facility_selection_array);

				}, function() {
					$('#location-fail').hide();
					clearTimeout(location_timeout);
					_removeLoadingScreen($loadingscreen);
				}, geo_options);
			}
		} else {
			alert('Unfortunately, your browser cannot get your location :(');
		}
	};

	var _resetSelection = function()
	{
		for (var i = 0; i < park_li_length; i++) {
	    	park_li[i].setAttribute('data-selected', 0);
	    	_resetStyles(i);
	    	_clearEntireParkList();
	    	_resetButtons();
	    }

	    facility_selection_array = []; // reset selection array
	};

	var _displayFireBtn = function()
	{
		var display_btn_counter = 1,
			display_button_vis  = false;

		for (var i = 0; i < park_li_length; i++) {
	    	if (park_li[i].getAttribute('data-selected') == 1) {
	    		display_button_vis = true;
	    	}

	    	if (display_btn_counter == park_li_length) {
		    	if (display_button_vis === false) {
		    		global_go_btn = false;
		    		_resetButtons();
		    	} else {
		    		global_go_btn = true;
		    		_setButtons();
		    	}
		    }
		    display_btn_counter++;
	    }
	};

	// AJAX

	var _getParksFromDB = function(_facility_selection_array)
	{
		var ajax_params = {
			lat       : lnglat_array[0],
			lng       : lnglat_array[1],
            facilities: _facility_selection_array.join(',')
		};

	    $.ajax({
	        url     : document.location.origin+'/t--p--f/public/facilities',
	        type    : 'GET',
	        data    : ajax_params,
	        dataType: 'JSON',
	        success : function(data) {
	        	console.log(data);
	        	_removeLoadingScreen($loadingscreen);

	        	if (data.length >= 1) {
	        		current_park_selection_data = data;
	        		_performPageTransition();
	        		_updateUrl();
	        	} else {
	        		alert('Your chosen facilities are not available at any parks.');
	        	}
	        },
	        error: function(xhr) {
	        	_removeLoadingScreen($loadingscreen);
	        	console.log(xhr);
	        }
	    });
	};

	var _filterParkNameForQuery = function(park_name)
	{
		var final_word;

		var __removeAbbrev = function (string) {
			var last_index = string.lastIndexOf(' ');
			return string.substring(0, last_index);
		};

		var last_word_array     = park_name.split(' '),
			last_word           = last_word_array.slice(-1).pop(),
			park_name_no_abbrev = __removeAbbrev(park_name);

		switch (last_word) {
			case 'CC':
				final_word = '%20Community%20Center';
			break;
			case 'CRC':
				final_word = '%20Community%20Recreation%20Center';
			break;
			case 'RC':
				final_word = '%20Recreation%20Center';
			break;
			case 'CSS':
				final_word = '%20Catholic%20Secondary%20School';
			break;
			case 'PS':
				final_word = '%20Public%20School';
			break;
			case 'CS':
				final_word = '%20Community%20School';
			break;
			case 'PARK':
				final_word = '%20Park';
			break;
			case 'ES':
				final_word = '%20Park';
			break;
			case 'CI':
				final_word = '%20Collegiate%20Institute';
			break;
			case 'SS':
				final_word = '%20Secondary%20School';
			break;
			case 'JHS':
				final_word = '%20Junior%20High%20School';
			break;
			case 'JPS':
				final_word = '%20Junior%20Public%20School';
			break;
			case 'TCH':
				final_word = '%20Toronto%20Community%20Housing';
			break;
			default:
				return encodeURIComponent(park_name.trim())+'%20Toronto';
		}

		return encodeURIComponent(park_name_no_abbrev.trim())+final_word+'%20Toronto';
	};

	var _getBingImages = function(park_selection_index)
	{
		_displayLoadingScreen($loadingscreen_small);

		var park_name = _filterParkNameForQuery(current_park_selection_data[park_selection_index]['name']);

		$('.park-images-ul ul').empty(); // empty previous event handlers/element data

	    $.ajax({
	        url     : document.location.origin+'/t--p--f/public/bingimages',
	        type    : 'GET',
	        data    : {park: park_name},
	        dataType: 'JSON',
	        success : function (data) {
	        	_removeLoadingScreen($loadingscreen_small);
	        	_displayParkImages(data);
	        	console.log(data);
	        },
	        error: function (e) {
	        	_removeLoadingScreen($loadingscreen_small);
	            console.log(e);
	        }
	    });
	};

	var _displayParkImages = function(data)
	{
		data.value.map(function(image, i) {
			$('.park-images-ul ul').append(
				"<a href='"+image.contentUrl.replace(/^http:\/\//i, 'https://')+"' target='_blank'><li class='image-item'><img src='"+image.contentUrl.replace(/^http:\/\//i, 'https://')+"'/></li></a>"
			);
		});
	};

	var _performPageTransition = function()
	{
		if (on_home_page) {
			$('.li-bg').removeClass('ani-right').addClass('ani-left'); // remove all park images
			$('.title').removeClass('ani-fadeIn').addClass('ani-fadeOut'); //fade out page title
			$('.sub-title').removeClass('ani-fadeIn').addClass('ani-fadeOut'); //fade out sub title
			$('.description').removeClass('ani-fadeIn').addClass('ani-fadeOut'); //fade out description
			_resetButtons(); //remove buttons

			setTimeout(function() {
				$('#home-page').css({'display':'none'}); //display none to homepage container after animations are done
				$('#find-parks-page').css({'display':'block'}); //display block to find parks container after animations are done
				_performPageInit();
			}, 101);

			on_home_page = false;
		} else {
			$('#find-parks-page').css({'display':'none'});
			$('#home-page').css({'display':'block'});

			setTimeout(function() {
				$('.li-bg').removeClass('ani-left').addClass('ani-right');
				$('.title').removeClass('ani-fadeOut').addClass('ani-fadeIn');
				$('.sub-title').removeClass('ani-fadeOut').addClass('ani-fadeIn');
				$('.description').removeClass('ani-fadeOut').addClass('ani-fadeIn');
				_displayFireBtn();
			}, 0); //wait for display corrections to be made before applying animations

			on_home_page = true;
		}
	};

	var _performPageInit = function()
	{
		_openGoogleMaps();
		_displayParkNav();
		_displayParkData(selection_index); // 0 initially
		_getBingImages(selection_index); // 0 initially
	};

	var _updateUrl = function(checkpoint)
  	{
  		var checkpoint_selected = (typeof checkpoint === 'undefined') ? 0 : checkpoint;

  		if (history.pushState) {
			history.pushState({
				data      : current_park_selection_data,
				location  : lnglat_array,
				checkpoint: checkpoint_selected
			}, null, 'nearme?q=' + checkpoint_selected);
		}
	};

	var _displayParkNav = function()
	{
		$('.park-distance-ul ul').empty(); // empty previous event handlers/element data

		current_park_selection_data.map(function(park, i) {
			$('.park-distance-ul ul').append(
				"<li class='distance-item' data-selection-number='"+i+"' data-lat='"+park['latitude']+"' data-lng='"+park['longitude']+"' data-parkname='"+park['name']+"' data-address='"+park['address']+"' data-phonenumber='"+park['phone']+"' data-postalcode='"+park['postal_code']+"'><div class='number-overlay'>"+(i + 1)+"</div><div class='number'><strong>"+(i + 1)+"</strong> <i class='fa fa-angle-right fa-styling' aria-hidden='true'></i> <span style='opacity: .8;'>"+park['name']+"</span></div></li>"
			);
		});

		var distance_class  = document.getElementsByClassName('distance-item');
		var distance_length = distance_class.length;

		for (var i = 0; i < distance_length; i++) {
		    distance_class[i].addEventListener('click', _reRenderParkSelection, false);
		}

		distance_class[selection_index].classList.add('park-selected'); // 0 initially
		distance_class[selection_index].classList.add('park-selected-official'); // 0 initially
	};

	var _reRenderParkSelection = function(map_selection)
	{
		selection_index = (isNaN(map_selection)) ? parseInt(this.getAttribute('data-selection-number')) : map_selection;

		$('.park-distance-ul>ul>li.park-selected-official').removeClass('park-selected-official');
		$('.park-distance-ul>ul>li>.number-zoom').removeClass('number-zoom');
		$('li[data-selection-number="'+selection_index+'"]').addClass('park-selected park-selected-official');
		$('.park-selected-official>.number-overlay').addClass('number-zoom');

		_calculateAndDisplayRout(selection_index, true);
		_displayParkData(selection_index);
		_getBingImages(selection_index);
		map.getStreetView().setVisible(false); // exit out of street view on new park selection

		_updateUrl(selection_index);
	};

	var _displayParkData = function(park_selection_index)
	{
		var phone_number   = current_park_selection_data[park_selection_index]['phone'],
			directions_url = "https://www.google.com/maps/dir/"+lnglat_array[0]+","+lnglat_array[1]+"/"+current_park_selection_data[park_selection_index]['latitude']+","+current_park_selection_data[park_selection_index]['longitude'],
			uber_url       = "uber://?action=setPickup&pickup=my_location&dropoff[latitude]="+current_park_selection_data[park_selection_index]['latitude']+"&dropoff[longitude]="+current_park_selection_data[park_selection_index]['longitude']+"&dropoff[formatted_address]="+current_park_selection_data[park_selection_index]['address'],
			tel            = '',
			tel_close      = '',
			facil_count    = 0;

		if (phone_number !== '') {
			tel       = '<a href="tel:' + current_park_selection_data[park_selection_index]['phone'] + '">',
			tel_close = '</a>';
		} else {
			phone_number = 'N/A';
		}

		$('.park-facilities-ul ul').empty(); // empty previous event handlers/element data

		$('.park-facilities-ul ul').append(
			"<li><div class='item'><strong>All Facilities</strong></div></li>"+
			"<li><div class='item'><i class='fa fa-angle-right' aria-hidden='true'></i> </div></li>"
		);

		for (var prop in current_park_selection_data[park_selection_index]) {
			if ((current_park_selection_data[park_selection_index][prop] === 1 ) && prop !== 'id') {
				var list_pointer = (facil_count !== 0) ? "<li><div class='item'><i class='fa fa-circle-o fa-styling-small' aria-hidden='true'></i></div></li>" : "";

				$('.park-facilities-ul ul').append(
					list_pointer+"<li><div class='item'>"+_cleanFacilityName(prop)+"</div></li>"
				);
				facil_count++;
			}
		}

		$('#park-info-name').empty().html(current_park_selection_data[park_selection_index]['name']);
		$('#park-info-address').empty().html('<i class="fa fa-map-marker fa-styling" aria-hidden="true"></i> '+current_park_selection_data[park_selection_index]['address']);
		$('#park-info-phonenumber').empty().html('<i class="fa fa-phone fa-styling" aria-hidden="true"></i> '+tel+phone_number+tel_close);
		$('#park-info-postalcode').empty().html('<i class="fa fa-home fa-styling" aria-hidden="true"></i> '+current_park_selection_data[park_selection_index]['postal_code']);
		$('#park-info-etc #directions').attr('href', directions_url);
		$('#park-info-etc #uber').attr('href', uber_url);
	};

	var _openGoogleMaps = function()
	{
		var marker,
			i;

	    map = new google.maps.Map(document.getElementById('google-map'), {
	      zoom     : 12,
	      center   : new google.maps.LatLng(lnglat_array[0], lnglat_array[1]),
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    });

		var infowindow    = new google.maps.InfoWindow();
		directionsDisplay = new google.maps.DirectionsRenderer({
      		preserveViewport: true
      	});
		directionsService = new google.maps.DirectionsService;

      	directionsDisplay.setMap(map);
     	//directionsDisplay.setPanel(document.getElementById('directions'));

	    for (i = 0; i < current_park_selection_data.length; i++)
	    {
	     	marker = new google.maps.Marker({
	        	position: new google.maps.LatLng(current_park_selection_data[i]['latitude'], current_park_selection_data[i]['longitude']),
	        	map     : map,
	        	icon : 'https://www.parkstoronto.ca/images/leaf_square_icon.png'
	      	});

	      	google.maps.event.addListener(marker, 'click', (function(marker, i) {
	       		return function() {
	       			_reRenderParkSelection(i);
	        		infowindow.setContent(current_park_selection_data[i]['name']);
	        		infowindow.open(map, marker);
	        	}
	      	})(marker, i));
	    }
	    _calculateAndDisplayRout(selection_index); // 0 initially
	};

	var _cleanFacilityName = function(name)
	{
		var fresh_name    = name.split('_').join(' '),
			complete_name = fresh_name.replace(/\b\w/g, function(l){ return l.toUpperCase() });

		return complete_name;
	}

	var _calculateAndDisplayRout = function(park_selection_index, reset_viewport)
	{
		var reset_viewport = (typeof reset_viewport === 'undefined') ? false : true,
    		start          = new google.maps.LatLng(lnglat_array[0], lnglat_array[1]),
        	end            = new google.maps.LatLng(current_park_selection_data[park_selection_index]['latitude'], current_park_selection_data[park_selection_index]['longitude']);

        if (reset_viewport) {
			directionsDisplay.preserveViewport = false;
		}

		directionsService.route({
			origin     : start,
			destination: end,
			travelMode : google.maps.TravelMode.DRIVING
		}, function(response, status) {
			if (status === google.maps.DirectionsStatus.OK) {
				directionsDisplay.setDirections(response);
			} else {
				console.debug('Directions request failed due to '+status);
			}
		});
    };

	// Styling Functions

	var _selectChanges = function(id, opac, selected, display)
	{
		$('#'+id).css({
			'opacity': opac
    	}).attr('data-selected', selected);

    	$('#'+id+' > .svg-check').css({
			'display': display
    	}).toggleClass('zoom-check');

    	if (display === 'none') {
    		$('#'+id).removeClass('li-click');
	    	$('#'+id+' > p').removeClass('li-click-text');
    	} else {
    		$('#'+id).addClass('li-click');
	    	$('#'+id+' > p').addClass('li-click-text');
	    }
	};

	var _setButtons = function()
	{
		$('.fire-btn-shadow').css({
			'display': 'block'
		}).removeClass('zoom-check-shadow-reverse').addClass('zoom-check-shadow');

		$('.reset-btn-shadow').css({
			'display': 'block'
		}).removeClass('zoom-check-shadow-reverse').addClass('zoom-check-shadow');

		$('.fire-btn').css({
			'display': 'block'
		}).removeClass('zoom-check-reverse').addClass('zoom-check');

		$('.reset-btn').css({
			'display': 'block'
		}).removeClass('zoom-check-reverse').addClass('zoom-check');
	};

	var _resetStyles = function(id)
	{
		$('#'+id).css({
			'opacity': '.9'
    	}).attr('data-selected', 0);

    	$('#'+id+' > .svg-check').css({
			'display': 'none'
    	}).removeClass('zoom-check');

    	$('#'+id).removeClass('li-click');
    	$('#'+id+' > p').removeClass('li-click-text');
	};

	var _resetButtons = function()
	{
		$('.fire-btn-shadow').addClass('zoom-check-shadow-reverse').removeClass('zoom-check-shadow');
    	$('.reset-btn-shadow').addClass('zoom-check-shadow-reverse').removeClass('zoom-check-shadow');
		$('.fire-btn').addClass( 'zoom-check-reverse' ).removeClass('zoom-check');
		$('.reset-btn').addClass( 'zoom-check-reverse' ).removeClass('zoom-check');
	};

	return {
		populateImages      : populateImages,
		attachFindAll       : attachFindAll,
		attachEventListeners: attachEventListeners,
		attachGoClick       : attachGoClick,
		attachResetClick    : attachResetClick,
		checkHistoryState   : checkHistoryState,
		loadCheckmarkInit   : loadCheckmarkInit
	}
})();

// ON LOAD

TpfHome.populateImages();
TpfHome.attachEventListeners();
TpfHome.attachFindAll();
TpfHome.attachGoClick();
TpfHome.attachResetClick();
TpfHome.checkHistoryState();
TpfHome.loadCheckmarkInit();