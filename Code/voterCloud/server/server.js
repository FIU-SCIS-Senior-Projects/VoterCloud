
Meteor.startup(function(){
    
});

Meteor.methods({
	civicAddress: function (address) {
            var url="https://www.googleapis.com/civicinfo/v2/representatives?address="+address+"&key=AIzaSyAdmDs9YqqhHMh0T_Mr_g895KLvUaLvtd4";
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
