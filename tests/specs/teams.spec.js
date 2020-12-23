var Teams = require('../page-objects/teams.po.js');
var Login = require('../page-objects/login.po.js');
var GLOBAL = require('../helper/globals.po')
var uniqid = require('uniqid');

beforeAll(function () {
   Login.login(GLOBAL.LOGIN, GLOBAL.PASSWORD);
});

describe('Teams Tests — Create', () => {

   beforeEach(() => {
      browser.get(Teams.url.create);
      browser.waitForAngular();
   });
   it('Create an standard Team', () => {
      Teams.fillRequiredFields(
          "Code_Standard_" + uniqid() + "_Protractor",
          "Name — Standard — " + uniqid() + " — Protractor");
      Teams.save();
      browser.waitForAngular();
   });

   xit('Create a Team and activate', () => {
      Link.fillAllFields(
        "Title — Activate — " + uniqid() + " — Protractor",
        "Tag — Activate — " + uniqid() + " — Protractor",
        "http://www.protractortest" + uniqid() + ".org");

      Link.activate();
      Link.save();
      browser.waitForAngular();

      expect($('[data-e2e="btnInactive"]')
      .getAttribute('aria-hidden'))
      .toEqual('true');
   });
   
   xit('Create a Link with Save & Return', () => {
    Link.fillAllFields(
        "Title — Save and Return — " + uniqid() + " — Protractor",
        "Tag — Save and Return — " + uniqid() + " — Protractor",
        "http://www.protractortest" + uniqid() + ".org");

      Link.saveAndReturn();
      browser.waitForAngular();

      expect(browser.getCurrentUrl()).toBe(Link.url.list);
   });

  xit('Create a Link with Tags', () => {

      Link.fillAllFields(
          "Title — With tags — " + uniqid() + " — Protractor",
          "Tag — With tags — " + uniqid() + " — Protractor",
          "http://www.protractortest" + uniqid() + ".org");

      Link.save();
      browser.waitForAngular();
   });

   xit('Create a Link with Max caracteres', () => {
      Link.fillAllFields(
         "X------Title — Max caracteres " + uniqid() + " — Protractor ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------X",
         "Tag — Max caracteres",
         "http://www.X------UrlMaxCaracteres" + uniqid() + "Protractor--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------X.org"
         
      );
      
      Link.save();
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