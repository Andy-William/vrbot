const http = require('http');
const express = require('express');
const app = express();

require('./unsleeper.js')(app);
require('./ettest.js')(app);

app.get("/tos", (request, response) => {
  try{
    response.set('Content-Type', 'text/html');
    response.send("Please use responsibly. We are not affiliated with Ragnarok Mobile: Eternal Love or Gravity inc.");
  }catch(e){
    console.log(e);
  }
})

app.get("/privacy", (request, response) => {
  try{
    response.set('Content-Type', 'text/html');
    response.send("We do not store any user data, however, we log incoming chat to keep up the quality of service.");
  }catch(e){
    console.log(e);
  }
})

app.listen(process.env.PORT);
