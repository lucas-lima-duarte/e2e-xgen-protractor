var Glossary = require('../page-objects/glossary.po.js');
var Login = require('../page-objects/login.po.js');
var GLOBAL = require('../helper/globals.po')
var uniqid = require('uniqid');

beforeAll(function () {
   Login.login(GLOBAL.LOGIN, GLOBAL.PASSWORD);
});

xdescribe('Glossary Tests — Create', () => {
   it('Create an standard Glossary', () => {
      browser.get(Glossary.url.create);
      browser.waitForAngular();

      Glossary.fillRequiredFields(
         "Word — " + uniqid() + " — Protractor",
         "Meaning — " + uniqid() + " — Protractor"
      );

      Glossary.save();
      browser.waitForAngular();
   });
});

describe('Glossary Tests — Check all labels [pt-br] from:', () => {
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