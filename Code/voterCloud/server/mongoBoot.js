/*
  AUTHOR AND PROGRAMMER: Eldar Feldbeine.
  SPRINT: 5
  DESCRIPTION: This class is responsible to boot and init the different collections.
*/
Meteor.startup(function() {

  if (Polls.find().count() === 0) {

    var firstPolls = [
      {
        question: 'What you think about your representatives ?',
        choices: [
          { text: 'I am happy with them', votes: 0 },
          { text: 'I am not satisfy with them', votes: 0 },
          { text: 'No, opinion', votes: 0 }
        ],
        date: new Date(),
        totalClicks: 0
      },
      {
        question: 'Do you think Hillary Clinton will be the next president ?',
        choices: [
          { text: 'Yes', votes: 0 },
          { text: 'No', votes: 0 }
        ],
        date: new Date(),
        totalClicks: 0
      }
    ];

    // loop over each sample poll and insert into database
    _.each(firstPolls, function(poll) {
      Polls.insert(poll);
    });

  }

  if (Mesg.find().count() === 0) {
    var firstMesg= {user:'VoterCloudBot', msg: "Welcome", date: new Date()};
    Mesg.insert(firstMesg);
    var secondMesg= {user:'VoterCloudBot', msg: "Please log-in or sign-up", date: new Date()};
    Mesg.insert(secondMesg);
  }

  if (Petition.find().count() === 0) {
    var firstPetition = {
      subject: 'Build a bridge from Aventura to FIU MMC', 
      description: "As a concern citizen, i would like to have a special and empty bridge from Aventura to FIU MMC, since personally i am driving 4 times a week to FIU MMC and i would like it to be faster and convenient.", 
      image1: "https://s-media-cache-ak0.pinimg.com/236x/e2/09/0f/e2090fa3de58b7ae0521ca0e57a30af7.jpg",
      email: "fiuAdmin@fiu.edu",
      Votes: 10,
      date: new Date(),
      support: [
        { firstName: 'Eldar', lastName: 'Aventura', address: 'Aventura, florida', signature: 'None'}
      ]
    };
    Petition.insert(firstPetition);
  }

});