var Login = require('../page-objects/login.po.js');

describe('Protractor Demo App', () => {
    beforeEach(() => {

    });

    it('Sucess login', async() => {

        await Login.get();
        await Login.fillForm('sys.admin', 'senha1234');
        await Login.login();

        expect(browser.getCurrentUrl()).toEqual('https://xgen-homolog.xgen.com.br/#/');

        await Login.exit();

    });

    // it('Password incorrect', async() => {

    //     await Login.get();
    //     await Login.fillForm();
    //     await Login.login();

    //     expect(browser.getCurrentUrl()).toEqual('https://xgen-homolog.xgen.com.br/#/');
    // });
});