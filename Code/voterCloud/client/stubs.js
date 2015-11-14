/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 6
	DESCRIPTION: The same as the server methods, it's purely for efficiency (when the server is down).
*/
Meteor.methods({
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 5
		DESCRIPTION: update MongoDB collection of the polls.
	*/
	mongoDBUpdate: function(id,text,vote){
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
	},
	/*
		AUTHOR AND PROGRAMMER: Eldar Feldbeine.
		SPRINT: 5
		DESCRIPTION: update MongoDB collection of the petition.
	*/
	mongoDBUpdatePeti: function(id, subject, description, image1, Votes, newSupport){
		var temp = Petition.findOne({ _id: id });
		var tempSupport = temp.support;
		tempSupport.push(newSupport);
    	if( Votes <= 0 )
    	{
    		Votes = 0;
    		Meteor.call('mongoDBinsertMesg',{user: "VoterCloudBot", msg: "The petition '"+subject+"' just got supported !", date: new Date(), linkp: id});
    		Meteor.call('mongoDBinsertMesgPeti',{user: "VoterCloudBot", msg: "The petition '"+subject+"' just got supported !", date: new Date(), linkp: id});
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
		var objs=Channels.find({$nor: [
			{messages: {$exists: false}},
			{messages: {$size: 0}}
		] }).fetch();
		_.each(objs, function (obj) {
			if (obj.messages)
				arr.push(obj._id);
		});
		console.log(arr.length);
		return arr;
	}
});