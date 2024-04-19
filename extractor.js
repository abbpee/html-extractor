import puppeteer, { TimeoutError } from 'puppeteer';
import {delay} from './utils.js';

var browser = null;
var destroyTimer = null;

// init browser if not exist and close after 10 minutes
async function initBrowser() {
    if (! browser) {
        browser = await puppeteer.launch({
            args: ['--ignore-certificate-errors', '--no-sandbox'],
        });
    }

    clearTimeout(destroyTimer);
    destroyTimer = setTimeout(destroyBrowser, 10 * 60 * 1000);
}

// close browser
async function destroyBrowser() {
    // TODO 
    await browser.close();
    browser = null;
}

// init browser new page
async function initPage() {
    let page = await browser.newPage();
    await page.setRequestInterception(true);
    page.on('request', (req) => {
        //console.log(req.resourceType() +'|||'+ req.url());
        switch(req.resourceType()) {
            case "image":
                req.abort();
                break;
            case "font":
                req.abort();
                break;

            case "script":
                let url = new URL(req.url());
                let abortDomains = ['gstatic.com', 'googleapis.com', 'yandex.net', 'google-analytics.com','yandex.ru','yastatic.net','yclients.com','googletagmanager.com'];
                let isAbort = false;
                for (let i = 0; i < abortDomains.length; i++) {
                    if (-1 !== url.hostname.indexOf(abortDomains[i])) {
                        isAbort = true;
                        break;
                    }
                }
                if (isAbort) {
                    req.abort();
                } else {
                    req.continue();
                }
                break;
            default: 
                req.continue();
        }
    });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/68.0.3419.0 Safari/537.36');
    return page;
}

// get full html of url
async function getHTML(url) {
    let html = '';

    try {
        await initBrowser();
        let page = await initPage();
    
        try {
            await page.goto(url, {timeout: 13000, waitUntil: 'networkidle0'});
        } catch (err) {
            if (! (err instanceof TimeoutError)) {
                throw err;
            }
        }

        await page.evaluate(() => {
            document.querySelectorAll('script, style, noscript, ymaps, iframe').forEach(e => {e.remove()});
        });
        html = await page.evaluate(() => {
            return document.querySelector('html').outerHTML;
        });
    
        await page.close();
    } catch (err) {
        try {
            await page.close();
        } catch (eee) {}

        console.error(err);
        throw err;
    }

    return html;
}


export default async function (url) {
    let res = await getHTML(url);

    return res;
}