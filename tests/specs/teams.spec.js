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

   it('Create a Team and activate', () => {
    Teams.fillRequiredFields(
        "Code_Activate_" + uniqid() + "_Protractor",
        "Name — Activate — " + uniqid() + " — Protractor");

      Teams.activate();
      Teams.save();
      browser.waitForAngular();

      expect($('[data-e2e="btnInactive"]')
      .getAttribute('aria-hidden'))
      .toEqual('true');
   });
   
   it('Create a Team with Save & Return', () => {
    Teams.fillRequiredFields(
        "Code_Save_Return_" + uniqid() + "_Protractor",
        "Name — Save & Return — " + uniqid() + " — Protractor");

      Teams.saveAndReturn();
      browser.waitForAngular();

      expect(browser.getCurrentUrl()).toBe(Teams.url.list);
   });

  it('Create a Team with Description', () => {

    Teams.fillAllFields(
        "Code_With_Description_" + uniqid() + "_Protractor",
        "Name — with Description — " + uniqid() + " — Protractor",
        "Description — with Description — " + uniqid() + " — Protractor");

      Teams.save();
      browser.waitForAngular();
   });

   it('Create a Team with Max caracteres', () => {
      Teams.fillAllFields(
         "X--Code--Max--Caracteres--xxxxxxxxxxxxxxxxx" + uniqid() + "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
         "X--Name--Max--Caracteres--xxxxxxxxxxxxxxxxx" + uniqid() + "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
         "X--Description--Max--Caracteres--xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" + uniqid() + "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"     
      );
      
      Teams.save();
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