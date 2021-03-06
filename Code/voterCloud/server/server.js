/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 4, 5, 6.
	DESCRIPTION: The global variables for the init.
*/
var Twit;
var T;
var Future;
var webshot;
PDFGenerator = {};
var key;
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 5
	DESCRIPTION: This function is the function prototype of the pdf generator.
*/
PDFGenerator.addTemplates = function(templates) {
  templates.forEach(function(template) {
    SSR.compileTemplate(template.name, Assets.getText(template.path));
  });
}
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 5
	DESCRIPTION: This function is the function prototype of the pdf generator.
*/
PDFGenerator.generateHtml = function(templateName, data) {
  var html = null;
  try {
    html = SSR.render(templateName, data);
  }
  catch (err) {
    console.log("meteor-template-pdf: Unable to generate html, err:", err);
  }
  return html;
}
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 5
	DESCRIPTION: This function/route serve and create the pdf files.
*/
Router.route('/pdf/:_id', function() {
	var tempPeti = Petition.findOne({ _id: this.params._id });
    var PDFData = {
      subject: tempPeti.subject,
      image1: tempPeti.image1,
      description: tempPeti.description,
      Votes: tempPeti.Votes,
      support: tempPeti.support
    };
    if( tempPeti.Votes <= 0 ){
    	var g = tempPeti._id+".pdf";
	    var fs = Meteor.npmRequire('fs');
        var Future = Npm.require('fibers/future');

		if ( fs.existsSync(g) ) 
		{
			console.log("HERE FILE exists !!!!");
            var fut = new Future();
            fs.readFile(g, function (err,data) {
                if (err) {
                    return console.log(err);
                }

                fut.return(data);
            });
			var data2 = fut.wait();

		    this.response.write(data2);
		    this.response.end();
		}
		else {
			console.log("HERE FILE NOTTTTT exists !!!!");
		    var body = PDFGenerator.generateHtml("resultTemplate", PDFData);
		        var options = {
		        	siteType:'html',
		            "paperSize": {
		                "format": "Letter",
		                "orientation": "portrait",
		                "margin": "1cm"
		        }
		    };

	        var fut = new Future();
			webshot(body, g, options, function(err) {
				if(err)
				{
					return console.log(err+" "+g);
				}
	            fs.readFile(g, function (err,data) {
	                if (err) {
	                    return console.log(err+""+g);
	                }

	                fut.return(data);
	            });
			});
			var data2 = fut.wait();

		    this.response.write(data2);
		    this.response.end();
		}
	}
}, {
    where: 'server'
});
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 6
	DESCRIPTION: The accounting user story.
*/
Accounts.onCreateUser(function(options, user) {
  user.participated = [];
  user.zipcode ="";
  if (options.profile)
    user.profile = options.profile;
  return user;
});
//fs.unlinkSync(filename); <---- In case you need to delete the file, here is the command.
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 1, 2, 3, 4, 5
	DESCRIPTION: The server statup, all the functions and objects that must start as server load.
*/
Meteor.startup(function() {
    Twit = Meteor.npmRequire('twit');
    Future = Npm.require('fibers/future');
    webshot = Meteor.npmRequire('webshot');

    T = new Twit({
        consumer_key:         'f3QeBKRsyeuef7glItQNm9QYO',
        consumer_secret:      '773SDImHW8N6pgBWazKiyRCXqT9KboWq8Gz49ZpPF8HH1APcUZ',
        access_token:         '4005437535-k6bCqYDNKr1w0GRSjvgI4BTT88S6oPExWOBRQrR', 
        access_token_secret:  '5YQXLdoHyc7EurvFZfTdQOnXAUJ6Te3VeeftniV4uLsNr'
    });
	/**
	*	TYPE YOUR GOOGLE KEY HERE =======================================
	**/
	key = "AIzaSyAdmDs9YqqhHMh0T_Mr_g895KLvUaLvtd4"; /*<------YOUR KEY-------*/
	/**
	* YOUR GOOGLE API KEY TYPE HERE =====================================
	**/
//autopublish
    Meteor.publish('pollsMesg', function() {
	  return Polls.find({}, {
	    sort: { date: -1 }
	  });
	});
	
	Meteor.publish("messages", function () {
		return Mesg.find({}, {sort: {date: 1}});
	});

	Meteor.publish("chann", function (id) {
		return Channels.find({_id: id});
	});

	Meteor.publish("petit", function () {
		return Petition.find({}, {
			fields: {subject: 1, description: 1, image1: 1, Votes: 1, date: 1},
			sort: {date: -1}
		});
	});

	Meteor.publish("users", function () {
  		return Meteor.users.find({_id: this.userId}, {
  			fields: {"username": 1, "participated": 1, "zipcode" : 1}
  		});
	});
	Meteor.publish("repch", function (id) {
  		return Repch.find({_id: id});
	});
	// For the Server side completion.
	var templates = [];
	templates.push({
		name: "resultTemplate",
		path: "result-template.html" // Check path
	});

	PDFGenerator.addTemplates(templates);

});

