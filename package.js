Package.describe({
  summary: "Google Spreadsheets for Docker",
  version: "0.1.0",
  git: "https://github.com/ongoworks/meteor-google-spreadsheets"
});

Npm.depends({
  "google-spreadsheets": "0.3.0",
  "googleclientlogin": "0.2.8"
});

Package.on_use(function (api) {
  api.imply(["underscore"], ["client", "server"]);
  api.export('GoogleSpreadsheets');
  api.export('GoogleClientLogin');
  api.add_files('common/collections.js', ['client','server']);
  api.add_files('server/methods.js', 'server');
  api.add_files('server/publications.js', 'server');
  api.add_files('google-spreadsheets.js', 'server');
});