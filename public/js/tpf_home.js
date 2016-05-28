var TpfHome = ( function ()
{
	// Private Variables

	var park_li              = document.getElementById( 'park-list' ).getElementsByTagName( 'li' );
	var park_li_length		 = park_li.length;
	var park_selection_array = [];
	var global_go_btn		 = false;
	var CSRF_TOKEN = $('meta[name="csrf-token"]').attr('content');


	// Public Methods

	var populateImages = function ()
	{
	    for ( i = 0; i < park_li_length; i++ )
	    {
	    	var park_id   = park_li[ i ].id;
	    	var park_name = park_li[ i ].getAttribute( 'data-parkval' );

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
				_resetSelection(); // get selected parks and ship off to php for db query
			}
		});
	};


	// Private Methods

	var _setSelectionStyles = function ( park_choice )
	{
		var selected_attr = park_choice.getAttribute( 'data-selected' );
		var clicked_id    = park_choice.id;

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
	    		park_selection_array.push( park_li[ i ].getAttribute( 'data-parkvaloffish' ) );
	    	}
	    }

	    _FIRE();

	    park_selection_array = [];
	};

	var _resetSelection = function ()
	{
		for ( i = 0; i < park_li_length; i++ )
	    {
	    	park_li[ i ].setAttribute( 'data-selected', 0 );

	    	_resetStyles( i );

	    	_resetButtons();
	    }

	    park_selection_array = [];
	};

	var _displayFireBtn = function ()
	{
		var display_btn_counter = 1;
		var display_button_vis  = false;

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

	var _FIRE = function ()
	{
	    $.ajax({
	        url:'http://localhost/t--p--f/public/getparks',
	        type: 'GET',
	        data: {
	        	_token: CSRF_TOKEN,
	            park_array: park_selection_array
	        },
	        dataType: 'JSON',
	        success: function( data ){

	            alert(data);
	        },
	        error: function (xhr, b, c) {
	            console.log(xhr);
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
		attachEventListeners: attachEventListeners,
		attachGoClick       : attachGoClick,
		attachResetClick    : attachResetClick
	}

})();

TpfHome.populateImages();
TpfHome.attachEventListeners();
TpfHome.attachGoClick();
TpfHome.attachResetClick();