import { Request, Response } from 'express';

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

        let data: KofiData;
        try {
            const parsed = JSON.parse(req.body);
            data = parsed.data;
        } catch (e) {
            data = JSON.parse(req.body.data);
        }
        console.log('final data:\n', data);

        const {
            from_name: name,
            message,
            amount,
            currency,
            is_public: isPublic,
            verification_token,
            type,
            is_first_subscription_payment: isFirstSubscriptionPayment,
            tier_name: tierName,
        }: KofiData = data;

        if (verification_token !== process.env.KOFI_TOKEN) {
            console.error(`Incorrect token ${verification_token}`);
            return res.status(401).json({ error: 'Incorrect verification token' });
        }

        await discord.login();

        const parsedAmount = `${Number.parseFloat(amount).toFixed(0)}${currency}`;
        const stringBuilder = [];
        if (type === 'Donation') {
            stringBuilder.push(`Awesome, we just got a ${parsedAmount} donation from ${name}!`);
        }
        if (type === 'Subscription') {
            if (isFirstSubscriptionPayment) {
                stringBuilder.push(`Amazing, we got a new subscriber to our ${parsedAmount} tier! ${name} has just became ${tierName}`);
            } else {
                stringBuilder.push(`Nice, our ${tierName} ${name} is still with us!`);
            }
        }
        if (type === 'Shop Order') {
            stringBuilder.push(`Cool, a ticket to an event has been bought by ${name} for ${parsedAmount}!`);
        }
        stringBuilder.push(`We promise your contribution won't go to waste :pray:`);
        if (isPublic && message) {
            stringBuilder.push(`\nLet's hear what they have to say: "${message}"`);
        }
        const finalMessage = stringBuilder.join(' ');

        discord.getAnnouncementsChannel().send(finalMessage);
        console.log(`Message sent:\n`, finalMessage);
        return res.status(200).json({ data: { message: finalMessage }});
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ error: e.message });
    }
};

export = {
    kofiIntegrationHandler,
};