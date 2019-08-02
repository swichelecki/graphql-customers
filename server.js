const express = require('express');
const expressGraphQL = require('express-graphql');
const cors = require('cors');
const schema = require('./schema.js');
const path = require('path');

const app = express();

app.use(cors());

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}));

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public', 'index.html'));
});

const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(router);

const WEB_PORT = process.env.WEB_PORT || 4000;

app.listen(4000, () => {
    console.log(`Website server is running on port ${WEB_PORT}`);
})

const JSON_PORT = process.env.JSON_PORT || 3000;

server.listen(3000, () => {
    console.log(`JSON-server server is running on port ${JSON_PORT}`);
});
