meteor-google-spreadsheets
==========================

Google Spreadsheets for Meteor

See:

https://github.com/samcday/node-google-spreadsheets

https://github.com/Ajnasz/GoogleClientLogin





Client:

	Meteor.subscribe("ga_spreadsheets");
	
	

Server:
	
	if ( Meteor.is_server ) {
	    Meteor.startup(function () {
	       Meteor.setInterval(function() {
	        Meteor.call('spreadsheet/fetch', key, worksheet, range, rowOneHeader)
	       },5000);
	    });
	}