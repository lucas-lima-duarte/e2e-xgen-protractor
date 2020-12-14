var GLOBAL = require('../helper/globals.po.js')

var Glossary = function() {
    /* Labels */
    this.lblWord = $('[translate="form_edit_word"]'); //Padronizar
    this.lblMeaning = $('[translate="form_edit_meaning"]'); //Padronizar
    this.lblDisplayInHome = $('[class="form-label-box ng-binding"]'); //Padronizar
    
    /* Buttons */
    var btnNew = $('[data-e2e="btnNew"]');
    var buttonSave = $('[data-e2e="btnSave"]');

    /* Inputs */
    var inputWord = element(by.name('word'));
    var inputMeaning = element(by.name('meaning'));

    /* URLS */
    this.url = {
        list: GLOBAL.BASE_URL + 'admin/glossary',
        create: GLOBAL.BASE_URL + 'admin/glossary/create/general'
    }

    
    this.fillRequiredFields = (word, meaning) => {
        inputWord.sendKeys(word);
        inputMeaning.sendKeys(meaning);
    }
    
    this.new = () => {
        btnNew.click();
    }

    this.save = () => {
        buttonSave.click()
    }
}

module.exports = new Glossary();