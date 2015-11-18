/*
	MODIFIED BY: Eldar Feldbeine.
	SPRINT: 6
	DESCRIPTION: google map logic and user story, Some of the code here are inspired by othe sources such as the geo decoding to hash.
*/	
var map = undefined;
var markersArray = [];
var markersArrayh = [];

em = new EventEmitter2();

em.on('map-ready', function () {
	console.log('map-ready');
	placeSquare( Session.get('default-chat') );
});

em.on('new-coords', function(lat, lon) {
	Session.set('default-chat', geohash.encode(lat, lon, 5) );
	placeMarker(lat, lon);
	var newChat = Session.get('default-chat');
	placeSquare( newChat );
	Meteor.call('createChat', newChat );
});

em.on('readylatlon', function(){
	if(!Session.get('lon')||!Session.get('maprendered'))
		console.log('Wait');//em.emit('map-ready');
	else{
		em.emit('new-coords', Session.get('lat'), Session.get('lon'));
		em.emit('active');
	}
});
em.on('active',function(){
	Meteor.call('activeGeohashes', function (err,data) {
    	if(!err&&data&&data.length!=0){
	    	Session.set('activeGeohashes', data);
	    
	    	placeMarkers();
		}
  	});
});

deleteOverlays = function () {
	if (markersArray) {
		for (i in markersArray) {
			markersArray[i].setMap(null);
		}
		markersArray.length = 0;
	}
}

placeMarker = function (lat, lon) {
	if(map) {
		var location = new google.maps.LatLng(lat, lon);

		marker = new google.maps.Marker({
			position: location,
			draggable: true,
			map: map
		});

		markersArray.push(marker);

		google.maps.event.addListener(marker, 'dragend', function(ev) {
			em.emit('new-coords', ev.latLng.lat(), ev.latLng.lng());
		});

	    google.maps.event.addListener(marker, 'click', function() {
	    	var temp=Session.get('default-chat');
	    	Router.go(('/Channel/'+temp));
	    });
	    if(map&&location)
			map.setCenter(location);
	}
}

placeSquare = function (sGeohash) { 
	if(map){
		var cePoint = geohash.decode(geohash.neighbors(sGeohash).c);
		var nwPoint = geohash.decode(geohash.neighbors(sGeohash).nw);
		var sePoint = geohash.decode(geohash.neighbors(sGeohash).se);

		deleteOverlays();

		placeMarker(cePoint[0],cePoint[1]);

		var location = new google.maps.LatLng(cePoint[0], cePoint[1]);
		var nwCoord = new google.maps.LatLng( cePoint[0]+(nwPoint[0]-cePoint[0])/2.0, cePoint[1]+(nwPoint[1]-cePoint[1])/2.0 );
		var seCoord = new google.maps.LatLng( cePoint[0]+(sePoint[0]-cePoint[0])/2.0, cePoint[1]+(sePoint[1]-cePoint[1])/2.0 );

		var rectangle = new google.maps.Rectangle();
		var rectOptions = {
				map: map,
		    strokeColor : "#FF0000",
		    fillColor : "#FF0000",
		    strokeOpacity : 0.8,
		    strokeWeight : 2,
		    fillOpacity : 0.2
		};
		rectangle.setOptions(rectOptions);

		
		rectangle.setBounds(new google.maps.LatLngBounds(nwCoord,seCoord) );

		markersArray.push(rectangle);
		if(map&&location)
			map.setCenter(location);
	}
}

placeMarkers = function () {
	var t=Session.get('activeGeohashes');
	if (t&&t.length!=0&&map) {
  		_(Session.get('activeGeohashes')).each(function (gh) {
		    var geo = geohash.decode(gh);
		    var el = {
				lat: geo[0], lon:geo[1], ghash:gh 
		  	};

		    var marker = new google.maps.Marker({
				position: new google.maps.LatLng(el.lat, el.lon),
				draggable: false,
				map: map,
				icon: '/message20.png'
		    });

		    google.maps.event.addListener(marker, 'click', function() {
		    	Router.go(('/Channel/'+gh));
		    });

		    markersArrayh.push(marker);
	  	});
		//var markerCluster = new MarkerClusterer(map, markersArrayh);
	}
}

Template.mapCanvas.rendered = function() {
	markersArray = [];

	var latlng = new google.maps.LatLng(45.0, 7.5);
	var myOptions = {
		zoom: 10,
		center: latlng,
		mapTypeId: google.maps.MapTypeId.ROADMAP
	};
	map = new google.maps.Map(document.getElementById("map-canvas"), myOptions);
	Session.set('maprendered',true);
	em.emit('readylatlon');
}

/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 6
	DESCRIPTION: For the channel user story.
*/
Template.Channel.events({
	'submit #sendMsg': function( e ){
		e.preventDefault( );
		var temp = Meteor.user() || {username: 'guest'};//.username
		var newMesg={user: temp.username, msg: e.target.msg.value, date: new Date()};
		Meteor.call('mongoDBinsertMesgCH', newMesg, Session.get('default-chat'));
		e.target.msg.value="";
		console.log("inserted the object");
	}
});
/*
	AUTHOR AND PROGRAMMER: Eldar Feldbeine.
	SPRINT: 6
	DESCRIPTION: For the channel user story.
*/
Template.Channel.helpers({
	messages: function(){
		this.messages.sort();
		return this.messages;
	}
});

Handlebars.registerHelper('session',function(input){
  return Session.get(input);
});