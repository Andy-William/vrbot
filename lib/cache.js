const NodeCache = require( "node-cache" );
const myCache = new NodeCache();

function set(key, value, ttl=0){
  console.log(key,String(value),ttl)
  return myCache.set(key, value, ttl);
}

function get(key){
  const value = myCache.get(key);
  console.log(key,String(value));
  return value;
}

exports.set = set
exports.get = get