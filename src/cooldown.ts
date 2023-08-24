import { Cooldowns } from "./interfaces";
import { Message } from "discord.js";
import logger from "./logger";
import config from 'config'

const cooldowns: Cooldowns = {};
const cooldownLength: number = config.get('cooldownLength')

function manageCooldown(message: Message, keywordId: string): boolean {
    if (message.guildId) {
        if (cooldowns?.[message.guildId]?.[keywordId] && cooldowns[message.guildId][keywordId].getTime() >= Date.now()) { // check if already cooled down
            logger.info(`Cooldown @ ${message.guild} for "${keywordId}" until ${cooldowns[message.guildId][keywordId].toISOString()}`);
            return true
        } else { // else if no cooldown
            cooldowns[message.guildId] = {
                ...(cooldowns[message.guildId] || {}),
                [keywordId]: new Date(Date.now() + cooldownLength) // add one
            }
            return false
        }
    }
    return true
}

export default manageCooldown