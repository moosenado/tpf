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
					'background-size': '105%',
					'opacity'        : '.5'
		    	} ).attr( "data-selected", 1 );
		    }
		    else
		    {
		    	$( '#' + clicked_id ).css( {
					'background-size': '100%',
					'opacity'        : '.9'
		    	} ).attr( "data-selected", 0 );
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