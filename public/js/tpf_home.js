var TpfHome = ( function ()
{
	// Private Variables

	var park_li                  = document.getElementById( 'park-list' ).getElementsByTagName( 'li' ),
		park_li_length		     = park_li.length,
		facility_selection_array = [],
		global_go_btn		     = false,
		CSRF_TOKEN               = $('meta[name="csrf-token"]').attr('content'),
		user_location			 = false,
		on_home_page             = true; //handle correct page transitiion


	// Public Methods

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
  			//history.replaceState( {}, null, '/' );

  			setTimeout( function ()
  			{
				window.addEventListener( "popstate", function ( e )
				{
					console.log(history.state);
					if ( history.state === null )
					{
						performPageTransition();
					}
				}, false );
			}, 0 ); // to stop older webkit browsers from adding pushstate event on page load
		});
	};

	var attachFindAll = function ()
	{
		var find_all = document.getElementById( 'find-all' );

		find_all.addEventListener( 'click', function () {

			getUserLocation( _getParksFromDB, facility_selection_array, true );

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


	// Private Methods

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

	    getUserLocation( _getParksFromDB, facility_selection_array );

	    facility_selection_array = []; // reset selection array
	};

	var getUserLocation = function ( callback, facility_selection_array, all_parks )
	{
		var yourLat,
			yourLng;
			//locationError = document.getElementById("locationErr");

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		}else{
			//locationError.innerHTML = "Your browser cannot get your location.";
		}

		function showPosition(position) {

			var lnglat_array = [],
				lat = (position.coords.latitude),
				lng = (position.coords.longitude);

			lnglat_array.push(lat, lng);

			callback(facility_selection_array, lnglat_array, all_parks );
		}

		//WHEN GPS POSITION IS READY

		// function onPositionReady(yourLat, yourLng) {

		// 	var latlng = new google.maps.LatLng(yourLat, yourLng);

		// 	var geocoder = new google.maps.Geocoder();

		// 	geocoder.geocode( {'latLng' : latlng}, function(results, status)  {

		// 		if (status == google.maps.GeocoderStatus.OK){

		// 			for(var i=0; i < results[0].address_components.length; i++)
		// 			{
		// 				var component = results[0].address_components[i];

		// 				if(component.types[0] == "postal_code")
		// 				{
		// 						//console.log(component.long_name.charAt(0));
		// 						//if (component.long_name.charAt(0) == 'm' || component.long_name.charAt(0) == 'M'){
		// 							var postalcodeField = document.forms[0].postalcode;
		// 							postalcodeField.value = component.long_name;
		// 							locationError.innerHTML = "Success";

		// 							console.log(component.long_name);
		// 							console.log(component);

	 //    							//if (component.long_name.charAt(0) != 'm' || !component.long_name.charAt(0) != 'M'){
	 //    								//locationError.innerHTML = "Not in Toronto? You can still search by facility type.";
	 //    							//}
	 //    						//}else{
	 //    							//locationError.innerHTML = "Not in Toronto? You can still search by facility type.";
	 //    							//var postalcodeField = document.forms[0].postalcode;
	 //    							//postalcodeField.focus();
	 //    						//}
	 //    					}
	 //    				}
	 //    			}else if(status === google.maps.GeocoderStatus.REQUEST_DENIED){
	 //    				locationError.innerHTML = "Unsuccessful";

	 //    			}else if(status === google.maps.GeocoderStatus.INVALID_REQUEST){
	 //    				locationError.innerHTML = "Unsuccessful";

	 //    			}else if(status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT){
	 //    				locationError.innerHTML = "Please try again soon!";

	 //    			}else{
	 //    				locationError.innerHTML = "Could not get your location: " + status;
	 //    			}
	 //    		});

		// }
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

	var _getParksFromDB = function ( _facility_selection_array, lnglat_array, all_parks )
	{
		var all_parks   = ( typeof all_parks == 'undefined' ) ? false : all_parks,
			ajax_params = {
				_token        : CSRF_TOKEN,
	            facility_array: _facility_selection_array,
	            lnglat_array  : lnglat_array,
				all_parks     : all_parks
			};

	    $.ajax({
	        url:'http://localhost/t--p--f/public/getparks',
	        type: 'GET',
	        data: ajax_params,
	        dataType: 'JSON',
	        success: function ( data ) {
	        	performPageTransition( data );
	        	_updateUrl( data );
	        },
	        error: function ( xhr ) { console.log( xhr ); }
	    });
	};

	var performPageTransition = function ( data )
	{
		if ( on_home_page )
		{
			// do transistion here and launch new page with callback
			$(".li-bg").removeClass("ani-right").addClass("ani-left"); // remove all park images
			$(".title").removeClass("ani-fadeIn").addClass("ani-fadeOut"); //fade out page title
			$(".sub-title").removeClass("ani-fadeIn").addClass("ani-fadeOut"); //fade out sub title
			$(".description").removeClass("ani-fadeIn").addClass("ani-fadeOut"); //fade out description
			_resetButtons(); //remove buttons

			setTimeout(function(){
				$("#home-page").css({"display":"none"}); //display none to homepage container after animations are done
				$("#find-parks-page").css({"display":"block"}); //display block to find parks container after animations are done
			}, 1200);

			on_home_page = false;
		}
		else
		{
			$("#find-parks-page").css({"display":"none"});
			$("#home-page").css({"display":"block"});

			setTimeout(function(){

				$(".li-bg").removeClass("ani-left").addClass("ani-right");
				$(".title").removeClass("ani-fadeOut").addClass("ani-fadeIn");
				$(".sub-title").removeClass("ani-fadeOut").addClass("ani-fadeIn");
				$(".description").removeClass("ani-fadeOut").addClass("ani-fadeIn");
				_displayFireBtn();

			}, 0); //wait for display corrections to be made before applying animations

			on_home_page = true;
		}
	};

	var _updateUrl = function ( data )
  	{
  		if ( history.pushState )
  		{
			history.pushState( { data }, null, document.location.href + 'findpark' );
		}
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

		setTimeout( function () {
			$( '.fire-btn-shadow' ).css( { 'display': 'none' } );
			$( '.fire-btn-shadow' ).removeClass( 'zoom-check-shadow-reverse' );

			$( '.reset-btn-shadow' ).css( { 'display': 'none' } );
			$( '.reset-btn-shadow' ).removeClass( 'zoom-check-shadow-reverse' );

			$( '.fire-btn' ).css( { 'display': 'none' } );
			$( '.fire-btn' ).removeClass( 'zoom-check-reverse' );

			$( '.reset-btn' ).css( { 'display': 'none' } );
			$( '.reset-btn' ).removeClass( 'zoom-check-reverse' );
		}, 250 );
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