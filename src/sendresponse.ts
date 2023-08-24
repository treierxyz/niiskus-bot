import { Message } from "discord.js";
import { tyCheck } from "./handlemsg";

export function sendReply(message: Message, response: string) {
    message.reply({
        content: response,
        allowedMentions: {
            repliedUser: false
        }
    });
}

export function sendReplyWithThanks(message: Message, response: string) {
    message.reply({
        content: response,
        allowedMentions: {
            repliedUser: false
        }
    });
    tyCheck(message) // start thank you collector
}