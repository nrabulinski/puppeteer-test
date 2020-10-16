/**
 * Creates a page with fake user-agent and viewport
 * @returns {import('puppeteer').Page}
 */
module.exports = async (browser, fakeUserAgent) => {
    const page = await browser.newPage();
    await page.setUserAgent(fakeUserAgent.UA);
    const viewport = fakeUserAgent.OS === 'iOS'
        ? {
            width: 375, height: 812,
            isLandscape: false,
            isMobile: true,
            hasTouch: true
        }
        : {
            width: 1280, height: 720,
            isLandscape: true,
            isMobile: false,
            hasTouch: false
        };
    await page.setViewport(viewport);
    await page.evaluateOnNewDocument((platform, productSub, vendor, oscpu, cpuClass) => {
        Object.defineProperty(navigator, 'platform', { get: () => platform });
        Object.defineProperty(navigator, 'productSub', { get: () => productSub });
        Object.defineProperty(navigator, 'vendor', { get: () => vendor });
        Object.defineProperty(navigator, 'oscpu', { get: () => oscpu });
        Object.defineProperty(navigator, 'cpuClass', { get: () => cpuClass });
        Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
        Object.defineProperty(navigator, 'plugins', { get: () => [] });
        delete Object.getPrototypeOf(navigator).webdriver;
    },
        getPlatform(fakeUserAgent),
        getProductSub(fakeUserAgent),
        getVendor(fakeUserAgent),
        getOsCpu(fakeUserAgent),
        getCpuClass(fakeUserAgent)
    );
    return page;
};

const getPlatform = ({ OS }) =>
    OS === 'iOS' ? 'iPhone' :
    OS === 'Linux' ? 'Linux x86_64' :
    OS === 'macOS' ? 'MacIntel' :
    'Win32';

const getProductSub = ({ name }) =>
    name.startsWith('Internet Explorer') ? undefined :
    name.startsWith('Firefox') ? '20100101' :
    '20030107';

const getVendor = ({ OS, name }) =>
    OS === 'iOS' ? 'Apple Computer, Inc.' :
    name.startsWith('Chrome') ? 'Google Inc.' :
    '';

const getOsCpu = ({ name }) =>
    name.startsWith('Firefox') ? 'Windows NT 10.0; Win64; x64' :
    '';

const getCpuClass = ({ name }) =>
    name.startsWith('Internet Explorer') ? 'x86' :
    undefined;