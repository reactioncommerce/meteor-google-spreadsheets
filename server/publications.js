Meteor.publish("ga_spreadsheet", function () {
  return GASpreadsheet.find();
});