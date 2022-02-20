import { Request, Response } from 'express';

const discord = require('../../discord');
const { buildKofiMessage } = require('./utils');

type KofiType = 'Donation' | 'Subscription' | 'Commission' | 'Shop Order';
export type KofiData = {
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
    shop_items: { direct_link_code: string }[],
    tier_name: string,
};

export const kofiIntegrationHandler = async (req: Request, res: Response) => {
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

        if (data.verification_token !== process.env.KOFI_TOKEN) {
            console.error(`Incorrect token ${data.verification_token}`);
            return res.status(401).json({ error: 'Incorrect verification token' });
        }

        await discord.login();

        const message = buildKofiMessage(data);

        discord.getAnnouncementsChannel().send(message);
        console.log(`Message sent:\n`, message);
        return res.status(200).json({ data: { message }});
    } catch (e) {
        console.error(e.message);
        return res.status(500).json({ error: e.message });
    }
};
