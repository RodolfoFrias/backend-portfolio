// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const express = require('express');
const ParseServer = require('parse-server').ParseServer;
const ParseDashboard = require('parse-dashboard');
const path = require('path');
const bodyParser = require('body-parser'); 

const Auth = require('./src/shared/interfaces/routes/Auth');
const Project = require('./src/projects/interfaces/routes/Project');
const dotenv = require('dotenv');

dotenv.config();
let databaseUri = 'mongodb://localhost:27017/dev';
let appId = 'myAppId';
let masterKey = 'myMasterKey';
let serveURL = 'http://localhost:1337/parse';
let appName = 'backend-portfolio';
let user = 'admin';
let pass = 'cliente';

if(process.env.ENV == 'production'){
  databaseUri = process.env.MONGODB_URI;
  appId = process.env.APP_ID;
  masterKey = process.env.MASTER_KEY;
  serveURL = process.env.SERVER_URL;
  appName = process.env.APP_NAME;
  user = process.env.USERNAME;
  pass = process.env.PASSWORD;
}

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

const api = new ParseServer({
  databaseURI: databaseUri,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/src/shared/infraestucture/cloud/main.js',
  appId: appId,
  masterKey: masterKey, //Add your master key here. Keep it secret!
  serverURL: serveURL,  // Don't forget to change to https if needed
  // liveQuery: {
  //   classNames: ["Posts", "Comments"] // List of classes to support for query subscriptions
  // }
});
// Client-keys like the javascript key or the .NET key are not necessary with parse-server
// If you wish you require them, you can set them as options in the initialization above:
// javascriptKey, restAPIKey, dotNetKey, clientKey
const trustProxy = true;
const dashboard = new ParseDashboard({
  "apps":[
    {
      "serverURL": serveURL,
      "appId": appId,
      "masterKey": masterKey,
      "appName": appName
    }
  ],
  "users":[
    {
      "user": user,
      "pass": pass
    }
  ]
}, { 
  allowInsecureHTTP: true,
  trustProxy: 1
 });

const app = express();

app.use('/dashboard', dashboard);

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

//Pug
// app.set('view engine', 'pug');
//Boby parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//Cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, responseType');  
  next();
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/test', function(req, res) {
  res.send('Ok');
});

//Routes
const PREFIX = '/api/v1';
app.use(PREFIX, Auth);
app.use(PREFIX+'/projects', Project);

const port = process.env.PORT || 1337;

app.listen(port, function() {
    console.log('Server running on ' + port + '.');
});

// This will enable the Live Query real-time server
//ParseServer.createLiveQueryServer(httpServer);
