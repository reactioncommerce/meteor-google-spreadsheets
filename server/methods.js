Meteor.methods({
  // Fetches from a google spreadsheet
  // key = key from googe spreadsheet publish
  // worksheet = numerical index or string
  // range = "R1C1:R5C5"
  'spreadsheet/fetch': function (key, worksheet, range, rowOneHeader) {
    if (!worksheet) worksheet = 0;
    if (!rowOneHeader) rowOneHeader = true;
    return GoogleSpreadsheets({
        key: key
    }, Meteor.bindEnvironment( function(err, spreadsheet) {
        spreadsheet.worksheets[worksheet].cells({
            range: range
        }, Meteor.bindEnvironment( function(err, cells) {
          console.log("Upserting spreadsheet: ",spreadsheet.title)
          header = cells.cells[1];
          if (rowOneHeader == true) delete cells.cells[1];
          data = cells.cells;
          record = GASpreadsheet.upsert({spreadsheet: spreadsheet.title},{$set:{spreadsheet: spreadsheet.title, header: header, cells: data}})
        }));
    }));
  },
  'spreadsheet/update': function (key, worksheet, rowOneHeader) {
    if (!worksheet) worksheet = 0;
    if (!rowOneHeader) rowOneHeader = true;
    //TODO update spreadsheet with collection updates
  }
});