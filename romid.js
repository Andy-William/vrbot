const fetch = require('node-fetch');

module.exports = function(app){
  app.get("/rom/:id", async (request, response) => {
    const ip = (request.headers['x-forwarded-for'] || request.connection.remoteAddress || '').split(',')[0].trim();
    console.log('rom from', ip, request.params.id);
    await fetch("https://romhandbook.com/things/" + request.params.id).then(res => res.text()).then(data=>{
      const nameRegex = /font-semibold leading-6.*\n(.*)/;
      match = nameRegex.exec(data)
      console.log(match[1])
      response.set({
        'Access-Control-Allow-Origin': '*'
      })
      response.send(match[1])
    })
  });
}
