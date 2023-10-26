import { Client as Styletron } from 'styletron-engine-atomic';
import { createLightTheme } from 'baseui';

export const client = new Styletron({
	prefix: '_',
});

export const lightTheme = createLightTheme({
	primaryFontFamily: 'mundial, sans-serif',
});

