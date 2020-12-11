var Compliments = require('../page-objects/compliments.po.js');
var Login = require('../page-objects/login.po.js');
var GLOBAL = require('../helper/globals.po')
var uniqid = require('uniqid');

xdescribe('Create Tests —', () => {

   beforeAll(function () {
      Login.navigateTo();
      Login.fullLogin(GLOBAL.LOGIN, GLOBAL.PASSWORD);
      browser.waitForAngular();
   });

   it('create an standard Compliment', () => {
      Compliments.getCreateUrl();
      browser.waitForAngular();

      Compliments.fillRequiredFields(
         "Compliments — " + uniqid() + " — Protractor",
         "Departament — " + uniqid() + " — Protractor",
         "Praise — " + uniqid() + " — Protractor"
      );

      Compliments.save();
      browser.waitForAngular();
   });

   afterAll(() => {
      browser.manage().deleteAllCookies();
   });

});

describe('Check all labels [pt-br] from —', () => {

   beforeAll(function () {
      Login.navigateTo();
      Login.fullLogin(GLOBAL.LOGIN, GLOBAL.PASSWORD);
      browser.waitForAngular();
   });

   it('general', () => {
      Compliments.getCreateUrl();
      browser.waitForAngular();
      expect(Compliments.lblName.getText()).toEqual("Name");
      
   });

   afterAll(() => {
      browser.manage().deleteAllCookies();
   });
});