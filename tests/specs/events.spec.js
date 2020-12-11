var Events = require('../page-objects/events.po.js');
var Login = require('../page-objects/login.po.js');
var GLOBAL = require('../helper/globals.po')

describe('Events Tests —', () => {

   beforeAll(function() {
      Login.navigateTo();
      Login.fullLogin(GLOBAL.LOGIN, GLOBAL.PASSWORD);
      browser.waitForAngular(); 
    });

   // it('Login for tests execution', () => {
   //    Login.getUrl(GLOBAL.MAIN)
   //    browser.waitForAngular();
   //    Login.fullLogin(GLOBAL.LOGIN, GLOBAL.PASSWORD);
   //    browser.waitForAngular();
   // });

    it('create an Event',  () => {
       Events.getCreateUrl();
       browser.waitForAngular(); 
    });
    
});