/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 1, 2, 3, 4, 5
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
	},
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 5
		DESCRIPTION: update MongoDB collection of the polls.
	*/
	mongoDBUpdate: function(id,text,vote){
		if(this.userId){
			var temp=Meteor.users.findOne({_id:this.userId}).participated;
			if( temp.indexOf(id) == -1){
				Polls.update({  
			        '_id': id,
			        'choices.text': text
			        }, {
			            $set:{ 
			                'choices.$': {
			                    'votes': vote,
			                    'text': text
			                 }
			            }
			        }
		    	);
		    	temp.push(id);
		    	Meteor.users.update(this.userId, {$set: {'participated':temp}});
			}
		}	
	},
		/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 7
		DESCRIPTION: .
	*/
	mongoDBUpdateUser: function(zipcode){
    	Meteor.users.update(this.userId, {$set: {'zipcode':zipcode}});
	},
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 5
		DESCRIPTION: update MongoDB collection of the petition.
	*/
	mongoDBUpdatePeti: function(id, subject, description, image1, Votes, newSupport){
		if(this.userId){
			var tempuser=Meteor.users.findOne({_id:this.userId}).participated;
			if( tempuser.indexOf(id) == -1) {
				var temp = Petition.findOne({ _id: id });
				var tempSupport = temp.support;
				tempSupport.push(newSupport);
		    	if( Votes <= 0 )
		    	{
		    		Votes = 0;
		    		Meteor.call('mongoDBinsertMesg',{user: "VoterCloudBot", msg: "The petition '"+subject+"' just got completely supported !", date: new Date(), linkp: id});
		    	}
				Petition.update({  
			        '_id': id,
			        'subject': subject,
			        'description': description,
			        'image1': image1,
			        'email' : temp.email
			        }, {
			            $set:{ 
			                'support': tempSupport,
			                'Votes': Votes
			            }
			        }
		    	);
		    	tempuser.push(id);
		    	Meteor.users.update(this.userId, {$set: {'participated':tempuser}});
			}
		}
	},
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 6
		DESCRIPTION: inser MongoDB collection of the Poll.
	*/
	mongoDBinsertPoll: function(newPoll){
		Polls.insert(newPoll);
	},
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 6
		DESCRIPTION: inser MongoDB collection of the Message.
	*/
	mongoDBinsertMesg: function(newMesg){
		newMesg.date=new Date();
		Mesg.insert(newMesg);
	},
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 6
		DESCRIPTION: inser MongoDB collection of the Petition.
	*/
	mongoDBinsertPetit: function(newPetit){
		Petition.insert(newPetit);
	},
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 6
		DESCRIPTION: insert MongoDB collection of the channel chat.
	*/
	createChat: function(id){
		Channels.remove( {$or: [
            {messages: {$exists: false}},
            {messages: {$size: 0}}
        ] });
		if(!Channels.findOne({_id: id})){
			Channels.insert({_id: id, messages: []});
		}
	},
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 6
		DESCRIPTION: insert MongoDB collection of the channel chat.
	*/
	mongoDBinsertMesgCH: function(newMesg, id){
		var temp = Channels.findOne({ _id: id });
		var tempSupport = temp.messages;
		tempSupport.push(newMesg);
		Channels.update({  
	        '_id': id
	        }, {
	            $set:{ 
	                'messages': tempSupport,
	            }
	        }
    	);
	},
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 6
		DESCRIPTION: insert MongoDB collection of the channel chat.
	*/
	activeGeohashes: function(){
		var arr=[];
		var objss=Channels.find({$nor: [
			{messages: {$exists: false}},
			{messages: {$size: 0}}
		] });
		var objs;
		if(objss) objs=objss.fetch();
		_.each(objs, function (obj) {
			if (obj.messages)
				arr.push(obj._id);
		});
		console.log(arr.length);
		return arr;
	},
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 6
		DESCRIPTION: Generate Cryptographic hash code using MD5 algorithim.
	*/
	generateHashMD5: function(argument){
		return CryptoJS.MD5(argument).toString();
	},
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 6
		DESCRIPTION: create new ch.
	*/
	createRepCh: function(id){
		Repch.remove( {$or: [
            {messages: {$exists: false}},
            {messages: {$size: 0}}
        ]});
		if(!Repch.findOne({_id: id})){
			Repch.insert({_id: id, messages: []});
		}
	},
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 6
		DESCRIPTION: create new ch.
	*/
	mongoDBinsertMesgRepCH: function(newMesg, id){
		var temp = Repch.findOne({ _id: id });
		console.log(temp);
		console.log("heyy");
		var tempSupport = temp.messages;
		tempSupport.push(newMesg);
		Repch.update({  
	        '_id': id
	        }, {
	            $set:{ 
	                'messages': tempSupport,
	            }
	        }
    	);
	}
});	