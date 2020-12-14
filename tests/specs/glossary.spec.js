var Glossary = require('../page-objects/glossary.po.js');
var Login = require('../page-objects/login.po.js');
var GLOBAL = require('../helper/globals.po')
var uniqid = require('uniqid');

describe('Glossary Tests —', () => {

   beforeAll(function () {
      Login.navigateTo();
      Login.fullLogin(GLOBAL.LOGIN, GLOBAL.PASSWORD);
      browser.waitForAngular();
   });

   it('create an standard Glossary', () => {
      Glossary.getCreateUrl();
      browser.waitForAngular();

      Glossary.fillRequiredFields(
         "Word — " + uniqid() + " — Protractor",
         "Meaning — " + uniqid() + " — Protractor"
      );

      Glossary.save();
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
      Glossary.getCreateUrl();
      browser.waitForAngular();
      expect(Glossary.lblWord.getText()).toEqual("Palavra");
      expect(Glossary.lblMeaning.getText()).toEqual("Significado");
      expect(Glossary.lblDisplayInHome.getText()).toEqual("Exibir na Home?");
      
   });

   afterAll(() => {
      browser.manage().deleteAllCookies();
   });
});