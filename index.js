// Example express application adding the parse-server module to expose Parse
// compatible API routes.

const express = require('express');
const {ParseServer} = require('parse-server');
const ParseDashboard = require('parse-dashboard');
const path = require('path');

const dotenv = require('dotenv');
const Auth = require('./src/shared/interfaces/routes/Auth');
const Project = require('./src/projects/interfaces/routes/Project');

dotenv.config();

const databaseUri = process.env.MONGODB_URI;
const appId = process.env.APP_ID;
const masterKey = process.env.MASTER_KEY;
const serveURL = process.env.SERVER_URL;
const appName = process.env.APP_NAME;
const user = process.env.USERNAME;
const pass = process.env.PASSWORD;

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

const api = new ParseServer({
  databaseURI: databaseUri,
  cloud: process.env.CLOUD_CODE_MAIN || `${__dirname  }/src/shared/infraestucture/cloud/main.js`,
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
// const trustProxy = true;
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

// app.use('/dashboard', dashboard);

// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);

//Pug
// app.set('view engine', 'pug');
//Boby parser
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

//Cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.ORIGIN);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, responseType');  
  next();
});

// There will be a test page available on the /test path of your server url
// Remove this before launching your app
app.get('/', (req, res) => {
  res.send('Welcome to this api');
});

//Routes
const PREFIX = '/api/v1';
app.use(PREFIX, Auth);
app.use(`${PREFIX}/projects`, Project);

app.use(require('./src/shared/interfaces/middlewares/error.middleware'))

const port = process.env.PORT || 1337;

app.listen(port, () => {
    console.log(`Server running on ${  port  }.`);
});

// This will enable the Live Query real-time server
//ParseServer.createLiveQueryServer(httpServer);
