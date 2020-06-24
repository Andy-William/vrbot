const express = require('express');

module.exports = function(app){
  app.get('/et', (request, response) => {
    response.sendFile(__dirname+'/ettest.html');
  });
}
