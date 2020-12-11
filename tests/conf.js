// An example configuration file.
exports.config = {
  
  onPrepare: function(){
    browser.manage().window().maximize();
    },

  seleniumAddress: 'http://localhost:4444/wd/hub',
  
  directConnect: true,

  capabilities: {
    'browserName': 'chrome'
  },

  framework: 'jasmine',

  specs: ['specs/compliments.spec.js'],

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
