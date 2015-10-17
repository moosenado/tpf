$( document ).ready( function()
{
    var park_li = document.getElementById( 'park-list' ).getElementsByTagName( 'li' );

    for ( i = 0; i < park_li.length; i++ )
    {
    	var park_id   = park_li[ i ].id;
    	var park_name = park_li[ i ].getAttribute( 'data-parkval' );

    	$( '#' + park_id ).css( {
			'background'     : 'url(../public/images/' + park_name + '.jpg) no-repeat left center',
			'background-size': '100%'
    	} );
    }
});