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
        date: new Date()
      },
      {
        question: 'Do you think Hillary Clinton will be the next president ?',
        choices: [
          { text: 'Yes', votes: 0 },
          { text: 'No', votes: 0 }
        ],
        date: new Date()
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
      Votes: 5,
      date: new Date(),
      support: [
        { firstName: 'Eldar', lastName: 'Feldbeine', address: 'Aventura, florida', signature: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmVyc2lvbj0iMS4xIiB3aWR0aD0iNTMzIiBoZWlnaHQ9IjI1NiI+PHBhdGggc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZT0icmdiKDUxLCA1MSwgNTEpIiBmaWxsPSJub25lIiBkPSJNIDc1IDk1IGMgMC40NyAtMC4zIDE3LjYyIC0xMi4zMSAyNyAtMTcgYyA5Ljc3IC00Ljg4IDIwLjI4IC04LjUyIDMxIC0xMiBjIDE0LjQgLTQuNjcgMjguMSAtOC4yMyA0MyAtMTIgYyAxMy42OSAtMy40NiAyNi40OSAtNy4wOSA0MCAtOSBjIDE0Ljg2IC0yLjEgMjkuNTYgLTIuNTYgNDUgLTMgYyAyMC41NSAtMC41OSA0MC4yOCAtMC45NyA2MCAwIGMgNy4wMyAwLjM1IDE0LjY4IDEuOTYgMjEgNCBjIDMuNDUgMS4xMSA3LjM0IDMuNzIgMTAgNiBjIDEuNjUgMS40MSAzLjQ3IDQuMDIgNCA2IGMgMC42NiAyLjQ3IDAuNDkgNi4xNyAwIDkgYyAtMC44IDQuNTggLTIuMDYgOS43MiAtNCAxNCBjIC0yLjkzIDYuNDUgLTYuOSAxMi43OSAtMTEgMTkgYyAtNS43NSA4LjcyIC0xMS4yMiAxNy40MiAtMTggMjUgYyAtMTAuMTIgMTEuMzIgLTIxLjc2IDIzLjAxIC0zMyAzMiBjIC00LjYgMy42OCAtMTEuNjkgNi4wNyAtMTcgOCBjIC0xLjQxIDAuNTEgLTQuNTcgMC42NSAtNSAwIGMgLTAuNTMgLTAuNzkgMC4zIC00LjI0IDEgLTYgYyAxLjE5IC0yLjk4IDIuNzkgLTYuNiA1IC05IGMgOS4yOCAtMTAuMDUgMTkuOTggLTIwLjcgMzEgLTMwIGMgMTAuNDMgLTguOCAyMS40MyAtMTYuNTEgMzMgLTI0IGMgMTEuNDMgLTcuNCAyMi44MSAtMTMuOTEgMzUgLTIwIGMgMTIuODYgLTYuNDMgMjUuNiAtMTIuMTEgMzkgLTE3IGMgMTEuNDYgLTQuMTggMjIuOTQgLTYuOTMgMzUgLTEwIGMgOC4xMiAtMi4wNyAxNS45MSAtMy44MiAyNCAtNSBjIDUuNjIgLTAuODIgMTEuMjcgLTAuNDEgMTcgLTEgYyA0LjA5IC0wLjQyIDguMTYgLTEuOCAxMiAtMiBjIDIuMjMgLTAuMTIgNS40NyAtMC4wMiA3IDEgYyAxLjg2IDEuMjQgNC4yMyA0LjU4IDUgNyBjIDEuMzYgNC4yNiAxLjk0IDkuOTUgMiAxNSBjIDAuMjcgMjIuNjkgMC42MyA0NS4zNyAtMSA2OCBjIC0xLjA0IDE0LjUgLTMuNjMgMjguODUgLTcgNDMgYyAtMy4zMyAxMy45NyAtNy44OSAyNy4zNyAtMTMgNDEgYyAtNS4wNiAxMy40OCAtOS4yMiAzNC45MyAtMTcgMzkgYyAtOC40OCA0LjQ0IC00My4wNyAwLjU5IC00NiAtNiBjIC0zLjc3IC04LjQ5IDEwLjk3IC0zNy44NCAxOCAtNTcgYyAxMC40IC0yOC4zMyAyMC43NiAtNTQuMTggMzMgLTgyIGMgMTYuNjYgLTM3Ljg4IDUxIC0xMDkgNTEgLTEwOSIvPjxwYXRoIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2U9InJnYig1MSwgNTEsIDUxKSIgZmlsbD0ibm9uZSIgZD0iTSAzNzggMTk1IGMgLTAuMDkgLTAuMDMgLTMuMzIgLTEuODggLTUgLTIgYyAtMTkuOTkgLTEuNDUgLTQyLjI0IC0xLjE2IC02NCAtMyBjIC0xOC40OSAtMS41NyAtMzUuNjggLTMuOCAtNTQgLTcgYyAtMjQuNzQgLTQuMzIgLTQ3LjQ3IC05LjM0IC03MiAtMTUgYyAtMTEuMDkgLTIuNTYgLTIxLjE3IC01LjQyIC0zMiAtOSBjIC0yOC42NCAtOS40NiAtNTQuNyAtMTguNjIgLTgzIC0yOSBjIC05LjA5IC0zLjMzIC0xNy40NiAtNi43MyAtMjYgLTExIGMgLTEyLjQ1IC02LjIzIC0yNS43NCAtMTMuMzMgLTM2IC0yMCBjIC0xLjggLTEuMTcgLTMuMTYgLTMuOTggLTQgLTYgbCAtMSAtNiIvPjwvc3ZnPg=="}
      ]
    };
    Petition.insert(firstPetition);
  }

});