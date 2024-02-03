import {
	GrafanaQueryResult,
	Keyword,
	PWQueryResult,
	Rounding,
	WeatherDataCommon,
} from "./interfaces";
import config from "config";
import { grafanaToCommon, pirateToCommon } from "./handledata";
import { fetchWeather_PirateWeather, fetchWeather_UT_FI } from "./fetchdata";
import logger from "./logger";
const lang: string = config.get("language");
const round: Rounding = config.get("rounding");
const datasrc: "UT_FI" | "PW" = config.get("dataSource");

function getLocalizedString(key: Keyword, weatherData: WeatherDataCommon) {
	const regex: RegExp = /\${(.*?)}/g;
	const template = key.response[lang];
	try {
		return template.replace(regex, (_match, placeholder): string => {
			const result = weatherData[placeholder as keyof WeatherDataCommon];
			if (result === null) {
				throw new Error("Result is null");
			}
			return result.toFixed(round[placeholder]);
		});
	} catch (error) {
		return key.failedResponse[lang];
	}
}

export async function generateReply(allMatchKeys: Keyword[] | undefined) {
	if (allMatchKeys === undefined) {
		return;
	}

	let weatherData: WeatherDataCommon;

	switch (datasrc) {
		case "UT_FI":
			weatherData = grafanaToCommon(await fetchWeather_UT_FI());
			break;
		case "PW":
			weatherData = pirateToCommon(await fetchWeather_PirateWeather());
			break;
		default:
			logger.error(`No match for data source ${datasrc}`);
			return;
	}

	// const selected_func = switch_dict[datasrc] || default_case;
	// const weatherData: WeatherDataCommon = grafanaToCommon(await selected_func());

	const strings: string[] = [];

	for (const keyword of allMatchKeys) {
		const sentence = getLocalizedString(keyword, weatherData);
		if (sentence !== null) strings.push(sentence);
	}
	return strings.join("\n");
}
