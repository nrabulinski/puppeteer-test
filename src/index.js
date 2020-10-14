const puppeteer = require('puppeteer');
const randomize = require('randomatic');
const preparePage = require('./preparePage');
const fakeUAs = JSON.parse(require('fs').readFileSync('./UAs.json'));
const fakeUserAgent = fakeUAs[Math.floor(Math.random() * fakeUAs.length)];

(async () => {
    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            `--user-agent=${fakeUserAgent.UA}`
        ]
    });
    const page = await preparePage(browser, fakeUserAgent);

    await page.goto('https://testing-default-dot-authentic-realm-252808.appspot.com/');
    await page.waitForTimeout(1000);
    await page.waitForSelector('.lever')
        .then(elem => elem.click());
    await page.waitForSelector('#go-to-login')
        .then(elem => elem.click());
    await page.waitForSelector('#login-portal__usernameOrEmail')
        .then(elem => elem.evaluate((target, value) => {
            target.value = value;
        }, `${randomize('a', 10)}@gmail.com`));
    await page.waitForSelector('#login-portal__password')
        .then(elem => elem.evaluate((target, value) => {
            target.value = value;
        }, randomize('*', 16)));
    console.log(page.url());
    await page.waitForSelector('#login-portal__meteor-login')
        .then(elem => elem.click());
    await page.waitForTimeout(500);
    await page.screenshot({
        fullPage: true,
        path: 'screenshot.png'
    });
    await browser.close();
})();