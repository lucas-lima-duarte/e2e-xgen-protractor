var GLOBAL = require('../helper/globals.po.js')

var Glossary = function() {
    /* Labels */
    this.lblWord = $('[translate="form_edit_word"]'); //Padronizar
    this.lblMeaning = $('[translate="form_edit_meaning"]'); //Padronizar
    this.lblOption = null; //Não esta conseguindo localizar pelo locator atual
    this.lblDisplayInHome = $('[class="form-label-box ng-binding"]'); //Padronizar
    
    /* Buttons */
    var btnNew = $('[data-e2e="btnNew"]');
    var buttonSave = $('[data-e2e="btnSave"]');
    var btnActive = $('[data-e2e="btnInactive"]');
    var btnSaveAndReturn = $('[data-e2e="btnSaveReturn"]');

    /* Inputs */
    var inputWord = element(by.name('word'));
    var inputMeaning = element(by.name('meaning'));
    var inputHasFeatured = element(by.name('hasFeatured'));

    /* URLS */
    this.url = {
        list: GLOBAL.BASE_URL + 'admin/glossary',
        create: GLOBAL.BASE_URL + 'admin/glossary/create/general'
    }

    /* Inputs */
    this.fillRequiredFields = (word, meaning) => {
        inputWord.sendKeys(word);
        inputMeaning.sendKeys(meaning);
    }

    this.checkHasFeatured = () => {
        inputHasFeatured.click();
    }
    /* Buttons */
    this.new = () => {
        btnNew.click();
    }

    this.save = () => {
        buttonSave.click()
    }

    this.saveAndReturn = () => {
        btnSaveAndReturn.click()
    }

    this.activate = () => {
        btnActive.click()
    }
}

module.exports = new Glossary();