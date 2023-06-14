const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { enableCooldown, cooldownLength, keywords } = require('./options.json');
const xpath = require('xpath');
const parse5 = require('parse5');
const xmlser = require('xmlserializer');
const dom = require('@xmldom/xmldom').DOMParser;

const cooldowns = {};

// Checker for if string contains any of the keywords
const checker = value => keywords.some(keyword => value.includes(keyword));

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;

    if (checker(message.content.toLowerCase())) {
        if (enableCooldown) { // if cooldowns are enabled
            if (cooldowns[message.guildId] >= Date.now()) {
                console.log(`(${new Date(Date.now()).toISOString()}) Cooldown @ ${message.guild} kuni ${new Date(cooldowns[message.guildId]).toISOString()}`);
                return;
            };
            cooldowns[message.guildId] = Date.now() + cooldownLength;
        }
        await fetch('https://meteo.physic.ut.ee/et/frontmain.php?m=2').then(res => res.text()).then(html => {
            const p5doc = parse5.parse(html);
            const xhtml = xmlser.serializeToString(p5doc);
            const doc = new dom().parseFromString(xhtml);
            const select = xpath.useNamespaces({ "x": "http://www.w3.org/1999/xhtml" });
            const nodes = select("//x:b/text()", doc);

            const väärtus = nodes[1].data.substring(0, nodes[1].data.length - 2);
            message.reply({
                content: `niiskus on ${väärtus + '%'}`,
                allowedMentions: {
                    repliedUser: false
                }
            });
        })
    }
});

// Log in to Discord with your client's token
client.login(token);
