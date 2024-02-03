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

export interface GrafanaQueryResult {
	results: Results;
}

export interface Results {
	UT_FI: UT_FI;
}

export interface UT_FI {
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
