// call own endpoint every 4 minutes to prevent sleeping

module.exports = function(app){
  app.get("/", (request, response) => {
    try{
      response.sendStatus(200);
    }catch(e){
      console.log(e);
    }
  })
}

// setInterval(() => {
//   try{
//     require('https').get(`https://vrbot--andywilliam.repl.co/`)
//   }catch(e){
//     console.log(e);
//   }
// }, 240000);
