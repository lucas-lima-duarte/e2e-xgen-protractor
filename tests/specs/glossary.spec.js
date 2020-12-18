var Glossary = require('../page-objects/glossary.po.js');
var Login = require('../page-objects/login.po.js');
var GLOBAL = require('../helper/globals.po')
var uniqid = require('uniqid');

beforeAll(function () {
   Login.login(GLOBAL.LOGIN, GLOBAL.PASSWORD);
});

describe('Glossary Tests — Create', () => {

   beforeEach(() => {
      browser.get(Glossary.url.create);
      browser.waitForAngular();
   });
   xit('Create an standard Glossary', () => {
      Glossary.fillRequiredFields(
         "Word — Standard — " + uniqid() + " — Protractor",
         "Meaning — Standard — " + uniqid() + " — Protractor"
      );
      Glossary.save();
      browser.waitForAngular();
   });

   xit('Create a Glossary with Has Featured checked', () => {
      Glossary.fillRequiredFields(
         "Word — Has Featured Checked — " + uniqid() + " — Protractor",
         "Meaning — Has Featured Checked — " + uniqid() + " — Protractor"
      );
      Glossary.checkHasFeatured();
      Glossary.save();
      browser.waitForAngular();

      expect(element(by.name('hasFeatured'))
      .isSelected())
      .toBe(true);
   });

   xit('Create a Glossary and activate', () => {
      Glossary.fillRequiredFields(
         "Word — Activate — " + uniqid() + " — Protractor",
         "Meaning — Activate — " + uniqid() + " — Protractor"
      );
      Glossary.activate();
      Glossary.save();
      browser.waitForAngular();

      expect($('[data-e2e="btnInactive"]')
      .getAttribute('aria-hidden'))
      .toEqual('true');
   });
   xit('Create a Glossary with Save & Return', () => {
      Glossary.fillRequiredFields(
         "Word — Save & Return — " + uniqid() + " — Protractor",
         "Meaning — Save & Return — " + uniqid() + " — Protractor"
      );
      Glossary.saveAndReturn();
      browser.waitForAngular();

      expect(browser.getCurrentUrl()).toBe(Glossary.url.list);
   });
   it('Create a Glossary with Max caracteres', () => {
      Glossary.fillRequiredFields(
         "X------------------------------------Word — Max caracteres — " + uniqid() +" — Protractor ------------------------------------X",
         "X --------------------------------------------------------------------------------- Meaning — Save & Return — " + uniqid() + " — Protractor X ----------------------------------------------------------------------------------"
      );
      Glossary.save();
      browser.waitForAngular();

   });
});

xdescribe('Glossary Tests — Check all labels [pt-br] from:', () => {
   it('General', () => {
      browser.get(Glossary.url.create);
      browser.waitForAngular();
      expect(Glossary.lblWord.getText()).toEqual("Palavra");
      expect(Glossary.lblMeaning.getText()).toEqual("Significado");
      //expect(Glossary.lblOption).toEqual("Opções");
      expect(Glossary.lblDisplayInHome.getText()).toEqual("Exibir na Home?");  
   });
});

afterAll(() => {
   browser.manage().deleteAllCookies();
});