var GLOBAL = require('../helper/globals.po.js')

var Login = function() {

    var inputLogin = $('[data-e2e="txtUsername"]');
    var inputPassword = $('[data-e2e="txtPassword"]');
    var btnLogin = $('[ng-show="!vm.show"]');
    var exit = element(by.linkText('Sair'));

    this.navigateTo = () => {
        browser.get(GLOBAL.MAIN);
    };

    this.fullLogin = (username, password) => {
        inputLogin.sendKeys(username);
        inputPassword.sendKeys(password)
        btnLogin.click();
    }
    
};

module.exports = new Login();