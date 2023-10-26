import { Client as Styletron } from 'styletron-engine-atomic';
import {createLightTheme} from "baseui";

export const styletronClient = new Styletron({
	prefix: '_',
});

export const lightTheme = createLightTheme({
	primaryFontFamily: "mundial, 'Noto Sans', sans-serif",
});
