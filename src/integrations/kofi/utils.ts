import {KofiData} from "./index";
// import * as puppeteer from 'puppeteer';

// const getEventName = async (shopItemCode: string): Promise<string> => {
//     const browser = await puppeteer.launch({headless: false});
//     const page = await browser.newPage();
//     await page.goto(`https://ko-fi.com/s/${shopItemCode}`, {waitUntil: 'networkidle2'});
//     console.log('?')
//     await page.screenshot({path: './screen.png'})
//     await page.waitForSelector('span.shop-item-title');
//     console.log('??')
//     const text = await page.$eval<string>('span.shop-item-title', el => {
//         console.log(el);
//         return el.textContent
//     });
//     console.log(text);
//
//     await browser.close();
//     return text;
// };

const buildKofiMessage = ({
                              type,
                              is_first_subscription_payment: isFirstSubscriptionPayment,
                              tier_name: tierName,
                              from_name: name,
                              is_public: isPublic,
                              // shop_items: shopItems,
                              message,
                          }: KofiData): string => {
    const sb = [];
    if (type === 'Donation') {
        sb.push(`Awesome, we just got a donation from ${name}!`);
    }
    if (type === 'Subscription') {
        if (isFirstSubscriptionPayment) {
            sb.push(`Amazing, we got a new subscriber${tierName ? ` to our ${tierName} tier` : ''} - ${name}!`);
        } else {
            sb.push(`Would you look at that, ${tierName ? `our ${tierName} ` : ''}${name} continues to support us!`)
        }
    }
    if (type === 'Shop Order') {
        // const eventName = await getEventName(shopItems[0].direct_link_code);
        sb.push(`Cool, ${name} bought a ticket to an event!`);
    }
    sb.push(`Thanks to you, we can thrive :pray:`);
    if (isPublic && message) {
        sb.push(`\nLet's hear what they have to say: "${message}"`);
    }
    return sb.join(' ');
}

export = {
    buildKofiMessage,
}
