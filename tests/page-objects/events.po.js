var GLOBAL = require('../helper/globals.po.js')

var Events = function() {
    /* GENERAL */

    /* Variables */

    /* Methods */
    this.getDatagridUrl = () => {
        browser.get(GLOBAL.DGEVENTS);
    };

    this.getCreateUrl = () => {
        browser.get(GLOBAL.CREATE_EVENTS);
    };

    this.new = () => {
        btnNew.click();
    }

    /* DATA GRID */

    /* Variables */
    // var lblTitle = element(by.class('.admin-title first-crumb ng-binding'));

    var btnNew = $('[data-e2e="btnNew"]');
    
    /* Methods */

    /* CREATE FORM */
    
    //Create Form
    var inputTitle = element(by.model('vm.model.title'));
    var inputReview = element(by.model('vm.model.summary'));
    var inputContent = $('[ng-if="!!vm.newpath"]');
    var optionsType = element.all(by.model('vm.model.type'));
    var celebrationOption = optionsType.first();
    var inputLocal = element(by.model('vm.model.title'));

    this.fillRequiredFields = (title, review, content, eventType, location) => {
        inputTitle.sendKeys(title);
        inputReview.sendKeys(review);
        inputContent.sendKeys(content);
        inputType.sendKeys(type); //Como vou pegar o dado no combo ?
        inputLocal.sendKeys(location);
    }
}

module.exports = new Events();