// https://glitch.com/faq#restrictions 
// call own endpoint every 4 minutes to prevent sleeping

module.exports = function(app){
  app.get("/", (request, response) => response.sendStatus(200));
}

setInterval(() => {
  require('https').get(`https://vrbot--andywilliam.repl.co/`);
}, 240000);
