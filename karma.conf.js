basePath = '';
// list of files / patterns to load in the browser
files = [
  MOCHA,
  MOCHA_ADAPTER,
  {pattern: 'public/javascripts/libs/chai.js', include: true},
  {pattern: 'public/javascripts/client.js', include: true},
  'tests/**/*.js'
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
