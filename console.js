const dotenv = require('dotenv');
dotenv.config();
const client = require('./lib/bot.js').client;

client.login(process.env.DISCORD_BOT_TOKEN);
client.on('error', (err) => console.log(err));

const db = require('./lib/mongo.js');
const repl = require('node:repl');

r = repl.start();

r.context.client = client
r.context.db = db
