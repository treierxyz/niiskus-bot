import calcHeatIndex from "./heatindex";
import { Column, GrafanaQueryResult } from "./interfaces";

function getMetric(
	key: string,
	weatherData: GrafanaQueryResult,
): number | null {
	switch (key) {
		case "relhum_mean":
		case "temperature_mean":
		case "wind_mean":
		case "wind_dir":
		case "baro_mean":
		case "percip_sum":
			return weatherData.results.UT_FI.tables[0].rows[0][
				weatherData.results.UT_FI.tables[0].columns.findIndex(
					(p: Column) => p.text === key,
				)
			];
		case "heat_index":
			return calcHeatIndex(
				getMetric("temperature_mean", weatherData),
				getMetric("relhum_mean", weatherData),
			);
		default:
			return null;
	}
}

export default getMetric;
