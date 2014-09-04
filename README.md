meteor-google-spreadsheets
==========================

Google Spreadsheets for Meteor

```
meteor add ongoworks:google-spreadsheets
```

## Option 1

Provides a way to pull a published, public google spreadsheet into a cache collection.

### Methods

Client:

 ```coffeescript   
Meteor.call "spreadsheet/fetch","<spreadsheet key>"

spreadsheetData = GASpreadsheet.findOne({spreadsheet:'<spreadsheet name or number>'})
if  spreadsheetData
 for index,row of spreadsheetData.cells
  if ( row[1] ) then value = row[1].value
  ...
```	

Or you could call on server:

```javascript	
if ( Meteor.is_server ) {
    Meteor.startup(function () {
       Meteor.setInterval(function() {
        Meteor.call('spreadsheet/fetch', key, worksheet, range, rowOneHeader)
       },50000);
    });
}

```	
### Exports

`GoogleSpreadsheets`

`GoogleClientLogin`

See:

[node-google-spreadsheets](https://github.com/samcday/node-google-spreadsheets)

[GoogleClientLogin](https://github.com/Ajnasz/GoogleClientLogin)


### Collection
Used as a cache for results `GASpreadsheet`

## Option 2

Provides a way to push the data from *any* collection to a Google spreadsheet, which can be either public or private. Then you can also make changes in the spreadsheet and pull them back, overwriting the data in the collection with the data from the spreadsheet.

### Requirements

The collection must have a simple-schema attached using the `collection2` package.

### Limitations

The collection must have a simple structure with only top-level fields that are strings, numbers, etc. There is no sub-object or array support yet.

### Package Setup

1. Add the `google-spreadsheets` package to your Meteor app.
2. Create a "private" folder at the top level of your Meteor app folder, if you don't already have it.
3. Go to the [Google Developers Console](https://console.developers.google.com/).
4. Select or create a project for your Meteor app.
5. Create a service account if you don't already have one for this project:
    5. In the sidebar on the left, expand **APIs & auth**. Select **Credentials**.
    6. Under the OAuth heading, select **Create new Client ID**.
    7. When prompted, select Service Account and click **Create Client ID**.
    8. A dialog box appears. To proceed, click **Okay, got it**.
6. Your service account should have a private key associated. Save that private key into a file named "google-key.pem" in your app's "private" folder. You might be given the key within a JSON file, in which case you need to extract and parse it into the separate PEM file (replace "\n" with actual line breaks, etc.). 
7. Make note of the email address created for your service account (a long, random address). You will need this address in later steps.

### Spreadsheet Setup

There are only three things you need to do to prep the spreadsheet:

1. Create a new Google spreadsheet.
2. Change the name from "Untitled" to something appropriate, like the name of the collection you will import into it. Don't skip this step; a unique name is required.
3. Share the spreadsheet with the service account email address you created during the "Package Setup" task.

### Using the Package in Your App

The package creates two server methods. Currently these do not do all of the work of integrating with your collection. Instead, you can make your own server methods to do that. Here are some example methods you could create in your app:

```js
pullAllSteps: function () {
  var spreadsheetName = 'Steps'; // must match exactly the name you gave your Google spreadsheet
  var serviceEmail = '795073958503-qukpg8tt7vbsjqtufgc379ag24200fr3@developer.gserviceaccount.com'; // this is fake; replace with your own

  var result = Meteor.call("spreadsheet/fetch2", spreadsheetName, 1, {email: serviceEmail});

  // Remove all existing
  Steps.remove({});

  // Gather property names
  var propNames = {};
  _.each(result.rows, function (rowCells, rowNum) {
    var doc = {};
    _.each(rowCells, function (val, colNum) {
      if (+rowNum === 1) {
        propNames[colNum] = val;
      } else {
        var propName = propNames[colNum];
        if (propName) {
          doc[propName] = val;
        }
      }
    });
    if (+rowNum > 1) {
      Steps.insert(doc);
    }
  });
},
writeAllSteps: function () {
  var spreadsheetName = 'Steps'; // must match exactly the name you gave your Google spreadsheet
  var serviceEmail = '795073958503-qukpg8tt7vbsjqtufgc379ag24200fr3@developer.gserviceaccount.com'; // this is fake; replace with your own

  var obj = {};
  obj[1] = {}
  var colPropNames = {};
  var col = 1;
  _.each(Steps.simpleSchema().schema(), function (def, key) {
    obj[1][col] = key;
    colPropNames[key] = col;
    col++;
  });

  var row = 2;
  Steps.find().forEach(function (step) {
    obj[row] = {};
    _.each(step, function (val, prop) {
      var pCol = colPropNames[prop];
      if (!pCol)
        return;
      obj[row][pCol] = val.toString();
    });
    row++;
  });

  Meteor.call("spreadsheet/update", spreadsheetName, 1, obj, {email: serviceEmail});
}
```

TODO - the above methods could be pulled into the package methods, just passing in the collection object.

So if you are building an app that needs to pull or push content from any unknown spreadsheets that are owned by any random users, you simply need to ask the user what the name of the spreadsheet is, and then tell the user to share that spreadsheet with your service account email address. (XXX not sure about potential name contention?)
