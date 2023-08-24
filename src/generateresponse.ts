import { Keyword, Matchmaker, Rounding } from "./interfaces"
import config from 'config'
import getMetric from "./handledata";
import fetchWeather from "./fetchdata";
const lang: string = config.get('language')
const round: Rounding = config.get('rounding')
const keywords: Keyword[] = config.get('keywords')

function getLocalizedString(key: Keyword, weatherData: any) {
    const regex: RegExp = /\${(.*?)}/g
    const template = key.response![lang]
    try {
        return template.replace(regex, (_match, placeholder): string => {
            const result = getMetric(placeholder, weatherData)
            if (result === null) {
                throw new Error('Result is null')
            }
            return result.toFixed(round[placeholder])
        
        })
    } catch (error) {
        return key.failedResponse![lang]
    }
}

function getSentence(key: Keyword, weatherData: any) {
    switch (key.id) {
        case 'humidity':
        case 'temperature':
        case 'wind':
        case 'air_pressure':
        case 'precipitation':
        case 'heat_index':
            return getLocalizedString(key, weatherData)
        default:
            return null
    }
}

export async function generateReply(allMatchKeys: Matchmaker | undefined) {
    if (allMatchKeys === undefined) {
        return
    }

    const weatherData = await fetchWeather()
    
    const strings: string[] = [];

    if (allMatchKeys.loneMatch.length) {  
        allMatchKeys.loneMatch.forEach(keyword => {
            switch (keyword.id) {
                case 'all':
                    keywords.forEach(kw => {
                        const sentence = getSentence(kw, weatherData)
                        if (sentence !== null) strings.push(sentence)
                    })
            }
        })
    } else {
        allMatchKeys.match.forEach(keyword => {
            const sentence = getSentence(keyword, weatherData)
            if (sentence !== null) strings.push(sentence)
        })
    }
    return strings.join('\n')
}