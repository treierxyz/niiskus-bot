import { Snowflake } from "discord.js"

export interface Keyword {
    id: string,
    words?: string[],
    lonelyWords?: string[],
    response?: {
        [lang: string]: string
    },
    failedResponse?: {
        [lang: string]: string
    }
}

export interface Cooldowns {
    [index: Snowflake]: {
        [id: string]: Date
    }
}

export interface Rounding {
    [id: string]: number
}

export interface Matchmaker {
    match: Keyword[],
    loneMatch: Keyword[]
}