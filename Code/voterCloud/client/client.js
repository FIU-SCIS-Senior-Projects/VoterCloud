/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 1
	DESCRIPTION: I set out the Sessions and router configuration to do routing and
	transitions. It's done during sprint 1.
*/
Session.setDefault('image', 1);
Session.setDefault('jason', null);

Session.setDefault('lat', undefined);
Session.setDefault('lon', undefined);
Session.setDefault('ad', undefined);
Session.setDefault('add', undefined);
Session.setDefault('ip', undefined);
Session.setDefault('elects', undefined);
Session.setDefault('voting', undefined);
Session.setDefault('fcimage', []);
Session.setDefault('twimage', []);
Session.setDefault('images', []);
Session.setDefault('PollMesg1', "");
Session.setDefault('PollMesg2', "");
Session.setDefault('PollMesg3', "");
Session.setDefault('plus', false);
Session.setDefault('askPoll', false);
Session.setDefault('PetitionMesg1', "");
Session.setDefault('PetitionMesg2', "");
Session.setDefault('PetitionMesg3', "");
Session.setDefault('PetitionMesg4', "");
Session.setDefault('PetitionMesg5', "");
Session.setDefault('askPetition', false);
Session.setDefault('supportPetition', false);
Session.setDefault('petiMesg1', "");
Session.setDefault('petiMesg2', "");
Session.setDefault('petiMesg3', "");
Session.setDefault('petiMesg4', "");
Session.setDefault('tempData', "");

Router.configure({
  layoutTemplate: "layout",
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.route('/', function () {
  this.render('Home');
});

Router.route('/MyProfile', function() {
  this.render('MyProfile');
});

Router.route('/Search', function () {
  this.render('Search');
});

Router.route('/Elections', function () {
  this.render('Elections');
});
Router.route('/About', function () {
  this.render('About');
});
Router.route('/Survey', function () {
  this.render('Survey');
});

Router.route('/Survey/:_id', {
    name: 'pollPage',
    template: 'pollPage',
    data: function(){
        var currentPoll = this.params._id;
        return Polls.findOne({ _id: currentPoll });
    }
});

Router.route('/Petition', function () {
  this.render('Petition');
});

Router.route('/Petition/:_id', {
    name: 'PetitionPage',
    template: 'PetitionPage',
    data: function(){
        var currentPetition = this.params._id;
        return Petition.findOne({ _id: currentPetition });
    }
});

/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 2
	DESCRIPTION: The meteor startup is the initialize functions that are run before any
	other functions. I wrote here mainly the gps call to get the device coordinates.
*/
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

    Accounts.ui.config({
    	requestPermissions: {
    		facebook: ['email']
    	},
    	passwordSignupFields: 'USERNAME_AND_EMAIL'
    });

    Meteor.subscribe('pollsMesg');
    Meteor.subscribe('messages');
    Meteor.subscribe('petit');
});

/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 2
	DESCRIPTION: Here i put the menu transitions, so it match perfectly with the css, Take notice its
	using JQuery.
*/
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
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 3
	DESCRIPTION: Here I get the location address by IP Locations. Calling here a different api
	that give me the address from the IP.
*/
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
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 3
	DESCRIPTION: I set the session so that i can move the data between templates.
*/
function gpscordinates()
{

	Session.set( 'ad', Session.get('add') || Session.get('ip') );	
}

/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 2
	DESCRIPTION: Here i wrote the code that implemented the main logic of the Representatives,
	It using 2 different api's calls and three level loop parsing to convert the data to more readble format.
