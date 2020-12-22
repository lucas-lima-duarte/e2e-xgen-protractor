var Link = require('../page-objects/links.po.js');
var Login = require('../page-objects/login.po.js');
var GLOBAL = require('../helper/globals.po')
var uniqid = require('uniqid');

beforeAll(function () {
   Login.login(GLOBAL.LOGIN, GLOBAL.PASSWORD);
});

describe('Link Tests — Create', () => {

   beforeEach(() => {
      browser.get(Link.url.create);
      browser.waitForAngular();
   });
   it('Create an standard Link', () => {
      Link.fillRequiredFields("http://www.protractortest" + uniqid() + ".org");
      Link.save();
      browser.waitForAngular();
   });

   it('Create a Link with Has Featured checked', () => {
      Link.fillAllFields(
        "Title — Has featured — " + uniqid() + " — Protractor",
        "Tag — Has featured — " + uniqid() + " — Protractor",
        "http://www.protractortest" + uniqid() + ".org");
      Link.checkHasFeatured();
      Link.save();
      browser.waitForAngular();

      expect(element(by.name('hasFeatured'))
      .isSelected())
      .toBe(true);
   });

   it('Create a Link and activate', () => {
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
   
   it('Create a Link with Save & Return', () => {
    Link.fillAllFields(
        "Title — Save and Return — " + uniqid() + " — Protractor",
        "Tag — Save and Return — " + uniqid() + " — Protractor",
        "http://www.protractortest" + uniqid() + ".org");

      Link.saveAndReturn();
      browser.waitForAngular();

      expect(browser.getCurrentUrl()).toBe(Link.url.list);
   });

   it('Create a Link with Tags', () => {

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