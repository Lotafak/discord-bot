const {Client, Intents} = require("discord.js");

// Initialize Discord Bot
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING]});
let announcementsChannel;
let ready = false;

client.on('ready', () => {
    console.log('Connected');
    console.log(`Logged in as: ${client.user.tag}`);
    announcementsChannel = client.channels.cache.get('940708077320147004');
    ready = true;
});

const login = async () => {
    if (!ready) {
        client.login(process.env.TOKEN);
        ready = await new Promise((resolve) => client.on('ready', () => resolve(true)));
    }
    return ready;
}

export = {
    getAnnouncementsChannel: () => announcementsChannel,
    login,
};






// client.on('ready', function (evt) {
//     logger.info('Connected');
//     logger.info(`Logged in as: ${client.user.tag}`);

// const channel = client.channels.cache.get('940708077320147004');
// channel.send('Nice');
// });

// client.on('interactionCreate', async interaction => {
//     if (!interaction.isCommand()) return;
//
//     const {commandName} = interaction;
//
//     if (commandName === 'ping') {
//         await interaction.reply('Pong!');
//     }
// });