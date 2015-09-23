
Meteor.startup(function(){
    
});

Meteor.methods({
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

        }
});
/*https://gist.github.com/nachiket-p/2922814#file-app-js-L12*/
