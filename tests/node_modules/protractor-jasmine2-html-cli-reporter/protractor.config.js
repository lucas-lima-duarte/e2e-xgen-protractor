// An example configuration file
exports.config = {

    // Capabilities to be passed to the webdriver instance.
    capabilities: {
        'browserName': 'chrome',
        chromeOptions: {
            args: [ "--headless", "--disable-gpu", "--window-size=800,600" ]
        }
    },
    framework: 'jasmine2',

    //directConnect: true,

    specs: ['test/**/*[sS]pec.js'],

    onPrepare: function() {

        return global.browser.getProcessedConfig().then(function (config) {
            var Jasmine2HtmlReporter = require('./index.js');

            jasmine.getEnv().addReporter(new Jasmine2HtmlReporter({
                savePath: './test/reports/'
            }));
        });


    },
    seleniumAddress: 'http://localhost:4444/wd/hub'
};