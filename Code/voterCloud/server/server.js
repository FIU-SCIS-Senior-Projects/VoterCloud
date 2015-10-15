/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 1, 2, 3, 4
	DESCRIPTION: the diffrent api calls i invoke, with my google api key,
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
		DESCRIPTION: The google map decodeing api, so i can translate lat and lon to real address.
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
		So that i can get the upcomming elections.
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
	}
});

