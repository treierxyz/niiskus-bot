import { Client, Events, GatewayIntentBits } from 'discord.js'
import 'dotenv/config'
import logger from './logger';
import { handleIncomingMessage } from './handlemsg';
import { generateReply } from './generateresponse';
import { sendReplyWithThanks } from './sendresponse';

const token = process.env.TOKEN;
if (token === undefined) {
    logger.error('You didn\'t supply a bot token! Please add the environment variable `TOKEN=replace.me.pretty.please` either into `.env` or any other valid way!')
    process.exit(1)
}

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    logger.info(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', async message => {
    generateReply(handleIncomingMessage(message)).then((reply) => {
        if (reply === undefined) {
            return
        }
        else {
            sendReplyWithThanks(message, reply)
        }
    })
})

// Log in to Discord with your client's token
client.login(token);
