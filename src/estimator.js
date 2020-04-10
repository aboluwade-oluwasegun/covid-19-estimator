const o2x = require('object-to-xml');

const covid19ImpactEstimator = (req, res) => {
  const output = {
    data: req.body,
    impact: {},
    severeImpact: {}
  };

  // CHALLENGE 1
  // estimated number of currently infected people
  output.impact.currentlyInfected = req.body.reportedCases * 10;
  output.severeImpact.currentlyInfected = req.body.reportedCases * 50;

  // projected number of infected people
  output.impact.infectionsByRequestedTime = Math.trunc(
    output.impact.currentlyInfected * 512
  );
  output.severeImpact.infectionsByRequestedTime = Math.trunc(
    output.severeImpact.currentlyInfected * 512
  );

  // CHALLENGE 2
  // estimated number of severe positive cases
  output.impact.severeCasesByRequestedTime = Math.trunc(
    output.impact.infectionsByRequestedTime * 0.15
  );
  output.severeImpact.severeCasesByRequestedTime = Math.trunc(
    output.severeImpact.infectionsByRequestedTime * 0.15
  );

  // estimated number of available hospital beds
  output.impact.hospitalBedsByRequestedTime = Math.trunc(
    req.body.totalHospitalBeds - output.impact.severeCasesByRequestedTime
  );
  output.severeImpact.hospitalBedsByRequestedTime = Math.trunc(
    req.body.totalHospitalBeds - output.severeImpact.severeCasesByRequestedTime
  );

  // CHALLENGE 3
  // estimated number of severe positive cases that will require ICU care
  output.impact.casesForICUByRequestedTime = Math.trunc(
    output.impact.infectionsByRequestedTime * 0.05
  );
  output.severeImpact.casesForICUByRequestedTime = Math.trunc(
    output.severeImpact.infectionsByRequestedTime * 0.05
  );

  // estimated number of severe positive cases that will require ventilators
  output.impact.casesForVentilatorsByRequestedTime = Math.trunc(
    output.impact.infectionsByRequestedTime * 0.02
  );
  output.severeImpact.casesForVentilatorsByRequestedTime = Math.trunc(
    output.severeImpact.infectionsByRequestedTime * 0.02
  );

  // estimated amount of money lost
  output.impact.dollarsInFlight = (output.impact.infectionsByRequestedTime
    * req.body.region.avgDailyIncomePopulation
    * req.body.region.avgDailyIncomeInUSD
    * req.body.timeToElapse).toFixed(2) * 1;
  output.severeImpact.dollarsInFlight = (output.severeImpact.infectionsByRequestedTime
    * req.body.region.avgDailyIncomePopulation
    * req.body.region.avgDailyIncomeInUSD
    * req.body.timeToElapse).toFixed(2) * 1;

  // xml or json?
  if (req.url === '/api/v1/on-covid-19/xml') {
    res.set('Content-Type', 'text/xml');
    return res.send(
      o2x({
        '?xml version="1.0" encoding="utf-8"?': null,
        output
      })
    );
  }
  return res.status(200).send(output);
};

module.exports = covid19ImpactEstimator;
