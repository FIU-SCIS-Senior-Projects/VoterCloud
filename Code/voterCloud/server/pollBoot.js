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
        date: new Date().toLocaleString(),
        totalClicks: 0
      },
      {
        question: 'Do you think Hillary Clinton will be the next president ?',
        choices: [
          { text: 'Yes', votes: 0 },
          { text: 'No', votes: 0 }
        ],
        date: new Date().toLocaleString(),
        totalClicks: 0
      }
    ];

    // loop over each sample poll and insert into database
    _.each(firstPolls, function(poll) {
      Polls.insert(poll);
    });

  }

});