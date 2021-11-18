const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//server urls will exist in env file in production.
require('dotenv').config();

const servers = ['http://ec2-3-145-57-143.us-east-2.compute.amazonaws.com:3030'];
let current = 0;

app.get('/*', (req, res) => {
  console.log('current server: ', servers[current]);
  console.log('req.url: ', req.url);
  console.log('req.body: ', req.body);
  console.log('req.query: ', req.query);
  const url = req.url;

  axios.get(servers[current] + url)
    .then(results => {
      console.log('success!');
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
  console.log('req.query: ', req.query);

  axios.post(servers[current] + req.url, req.body)
    .then(results => {
      console.log('success post');
      res.status(201).send(results.data);
    })
    .catch(err => {
      res.status(500).send(err);
    });
});

app.put('/*', (req, res) => {
  console.log('current server: ', servers[current]);
  console.log('req.url: ', req.url);
  console.log('req.body: ', req.body);
  console.log('req.query: ', req.query);
  res.send('Checking setup');
});

app.listen(port, () => {
  console.log(`Load Balancer listening at http://localhost:${port}`);
});