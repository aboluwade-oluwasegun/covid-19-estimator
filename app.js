const fs = require('fs');
const express = require('express');
const app = express();

const covid19ImpactEstimator = require('./src/estimatorRest');

app.use(express.json());

// set up logger
let logger = (req, res, next) => {
  const getActualRequestDurationInMilliseconds = (start) => {
    const nanosecondPerSecond = 1e9; // convert to nanoseconds
    const nanosecondToMillisecond = 1e6; // convert to milliseconds
    const diff = process.hrtime(start);
    return (diff[0] * nanosecondPerSecond + diff[1]) / nanosecondToMillisecond;
  };
  const start = process.hrtime();
  const requestDuration = getActualRequestDurationInMilliseconds(start);
  let log =
    req.method +
    '\t\t' +
    req.url +
    '\t\t' +
    res.statusCode +
    '\t\t' +
    requestDuration +
    'ms';
  fs.appendFile('request_logs.txt', log + '\n', (err) => {
    if (err) {
      throw err;
    }
  });
  next();
};

// use as middleware
app.use(logger);

// get json format
app.post('/api/v1/on-covid-19', (req, res) => {
  covid19ImpactEstimator(req, res);
});

// get json format
app.post('/api/v1/on-covid-19/json', (req, res) => {
  covid19ImpactEstimator(req, res);
});

// get xml format
app.post('/api/v1/on-covid-19/xml', (req, res) => {
  covid19ImpactEstimator(req, res);
});

// retrieve the logs
app.get('/api/v1/on-covid-19/logs', (req, res) => {
  res.status(200).sendFile(__dirname + '/request_logs.txt');
});

// connect to port
const port = process.env.PORT || 3002;
app.listen(port, () => console.log(`Listening on port ${port}...`));
