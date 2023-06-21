const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { enableCooldown, cooldownLength, keywords } = require('./options.json');
const xpath = require('xpath');
const parse5 = require('parse5');
const xmlser = require('xmlserializer');
const dom = require('@xmldom/xmldom').DOMParser;

const cooldowns = {};
// for (const key in keywords) {
//     cooldowns[key] = {};
// }
// console.log(cooldowns);

// Checker for if string contains any of the keywords
const checker = (messageString, keywordArray) => keywordArray.some(keyword => messageString.includes(keyword));

const loneChecker = (messageString, keywordArray) => keywordArray.some(keyword => messageString === keyword);

const checker2 = (messageString, keywordArray) => {
    const out: string[] = [];
    for (const key in keywordArray) { // check every keyword
        if (checker(messageString, keywordArray[key].words)) {
            out.push(key);
        }
        if (loneChecker(messageString, keywordArray[key].lonelyWords)) {
            out.push(key);
        }
    }
    return out;
}
// console.log(checker2("niiskus on kõrge ja tuul on tugev, yo", keywords));

function getSentence(key, nodes) {
    if (key === "niiskus") {
        return keywords[key].data.response + nodes[keywords[key].data.position].data.substring(0, nodes[keywords[key].data.position].data.length - 2) + '%';
    } else {
        return keywords[key].data.response + nodes[keywords[key].data.position].data;
    }
}

function sendReply(message, values) {
    message.reply({
        content: `${values.join('\n')}`,
        allowedMentions: {
            repliedUser: false
        }
    });
}

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on('messageCreate', async message => {
    if (message.author.bot) return;
    const allMatchKeys: string[] = checker2(message.content.toLowerCase(), keywords);
    if (allMatchKeys && allMatchKeys.length) {
        // COOLDOWN IS BROKEN, DO NOT USE
        if (enableCooldown) { // if cooldowns are enabled
            // for (const key in pos) {
            //     if (cooldowns[key][message.guildId] >= Date.now()) {
            //         console.log(`(${new Date(Date.now()).toISOString()}) Cooldown @ ${message.guild} for ${key} until ${new Date(cooldowns[message.guildId]).toISOString()}`);
            //     } else {
            //         cooldowns[key][message.guildId] = Date.now() + cooldownLength;
            //     }
            // }

            // if (cooldowns[message.guildId] >= Date.now()) {
            //     console.log(`(${new Date(Date.now()).toISOString()}) Cooldown @ ${message.guild} kuni ${new Date(cooldowns[message.guildId]).toISOString()}`);
            //     return;
            // };
            // cooldowns[message.guildId] = Date.now() + cooldownLength;
        }
        await fetch('https://meteo.physic.ut.ee/et/frontmain.php?m=2').then(res => res.text()).then(html => {
            const p5doc = parse5.parse(html);
            const xhtml = xmlser.serializeToString(p5doc);
            const doc = new dom().parseFromString(xhtml);
            const select = xpath.useNamespaces({ "x": "http://www.w3.org/1999/xhtml" });
            const nodes = select("//x:b/text()", doc);

            let values: string[] = [];
            
            if (allMatchKeys.includes("ilm")) {
                for (const key in keywords) {
                    if (key !== "ilm") {
                        values.push(getSentence(key, nodes));
                    }
                }
                sendReply(message, values);
                return;
            } else {
                allMatchKeys.forEach(key => {
                    values.push(getSentence(key, nodes));
                });
                sendReply(message, values);
            }            
        })
    }
});

// Log in to Discord with your client's token
client.login(token);
