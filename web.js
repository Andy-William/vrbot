const http = require('http');
const express = require('express');
const app = express();

require('./unsleeper.js')(app);
require('./ettest.js')(app);

app.listen(process.env.PORT);