
const covid19ImpactEstimator = (data) => {
  let days;
  if (data.periodType === 'days') {
    days = Math.trunc(data.timeToElapse / 3);
  } else if (data.periodType === 'weeks') {
    days = Math.trunc((data.timeToElapse * 7) / 3);
  } else if (data.periodType === 'months') {
    days = Math.trunc((data.timeToElapse * 30) / 3);
  }

  const output = {
    data,
    impact: {},
    severeImpact: {}
  };

  // CHALLENGE 1
  // estimated number of currently infected people
  output.impact.currentlyInfected = data.reportedCases * 10;
  output.severeImpact.currentlyInfected = data.reportedCases * 50;

  // projected number of infected people
  output.impact.infectionsByRequestedTime = Math.trunc(
    output.impact.currentlyInfected * (2 ** days)
  );
  output.severeImpact.infectionsByRequestedTime = Math.trunc(
    output.severeImpact.currentlyInfected * (2 ** days)
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
    data.totalHospitalBeds * 0.35 - output.impact.severeCasesByRequestedTime
  );
  output.severeImpact.hospitalBedsByRequestedTime = Math.trunc(
    data.totalHospitalBeds * 0.35
    - output.severeImpact.severeCasesByRequestedTime
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
  output.impact.dollarsInFlight = (
    Math.trunc(
      (output.impact.infectionsByRequestedTime
      * data.region.avgDailyIncomePopulation
      * data.region.avgDailyIncomeInUSD)
      / days
    )
  );
  output.severeImpact.dollarsInFlight = (
    Math.trunc(
      (output.severeImpact.infectionsByRequestedTime
      * data.region.avgDailyIncomePopulation
      * data.region.avgDailyIncomeInUSD)
      / days
    )
  );

  return output;
};


export default covid19ImpactEstimator;
