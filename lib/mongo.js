const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URL;

let db;

async function connect(){
  return MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then((client) => {
      db = client.db()
      console.log("mongo connected");
    });
}

async function getCollection(name){
  if( !db ) await connect();
  return db.collection(name);
}


async function insertDocuments(collectionName, data) {  
  const collection = await getCollection(collectionName);
  return collection.insertMany(data);
}

async function getDocuments(collectionName, query = {}, sort = {}, collation = {}){
  const collection = await getCollection(collectionName);
  return collection.find(query).sort(sort).collation(collation).toArray();
}

async function getCount(collectionName, query = {}){
  const collection = await getCollection(collectionName);
  return collection.find(query).count();
}

async function getRandomDocuments(collectionName, query = {}, size = 1){
  const collection = await getCollection(collectionName);
  return collection.aggregate([
    {$match: query},
    {$sample: {size: size}}
  ]).toArray();
}

async function updateDocument(collectionName, query, data, options = {}){
  const collection = await getCollection(collectionName);
  return collection.updateOne(query, { $set: data }, options);
}

async function updateDocumentIfNewer(collectionName, query, data, timestamp, options = {}){
  const collection = await getCollection(collectionName);
  query[$or] = [{lastRequest: {$gt: timestamp}, lastRequest: null}]
  return collection.updateOne(query, { $set: data }, options);
}

async function deleteDocuments(collectionName, query){
  const collection = await getCollection(collectionName);
  return collection.deleteMany(query)  
}

/* update multiple documents
updates is an array of object with properties:
query: the query to get the document
data: the new data for the document
*/
async function bulkUpdate(collectionName, updates, upsert=false, ordered=false){
  if( updates.length == 0 ) return 0;
  const collection = await getCollection(collectionName);
  return collection.bulkWrite(updates.map(update=>{
    return { updateOne: {
        filter: update.query,
        update: { $set: update.data },
        upsert: upsert
    }}
  }), {ordered: false}).then(r=>console.log('matched %s\nupdated %s\nerror %s\n%s', r.result.nMatched, r.result.nModified, r.result.writeErrors, r.result.writeConcernErrors));
}

exports.get = getDocuments
exports.count = getCount
exports.getRandom = getRandomDocuments
exports.insert = insertDocuments
exports.update = updateDocument
exports.updateNewer = updateDocumentIfNewer
exports.delete = deleteDocuments
exports.bulkUpdate = bulkUpdate
// exports.collection = getCollection
