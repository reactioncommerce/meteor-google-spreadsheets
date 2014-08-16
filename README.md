meteor-google-spreadsheets
==========================

Google Spreadsheets for Meteor

See:

https://github.com/samcday/node-google-spreadsheets

https://github.com/Ajnasz/GoogleClientLogin





Client:
    
    Meteor.call "spreadsheet/fetch","<spreadsheet key>"

    spreadsheetData = GASpreadsheet.findOne({spreadsheet:'<spreadsheet name or number>'})
    if  spreadsheetData
      for index,row of spreadsheetData.cells
        if ( row[1] ) then value = row[1].value
        ...
	

Or you could call on server:
	
	if ( Meteor.is_server ) {
	    Meteor.startup(function () {
	       Meteor.setInterval(function() {
	        Meteor.call('spreadsheet/fetch', key, worksheet, range, rowOneHeader)
	       },50000);
	    });
	}