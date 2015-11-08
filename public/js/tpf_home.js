$( document ).ready( function ()
{
	var TpfHome = ( function ()
	{
		// Private Variables

		var park_li = document.getElementById( 'park-list' ).getElementsByTagName( 'li' );


		// Public Methods

		var parkImagePopulate = function ()
		{
		    for ( i = 0; i < park_li.length; i++ )
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
			for ( var i = 0; i < park_li.length; i++ )
			{
    			park_li[ i ].addEventListener( 'click', _populateCustomSearch, false );
			}
		};


		// Private Methods

		var _populateCustomSearch = function ()
		{
			var selected_attr = this.getAttribute( 'data-selected' );
			var clicked_attr  = this.getAttribute( 'data-parkvaloffish' );
			var clicked_id    = this.id;

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
		    	alert('hi');
		    	$( '#' + clicked_id ).css( {
					'opacity': '.9'
		    	} ).attr( "data-selected", 0 );

		    	$( '#' + clicked_id + ' > .svg-check' ).css( {
					'display': 'none'
		    	} ).removeClass( 'zoom-check' );

		    	$( '#' + clicked_id + ' > p' ).removeClass( 'slide-center' );
		    }

		};

		return {
			parkImagePopulate   : parkImagePopulate,
			attachEventListeners: attachEventListeners
		}

    })();

    TpfHome.parkImagePopulate();
    TpfHome.attachEventListeners();

});