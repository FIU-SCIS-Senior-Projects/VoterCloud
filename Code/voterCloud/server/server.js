/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 4
	DESCRIPTION: The twitter keys, to initilize the api credential !.
*/
var Twit;
var T;
var Future;
Meteor.startup(function() {
    Twit = Meteor.npmRequire('twit');
    Future = Npm.require('fibers/future');
    T = new Twit({
        consumer_key:         'f3QeBKRsyeuef7glItQNm9QYO',
        consumer_secret:      '773SDImHW8N6pgBWazKiyRCXqT9KboWq8Gz49ZpPF8HH1APcUZ',
        access_token:         '4005437535-k6bCqYDNKr1w0GRSjvgI4BTT88S6oPExWOBRQrR', 
        access_token_secret:  '5YQXLdoHyc7EurvFZfTdQOnXAUJ6Te3VeeftniV4uLsNr'
    });
});

/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 1, 2, 3, 4
	DESCRIPTION: the different api calls i invoke, with my google api key,
	so make sure YOU CHANGE THE KEY FOR YOUR OWN KEY.
*/
Meteor.methods({
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 2
		DESCRIPTION: the google representatives api.
	*/
	civicAddress: function (address) {
			/**
			*	TYPE YOUR GOOGLE KEY HERE =======================================
			**/
			var key = "AIzaSyAdmDs9YqqhHMh0T_Mr_g895KLvUaLvtd4"; /*<------YOUR KEY-------*/
			/**
			* YOUR GOOGLE API KEY TYPE HERE =====================================
			**/
            var url="https://www.googleapis.com/civicinfo/v2/representatives?address="+address+"&key="+key;
            var ret= Meteor.http.call("GET", url);
			if(ret.statusCode==200) {
				var respJson = JSON.parse(ret.content);
				console.log("response received.");
				return respJson;
			} else {
				console.log("Response issue: ", ret.statusCode);
				var errorJson = JSON.parse(ret.content);
				throw new Meteor.Error(ret.statusCode, errorJson.error);
			}

        },
    /*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 2
		DESCRIPTION: The google map decoding api, so i can translate lat and lon to real address.
	*/
    address: function(lat,lon) {
    		/**
			*	TYPE YOUR GOOGLE KEY HERE =======================================
			**/
			var key = "AIzaSyAdmDs9YqqhHMh0T_Mr_g895KLvUaLvtd4"; /*<------YOUR KEY-------*/
			/**
			* YOUR GOOGLE API KEY TYPE HERE =====================================
			**/
			var url="https://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lon+"&key="+key;
			var ret= Meteor.http.call("GET", url);
			if(ret.statusCode==200) {
				var respJson = JSON.parse(ret.content);
				console.log("response received.");
				return respJson;
			} else {
				console.log("Response issue: ", ret.statusCode);
				var errorJson = JSON.parse(ret.content);
				throw new Meteor.Error(ret.statusCode, errorJson.error);
			}
    	},
    /*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 3
		DESCRIPTION: the google civic api' of election
		So that i can get the upcoming elections.
	*/
    elections: function() {
			/**
			*	TYPE YOUR GOOGLE KEY HERE =======================================
			**/
			var key = "AIzaSyAdmDs9YqqhHMh0T_Mr_g895KLvUaLvtd4"; /*<------YOUR KEY-------*/
			/**
			* YOUR GOOGLE API KEY TYPE HERE =====================================
			**/
			var url="https://www.googleapis.com/civicinfo/v2/elections?key="+key;
			var ret= Meteor.http.call("GET", url);
			if(ret.statusCode==200) {
				var respJson = JSON.parse(ret.content);
				console.log("response received.");
				return respJson;
			} else {
				console.log("Response issue: ", ret.statusCode);
				var errorJson = JSON.parse(ret.content);
				throw new Meteor.Error(ret.statusCode, errorJson.error);
			}
		},
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 3
		DESCRIPTION: the voting info api so that i can get more details of each election.
	*/
    voteinfo: function(address,electionId) {
			/**
			*	TYPE YOUR GOOGLE KEY HERE =======================================
			**/
			var key = "AIzaSyAdmDs9YqqhHMh0T_Mr_g895KLvUaLvtd4"; /*<------YOUR KEY-------*/
			/**
			* YOUR GOOGLE API KEY TYPE HERE =====================================
			**/
			var url="https://www.googleapis.com/civicinfo/v2/voterinfo?address="+address+"&electionId="+electionId+"&key="+key;
			var ret= Meteor.http.call("GET", url);
			if(ret.statusCode==200) {
				var respJson = JSON.parse(ret.content);
				console.log("response received.");
				return respJson;
			} else {
				console.log("Response issue: ", ret.statusCode);
				var errorJson = JSON.parse(ret.content);
				throw new Meteor.Error(ret.statusCode, errorJson.error);
			}
		},
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 4
		DESCRIPTION: facebook api, so that i can get the REP image profile.
	*/
	facebookImage: function(nameId){
			var url="https://graph.facebook.com/v2.5/"+nameId+"/picture?width=150&height=150&redirect=0";
			var ret= Meteor.http.call("GET", url);
			if(ret.statusCode==200) {
				var respJson = JSON.parse(ret.content);
				console.log("response received.");
				return [respJson.data.url, nameId];
			} else {
				console.log("Response issue: ", ret.statusCode);
				var errorJson = JSON.parse(ret.content);
				throw new Meteor.Error(ret.statusCode, errorJson.error);
			}
		},
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 4
		DESCRIPTION: imageSearch api, so that i can get the REP image profile, using some third party libary api.
	*/
	imageSearch: function(name, division, arg3){
			var queryy=name+" "+division+" "+arg3;
			var url = "http://freeimages.pictures/api/user/4713148680515587/?keyword="+queryy+"&format=json&sources=google";
			var ret= Meteor.http.call("GET", url);
			if(ret.statusCode==200) {
				var respJson = JSON.parse(ret.content);
				console.log("response received.");
				return [respJson.sources[0].result[0].preview_url, name];
			} else {
				console.log("Response issue: ", ret.statusCode);
				var errorJson = JSON.parse(ret.content);
				throw new Meteor.Error(ret.statusCode, errorJson.error);
			}
		},
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 4
		DESCRIPTION: wikipedia api, so that i can get the REP image profile, for the ones that don't have facebook or twitter.
	*/
	wikiImages: function(name, query){
			var secondTry = true;
			var newname=name.replace(' ','_');
			var url = "https://en.wikipedia.org/w/api.php?action=query&titles="+newname+"&prop=pageimages&format=json";
			var ret= Meteor.http.call("GET", url);
			if(ret.statusCode==200) {
				secondTry = false;
				var respJson = JSON.parse(ret.content);
				console.log("response received.");

				var obg=respJson.query.pages;
				var obg2;
				for (var prop in obg) {
				    obg2=obg[prop]
				    break;
				}
				if( obg2.hasOwnProperty( 'thumbnail' ) )
				{
					var obg3=obg2.thumbnail.source;
					var imageurl=obg3.indexOf('.jpg/')+5;
					var temp=obg3.substring(0,imageurl)+"150"+obg3.substring(imageurl+2);
					return [temp, name];
				}
				else {
					secondTry = true;
				}
			} 
			if ( (ret.statusCode!=200) || secondTry )
			{
				var fut = new Future();
				T.get('users/search', {
				  q: query,
				  page: 1,
				  count: 1
				}, function(err, data) {
					if(err)
				    	throw err;
				    else {
				    	fut.return ( ( data.length >= 1 ) ? [data[0].profile_image_url.replace("_normal",""), name] : ["", ""] );
				    }
				});
				return fut.wait();/*
				console.log("Response issue: ", ret.statusCode);
				var errorJson = JSON.parse(ret.content);
				throw new Meteor.Error(ret.statusCode, errorJson.error);*/
			}
		},
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 4
		DESCRIPTION: twitter api, so that i can get the REP image profile, the credential are in the server startup !.
	*/
	twitterImage: function(twitterId){
			// Get the user info
			var fut = new Future();
			T.get('users/show', {
			  screen_name: twitterId
			}, function(err, data) {
				if(err)
			    	throw err;
			    else{
			    	fut.return ([data.profile_image_url.replace("_normal",""), twitterId]);
			    }
			});
			return fut.wait();
		}

});	