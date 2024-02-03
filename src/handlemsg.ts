import { Message, MessageCollector } from "discord.js";
import { FullOutput, Keyword, Thanks } from "./interfaces";
import config from "config";
import manageCooldown from "./cooldown";
import { sendReply } from "./sendresponse";
const keywords: Keyword[] = config.get("keywords");
const fullout: FullOutput = config.get("full_output");
const activeCollectors: Map<string, MessageCollector> = new Map();

// Checker for if string contains a keyword
const checker = (messageString: string, keywordArray: Keyword): boolean => {
	if (keywordArray.words)
		return keywordArray.words.some((keyword: string) =>
			messageString.includes(keyword),
		);
	return false;
};

const combinedChecker = (
	messageString: string,
	keywordArray: Keyword[],
): Keyword[] => {
	const match: Keyword[] = [];

	// first pass only for full output
	if (fullout.words) {
		if (
			fullout.words.some((keyword: string) => messageString.includes(keyword))
		) {
			return keywords;
		}
	}
	if (fullout.lonelyWords) {
		if (
			fullout.lonelyWords.some((keyword: string) => messageString === keyword)
		) {
			return keywords;
		}
	}

	for (const keyword of keywordArray) {
		if (keyword.words)
			checker(messageString, keyword) ? match.push(keyword) : undefined;
	}
	return match;
};

export function handleIncomingMessage(message: Message): Keyword[] | undefined {
	if (message.author.bot) return;

	// for whitelisting channels
	// if (message.guildId == '-1') {
	//     if (message.channelId != '-1') return
	// }

	let allMatchKeys = combinedChecker(message.content.toLowerCase(), keywords);

	if (config.get("enableCooldown")) {
		// if cooldowns are enabled
		const filtered = allMatchKeys.filter(
			(kw) => !manageCooldown(message, kw.id),
		);
		allMatchKeys = filtered;
	}

	if (allMatchKeys.length) return allMatchKeys; // if at least 1 match that is good or isn't cooled down
	return;
}

export function tyCheck(message: Message) {
	if (activeCollectors.has(message.author.id)) {
		return;
	}

	const thanks: Thanks[] = config.get("thanks");

	const filter = (m: Message) =>
		thanks.some((thank: Thanks) =>
			thank.words.some((keyword: string) =>
				m.content.toLowerCase().includes(keyword),
			),
		);
	const collector = message.channel.createMessageCollector({
		filter,
		time: 30000,
	});

	collector.on("collect", (m) => {
		if (!m.author.bot) {
			for (const thank of thanks) {
				if (
					thank.words.some((keyword: string) =>
						m.content.toLowerCase().includes(keyword),
					)
				) {
					const randResponse: string =
						thank.responses[Math.floor(Math.random() * thank.responses.length)];
					sendReply(m, randResponse);
				}
			}
			collector.stop();
			activeCollectors.delete(message.author.id);
		}
	});
	collector.on("end", (_collected, _reason) => {
		activeCollectors.delete(message.author.id);
	});

	activeCollectors.set(message.author.id, collector);
}
