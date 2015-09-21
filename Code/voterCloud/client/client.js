Session.setDefault('image', 1);
Router.configure({
  layoutTemplate: "layout"
});

Router.route('/', function () {
  this.render('Home');
});

Router.route('/Search', function () {
  this.render('Search');
});

Template.layout.events({
	'click #toggle-menu, click #pagemask': function(evt, inst) {
		evt.preventDefault();

		var $body = $( 'body' ),
		$page = $( '#page' ),
		$menu = $( '#menu' ),
		$image = $( '#image' ),

		/* Cross browser support for CSS "transition end" event */
		transitionEnd = 'transitionend webkitTransitionEnd otransitionend MSTransitionEnd';

	    $body.addClass( 'animating' );

		/***
		* Determine the direction of the animation and
		* add the correct direction class depending
		* on whether the menu was already visible.
		*/
		if ( $body.hasClass( 'menu-visible' ) ) {
			$body.addClass( 'left' );
		} else {
			$body.addClass( 'right' );
		}
		if( Session.get( 'image' ) == 1 )
		$image.attr("src","/list26.png");
		else
		$image.attr("src","/options21.png");
		Session.set( 'image', Session.get( 'image' ) * -1 );

		/***
		* When the animation (technically a CSS transition)
		* has finished, remove all animating classes and
		* either add or remove the "menu-visible" class 
		* depending whether it was visible or not previously.
		*/
		$page.on( transitionEnd, function() {
			$body.removeClass( 'animating left right' )
			$body.toggleClass( 'menu-visible' );
			$page.off( transitionEnd );
		} );

	}
});
Template.Search.events({
	'submit #Search': function(event){
		event.preventDefault();
		var address = event.target.address.value;
		console.log(address);
		
		Meteor.call('civicAddress', address,  function (error, result) {
			if(error) {
				window.alert("Error: " + error.reason);
				console.log("error occured on receiving data on server. ", error );
			} else {
				console.log("result: ", result);
			}
			
		});
	}
});