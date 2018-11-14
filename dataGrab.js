'use strict';
var express    = require('express');
var app  = express();  
var MongoClient = require('mongodb').MongoClient
  , assert = require('assert');
var bodyParser = require('body-parser');

// Connection URL
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

const yelp = require('yelp-fusion');
const client = yelp.client('pKMXcbNJkZVaIcXByLxgpVSYBDCULOGGbY6NFsDqcSY2kndHrDm-WL59Re8XDhhuibgq8yGWm-pNJvfKbwYJ4Gtrderjtsp9VAPI5nDtCzxs_EgcIVc99LrL4yPqW3Yx');
var url = 'mongodb://localhost:27017/otherBird';

var router = express.Router(); 
router.get('/results', function(req, res) {
  var rapscallionId = [];
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("otherBird");
    dbo.collection("ReviewsFinal").find({}).toArray(function (err, result) {
      if (err) throw err;;
      for (let i = 0; i < result.length; i++) {
        //if(result[i].name == "The Rapscallion"){
        for (let j = 0; j < result[i].Data.length; j++) {
          var tmp = {};
          if ((rapscallionId.indexOf(result[i].Data[j].id)) == -1) {
            rapscallionId.push(result[i].Data[j].id);
            tmp.name = result[i].name;
            tmp.id = result[i].Data[j].id;
            tmp.rating = result[i].Data[j].rating;
            tmp.datetime = result[i].Data[j].time_created
          }
          if (!(isEmpty(tmp))) {
            dataarray.push(tmp);
          }
        }
      }
      res.send(dataarray);
      //console.log(dataarray);
      //return dataarray;
    });
    db.close();
  });
  //console.log(dataarray);
  //res.json({ message: 'hooray! welcome to our api!' });   
});
app.use('/api', router);
//router.get('/', (req, res) => {
//  arr = grabAll();
//  res.send(arr);
//});

function createDb() {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("otherBird");
    dbo.createCollection("ReviewsFinal", function (err, res) {
      if (err) throw err;
      console.log("Collection created!");
      db.close();
    });
  });
}
//cleanup();
//createDb();
//getDataYelp();
function testInsert(obj) {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("otherBird");
    //var myobj = { name: "Company Inc", address: "Highway 37" };
    dbo.collection("ReviewsFinal").insertOne(obj, function (err, res) {
      if (err) throw err;
      console.log("1 document inserted");
      db.close();
    });
  });
}

//testInsert();
var dataarray = [];
function grabAll() {
  
}
//grabAll();
function cleanup() {
  MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    var dbo = db.db("otherBird");
    dbo.collection("Reviews").remove({})
  });
}
//cleanup();

//grabAll();
// the muleId = h2mI1wBIK1PyaNupaL58gw
// the Rapscallion = iShdeC-lrtqi0VQhHs3Y4A
//apiId = 'ayupbX4GNeCZ1jCkemVgyg';

//Some test code for getting the Business ID for review searches
/*
client.search({
  term:'The Rapscallion',
  location: 'Hamilton, ON'
}).then(response => {
  console.log(response.jsonBody.businesses[0].id);
}).catch(e => {
  console.log(e);
});
*/
function getDataYelp() {
  //Review Data The Mule
  client.reviews('h2mI1wBIK1PyaNupaL58gw').then(response => {
    var myobj = { name: "The Mule", Data: response.jsonBody.reviews };
    testInsert(myobj);
    console.log("done");
  }).catch(e => {
    console.log(e);
  });
  //Review Data the Rapscallion
  client.reviews('iShdeC-lrtqi0VQhHs3Y4A').then(response => {
    var myobj = { name: "The Rapscallion", Data: response.jsonBody.reviews };
    testInsert(myobj);
    console.log("done");
  }).catch(e => {
    console.log(e);
  });
}

function isEmpty(obj) {
  for (var key in obj) {
    let count = Object.keys(obj).length
    if (count != 0) {
      return false;
    }
  }
  return true;
}
app.listen(port);