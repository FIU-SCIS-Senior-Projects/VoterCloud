Session.setDefault('image', 1);
Session.setDefault('jason', null);

Session.setDefault('lat', undefined);
Session.setDefault('lon', undefined);
Session.setDefault('ad', undefined);
Session.setDefault('add', undefined);
Session.setDefault('ip', undefined);
Session.setDefault('elects', undefined);
Session.setDefault('voteing', undefined);

Router.configure({
  layoutTemplate: "layout",
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.route('/', function () {
  this.render('Home');
});

Router.route('/Search', function () {
  this.render('Search');
});

Router.route('/Elections', function () {
  this.render('Elections');
});

Meteor.startup(function() {
    if (Session.get('lat') == undefined 
             || Session.get('lon') == undefined) {
        navigator.geolocation.getCurrentPosition(function(position) {
            Session.set('lat', position.coords.latitude);
            Session.set('lon', position.coords.longitude);
        	var lat,lon;
            lat = position.coords.latitude;
            lon = position.coords.longitude;
			var addresss="";
			Meteor.call('address', lat, lon,  function (error, result) {
				if(error) {
					console.log("error occured on receiving data on server. ", error );
				}
				else {
					addresss = result.results[0].formatted_address;
					Session.set('add', addresss);
					console.log("Printing");
					console.log(addresss);
				}
			});
        });
    	getlocationbyip();
    }

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


		$page.on( transitionEnd, function() {
			$body.removeClass( 'animating left right' )
			$body.toggleClass( 'menu-visible' );
			$page.off( transitionEnd );
		} );

	}
});
function getlocationbyip(){
	$(document).ready(function() {
		$.getJSON("http://www.telize.com/geoip?callback=?",
			function(data) {
				var addresss = data.city+" "+data.region_code+" "+data.postal_code;
				Session.set('ip', addresss);
				console.log("Printing ip");
				console.log(addresss);
			}
		);
	});
}

function gpscordinates()
{

	Session.set( 'ad', Session.get('add') || Session.get('ip') );	
}

function submiting()
{
	console.log( "calling submit" );
	var address;
	if ( Session.get( 'ad' ) != undefined ) {

		address = Session.get('ad');
	}	
	else {
		address = event.target.address.value;
	}

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
								var partyImg = ( hasParty && party != "Unknown" )? "/" + party + ".png" : "/blank.gif";
								var hasPhone = official.hasOwnProperty( 'phones' );
								var phone = ( hasPhone )? official.phones[ 0 ] : "";
								var hasPhoto = official.hasOwnProperty( 'photoUrl' );
								var photo = ( hasPhoto )? official.photoUrl : "";
								var hasFacebook = false;
								var facebook;
								var hasYoutube = false;
								var youtube;
								var hasTwitter = false;
								var twitter;

								if( official.hasOwnProperty( 'channels' ) ) {

									for ( var h = 0; h < official.channels.length; h++ ) {	
										switch ( official.channels[ h ].type )
										{
											case "Twitter":
												twitter = "https://twitter.com/"+official.channels[ h ].id;
												hasTwitter = true;
												break;
											case "Facebook":
												facebook = "https://www.facebook.com/"+official.channels[ h ].id;
												hasFacebook = true;
												break;
											case "YouTube":
												youtube = "https://www.youtube.com/user/"+official.channels[ h ].id;
												hasYoutube = true;
												break;
										}
									}
								}
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
									partyImg: partyImg,
									hasPhone: hasPhone,
									phone: phone,
									hasPhoto: hasPhoto,
									photo: photo,
									tag: tag,
									hasFacebook: hasFacebook,
									facebook: facebook,
									hasYoutube: hasYoutube,
									youtube: youtube,
									hasTwitter: hasTwitter,
									twitter: twitter
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
			console.log( result );
		}
	});
};

Template.Search.events({
	'click #but' : function(event){
		event.preventDefault();
		gpscordinates();
		submiting();
	},
	'submit #Search': function(event){
		event.preventDefault();
		Session.set('ad', undefined);
		submiting();
	}
});


Template.Search.helpers({
	officials: function(){
		return Session.get( 'jason' );
	}
});
Template.Elections.helpers({
	elections: function() {
		elects();
		return Session.get('elects');
		}
	}

);
Template.Elections.events({
	'click #voteing' : function(event){
		event.preventDefault();
		var t=this.ocdDivisionId;
		var p=t.indexOf('state:');
		var add=t.substring(p+6,p+8);
		console.log(t);
		Meteor.call('voteinfo', add, this.id, function (error, result) {
			if(error) {
				console.log("error occured on receiving data on server. ", error );
			}
			else {
				console.log("print the results");
				console.log(result);
				Session.set('voteing',result);
			}
		});
	}
});
Template.votes.helpers({
	voteing: function(event){
		var tt=Session.get('voteing');
		console.log(tt);
		console.log("helper");
		var obg=undefined;
		if(tt){
			if(tt.election.id==this.id) {
				obg={
					isthere: true,
					place: tt.state[0].name,
					absenteeVotingInfoUrl: tt.state[0].electionAdministrationBody.absenteeVotingInfoUrl,
					electionInfoUrl: tt.state[0].electionAdministrationBody.electionInfoUrl,
					electionRegistrationConfirmationUrl: tt.state[0].electionAdministrationBody.electionRegistrationConfirmationUrl,
					electionRegistrationUrl: tt.state[0].electionAdministrationBody.electionRegistrationUrl,
					electionRulesUrl: tt.state[0].electionAdministrationBody.electionRulesUrl,
					forname: tt.state[0].electionAdministrationBody.name,
					votingLocationFinderUrl: tt.state[0].electionAdministrationBody.votingLocationFinderUrl
				};
			}
		}
		console.log(obg);
		return [obg];
	}
});

function elects(){
	Meteor.call('elections', function (error, result) {
		if(error) {
			console.log("error occured on receiving data on server. ", error );
		}
		else {
			console.log(result.elections);
			Session.set('elects', result.elections.slice( 1 ));
		}
	});
}


