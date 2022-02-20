const {Client, Intents} = require("discord.js");
const logger = require('winston');

// Initialize Discord Bot
const client = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_TYPING]});
let announcementsChannel;

client.on('ready', () => {
    logger.info('Connected');
    logger.info(`Logged in as: ${client.user.tag}`);
    announcementsChannel = client.channels.cache.get('940708077320147004');
});

export = {
    client,
    // announcementsChannel: client.channels.cache.get('940708077320147004'),
    getAnnouncementsChannel: () => announcementsChannel,
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