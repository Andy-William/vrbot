const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URL;

let db;

function connect(){
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
// insertDocuments('cards', [{"name":"Galion","color":"mini"},{"name":"Hill Wind","color":"mvp"},{"name":"Ice Statue","color":"mini"},{"name":"Ktullanux","color":"mvp"},{"name":"Fallen Bishop","color":"mini"},{"name":"Gloom Under Night","color":"mvp"}])

async function getDocuments(collectionName, query = {}, sort = {}){
      console.log(query);

  const collection = await getCollection(collectionName);
  return collection.find(query).sort(sort).toArray();
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

async function deleteDocuments(collectionName, query){
  const collection = await getCollection(collectionName);
  return collection.deleteMany(query)  
}

/* update multiple documents
updates is an array of object with properties:
query: the query to get the document
data: the new data for the document
*/
async function bulkUpdate(collectionName, updates){
  if( updates.length == 0 ) return 0;
  const collection = await getCollection(collectionName);
  collection.bulkWrite(updates.map(update=>{
    return { updateOne: {
        filter: update.query,
        update: { $set: update.data }
    }}
  })).then(r=>console.log('updated ' + r.result.nModified));
}

// bulkUpdate('pokemon', [{"query": {"name": "Nihilego"}, "data": {"category": "ultrabeast"}},{"query": {"name": "Buzzwole"}, "data": {"category": "ultrabeast"}},{"query": {"name": "Pheromosa"}, "data": {"category": "ultrabeast"}},{"query": {"name": "Xurkitree"}, "data": {"category": "ultrabeast"}},{"query": {"name": "Celesteela"}, "data": {"category": "ultrabeast"}},{"query": {"name": "Kartana"}, "data": {"category": "ultrabeast"}},{"query": {"name": "Guzzlord"}, "data": {"category": "ultrabeast"}},{"query": {"name": "Poipole"}, "data": {"category": "ultrabeast"}},{"query": {"name": "Naganadel"}, "data": {"category": "ultrabeast"}},{"query": {"name": "Stakataka"}, "data": {"category": "ultrabeast"}},{"query": {"name": "Blacephalon"}, "data": {"category": "ultrabeast"}}])

exports.get = getDocuments
exports.count = getCount
exports.getRandom = getRandomDocuments
exports.insert = insertDocuments
exports.update = updateDocument
exports.delete = deleteDocuments
exports.bulkUpdate = bulkUpdate
// exports.collection = getCollection
