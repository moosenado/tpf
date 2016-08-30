var TpfHome = ( function ()
{
	// Globals

	var park_li                  = document.getElementById( 'park-list' ).getElementsByTagName( 'li' ),
		park_li_length		     = park_li.length,
		facility_selection_array = [],
		global_go_btn		     = false,
		CSRF_TOKEN               = $('meta[name="csrf-token"]').attr('content'),
		user_location			 = false,
		on_home_page             = true, //handle correct page transition
		bing_app_id              = 'd94b9ad51f0c422787649f57c7d68468',
		directionsDisplay,
		directionsServce,
		current_park_selection_data,
		lnglat_array;


	// Launch On Load

	var populateImages = function ()
	{
	    for ( i = 0; i < park_li_length; i++ )
	    {
	    	var park_id   = park_li[ i ].id,
	    		park_name = park_li[ i ].getAttribute( 'data-parkval' );

	    	$( '#' + park_id ).css( {
				'background'         : 'url(../public/images/' + park_name + '.jpg) no-repeat left center',
				'background-size'    : '100%',
				'background-position': 'center'
	    	} );
	    }
	};

	var attachEventListeners = function ()
	{
		for ( var i = 0; i < park_li_length; i++ )
		{
			park_li[ i ].addEventListener( 'click', function () {

				_setSelectionStyles( this );
				_displayFireBtn();

			}, false );
		}

		window.addEventListener( "load", function ()
  		{
  			setTimeout( function ()
  			{
				window.addEventListener( "popstate", function ( e )
				{
					_performPageTransition();

				}, false );
			}, 0 ); // to stop older webkit browsers from adding pushstate event on page load
		});
	};

	var attachFindAll = function ()
	{
		var find_all = document.getElementById( 'find-all' );

		find_all.addEventListener( 'click', function () {

			_getUserLocation( _getParksFromDB, facility_selection_array, true );

		}, false );
	};

	var attachGoClick = function ()
	{
		$( '#park-find-btn' ).click( function ()
		{
			if ( global_go_btn )
			{
				_getParkSelection(); // get selected parks and ship off to php for db query
			}
		});
	};

	var attachResetClick = function ()
	{
		$( '#park-reset-btn' ).click( function ()
		{
			if ( global_go_btn )
			{
				_resetSelection();
			}
		});
	};


	// After load - handle user events

	var _setSelectionStyles = function ( park_choice )
	{
		var selected_attr = park_choice.getAttribute( 'data-selected' ),
			clicked_id    = park_choice.id;

		if ( selected_attr == 0 )
		{
			_selectChanges( clicked_id, '.5', 1, 'block' );
	    }
	    else
	    {
	    	_selectChanges( clicked_id, '.9', 0, 'none' );
	    }

	};

	var _getParkSelection = function ()
	{
		for ( i = 0; i < park_li_length; i++ )
	    {
	    	if ( park_li[ i ].getAttribute( 'data-selected' ) == 1 )
	    	{
	    		facility_selection_array.push( park_li[ i ].getAttribute( 'data-parkvaloffish' ) );
	    	}
	    }

	    _getUserLocation( _getParksFromDB, facility_selection_array );

	    facility_selection_array = []; // reset selection array
	};

	var _getUserLocation = function ( callback, facility_selection_array, all_parks )
	{
		var yourLat,
			yourLng;

		if ( navigator.geolocation )
		{
			navigator.geolocation.getCurrentPosition( __getPosition );
		}
		else
		{
			alert( "Your browser cannot get your location." );
		}

		function __getPosition( position )
		{
			lnglat_array = [];

			var lat = ( position.coords.latitude ),
				lng = ( position.coords.longitude );

			lnglat_array.push( lat, lng );

			callback( facility_selection_array, all_parks );
		}
	};

	var _resetSelection = function ()
	{
		for ( i = 0; i < park_li_length; i++ )
	    {
	    	park_li[ i ].setAttribute( 'data-selected', 0 );

	    	_resetStyles( i );

	    	_resetButtons();
	    }

	    facility_selection_array = []; // reset selection array
	};

	var _displayFireBtn = function ()
	{
		var display_btn_counter = 1,
			display_button_vis  = false;

		for ( i = 0; i < park_li_length; i++ )
	    {
	    	if ( park_li[ i ].getAttribute( 'data-selected' ) == 1 )
	    	{
	    		display_button_vis = true;
	    	}

	    	if ( display_btn_counter == park_li_length )
		    {
		    	if ( display_button_vis === false )
		    	{
		    		global_go_btn = false;

		    		_resetButtons();
		    	}
		    	else
		    	{
		    		global_go_btn = true;

		    		_setButtons();
		    	}
		    }

		    display_btn_counter++;
	    }
	};

	// AJAX

	var _getParksFromDB = function ( _facility_selection_array, all_parks )
	{
		var all_parks   = ( typeof all_parks == 'undefined' ) ? false : all_parks,
			ajax_params = {
				_token        : CSRF_TOKEN,
	            facility_array: _facility_selection_array,
	            lnglat_array  : lnglat_array,
				all_parks     : all_parks
			};

	    $.ajax({
	        url     :'http://localhost/t--p--f/public/getparks',
	        type    : 'GET',
	        data    : ajax_params,
	        dataType: 'JSON',
	        success : function ( data )
	        {
	        	if ( data.length >= 1 )
	        	{
	        		current_park_selection_data = data;
	        		_performPageTransition();
	        		_updateUrl();
	        	}
	        	else
	        	{
	        		alert( "Your chosen facilities are not available at any parks." )
	        	}
	        },
	        error: function ( xhr ) { console.log( xhr ); }
	    });
	};

	var _performPageTransition = function ()
	{
		if ( on_home_page )
		{
			// do transistion here and launch new page with callback
			$(".li-bg").removeClass("ani-right").addClass("ani-left"); // remove all park images
			$(".title").removeClass("ani-fadeIn").addClass("ani-fadeOut"); //fade out page title
			$(".sub-title").removeClass("ani-fadeIn").addClass("ani-fadeOut"); //fade out sub title
			$(".description").removeClass("ani-fadeIn").addClass("ani-fadeOut"); //fade out description
			_resetButtons(); //remove buttons

			setTimeout( function ()
			{
				$("#home-page").css({"display":"none"}); //display none to homepage container after animations are done
				$("#find-parks-page").css({"display":"block"}); //display block to find parks container after animations are done
				_performPageInit();
			}, 101);

			on_home_page = false;
		}
		else
		{
			$("#find-parks-page").css({"display":"none"});
			$("#home-page").css({"display":"block"});

			setTimeout( function ()
			{
				$(".li-bg").removeClass("ani-left").addClass("ani-right");
				$(".title").removeClass("ani-fadeOut").addClass("ani-fadeIn");
				$(".sub-title").removeClass("ani-fadeOut").addClass("ani-fadeIn");
				$(".description").removeClass("ani-fadeOut").addClass("ani-fadeIn");
				_displayFireBtn();
			}, 0); //wait for display corrections to be made before applying animations

			on_home_page = true;
		}
	};

	var _performPageInit = function ()
	{
		_openGoogleMaps();
		_displayParkNav();
		_displayParkData( 0 ); // 0 for first park in line
	};

	var _updateUrl = function ()
  	{
  		if ( history.pushState )
  		{
			history.pushState( { current_park_selection_data }, null );
		}
	};

	var _displayParkNav = function ()
	{
		$(".park-distance-ul ul").empty(); // empty previous event handlers/element data

		current_park_selection_data.map( function ( park, i )
		{
			$(".park-distance-ul ul").append(
				"<li class='distance-item' data-selection-number='" + i + "' data-lat='" + park['lat'] + "' data-lng='" + park['lng'] + "' data-parkname='" + park['parkname'] + "' data-address='" + park['address'] + "' data-phonenumber='" + park['phonenumber'] + "' data-postalcode='" + park['postalcode'] + "'><span>" + (i + 1) + "</span></li>"
			);
		});

		var distance_class  = document.getElementsByClassName( "distance-item" );
		var distance_length = distance_class.length;

		for ( var i = 0; i < distance_length; i++ )
		{
			distance_class[i].classList.remove( 'park-selected' );
		    distance_class[i].addEventListener( 'click', _reRenderParkSelection, false );
		}
	};

	var _reRenderParkSelection = function ()
	{
		var selection_index = parseInt( this.getAttribute( "data-selection-number" ) );

		$(".park-distance-ul>ul>li.park-selected").removeClass("park-selected");

		this.classList.add( 'park-selected' );

		_calculateAndDisplayRout( selection_index, true );
		_displayParkData( selection_index );
	};

	var _displayParkData = function ( park_selection_index )
	{
		$("#park-info-name").empty().html( current_park_selection_data[park_selection_index]['parkname'] );
		$("#park-info-address").empty().html( current_park_selection_data[park_selection_index]['address'] );
		$("#park-info-phonenumber").empty().html( current_park_selection_data[park_selection_index]['phonenumber'] );
		$("#park-info-postalcode").empty().html( current_park_selection_data[park_selection_index]['postalcode'] );
	};

	var _openGoogleMaps = function ()
	{
		var marker, i;
	    var map = new google.maps.Map( document.getElementById( "google-map" ), {
	      zoom     : 12,
	      center   : new google.maps.LatLng( lnglat_array[0], lnglat_array[1] ),
	      mapTypeId: google.maps.MapTypeId.ROADMAP
	    });
		var infowindow    = new google.maps.InfoWindow();
		directionsDisplay = new google.maps.DirectionsRenderer({
      		preserveViewport: true
      	});
		directionsService = new google.maps.DirectionsService;

      	directionsDisplay.setMap( map );
     	//directionsDisplay.setPanel(document.getElementById('directions'));

	    for (i = 0; i < current_park_selection_data.length; i++)
	    {
	     	marker = new google.maps.Marker({
	        	position: new google.maps.LatLng( current_park_selection_data[i]["lat"], current_park_selection_data[i]["lng"] ),
	        	map     : map
	      	});

	      	google.maps.event.addListener( marker, "click", ( function( marker, i )
	      	{
	       		return function()
	       		{
	        		infowindow.setContent( current_park_selection_data[i]["parkname"] );
	        		infowindow.open( map, marker );
	        	}
	      	})( marker, i ) );
	    }

	    _calculateAndDisplayRout( 0 );
	};

	var _calculateAndDisplayRout = function ( park_selection_index, reset_viewport )
	{
		var reset_viewport = ( typeof reset_viewport === 'undefined' ) ?  false : true,
    		start          = new google.maps.LatLng( lnglat_array[0], lnglat_array[1] ),
        	end            = new google.maps.LatLng( current_park_selection_data[park_selection_index]["lat"], current_park_selection_data[park_selection_index]["lng"] );

        if ( reset_viewport )
		{
			directionsDisplay.preserveViewport = false;
		}

		directionsService.route({
			origin     : start,
			destination: end,
			travelMode : google.maps.TravelMode.DRIVING
		}, function( response, status )
		{
			if ( status === google.maps.DirectionsStatus.OK )
			{
				directionsDisplay.setDirections( response );
			}
			else
			{
				console.debug( "Directions request failed due to " + status );
			}
		});

    };

	// Styling Functions

	var _selectChanges = function ( id, opac, selected, display )
	{
		$( '#' + id ).css( {
			'opacity': opac
    	} ).attr( "data-selected", selected );

    	$( '#' + id + ' > .svg-check' ).css( {
			'display': display
    	} ).toggleClass( 'zoom-check' );

    	$( '#' + id + ' > p' ).toggleClass( 'slide-center' );
	};

	var _setButtons = function ()
	{
		$( '.fire-btn-shadow' ).css( {
			'display': 'block'
		} ).addClass( 'zoom-check-shadow' );

		$( '.reset-btn-shadow' ).css( {
			'display': 'block'
		} ).addClass( 'zoom-check-shadow' );

		$( '.fire-btn' ).css( {
			'display': 'block'
		} ).addClass( 'zoom-check' );

		$( '.reset-btn' ).css( {
			'display': 'block'
		} ).addClass( 'zoom-check' );
	};

	var _resetStyles = function ( id )
	{
		$( '#' + id ).css( {
			'opacity': '.9'
    	} ).attr( "data-selected", 0 );

    	$( '#' + id + ' > .svg-check' ).css( {
			'display': 'none'
    	} ).removeClass( 'zoom-check' );

    	$( '#' + id + ' > p' ).removeClass( 'slide-center' );
	};

	var _resetButtons = function ()
	{
		$( '.fire-btn-shadow' ).addClass( 'zoom-check-shadow-reverse' );
    	$( '.reset-btn-shadow' ).addClass( 'zoom-check-shadow-reverse' );
		$( '.fire-btn' ).addClass( 'zoom-check-reverse' );
		$( '.reset-btn' ).addClass( 'zoom-check-reverse' );

		setTimeout( function ()
		{
			$( '.fire-btn-shadow' ).css( { 'display': 'none' } );
			$( '.fire-btn-shadow' ).removeClass( 'zoom-check-shadow-reverse' );

			$( '.reset-btn-shadow' ).css( { 'display': 'none' } );
			$( '.reset-btn-shadow' ).removeClass( 'zoom-check-shadow-reverse' );

			$( '.fire-btn' ).css( { 'display': 'none' } );
			$( '.fire-btn' ).removeClass( 'zoom-check-reverse' );

			$( '.reset-btn' ).css( { 'display': 'none' } );
			$( '.reset-btn' ).removeClass( 'zoom-check-reverse' );
		}, 100 );
	};

	return {
		populateImages      : populateImages,
		attachFindAll       : attachFindAll,
		attachEventListeners: attachEventListeners,
		attachGoClick       : attachGoClick,
		attachResetClick    : attachResetClick
	}

})();

TpfHome.populateImages();
TpfHome.attachEventListeners();
TpfHome.attachFindAll();
TpfHome.attachGoClick();
TpfHome.attachResetClick();