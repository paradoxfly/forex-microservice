const { MongoClient } = require("mongodb");
const atlasURI = process.env.ATLAS_URI;

const Client = new MongoClient(atlasURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
 
var _db;
 
module.exports = Client;