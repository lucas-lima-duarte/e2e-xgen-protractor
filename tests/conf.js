var Jasmine2HtmlCliReporter = require('protractor-jasmine2-html-cli-reporter');

exports.config = {
  
  onPrepare: function () {
    browser.manage().window().maximize();
    jasmine.getEnv().addReporter(
      new Jasmine2HtmlCliReporter({
        savePath: 'reports/screenshots'
      })
    );
  },
  
  cliReport: {
    enabled: true,
    options:{} // this support all the options for https://github.com/onury/jasmine-console-reporter.git
  },

  specs: ['specs/link.spec.js'],
  seleniumAddress: 'http://localhost:4444/wd/hub',
  framework: 'jasmine',

  allScriptsTimeout: 30000,
  directConnect: true,

  capabilities: {
    'browserName': 'chrome'
  },

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