*/
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
								var hasface = false;
								var faceId;
								var hastwit = false;
								var twittId;

								if( official.hasOwnProperty( 'channels' ) ) {

									for ( var h = 0; h < official.channels.length; h++ ) {	
										switch ( official.channels[ h ].type )
										{
											case "Twitter":
												twitter = "https://twitter.com/"+official.channels[ h ].id;
												hasTwitter = true;
												twittId = official.channels[ h ].id;
												break;
											case "Facebook":
												facebook = "https://www.facebook.com/"+official.channels[ h ].id;
												hasFacebook = true;
												faceId = official.channels[ h ].id;
												break;
											case "YouTube":
												youtube = "https://www.youtube.com/user/"+official.channels[ h ].id;
												hasYoutube = true;
												break;
										}
									}
								}

								switch( true )
								{
									case ( !hasPhoto && hasTwitter ):
										hastwit = true;
										Meteor.call('twitterImage', twittId,  function (error, result2) {
											if(error) {
												console.log("error occured on receiving data on server. ", error );
											}
											else {
												var ppp=Session.get('twimage');
												ppp.push(result2);
												Session.set('twimage',ppp);
											}
										});
										break;
									case ( !hasPhoto && hasFacebook ):
										hasface = true;
										Meteor.call('facebookImage', faceId,  function (error, result) {
											if(error) {
												console.log("error occured on receiving data on server. ", error );
											}
											else {
												var ppp=Session.get('fcimage');
												ppp.push(result);
												Session.set('fcimage',ppp);
											}
										});
										break;
									case ( !hasPhoto ): // wikipedia api call and twitter search api
										//I did two options calls functions wikiImages, imageSearch
										Meteor.call('wikiImages', officialName, (officialName+" "+officeName),  function (error, result) {
											if(error) {
												console.log("error occured on receiving data on server of wikiimages. ", error );
											}
											else {
												var ppp = Session.get('images');
												ppp.push(result);
												Session.set('images', ppp);
											}
										});
										break;
								}
								/**
								* I PUTTED HERE ALL THE PROPERTIES OF THE OBJECT DESCRIBED HERE !! FOR EACH OFFICIAL !!
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
									twitter: twitter,
									hasface: hasface,
									faceId: faceId,
									hastwit : hastwit,
									twittId : twittId
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
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 3
	DESCRIPTION: event click template, for the gps cordinates.
*/
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
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 3
	DESCRIPTION: Helper for the image.
*/
Template.imagesGen.helpers({
	images: function(){
		var t = Session.get('images');
		if(t) {
			for( var i = 0; i < t.length; i++ )
			{
				if(this.officialName==t[i][1])
					return t[i][0];
			}
		}
	}
});
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 4
	DESCRIPTION: I wrote this function so that i can get the facebook image,
	for the profile of the representatives.
*/
Template.facebookImage.helpers({
	fcimage: function(){
		//console.log("INSIDE the LOG");
		var t=Session.get('fcimage');
		if(t) {
			for (var i = 0; i < t.length; i++) {
				if(this.faceId==t[i][1]){
					return t[i][0];
				}
			}

		}
	}
});
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 4
	DESCRIPTION: I wrote this function so that i can get the twitter image,
	for the profile of the representatives.
*/
Template.twitterImage.helpers({
	twimage: function(){
		//console.log("INSIDE the LOG");
		var t=Session.get('twimage');
		if(t) {
			for (var i = 0; i < t.length; i++) {
				if(this.twittId==t[i][1]){
					return t[i][0];
				}
			}

		}
	}
});
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 2
	DESCRIPTION: this function i wrote mainly because it's provide better scoping and
	template organization.
*/
Template.Search.helpers({
	officials: function(){
		return Session.get( 'jason' );
	}
});
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 3
	DESCRIPTION: I wrote this function mainly to get the elections from the google api's
	it's using two different api's.
*/
Template.Elections.helpers({
	elections: function() {
		elects();
		return Session.get('elects');
		}
	}

);
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 3
	DESCRIPTION: This function i wrote so it gives you more detail information of each election,
	here is the second google api, the way i did it so because based on the term and condition of google apis' it
	has to be user invoked.
*/
Template.Elections.events({
	'click #voting' : function(event){
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
				console.log("print the results of voteing");
				console.log(result);
				Session.set('voting',result);
			}
		});
	}
});
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 3
	DESCRIPTION: The function that parse the api result of the voting information,
	So that i can get more clear details of the elections.
