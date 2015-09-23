Session.setDefault('image', 1);
Session.setDefault('jason', null);

Router.configure({
  layoutTemplate: "layout",
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
});

Router.route('/', function () {
  this.render('Home');
});

Router.route('/Search', function () {
  this.render('Search');
});

Template.layout.events({
	'click #toggle-menu, click #pagemask, click .menuitem' : function(evt, inst) {
		//evt.preventDefault();

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
		
		Meteor.call('civicAddress', address,  function (error, result) {
			if(error) {
				console.log("error occured on receiving data on server. ", error );
			} else {

				var arr = [ ];

				for( var prop2 in result.divisions )
				{
					if( result.divisions.hasOwnProperty( prop2 ) )
					{
						var prop = result.divisions[ prop2 ];
						var tag = prop2;
						var division = prop.name;
						if( prop.hasOwnProperty( 'officeIndices' ) ){

							for ( var i = 0; i < prop.officeIndices.length; i++ ) {

								var office = result.offices[ prop.officeIndices[ i ] ];
								var hasLevel = office.hasOwnProperty( 'levels' );
								var level = ( hasLevel )? office.levels[ 0 ] : "";
								var hasOfficeName = office.hasOwnProperty( 'name' );
								var officeName = ( hasOfficeName )? office.name : "";
								var hasRole = office.hasOwnProperty( 'roles' );
								var role = ( hasRole )? office.roles[ 0 ] : "";

								for ( var j = 0; j < office.officialIndices.length; j++ ) {

									var official = result.officials[ office.officialIndices[ j ] ];
									var officialName = official.name;
									var hasParty = official.hasOwnProperty( 'party' );
									var party = ( hasParty )? official.party : "";
									var hasPhone = official.hasOwnProperty( 'phones' );
									var phone = ( hasPhone )? official.phones[ 0 ] : "";
									var hasPhoto = official.hasOwnProperty( 'photoUrl' );
									var photo = ( hasPhoto )? official.photoUrl : "";
									/**
									* ALL THE PROPERTIES OF THE OBJECT DESCRIBED HERE !! FOR EACH OFFICIAL !!
									*/
									var obg = {
										division: division,
										hasLevel: hasLevel,
										level: level,
										hasOfficeName: hasOfficeName,
										officeName: officeName,
										hasRole: hasRole,
										role: role,
										officialName: officialName,
										hasParty: hasParty,
										party: party,
										hasPhone: hasPhone,
										phone: phone,
										hasPhoto: hasPhoto,
										photo: photo,
										tag: tag
									};

									arr.push( obg );

								}
							}
						}
					}
				}
				function compare(a, b)
				{
					if( a.tag.length < b.tag.length )
						return -1;
					if( a.tag.length > b.tag.length )
						return 1;
					return 0;
				};
				arr.sort( compare );
				Session.set( 'jason',arr );
				console.log( arr );
				console.log( result );
			}
		});
	}
});

Template.Search.helpers({
	officials: function(){
		return Session.get( 'jason' );
	}
});