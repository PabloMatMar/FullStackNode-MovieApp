const puppeteer = require('puppeteer')

const extractfilmaffinityData = async (url, browser) => {
    try {
        console.time(`${url}`);
        const filmaffinityData = {};
        const page = await browser.newPage();
        await page.goto(url);
        filmaffinityData['Title'] = await page.$eval("dd:nth-child(2)", name => name.innerHTML);
        filmaffinityData['Critics'] = await page.$eval("#pro-reviews > li:nth-child(1) > div > a > div", critica => critica.innerHTML.slice(0, (critica.innerHTML.indexOf("&"))));
        filmaffinityData['Punctuation'] = await page.$eval("#movie-rat-avg", note => note.innerHTML);
        console.timeEnd(`${url}`);
        return filmaffinityData;
    }
    catch (err) {
        return { err };
    }
}
const scrap = async (url) => {
    try {
        console.time("scrap");
        const scrapedData = [];
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(url);
        const tmpurls = await page.$$eval("div.mc-title > a", data => data.map(a => a.href));
        const urls = tmpurls.filter((link, index, arr) => arr.indexOf(link) == index);
        let i = 0;
        while (scrapedData.length == 0 && i < urls.length && i < 10) {
            const filmaffinity = await extractfilmaffinityData(urls[i], browser);
            filmaffinity.Critics != undefined && filmaffinity.Punctuation != undefined ? scrapedData.push(filmaffinity) : i++;
        };
        await browser.close()
        console.timeEnd("scrap")
        return scrapedData;
    } catch (err) {
        console.log("Error:", err);
    };
};

exports.scrap = scrap;