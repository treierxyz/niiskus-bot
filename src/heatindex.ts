// Heat index constants
const hi_a = [
	-42.379, 2.04901523, 10.14333127, -0.22475541, -6.83783e-3, -5.481717e-2,
	1.22874e-3, 8.5282e-4, -1.99e-6,
];

function toFahr(celsius: number) {
	return (celsius * 9) / 5 + 32;
}

function toCels(fahrenheit: number) {
	return ((fahrenheit - 32) * 5) / 9;
}

function calcHeatIndex(temp: number, relhum: number): number {
	const temp_fahr = toFahr(temp);

	if (temp_fahr < 80) {
		return toCels(
			0.5 * (temp_fahr + 61.0 + (temp_fahr - 68.0) * 1.2 + relhum * 0.094),
		);
	}

	let adjust = 0;

	if (temp_fahr > 80 && temp_fahr < 112) {
		if (relhum < 13) {
			adjust =
				-((13 - relhum) / 4) * Math.sqrt((17 - Math.abs(temp_fahr - 95)) / 17);
		} else if (relhum > 85 && temp_fahr < 87) {
			adjust = ((relhum - 85) / 10) * ((87 - temp_fahr) / 5);
		}
	}

	return toCels(
		hi_a[0] +
			hi_a[1] * temp_fahr +
			hi_a[2] * relhum +
			hi_a[3] * temp_fahr * relhum +
			hi_a[4] * temp_fahr ** 2 +
			hi_a[5] * relhum ** 2 +
			hi_a[6] * temp_fahr ** 2 * relhum +
			hi_a[7] * temp_fahr * relhum ** 2 +
			hi_a[8] * temp_fahr ** 2 * relhum ** 2 +
			adjust,
	);
}

export default calcHeatIndex;
