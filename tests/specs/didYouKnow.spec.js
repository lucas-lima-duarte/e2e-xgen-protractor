var Compliments = require('../page-objects/compliments.po.js');
var Login = require('../page-objects/login.po.js');
var GLOBAL = require('../helper/globals.po')
var uniqid = require('uniqid');

beforeAll(function () {
   Login.login(GLOBAL.LOGIN, GLOBAL.PASSWORD);
});
describe('Compliments Tests — Create', () => {

   it('Create an standard Compliment', () => {
      browser.get(Compliments.url.create);
      browser.waitForAngular();

      Compliments.fillRequiredFields(
         "Compliments — " + uniqid() + " — Protractor",
         "Departament — " + uniqid() + " — Protractor",
         "Praise — " + uniqid() + " — Protractor"
      );

      Compliments.save();
      browser.waitForAngular();
   });
});

describe('Compliments Tests — Check all labels [pt-br] from', () => {

   it('General', () => {
      browser.get(Compliments.url.create);
      browser.waitForAngular();
      expect(Compliments.lblName.getText()).toEqual("Nome");
      
   });
});

afterAll(() => {
   browser.manage().deleteAllCookies();
});