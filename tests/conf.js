// An example configuration file.
exports.config = {
  
  onPrepare: function(){
    browser.manage().window().maximize();
    },

  seleniumAddress: 'http://localhost:4444/wd/hub',

  allScriptsTimeout: 30000,
  
  directConnect: true,

  capabilities: {
    'browserName': 'chrome'
  },

  framework: 'jasmine',

  specs: ['specs/glossary.spec.js'],

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