*/
Template.votes.helpers({
	voting: function(event){
		var tt=Session.get('voting');
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
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 3
	DESCRIPTION: This function is mostly written for the api call of elections,
	look at the server file for more details.
*/
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
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 5
	DESCRIPTION: This function was written for the survey user story, Here i send the various messages and conditions
	for the form input.
*/
Template.Survey.helpers({
	PollMesg1: function(){
		return Session.get( 'PollMesg1' );
	},
	PollMesg2: function(){
		return Session.get( 'PollMesg2' );
	},
	PollMesg3: function(){
		return Session.get( 'PollMesg3' );
	},
	plus: function(){
		return Session.get('plus');
	},
	askPoll: function(){
		return Session.get('askPoll');
	},
	polls: function(){
		return Polls.find({});
	}
});
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 5
	DESCRIPTION: This function was written for the survey user story, Here i deal with the events.
*/
Template.Survey.events({
	'submit #Poll': function( event ){
		event.preventDefault( );
		var mesg1 = "";
		var pass = true;
		if( !event.target.Question.value ) {mesg1 = "*Please type a Question."; pass = false;}
		Session.set( 'PollMesg1', mesg1 );
		var mesg2 = "";
		if( !event.target.Answer1.value ) {mesg2 = "*Please type a Answer1."; pass = false;}
		Session.set( 'PollMesg2', mesg2 );
		var mesg3 = "";
		if( !event.target.Answer2.value ) {mesg3 = "*Please type a Answer2."; pass = false;}
		Session.set( 'PollMesg3', mesg3 );
		if(pass)
		{
			console.log("inserting new Record!!!!!");
		    var newPoll = {
		      question: event.target.Question.value,
		      choices: [
		        {  text: event.target.Answer1.value, votes: 0},
		        {  text: event.target.Answer2.value, votes: 0}
		      ],
		      date: new Date(),
		      totalClicks: 0
		    };
		    if(event.target.Answer3.value)	newPoll.choices.push({text: event.target.Answer3.value, votes: 0});
		    if(Session.get('plus'))
		    {
			    if(event.target.Answer4.value)	newPoll.choices.push({text: event.target.Answer4.value, votes: 0}); 
			    if(event.target.Answer5.value)	newPoll.choices.push({text: event.target.Answer5.value, votes: 0});   
			    if(event.target.Answer6.value)	newPoll.choices.push({text: event.target.Answer6.value, votes: 0}); 
			}
		     
		    Polls.insert(newPoll);
		    console.log(newPoll.date);
		    Session.set('askPoll', false);
		}
	},
	'click #plus': function(event){
		event.preventDefault( );
		Session.set('plus', true);
	},
	'click #askPoll': function(event){
		event.preventDefault( );
		Session.set('askPoll', true);
	}
});
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 5
	DESCRIPTION: This function was written for the survey user story, Here i deal with the events.
*/
Template.poll.events({
	'click #choice': function(event){
		event.preventDefault( );

		var votes = this.votes+1;
		console.log(votes+" "+this.text);
		var pollID = $(event.currentTarget).parent('.poll').data('id');
		console.log(pollID);
		console.log($(event.currentTarget).parent('.poll').data('totalClicks'));
		//Polls.update({_id : pollID, choices.text: this.text }, {$set: {choices: votes}});
		Meteor.call('mongoDBUpdate',pollID,this.text,votes, function (error, result) {
			if(error) {
				console.log("error occured on receiving data on server. ", error );
			}
			else {
				console.log('Sucess');
			}
		});
    	console.log("updated sucssefuly");
	}
});
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 5
	DESCRIPTION: This function was written for the survey user story, Here i deal with the events.
*/
Template.pollPage.events({
	'click #choice': function(event){
		event.preventDefault( );

		var votes = this.votes+1;
		console.log(votes+" "+this.text);
		var pollID = $(event.currentTarget).parent('.poll').data('id');
		console.log(pollID);
		console.log($(event.currentTarget).parent('.poll').data('totalClicks'));
		//Polls.update({_id : pollID, choices.text: this.text }, {$set: {choices: votes}});
		Meteor.call('mongoDBUpdate',pollID,this.text,votes, function (error, result) {
			if(error) {
				console.log("error occured on receiving data on server. ", error );
			}
			else {
				console.log('Sucess');
			}
		});
    	console.log("updated sucssefuly");
	}
});
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 5
	DESCRIPTION: This function was written for the room chat user story, Here i deal with the events.
*/
Template.chat.events({
	'submit #sendMsg': function( e ){
		e.preventDefault( );
		var temp = Meteor.user() || {username: 'guest'};//.username
		Mesg.insert({user: temp.username, msg: e.target.msg.value, date: new Date()});
		e.target.msg.value="";
		console.log("inserted the object");
	}
});
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 5
	DESCRIPTION: This function was written for the room chat user story, Here i deal with the guide.
*/
Template.chat.helpers({
	messagess: function(){
		return Mesg.find({});
	}
});
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 5
	DESCRIPTION: This function was written for the Petition user story.
*/
Template.Petition.events({
	'submit #Petition': function( event ){
		event.preventDefault( );
		var mesg1 = "";
		var pass = true;
		if( !event.target.Subject.value ) {mesg1 = "*Please type a Subject."; pass = false;}
		Session.set( 'PetitionMesg1', mesg1 );
		var mesg2 = "";
		if( !event.target.Description.value ) {mesg2 = "*Please type a Description"; pass = false;}
		Session.set( 'PetitionMesg2', mesg2 );
		var mesg3 = "";
		if( !event.target.Image1.value ) {mesg3 = "*Please type a Image Url !"; pass = false;}
		Session.set( 'PetitionMesg3', mesg3 );
		var mesg4 = "";
		if( !event.target.Email.value ) {mesg4 = "*Please type a Email to send!"; pass = false;}
		Session.set( 'PetitionMesg4', mesg4 );
		var mesg5 = "";
		if( !event.target.Votes.value ) {mesg5 = "*Please type the number of voters needed"; pass = false;}
		Session.set( 'PetitionMesg5', mesg5 );
		if(pass)
		{
			console.log("inserting new Record for petition!!!!!");
		    var newPetition = {
		      subject: event.target.Subject.value, 
		      description: event.target.Description.value, 
		      image1: event.target.Image1.value,
		      email: event.target.Email.value,
		      Votes: event.target.Votes.value,
		      date: new Date(),
		      support: [ ]
		    };
    		Petition.insert(newPetition);

		    Session.set('askPetition', false);
		}
	},
	'click #askPetition': function(event){
		event.preventDefault( );
		Session.set('askPetition', true);
	}	
});
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 5
	DESCRIPTION: This function was written for the Petition user story, here are the helpers.
*/
Template.Petition.helpers({
	askPetition: function(){
		return Session.get('askPetition');
	},
	PetitionMesg1: function(){
		return Session.get('PetitionMesg1');
	},
	PetitionMesg2: function(){
		return Session.get('PetitionMesg2');
	},
	PetitionMesg3: function(){
		return Session.get('PetitionMesg3');
	},
	PetitionMesg4: function(){
		return Session.get('PetitionMesg4');
	},
	PetitionMesg5: function(){
		return Session.get('PetitionMesg5');
	},
	Petitions: function(){
		return Petition.find({});
	}
});

//jSignature
var $sigdiv; // The signature
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 5
	DESCRIPTION: This function was written for the Petition user story, here it's init the signature canvas.
*/
Template.Signature.rendered = function() {
    if(!this._rendered) {
		this._rendered = true;
		$(document).ready(function () {
			$sigdiv = $('#signature');
			$sigdiv.jSignature();
			$sigdiv.jSignature("reset");
		});
    }
}
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 5
	DESCRIPTION: This function was written for the Petition user story, event to change pages.
*/
Template.peti.events({
	'click #supportPetition': function(event){
		Session.set('supportPetition', true);
	}
});

/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 5
	DESCRIPTION: This function was written for the Petition user story, the main Petition sign user is done here.
*/
Template.PetitionPage.events({
	'click #supportPetition': function(event){
		event.preventDefault( );
		Session.set('supportPetition', true);
	},
	'submit #Peti': function( event ){
		event.preventDefault( );
		var mesg1 = "";
		var pass = true;
		if( !event.target.First.value ) {mesg1 = "*Please type a First Name."; pass = false;}
		Session.set( 'petiMesg1', mesg1 );
		var mesg2 = "";
		if( !event.target.Last.value ) {mesg2 = "*Please type a Last Name"; pass = false;}
		Session.set( 'petiMesg2', mesg2 );
		var mesg3 = "";
		if( !event.target.Address.value ) {mesg3 = "*Please type a Address !"; pass = false;}
		Session.set( 'petiMesg3', mesg3 );

		var imageCode;
		$(document).ready(function () {
			var datapair = $sigdiv.jSignature("getData", "svgbase64"); 
			imageCode = "data:" + datapair[0] + "," + datapair[1];
			console.log(imageCode);
		});

		var mesg4 = "";
		var empty="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iMCIgaGVpZ2h0PSIwIj48L3N2Zz4=";
		if(imageCode==empty){
			pass = false;
			mesg4 = "*Please sign using your signature.";
		}
		Session.set( 'petiMesg4', mesg4 );

		if(pass)
		{
			console.log("inserting new Record for petition!!!!!");
		    var newSupport = {
		    	firstName: event.target.First.value,
		    	lastName: event.target.Last.value,
		    	address: event.target.Address.value,
		    	signature: imageCode
		    };
		    var votesLeft = this.Votes-1;
		    var tempSupport = this.support;
		    tempSupport.push( newSupport );
    		Meteor.call('mongoDBUpdatePeti', this._id, this.subject, this.description, this.image1, this.email, votesLeft, tempSupport,  function (error, result) {
				if(error) {
					console.log("error occured on receiving data on server. ", error );
				}
				else {
					console.log('Sucess');
				}
			});
		    Session.set('supportPetition', false);
		    $sigdiv = null;
		    Router.go('Petition');
		}
	}
});
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 5
	DESCRIPTION: This function was written for the Petition user story, the helpers for the sign of user.
*/
Template.PetitionPage.helpers({
	supportPetition: function(){
		return Session.get('supportPetition');
	},
	petiMesg1: function(){
		return Session.get('petiMesg1');
	},
	petiMesg2: function(){
		return Session.get('petiMesg2');
	},
	petiMesg3: function(){
		return Session.get('petiMesg3');
	},
	petiMesg4: function(){
		return Session.get('petiMesg4');
	}
});