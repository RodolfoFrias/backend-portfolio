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

if(process.env.ENV == 'development'){
  databaseUri = process.env.MONGODB_URI;
}

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

const api = new ParseServer({
  databaseURI: databaseUri,
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/src/shared/infraestucture/cloud/main.js',
  appId: process.env.APP_ID || 'myAppId',
  masterKey: process.env.MASTER_KEY || 'myMasterKey', //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'http://localhost:1337/parse',  // Don't forget to change to https if needed
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
      "serverURL": 'http://localhost:1337/parse',
      "appId":'myAppId',
      "masterKey":'myMasterKey',
      "appName":'backend-portfolio'
    }
  ],
  "users":[
    {
      "user":'admin',
      "pass":'cliente'
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
app.use('/', Auth);
app.use('/projects', Project);

const port = process.env.PORT || 1337;

app.listen(port, function() {
    console.log('Server running on ' + port + '.');
});

// This will enable the Live Query real-time server
//ParseServer.createLiveQueryServer(httpServer);
