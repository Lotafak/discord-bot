import { Request, Response } from 'express';

const logger = require('winston');

const discord = require('../../discord');

type KofiType = 'Donation' | 'Subscription' | 'Commission' | 'Shop Order';
type KofiData = {
    message_id: string,
    timestamp: Date,
    type: KofiType,
    is_public: boolean,
    from_name: string,
    message: string,
    amount: string,
    url: string,
    email: string,
    currency: string,
    is_subscription_payment: boolean,
    is_first_subscription_payment: boolean,
    kofi_transaction_id: string,
    verification_token: string,
    shop_item: { direct_link_code: string }[],
    tier_name: null,
};

const kofiIntegrationHandler = async (req: Request, res: Response) => {
    try {
        console.log('kofiIntegrationHandler request', req.body);

        await discord.login();
        const {from_name: name, message, amount, currency, is_public: isPublic, verification_token}: KofiData = <any>req.body.data;

        if (verification_token !== process.env.KOFI_TOKEN) {
            logger.error(`Incorrect token ${verification_token}`);
            return res.status(401).json({ error: 'Incorrect verification token' });
        }

        const parsedAmount = Number.parseFloat(amount).toFixed(0);
        const stringBuilder = [];
        stringBuilder.push(`Awesome, we just got a ${parsedAmount}${currency} donation from ${name}!`);
        stringBuilder.push(`We promise you're contribution won't go to waste :pray:`);
        if (isPublic && message) {
            stringBuilder.push(`\nLet's hear what they have to say: "${message}"`);
        }
        const finalMessage = stringBuilder.join(' ');

        discord.getAnnouncementsChannel().send(finalMessage);
        console.log(`Message sent`, finalMessage);
        return res.status(200).json({ data: { message: finalMessage }});
    } catch (e) {
        logger.error(e.message);
        return res.status(500).json({ error: e.message });
    }
};

export = {
    kofiIntegrationHandler,
};