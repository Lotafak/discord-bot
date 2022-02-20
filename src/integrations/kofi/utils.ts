import {KofiData} from "./index";

const buildKofiMessage = ({
                              amount,
                              currency,
                              type,
                              is_first_subscription_payment: isFirstSubscriptionPayment,
                              tier_name: tierName,
                              from_name: name,
                              is_public: isPublic,
                              message,
                          }: KofiData): string => {
    const parsedAmount = `${Number.parseFloat(amount).toFixed(0)}${currency}`;
    const sb = [];
    if (type === 'Donation') {
        sb.push(`Awesome, we just got a ${parsedAmount} donation from ${name}!`);
    }
    if (type === 'Subscription') {
        if (isFirstSubscriptionPayment) {
            sb.push(`Amazing, we got a new subscriber to our ${parsedAmount} tier!`);
            tierName
                ? sb.push(`${name} has just become ${tierName}!`)
                : sb.push(`Thank you ${name}!`)
        } else {
            sb.push(`How nice, ${tierName ? `our ${tierName} ` : ''}${name} continues to support us for ${parsedAmount}!`)
        }
    }
    if (type === 'Shop Order') {
        sb.push(`Cool, ${name} bought a ticket to an event for ${parsedAmount}!`);
    }
    sb.push(`We promise your contribution won't go to waste :pray:`);
    if (isPublic && message) {
        sb.push(`\nLet's hear what they have to say: "${message}"`);
    }
    return sb.join(' ');
}

export = {
    buildKofiMessage,
}
