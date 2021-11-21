var express = require('express');
var router = express.Router();
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const setBase = require('../utils/set-base');
const checkDate = require('../utils/check-date');
const checkCode = require('../utils/check-code');

// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

// This will test the database connection
const Client = require("../database/connect");
Client.connect((error, db) => {
  if(db){
    console.log("Successfully connected to database");
  } else{
    console.log(error);
  } 
})


/**
 * GET current rates for currency
 */
router.get('/latest/currencies/:currencyCode', async (request, response, next) => {
  var currencyCode = request.params["currencyCode"];
  if(!checkCode(currencyCode)) {    //checks if specified currency code is valid
    return response.send({status: "Error! Unknown request. Check currency code"}); 
  }
  const url = `http://api.exchangeratesapi.io/v1/latest?access_key=${process.env.ACCESS_KEY}`
  fetch(url)
    .then(res => res.json())
    .then(data => { 
      console.log(data);
      if(data.success){
        const domainObject = setBase(currencyCode.toUpperCase(), true, data);   //Sets the base currency to the specified currency
        Client.connect((error, db) => {     //Connects to database and sends the processed domain object
          if(db){
            forexDatabase = db.db("forex");
            forexDatabase.collection("forex-data").insertOne(domainObject, function (err, res) {
              if (err) throw err;
              console.log("successful")
              response.json(domainObject);
            });
          } else{
            console.log(error);
            response.send(domainObject);
          } 
        })
      } else {
        response.json({status: "Error! Unknown request"}); 
    }
    })
    .catch(error => { 
      console.log(error);
      response.json({status: "Internal Server Error"});
    });
});


/**
 * GET rates for currency by date
 */
router.get('/latest/currencies/:currencyCode/date/:date', (request, response, next) => {
  var currencyCode = request.params["currencyCode"];
  var dateString = request.params["date"];
  if(!checkDate(dateString)) response.json({status: "Error!! Unknown request"})   //checks if date string follows convention
  const url = `http://api.exchangeratesapi.io/v1/${dateString}?access_key=${process.env.ACCESS_KEY}`
  fetch(url)
    .then(res => res.json())
    .then(data => {
      console.log(data);
      if(data.success){
        const domainObject = setBase(currencyCode.toUpperCase(), true, data);   //Sets the base currency to the specified currency
        Client.connect((error, db) => {     //Connects to database and sends the processed domain object
          if(db){
            forexDatabase = db.db("forex");
            forexDatabase.collection("forex-data").insertOne(domainObject, function (err, res) {
              if (err) throw err;
              console.log("successful")
              response.json(domainObject);
            });
          } else{
            console.log(error);
            response.send(domainObject);
          } 
        })
      } else{
          response.json({status: "Error! Unknown request"});
      }
    })
    .catch(error => { 
      console.log(error);
      response.json({status: "Internal Server Error"});
      
    });
})


/**
 * GET rates for multiple currencies
 */
 router.get('/latest/currencies', (request, response, next) => {
  if(request.query["list"]){  //checks whether proper query string was passed
    request.query["list"].toUpperCase();
    var includesEuro = false;
    if(request.query["list"].indexOf("USD") == -1){   //checks if default base USD is part of the list and adds it if its not
      request.query["list"] = request.query["list"] + ",USD"
    }
    if(request.query["list"].indexOf("EUR") != -1){   //checks if the euro is part of the list
      includesEuro = true;
    }
    var url = `http://api.exchangeratesapi.io/v1/latest?access_key=${process.env.ACCESS_KEY}& symbols=${request.query["list"]};`
    
    fetch(url)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        if(data.success){
          const domainObject = setBase("USD", includesEuro, data)   //Sets the base currency to USD
          Client.connect((error, db) => {     //Connects to database and sends the processed domain object
            if(db){
              forexDatabase = db.db("forex");
              forexDatabase.collection("forex-data").insertOne(domainObject, function (err, res) {
                if (err) throw err;
                console.log("successful")
                response.json(domainObject);
                
              });
            } else{
              console.log(error);
              response.send(domainObject);
            } 
          })
        } else{
          response.json({status: "Error! Unknown request"});
        }
      })
      .catch(error => { 
        console.log(error);
        response.json({status: "Internal Server Error"});
      });
  } else{
    response.json({status: "Error!! Unknown request"});
  }
  
})

module.exports = router;
