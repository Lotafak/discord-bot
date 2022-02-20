import "jest";

const {buildKofiMessage} = require('./utils');

describe('kofi utils', () => {
    describe('buildKofiMessage', () => {
        const data = {
            message_id: "3a1fac0c-f960-4506-a60e-824979a74e74",
            timestamp: "2022-08-21T13:04:30Z",
            type: "Donation",
            is_public: true,
            from_name: "Ko-fi Team",
            message: "Good luck with the integration!",
            amount: "3.00",
            url: "https://ko-fi.com/Home/CoffeeShop?txid=0a1fac0c-f960-4506-a60e-824979a74e71",
            email: "someone@example.com",
            currency: "USD",
            is_subscription_payment: false,
            is_first_subscription_payment: false,
            kofi_transaction_id: "0a1fac0c-f960-4506-a60e-824979a74e71",
            verification_token: "12ff1065-85d9-4cb7-b1bd-c7b1f85893a2",
            shop_items: null,
            tier_name: null
        };

        it('Can handle donation', () => {
            const message = buildKofiMessage(data);

            expect(message).toBe("Awesome, we just got a 3USD donation from Ko-fi Team! We promise your contribution won't go to waste :pray: \nLet's hear what they have to say: \"Good luck with the integration!\"");
        });

        it('Can handle first subscription', () => {
            const message = buildKofiMessage({...data, type: 'Subscription', is_first_subscription_payment: true});

            expect(message).toBe("Amazing, we got a new subscriber to our 3USD tier! Thank you Ko-fi Team! We promise your contribution won't go to waste :pray: \nLet's hear what they have to say: \"Good luck with the integration!\"");
        });

        it('Can handle first subscription with tier name', () => {
            const message = buildKofiMessage({...data, type: 'Subscription', is_first_subscription_payment: true, tier_name: 'Mana Soldier'});

            expect(message).toBe("Amazing, we got a new subscriber to our 3USD tier! Ko-fi Team has just become Mana Soldier! We promise your contribution won't go to waste :pray: \nLet's hear what they have to say: \"Good luck with the integration!\"");
        });

        it('Can handle recurring subscription without message', () => {
            const message = buildKofiMessage({...data, type: 'Subscription', message: ''});

            expect(message).toBe("How nice, Ko-fi Team continues to support us for 3USD! We promise your contribution won't go to waste :pray:");
        });

        it('Can handle subscription with tier name', () => {
            const message = buildKofiMessage({...data, type: 'Subscription', message: '', tier_name: 'Mana warrior'});

            expect(message).toBe("How nice, our Mana warrior Ko-fi Team continues to support us for 3USD! We promise your contribution won't go to waste :pray:");
        });

        it('Can handle shop item', () => {
            const message = buildKofiMessage({...data, type: 'Shop Order', message: ''});

            expect(message).toBe("Cool, Ko-fi Team bought a ticket to an event for 3USD! We promise your contribution won't go to waste :pray:");
        });
    });
});