var GLOBAL = require('../helper/globals.po.js')

var Teams = function() {
    /* Labels */
    this.lblWord = $('[translate="form_edit_word"]'); //Padronizar
    this.lblMeaning = $('[translate="form_edit_meaning"]'); //Padronizar
    this.lblOption = null; //Não esta conseguindo localizar pelo locator atual
    this.lblDisplayInHome = $('[class="form-label-box ng-binding"]'); //Padronizar
    
    /* Buttons */
    var btnNew = $('[data-e2e="btnNew"]');
    var btnSave = $('[data-e2e="btnSave"]');
    var btnActive = $('[data-e2e="btnInactive"]');
    var btnSaveAndReturn = $('[data-e2e="btnSaveReturn"]');

    /* Inputs */
    var inputCode = element(by.name('CodName'));
    var inputName = element(by.name('name'));
    var inputDescription = element(by.model('description'));
    
    /* URLS */
    this.url = {
        list: GLOBAL.BASE_URL + 'admin/security/teams',
        create: GLOBAL.BASE_URL + 'admin/security/teams/create/general'
    }

    /* Inputs */
    this.fillRequiredFields = (code, name) => {
        inputCode.sendKeys(code);
        inputName.sendKeys(name);
    }

    this.fillAllFields = (title, tags, url) => {
        inputTitle.sendKeys(title);
        inputUrl.sendKeys(url);
        inputTags.sendKeys(tags);
        inputTags.sendKeys(protractor.Key.ESCAPE);
        inputTags.sendKeys(protractor.Key.TAB);
    }

    this.checkHasFeatured = () => {
        inputHasFeatured.click();
    }
    /* Buttons */
    this.new = () => {
        btnNew.click();
    }

    this.save = () => {
        btnSave.click()
    }

    this.saveAndReturn = () => {
        btnSaveAndReturn.click()
    }

    this.activate = () => {
        btnActive.click()
    }
}

module.exports = new Teams();