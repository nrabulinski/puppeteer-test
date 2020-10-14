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
    await page.evaluateOnNewDocument(({ platform, productSub, vendor, oscpu, cpuClass }) => {
        Object.defineProperty(navigator, 'platform', platform);
        Object.defineProperty(navigator, 'productSub', productSub);
        Object.defineProperty(navigator, 'vendor', vendor);
        Object.defineProperty(navigator, 'oscpu', oscpu);
        Object.defineProperty(navigator, 'cpuClass', cpuClass);
        Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
        Object.defineProperty(navigator, 'plugins', { get: () => [] });
    }, {
        platform:
            fakeUserAgent.OS === 'iOS' ? { get: () => 'iPhone' } :
            fakeUserAgent.OS === 'Windows' ? { get: () => 'Win32' } :
            fakeUserAgent.OS === 'Linux' ? { get: () => 'Linux x86_64' } :
            fakeUserAgent.OS === 'macOS' ? { get: () => 'MacIntel' } :
            { get: () => 'Win32' },
        productSub:
            fakeUserAgent.name.startsWith('Internet Explorer') ? { get: () => undefined } :
            fakeUserAgent.name.startsWith('Firefox') ? { get: () => '20100101' } :
            fakeUserAgent.name.startsWith('Chrome') ? { get: () => '20030107' } :
            { get: () => '20030107' },
        vendor:
            fakeUserAgent.OS === 'iOS' ? { get: () => 'Apple Computer, Inc.' } :
            fakeUserAgent.name.startsWith('Chrome') ? { get: () => 'Google Inc.' } :
            { get: () => '' },
        oscpu:
            fakeUserAgent.name.startsWith('Firefox') ? { get: () => 'Windows NT 10.0; Win64; x64' } :
            { get: () => undefined },
        cpuClass:
            fakeUserAgent.name.startsWith('Internet Explorer') ? { get: () => 'x86' } :
            { get: () => undefined }
    });
    return page;
};