$( document ).ready( function ()
{
	var TpfHome = ( function ()
	{
		// Private Variables

		var park_li              = document.getElementById( 'park-list' ).getElementsByTagName( 'li' );
		var park_li_length		 = park_li.length;
		var park_selection_array = [];
		var global_go_btn		 = false;


		// Public Methods

		var parkFacilImagePopulate = function ()
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

    				_setParkSelection( this );
    				_setSelectionStyles( this );
    				_displayFireBtn();

    			}, false );
			}
		};

		var attachGoClick = function ()
		{
			$( '#park-find-btn' ).click( function () {
				if ( global_go_btn )
				{
					// this is where the created array is looped through and duplicates are removed - then the array is sent through ajax to php backend for querying 
					alert('hi there');
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
				$( '#' + clicked_id ).css( {
					'opacity': '.5'
		    	} ).attr( "data-selected", 1 );

		    	$( '#' + clicked_id + ' > .svg-check' ).css( {
					'display': 'block'
		    	} ).addClass( 'zoom-check' );

		    	$( '#' + clicked_id + ' > p' ).addClass( 'slide-center' );
		    }
		    else
		    {
		    	$( '#' + clicked_id ).css( {
					'opacity': '.9'
		    	} ).attr( "data-selected", 0 );

		    	$( '#' + clicked_id + ' > .svg-check' ).css( {
					'display': 'none'
		    	} ).removeClass( 'zoom-check' );

		    	$( '#' + clicked_id + ' > p' ).removeClass( 'slide-center' );
		    }

		};

		var _setParkSelection = function ( park_choice )
		{
			var clicked_attr = park_choice.getAttribute( 'data-parkvaloffish' );

			park_selection_array.push( clicked_attr );
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

			    		$( '.fire-btn' ).addClass( 'zoom-check-reverse' );

			    		setTimeout( function () {
			    			$( '.fire-btn' ).css( { 'display': 'none' } );
			    			$( '.fire-btn' ).removeClass( 'zoom-check-reverse' );
			    		}, 500 );
			    	}
			    	else
			    	{
			    		global_go_btn = true;

			    		$( '.fire-btn' ).css( {
							'display': 'block'
		    			} ).addClass( 'zoom-check' );;
			    	}
			    }

			    display_btn_counter++;
		    }
		};

		return {
			parkFacilImagePopulate: parkFacilImagePopulate,
			attachEventListeners  : attachEventListeners,
			attachGoClick		  : attachGoClick
		}

    })();

    TpfHome.parkFacilImagePopulate();
    TpfHome.attachEventListeners();
    TpfHome.attachGoClick();

});