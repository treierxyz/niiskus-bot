import { Snowflake } from "discord.js";

export interface Keyword {
	id: string;
	words: string[];
	response: {
		[lang: string]: string;
	};
	failedResponse: {
		[lang: string]: string;
	};
}

export interface WeatherDataCommon {
	temperature: number;
	relativeHumidity: number;
	heatIndex: number;
	windSpeed: number;
	windDirection: number;
	airPressure: number;
	percipitation: number;
}

export interface Thanks {
	words: string[];
	responses: string[];
}

export interface FullOutput {
	words: string[];
	lonelyWords: string[];
}

export interface Cooldowns {
	[index: Snowflake]: {
		[id: string]: Date;
	};
}

export interface Rounding {
	[id: string]: number;
}

// grafana types
export interface GrafanaQueryResult {
	results: Results;
}

export interface Results {
	A: A;
}

export interface A {
	refId: string;
	meta: Meta;
	series: null;
	tables: Table[];
	dataframes: null;
}

export interface Meta {
	executedQueryString: string;
	rowCount: number;
}

export interface Table {
	columns: Column[];
	rows: number[][];
}

export interface Column {
	text: string;
}

// pirateweather types
export interface PWQueryResult {
	latitude: number;
	longitude: number;
	timezone: string;
	offset: number;
	elevation: number;
	currently: Currently;
	flags: Flags;
}

export interface Currently {
	time: number;
	summary: string;
	icon: string;
	nearestStormDistance: number;
	nearestStormBearing: number;
	precipIntensity: number;
	precipProbability: number;
	precipIntensityError: number;
	precipType: string;
	temperature: number;
	apparentTemperature: number;
	dewPoint: number;
	humidity: number;
	pressure: number;
	windSpeed: number;
	windGust: number;
	windBearing: number;
	cloudCover: number;
	uvIndex: number;
	visibility: number;
	ozone: number;
}

export interface Flags {
	sources: string[];
	sourceTimes: SourceTimes;
	"nearest-station": number;
	units: string;
	version: string;
}

export interface SourceTimes {
	gfs: string;
	gefs: string;
}
