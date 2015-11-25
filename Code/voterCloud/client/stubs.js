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
	}
});