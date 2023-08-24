import { Message, MessageCollector } from "discord.js";
import { Keyword, Matchmaker } from "./interfaces";
import config from 'config'
import manageCooldown from "./cooldown";
import { sendReply } from "./sendresponse";
const keywords: Keyword[] = config.get('keywords')
const activeCollectors: Map<string, MessageCollector> = new Map()

// Checker for if string contains a keyword
const checker = (messageString: string, keywordArray: Keyword): boolean => {
    if (keywordArray.words) return keywordArray.words.some((keyword: string) => messageString.includes(keyword))
    return false
}

const loneChecker = (messageString: string, keywordArray: Keyword): boolean => {
    if (keywordArray.lonelyWords) return keywordArray.lonelyWords.some((keyword: string) => messageString === keyword)
    return false
}

const combinedChecker = (messageString: string, keywordArray: Keyword[]): Matchmaker => {
    const match: Keyword[] = [];
    const loneMatch: Keyword[] = [];
    keywordArray.forEach(keyword => {
        if (keyword.words) checker(messageString, keyword) ? match.push(keyword) : undefined
        if (keyword.lonelyWords) loneChecker(messageString, keyword) ? loneMatch.push(keyword) : undefined
    });
    return {match, loneMatch};
}    

export function handleIncomingMessage(message: Message): Matchmaker | undefined {
    if (message.author.bot) return

    // for whitelisting channels
    // if (message.guildId == '-1') {
    //     if (message.channelId != '-1') return
    // }
    
    const allMatchKeys = combinedChecker(message.content.toLowerCase(), keywords)

    if (config.get('enableCooldown')) { // if cooldowns are enabled
        allMatchKeys.match.forEach(keyword => {
            manageCooldown(message, keyword.id) ? allMatchKeys.match.splice(allMatchKeys.match.indexOf(keyword),1) : undefined
        })

        allMatchKeys.loneMatch.forEach(keyword => {
            manageCooldown(message, keyword.id) ? allMatchKeys.loneMatch.splice(allMatchKeys.loneMatch.indexOf(keyword),1) : undefined
        })
    }

    if (allMatchKeys.match.length + allMatchKeys.loneMatch.length) return allMatchKeys // if at least 1 match that is good or isn't cooled down
    return
}

export function tyCheck(message: Message) {
    if (activeCollectors.has(message.author.id)) {
        return
    }

    const thanksWords = ['ty', 'tänud', 'thank you', 'armastan sind']
    const filter = (m: Message) => thanksWords.some((keyword: string) => m.content.includes(keyword))
    const collector = message.channel.createMessageCollector({ filter, time: 30000 })
    collector.on('collect', m => {
        if (!m.author.bot) {
            if (m.content.includes('armastan sind')) {
                sendReply(m, 'mina sind ka')
            } else {
                const strings = ['np m8', 'my pleasure', '\"i didn\'t need yer help, ya know\"\n\\- demoman tf2', '👍', 'sama siin']
                sendReply(m, strings[Math.floor(Math.random() * strings.length)])
            }
            collector.stop()
            activeCollectors.delete(message.author.id)
        }
    })
    collector.on('end', (_collected, _reason) => {
        activeCollectors.delete(message.author.id)
    })

    activeCollectors.set(message.author.id, collector)
}