/*
 * Copyright (c) Anthaathi Private Limited 2023.
 *
 * This code is the exclusive property of Anthaathi Private Limited and is protected by copyright and intellectual property laws.
 * Any unauthorized use, reproduction, distribution, or modification of this code is strictly prohibited.
 *
 * Anthaathi Private Limited reserves all rights in and to this code and will vigorously defend its intellectual property rights.
 */

export const LoadFontForLanguage: Record<
	string,
	{ fontFamily: { google: string[] }; unicodeRange: number[] }
> = {
	devnagari: {
		fontFamily: {
			google: ['Noto Sans Devanagari'],
		},
		unicodeRange: [2306, 2404],
	},
};

export function loadFontsForText(
	text: string,
	fontConfig = LoadFontForLanguage
): string[] {
	const language = text
		.split('')
		.map((res) => {
			return Object.values(fontConfig)
				.map((cf) => {
					const [min, max] = cf.unicodeRange;

					if (res.charCodeAt(0) >= min && res.charCodeAt(0) <= max) {
						return cf.fontFamily.google;
					}

					return [];
				})
				.flat();
		})
		.flat();

	return [...new Set(language)];
}
