.meteor/
	packages - meteor packages that this projects is using (like bootstrap, geohash ...).

client/ - The files that can be seen by the user
	
	vendor/
		eventemitter2.js - javascript package i am using for event creation
	
	views/
		localizeme.html - map locality user story(view)
	
		localizeme.js - map locality user story logic(controller)
	
	client.js - The main logic is done here, of all the user stories, this is the most imortant file since it's contian all the logic.
	
	stubs.js - for efficency reasons, it's a clone of the database server, in case the ddp protocol meteor.

private/ - it's private, the user can not see it, it used only by the server.
	
	result-template.html - template for the pdf user story, the html for the pdf.

public/ - contains all the images of this application.
	
	images - diffrent images used in this application.

server/ - the server folder, can not be seen by the user.
	
	mongoBoot.js - the boot file that init the mongoDB database.
	
	server.js - the second most important file, since it's contains all the logic that done in the server.

shared/ - the shared folder can seen both by the client and the server, its the database directory.
	shared.js - the declaration of the mongoDB collections.

packages.json - nodeJs NPM packages i used in the server.

votercloud.css - the complete css and desgin for the application.

votercloud.html - the complete view of the logic and presentation.

Please don't touch the other folder and files since they are part of meteor build framework.
