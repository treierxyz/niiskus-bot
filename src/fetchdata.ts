import config from "config";
import { GrafanaQueryResult, PWQueryResult } from "./interfaces";
import logger from "./logger";

export async function fetchWeather_UT_FI(): Promise<GrafanaQueryResult> {
	const fetchURL: string = "https://atmos.physic.ut.ee/grafana/api/ds/query";
	const sqlQuery: string =
		'SELECT begin_time AS "time", temperature_mean, relhum_mean, baro_mean, sqrt(power(wind_mean_x, 2) + power(wind_mean_x, 2)) AS "wind_mean", ((degrees(atan2(wind_mean_x, wind_mean_y)) + 360)::numeric % 360) AS "wind_dir", irradiance_mean, (SELECT sum(precip_sum) AS "percip" FROM fhilm_primary WHERE begin_time between now() - interval \'1h\' and now()) AS "percip_sum" FROM fhilm_primary WHERE $__timeFilter(begin_time) ORDER BY 1 desc limit 1';

	// we don't have to do a new query for every single metric, just one big query for everything at once
	// $__timeFilter(begin_time) => begin_time BETWEEN "from" AND "to"
	// datasourceId from https://atmos.physic.ut.ee/grafana/api/datasources/id/Vaatlus%20Postgresql <= https://atmos.physic.ut.ee/grafana/api/dashboards/uid/000000004

	const data = JSON.stringify({
		from: "now-5m",
		to: "now",
		queries: [
			{
				datasourceId: 8,
				rawSql: sqlQuery,
				format: "table",
				refId: "A",
			},
		],
	});

	const fetchData = {
		method: "POST",
		body: data,
		headers: { "Content-Type": "application/json" },
	};

	return await fetch(fetchURL, fetchData)
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			return response.json();
		})
		.catch((error) => console.error(error));
}

export async function fetchWeather_PirateWeather(): Promise<PWQueryResult> {
	if (process.env.PW_API_KEY === undefined) {
		logger.error(
			"You didn't supply a Pirate Weather API key! Please add the environment variable `PW_API_KEY=replace.me.pretty.please` either into `.env` or any other valid way!",
		);
		throw new Error("Missing Pirate Weather API key");
	}
	const fetchURL: string = `https://api.pirateweather.net/forecast/${
		process.env.PW_API_KEY
	}/${config.get(
		"defaultCoords",
	)}?exclude=minutely,hourly,daily,alerts&units=si`;

	return await fetch(fetchURL, {
		method: "GET",
	})
		.then((response) => {
			if (!response.ok) {
				throw new Error(`HTTP error: ${response.status}`);
			}
			return response.json();
		})
		.catch((error) => console.error(error));
}
