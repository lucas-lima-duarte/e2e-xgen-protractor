var GLOBAL = require('../helper/globals.po.js')

var Login = function() {

    this.url = 'https://tenant3-homolog.xgen.com.br/#/';

    var inputLogin = $('[data-e2e="txtUsername"]');
    var inputPassword = $('[data-e2e="txtPassword"]');
    var btnLogin = $('[ng-show="!vm.show"]');
    var exit = element(by.linkText('Sair'));

    this.navigateTo = () => {
        browser.get(GLOBAL.BASE_URL);
    };

    this.login = (username, password) => {
        browser.get(this.url);
        browser.waitForAngular();

        inputLogin.sendKeys(username);
        inputPassword.sendKeys(password)
        btnLogin.click();
        browser.waitForAngular();
    }
    
};

module.exports = new Login();