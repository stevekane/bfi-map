basePath = '';
// list of files / patterns to load in the browser
files = [
  MOCHA,
  MOCHA_ADAPTER,
  {pattern: 'public/javascripts/libs/jquery-1.10.1.min.js', include: true},
  {pattern: 'public/javascripts/libs/chai.js', include: true},
  {pattern: 'public/javascripts/libs/minispade.js', include: true},
  {pattern: 'public/javascripts/libs/lodash.js', include: true},
  {pattern: 'public/javascripts/libs/Bacon.min.js', include: true},
  {pattern: 'public/dist/client.js', include: true},
  {pattern: 'tests/**/*.js', include: true}
];
reporters = ['progress'];
port = 9876;
runnerPort = 9100;
colors = true;
logLevel = LOG_INFO;
autoWatch = true;
browsers = ['Chrome'];
captureTimeout = 60000;
singleRun = false;
