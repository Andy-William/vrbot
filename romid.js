const fetch = require('node-fetch');
const cache = require('./lib/cache.js');

module.exports = function(app){
  app.get("/rom/:id", async (request, response) => {
    const ip = (request.headers['x-forwarded-for'] || request.connection.remoteAddress || '').split(',')[0].trim();
    console.log('rom from', ip, request.params.id);
    cacheKey = 'rom-' + request.params.id
    ans = cache.get(cacheKey)
    if( !ans ){
      await fetch("https://romhandbook.com/things/" + request.params.id).then(res => res.text()).then(data=>{
        const nameRegex = /font-semibold leading-6.*\n(.*)/;
        match = nameRegex.exec(data)
        console.log(match[1])
        cache.set(cacheKey, match[1])
        response.set({
          'Access-Control-Allow-Origin': '*'
        })
        response.send(match[1])
      })
    } else {
      console.log('cached ', ans)
      response.set({
        'Access-Control-Allow-Origin': '*'
      })
      response.send(ans)
    }
  });
}
