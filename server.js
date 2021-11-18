const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const path = require('path');
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//server urls will exist in env file in production.
require('dotenv').config();

const servers = process.env.SERVERS.split(',');
console.log(servers);
let current = 0;

app.get('/loaderio-697c9500259995a01b46638001c2434b/', (req, res) => {
  res.sendFile(path.join(__dirname, 'loader.txt'));
});

app.get('/*', (req, res) => {
  console.log('current server: ', servers[current]);
  console.log('req.url: ', req.url);
  console.log('req.query: ', req.query);
  const url = req.url;

  axios.get(servers[current] + url)
    .then(results => {
      console.log('success!');
      current = (current + 1) % servers.length;
      console.log(current);
      res.status(200).send(results.data);
    })
    .catch(err => {
      console.log('err', err);
      res.status(500).send(err);
    });
});

app.post('/*', (req, res) => {
  console.log('current server: ', servers[current]);
  console.log('req.url: ', req.url);
  console.log('req.body: ', req.body);

  axios.post(servers[current] + req.url, req.body)
    .then(results => {
      console.log('success post');
      current = (current + 1) % servers.length;
      console.log(current);
      res.status(201).send(results.data);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.put('/*', (req, res) => {
  console.log('current server: ', servers[current]);
  console.log('req.url: ', req.url);

  axios.put(servers[current] + req.url)
    .then(results => {
      console.log('success put');
      current = (current + 1) % servers.length;
      console.log(current);
      res.status(200).send(results.data);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.listen(port, () => {
  console.log(`Load Balancer listening at http://localhost:${port}`);
});