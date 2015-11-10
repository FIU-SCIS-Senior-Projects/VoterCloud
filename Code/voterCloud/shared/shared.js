/*
  AUTHOR AND PROGRAMMER: Eldar Feldbeine.
  SPRINT: 5, 6
  DESCRIPTION: This class is responsible to create and define the different collections.
*/
Polls = new Mongo.Collection('polls'); // declaration of database
Mesg = new Mongo.Collection('mesg'); // declaration of database #general
Petition = new Mongo.Collection('petition'); // declaration of database
MesgPoll = new Mongo.Collection('mesgpll'); // declaration of database #polls
MesgPeti = new Mongo.Collection('mesgpeti'); // declaration of database #survey