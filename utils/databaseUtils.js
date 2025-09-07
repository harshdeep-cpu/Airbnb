const mongo = require('mongodb');

const mongoClient = mongo.MongoClient;
const mongoUrl= "mongodb+srv://root:Sharshdeep91%40@cluster0.oh5gpao.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let _db;

const mongoConnect = (callback) => {
  mongoClient.connect(mongoUrl).then(client=>{
    _db=client.db('airbnb');
    callback();
  }).catch(err=>{
    console.log('Error while connecting to mongo',err);
  })
}

const getDb = () => {
  if(!_db){
    throw new Error('No database found!');
  }
  return _db;
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;