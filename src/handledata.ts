import calcHeatIndex from "./heatindex";
import {
	Column,
	Currently,
	GrafanaQueryResult,
	PWQueryResult,
	WeatherDataCommon,
} from "./interfaces";

export function grafanaToCommon(
	weatherData: GrafanaQueryResult,
): WeatherDataCommon {
	function getValue(key: string): number {
		return weatherData.results.A.tables[0].rows[0][
			weatherData.results.A.tables[0].columns.findIndex(
				(p: Column) => p.text === key,
			)
		];
	}

	const temperature = getValue("temperature_mean");
	const relativeHumidity = getValue("relhum_mean");

	return {
		temperature,
		relativeHumidity,
		heatIndex: calcHeatIndex(temperature, relativeHumidity),
		windSpeed: getValue("wind_mean"),
		windDirection: getValue("wind_dir"),
		airPressure: getValue("baro_mean"),
		percipitation: getValue("percip_sum"),
	};
}

export function pirateToCommon(weatherData: PWQueryResult): WeatherDataCommon {
	function getValue(key: string): number | string {
		return weatherData.currently[key as keyof Currently];
	}

	return {
		temperature: getValue("temperature") as number,
		relativeHumidity: (getValue("humidity") as number) * 100,
		heatIndex: getValue("apparentTemperature") as number,
		windSpeed: getValue("windSpeed") as number,
		windDirection: getValue("windBearing") as number,
		airPressure: getValue("pressure") as number,
		percipitation: getValue("precipIntensity") as number,
	};
}
